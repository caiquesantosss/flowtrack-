import React from 'react';
import { StyleSheet, View, FlatList, Text, SafeAreaView } from 'react-native'
import { COLORS } from '../constants/theme';
import { MetricHeader } from '../components/MetricHeader'
import { AmbienteCard } from '../components/AmbientCard'
import { useFlowSenseData } from '../hooks/useFlowSenseData'

export function HomeScreen() {
  const { ambientes, totalPessoas, ambientesAtivos, conectado } = useFlowSenseData();

  return (
    <SafeAreaView style={styles.container}>
      <MetricHeader 
        titulo="Controle de Presença"
        subtitulo="Monitoramento em tempo real"
        totalPessoas={totalPessoas}
        ambientesAtivos={ambientesAtivos}
      />
      
      <View style={styles.statusBanner}>
        <Text style={styles.statusText}>
          Status da Conexão: {conectado ? '● ONLINE' : '○ DISCONNECTED'}
        </Text>
      </View>

      <FlatList
        data={ambientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AmbienteCard ambiente={item} />}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Ambientes</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statusBanner: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#1A1A1A',
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
  },
});