import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { useFlowSenseData } from '../hooks/useFlowSenseData';

export function NotificationsScreen() {
  const { notificacoes, limparAlertas } = useFlowSenseData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.localHeader}>
        <Text style={styles.title}>Notificações</Text>
        <Text style={styles.subtitle}>Notificações e eventos importantes</Text>
      </View>

      <View style={styles.actionsBar}>
        <TouchableOpacity style={styles.clearBtn} onPress={limparAlertas}>
          <Text style={styles.clearBtnText}>Limpar todas as notificações</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notificacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <Text style={styles.alertTitle}>⚠️ {item.titulo}</Text>
            <Text style={styles.alertMsg}>{item.mensagem}</Text>
            <Text style={styles.alertTime}>{new Date(item.timestamp).toLocaleTimeString('pt-BR')}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum alerta crítico gerado.</Text>
          </View>
        }
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
    backgroundColor: COLORS.primary,
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
  actionsBar: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  clearBtn: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  clearBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    padding: 24,
  },
  alertCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: 12,
  },
  alertTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  alertMsg: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  alertTime: {
    color: '#555',
    fontSize: 11,
    marginTop: 8,
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});