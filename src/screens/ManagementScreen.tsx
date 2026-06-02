import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import { COLORS } from '../constants/theme';
import { useFlowSenseData } from '../hooks/useFlowSenseData';

export function ManagementScreen() {
  const { ambientes, salvarAmbiente, excluirAmbiente } = useFlowSenseData();
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [sensorId, setSensorId] = useState('');
  const [capacidade, setCapacidade] = useState('');

  const handleSalvar = () => {
    if (!nome || !sensorId || !capacidade) return;
    salvarAmbiente({
      nome,
      sensor_id: sensorId,
      capacidade_maxima: Number(capacidade)
    });
    setNome('');
    setSensorId('');
    setCapacidade('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.localHeader}>
        <Text style={styles.title}>Gerenciamento</Text>
        <Text style={styles.subtitle}>Gerencie e crie os ambientes</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Adicionar ambiente</Text>
        </TouchableOpacity>

        <FlatList
          data={ambientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.roomRow}>
              <View>
                <Text style={styles.roomName}>{item.nome}</Text>
                <Text style={styles.roomCap}>Capacidade: {item.capacidade_maxima} | ID: {item.sensor_id}</Text>
              </View>
              <TouchableOpacity onPress={() => excluirAmbiente(item.id)}>
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
          style={styles.list}
        />
      </View>

      {/* Modal de Criação Fiel ao Formulário Lateral do Figma */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Ambiente</Text>
            
            <TextInput style={styles.input} placeholder="Nome do ambiente" placeholderTextColor="#666" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="ID do Sensor" placeholderTextColor="#666" value={sensorId} onChangeText={setSensorId} />
            <TextInput style={styles.input} placeholder="Capacidade" placeholderTextColor="#666" keyboardType="numeric" value={capacidade} onChangeText={setCapacidade} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave]} onPress={handleSalvar}>
                <Text style={styles.btnTextForm}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.btnTextForm, { color: '#FFF' }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  localHeader: {
    backgroundColor: '#2D2D2D',
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
  content: {
    padding: 24,
    flex: 1,
  },
  addBtn: {
    backgroundColor: COLORS.surface,
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  addBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  roomRow: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  roomCap: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  deleteText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2A2A2A',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFF',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSave: {
    backgroundColor: COLORS.textPrimary,
  },
  btnCancel: {
    backgroundColor: '#333',
  },
  btnTextForm: {
    fontWeight: '700',
    color: '#000',
  },
});