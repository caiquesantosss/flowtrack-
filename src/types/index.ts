export interface Ambiente {
  id: string;
  nome: string;
  sensor_id: string;
  quantidade_pessoas: number;
  capacidade_maxima: number;
  status: 'VAZIO' | 'BAIXO' | 'MEDIO' | 'ALTO';
  ultima_atualizacao: string;
}

export interface RegistroHistorico {
  id: string;
  ambiente_id: string;
  ambiente_nome: string;
  tipo: 'ENTRADA' | 'SAÍDA';
  quantidade: number;
  timestamp: string;
}

export interface AlertaNotificacao {
  id: string;
  titulo: string;
  mensagem: string;
  timestamp: string;
  lida: boolean;
}