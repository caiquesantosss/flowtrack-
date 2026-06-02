import { useContext } from 'react'
import { FlowSenseContext } from '../contexts/FlowSenseContext'

export function useFlowSenseData() {
  const context = useContext(FlowSenseContext);
  if (!context) {
    throw new Error('useFlowSenseData deve ser consumido de dentro de um FlowSenseProvider');
  }
  return context;
}