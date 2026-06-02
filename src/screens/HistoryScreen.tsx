import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import { COLORS } from '../constants/theme';
import { useFlowSenseData } from '../hooks/useFlowSenseData';

export function HistoryScreen() {
  const { historico } = useFlowSenseData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.localHeader}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Registros de entrada e saída</Text>
      </View>

      <FlatList
        data={historico}
        keyExtractor={(item, index) => {
          const idValido = item.id ? String(item.id) : '';
          const tempoValido = item.timestamp ? String(item.timestamp) : '';
          return `${idValido}-${tempoValido}-${index}`;
        }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.left}>
              <View 
                style={[
                  styles.indicator, 
                  { backgroundColor: item.tipo === 'ENTRADA' ? COLORS.success : COLORS.primary }
                ]} 
              />
              <View>
                <Text style={styles.ambienteNome}>{item.ambiente_nome || 'Ambiente'}</Text>
                <Text style={styles.tipoText}>
                  {item.tipo || 'MOVIMENTAÇÃO'} - {item.quantidade ?? 0} ocupantes
                </Text>
              </View>
            </View>
            <Text style={styles.time}>
              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString('pt-BR') : '--:--'}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  localHeader: {
    backgroundColor: '#DD6B20',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  list: {
    padding: 24,
  },
  row: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  ambienteNome: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  tipoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});