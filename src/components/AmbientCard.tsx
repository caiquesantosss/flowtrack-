import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ambiente } from '../types';

interface AmbienteCardProps {
  ambiente: Ambiente;
}

export function AmbienteCard({ ambiente }: AmbienteCardProps) {
  const percentual = Math.min((ambiente.quantidade_pessoas / ambiente.capacidade_maxima) * 100, 100);
  
  const obterCorStatus = () => {
    if (ambiente.status === 'VAZIO') return COLORS.success;
    if (ambiente.status === 'BAIXO') return COLORS.success;
    if (ambiente.status === 'MEDIO') return COLORS.warning;
    return COLORS.primary;
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.nome}>{ambiente.nome}</Text>
          <Text style={styles.sensorId}>Sensor: {ambiente.sensor_id}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: obterCorStatus(), borderWidth: 1 }]}>
          <Text style={[styles.badgeText, { color: obterCorStatus() }]}>
            ● {ambiente.status}
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.labelRow}>
          <Text style={styles.progressLabel}>Ocupação</Text>
          <Text style={styles.progressValue}>{ambiente.quantidade_pessoas}/{ambiente.capacidade_maxima}</Text>
        </View>
        
        {/* Track da Barra de Progresso Fiel ao Layout do Figma */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percentual}%`, backgroundColor: obterCorStatus() }]} />
        </View>
        <Text style={styles.timeText}>Atualizado agora mesmo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nome: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  sensorId: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressSection: {
    marginTop: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  progressValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#2D2D2D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeText: {
    color: '#555555',
    fontSize: 10,
    marginTop: 8,
    textAlign: 'left',
  },
});