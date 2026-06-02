import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

interface MetricHeaderProps {
  titulo: string;
  subtitulo: string;
  totalPessoas: number;
  ambientesAtivos: string;
  backgroundColor?: string;
}

export function MetricHeader({ titulo, subtitulo, totalPessoas, ambientesAtivos, backgroundColor }: MetricHeaderProps) {
  return (
    <View style={[styles.headerContainer, backgroundColor ? { backgroundColor } : null]}>
      <Text style={styles.title}>{titulo}</Text>
      <Text style={styles.subtitle}>{subtitulo}</Text>
      
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Total de pessoas</Text>
          <Text style={styles.metricValue}>{totalPessoas}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Ambientes ativos</Text>
          <Text style={styles.metricValue}>{ambientesAtivos}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  metricValue: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
});