import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Ambiente, RegistroHistorico, AlertaNotificacao } from '../types';
import { WS_BASE_URL, api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage'

interface FlowSenseContextProps {
  ambientes: Ambiente[];
  historico: RegistroHistorico[];
  notificacoes: AlertaNotificacao[];
  totalPessoas: number;
  ambientesAtivos: string;
  conectado: boolean;
  recarregarDados: () => Promise<void>;
  limparAlertas: () => void;
  salvarAmbiente: (ambiente: Partial<Ambiente>) => Promise<void>;
  excluirAmbiente: (id: string) => Promise<void>;
}

export const FlowSenseContext = createContext<FlowSenseContextProps>({} as FlowSenseContextProps);

const CACHE_KEY_HISTORICO = '@flowsense:historico';

export function FlowSenseProvider({ children }: { children: ReactNode }) {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
  const [notificacoes, setNotificacoes] = useState<AlertaNotificacao[]>([]);
  const [conectado, setConectado] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const totalPessoas = ambientes.reduce((acc, curr) => acc + curr.quantidade_pessoas, 0);
  const ambientesAtivos = `${ambientes.filter(a => a.quantidade_pessoas > 0).length}/${ambientes.length}`;

  const carregarHistoricoLocal = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(CACHE_KEY_HISTORICO);
      if (dadosSalvos) {
        setHistorico(JSON.parse(dadosSalvos));
      }
    } catch (err) {
      console.log('[ASYNC STORAGE ERROR]', err);
    }
  };

  const determinarStatus = (atual: number, max: number): 'VAZIO' | 'BAIXO' | 'MEDIO' | 'ALTO' => {
    if (atual === 0) return 'VAZIO';
    const percentual = (atual / max) * 100;
    if (percentual <= 30) return 'BAIXO';
    if (percentual <= 70) return 'MEDIO';
    return 'ALTO';
  };

  const recarregarDados = async () => {
    try {
      const resAmbientes = await api.get('/api/ambientes').catch(() => ({
        data: [
          { id: '1', nome: 'Sala de aula 1', sensor_id: 'SR-01', quantidade_pessoas: 0, capacidade_maxima: 45, status: 'VAZIO', ultima_atualizacao: new Date().toISOString() },
          { id: '2', nome: 'Entrada 1', sensor_id: 'SR-02', quantidade_pessoas: 0, capacidade_maxima: 25, status: 'VAZIO', ultima_atualizacao: new Date().toISOString() },
          { id: '3', nome: 'Entrada 2', sensor_id: 'SR-03', quantidade_pessoas: 0, capacidade_maxima: 15, status: 'VAZIO', ultima_atualizacao: new Date().toISOString() }
        ]
      }));

      setAmbientes(resAmbientes.data);
    } catch (err) {
      console.log('[ERROR] Sincronização falhou:', err);
    }
  };

  const conectarWebSocket = () => {
    if (wsRef.current) return;

    const ws = new WebSocket(WS_BASE_URL);

    ws.onopen = () => {
      setConectado(true);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const quantidade = payload.quantidade_pessoas ?? payload.quantidade_atual ?? 0;
        const statusPayload = payload.status ?? payload.status_ambiente ?? 'VAZIO';
        const agora = new Date();

        setAmbientes((prev) =>
          prev.map((amb) => {
            if (amb.id === '1' || amb.sensor_id === 'SR-01') {
              const novoStatus = determinarStatus(quantidade, amb.capacidade_maxima);
              
              if (novoStatus === 'ALTO') {
                const novoAlerta: AlertaNotificacao = {
                  id: `ALTO-${Date.now()}`,
                  titulo: `Superlotação detectada!`,
                  mensagem: `O ambiente ${amb.nome} atingiu nível crítico de ocupação com ${quantidade} pessoas.`,
                  timestamp: agora.toISOString(),
                  lida: false
                };
                setNotificacoes(prevAlerts => {
                  if (prevAlerts.length > 0 && prevAlerts[0].mensagem === novoAlerta.mensagem) {
                    return prevAlerts;
                  }
                  return [novoAlerta, ...prevAlerts];
                });
              }

              return {
                ...amb,
                quantidade_pessoas: quantidade,
                status: novoStatus,
                ultima_atualizacao: agora.toISOString(),
              };
            }
            return amb;
          })
        );

        const horaAtual = agora.getHours()
        const horarioPermitido = false
        
        if (quantidade > 0 && !horarioPermitido) {
          const alertaSeguranca: AlertaNotificacao = {
            id: `SEC-${Date.now()}`,
            titulo: `🚨 ALERTA DE SEGURANÇA`,
            mensagem: `Presença detectada fora do horário permitido (${horaAtual}h) no ambiente Sala de aula 1.`,
            timestamp: agora.toISOString(),
            lida: false
          };
          
          setNotificacoes(prevAlerts => {
            if (prevAlerts.length > 0 && prevAlerts[0].titulo === `🚨 ALERTA DE SEGURANÇA`) {
              return prevAlerts;
            }
            return [alertaSeguranca, ...prevAlerts];
          });
        }

        const novoRegistro: RegistroHistorico = {
          id: `${Date.now()}-${Math.random()}`,
          ambiente_id: '1',
          ambiente_nome: 'Sala de aula 1',
          tipo: statusPayload === 'PRESENCA' ? 'ENTRADA' : 'SAÍDA',
          quantidade: quantidade,
          timestamp: agora.toISOString()
        };

        setHistorico((prevHist) => {
          if (prevHist.length > 0 && prevHist[0].quantidade === quantidade && prevHist[0].tipo === novoRegistro.tipo) {
            return prevHist; 
          }
          const novoHistoricoCompleto = [novoRegistro, ...prevHist.slice(0, 49)];
          AsyncStorage.setItem(CACHE_KEY_HISTORICO, JSON.stringify(novoHistoricoCompleto));
          return novoHistoricoCompleto;
        });

      } catch (err) {
        console.log('[WS ERROR]', err);
      }
    };

    ws.onclose = () => {
      setConectado(false);
      wsRef.current = null;
      setTimeout(conectarWebSocket, 5000);
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  };

  const limparAlertas = () => setNotificacoes([]);

  const salvarAmbiente = async (ambiente: Partial<Ambiente>) => {
    if (ambiente.id) {
      setAmbientes(prev => prev.map(a => a.id === ambiente.id ? { ...a, ...ambiente } as Ambiente : a));
    } else {
      const novo: Ambiente = {
        id: String(Date.now()),
        nome: ambiente.nome || 'Novo Ambiente',
        sensor_id: ambiente.sensor_id || 'SR-X',
        quantidade_pessoas: 0,
        capacidade_maxima: ambiente.capacidade_maxima || 30,
        status: 'VAZIO',
        ultima_atualizacao: new Date().toISOString()
      };
      setAmbientes(prev => [...prev, novo]);
    }
  };

  const excluirAmbiente = async (id: string) => {
    setAmbientes(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => {
    carregarHistoricoLocal();
    recarregarDados();
    conectarWebSocket();
    return () => wsRef.current?.close();
  }, []);

  return (
    <FlowSenseContext.Provider
      value={{
        ambientes,
        historico,
        notificacoes,
        totalPessoas,
        ambientesAtivos,
        conectado,
        recarregarDados,
        limparAlertas,
        salvarAmbiente,
        excluirAmbiente
      }}
    >
      {children}
    </FlowSenseContext.Provider>
  );
}