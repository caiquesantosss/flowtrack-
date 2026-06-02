import { useEffect, useState } from "react";

// Tipagem dos dados que vêm do Python
export interface OcupacaoData {
  id?: string;
  quantidade_atual: number;
  status_ambiente: string;
  timestamp: number | string;
}

export function useFlowSense() {
  const [dadosAtuais, setDadosAtuais] = useState<OcupacaoData>({
    quantidade_atual: 0,
    status_ambiente: "DESCONECTADO",
    timestamp: 0,
  });
  const [historico, setHistorico] = useState<OcupacaoData[]>([]);
  const [conectado, setConectado] = useState(false);

  const IP_SERVIDOR = "192.168.1.40"; 
  const WS_URL = `ws://${IP_SERVIDOR}:8000/ws`;
  const HTTP_URL = `http://${IP_SERVIDOR}:8000/api/presenca/historico`;

  const carregarHistoricoInicial = async () => {
    try {
      const response = await fetch(HTTP_URL);
      if (response.ok) {
        const data = await response.json();
        setHistorico(data);
        
        if (data.length > 0) {
          setDadosAtuais({
            quantidade_atual: data[0].quantidade_atual,
            status_ambiente: data[0].status_ambiente,
            timestamp: data[0].timestamp,
          });
        }
      }
    } catch (error) {
      console.log("[HTTP ERROR] Falha ao buscar histórico inicial:", error);
    }
  };

  useEffect(() => {
    carregarHistoricoInicial();

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setConectado(true);
      console.log("[WS] Conectado ao servidor FlowSense!");
    };

    ws.onmessage = (event) => {
      try {
        const payload: OcupacaoData = JSON.parse(event.data);
        
        setDadosAtuais(payload);

        setHistorico((prev) => {
          if (prev.length > 0 && prev[0].quantidade_atual === payload.quantidade_atual) {
            return prev; 
          }
          return [payload, ...prev.slice(0, 19)]; 
        });
        
      } catch (err) {
        console.log("[WS ERROR] Falha ao processar mensagem recebida:", err);
      }
    };

    ws.onclose = () => {
      setConectado(false);
      setDadosAtuais((prev) => ({ ...prev, status_ambiente: "DESCONECTADO" }));
      console.log("[WS] Conexão encerrada pelo servidor.");
    };

    ws.onerror = (error) => {
      console.log("[WS ERROR] Erro na conexão WebSocket:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { dadosAtuais, historico, conectado };
}