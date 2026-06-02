import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { COLORS } from '../constants/theme';
import { MetricHeader } from '../components/MetricHeader';
import { useFlowSenseData } from '../hooks/useFlowSenseData';
import { BarChart, LineChart, PieChart, ContributionGraph } from 'react-native-chart-kit';

export function MonitorScreen() {
  const { totalPessoas, ambientesAtivos, ambientes, historico } = useFlowSenseData();
  const screenWidth = Dimensions.get('window').width - 48;

  const dadosCronologicos = [...historico].reverse();
  const ultimosEventosSalvos = dadosCronologicos.slice(-6);
  
  const lineLabels = ultimosEventosSalvos.map(h => 
    new Date(h.timestamp).toLocaleTimeString('pt-BR', { minute: '2-digit', second: '2-digit' })
  );
  const lineValues = ultimosEventosSalvos.map(h => h.quantidade);

  const obterMaiorPico = (ambienteNome: string) => {
    const registrosAmbiente = historico.filter(h => h.ambiente_nome === ambienteNome);
    if (registrosAmbiente.length === 0) return 0;
    return Math.max(...registrosAmbiente.map(h => h.quantidade));
  };

  const barLabels = ambientes.map(a => a.nome.split(' ').slice(-1)[0]);
  const barData = ambientes.map(a => {
    const pico = obterMaiorPico(a.nome);
    return pico > 0 ? pico : a.quantidade_pessoas;
  });

  const obterTotalInteracoes = (ambienteNome: string) => {
    return historico.filter(h => h.ambiente_nome === ambienteNome && h.tipo === 'ENTRADA').length;
  };

  const pieColors = ['#E53E3E', '#3182CE', '#38A169', '#D69E2E', '#805AD5'];
  const pieData = ambientes.map((amb, index) => ({
    name: amb.nome.split(' ').slice(-1)[0],
    population: obterTotalInteracoes(amb.nome) || (amb.quantidade_pessoas > 0 ? 1 : 0),
    color: pieColors[index % pieColors.length],
    legendFontColor: COLORS.textSecondary,
    legendFontSize: 11,
  })).filter(item => item.population > 0);

  const contributionData = historico.map(h => ({
    date: h.timestamp.split('T')[0],
    count: 1
  }));

  const chartConfigBase = {
    backgroundColor: COLORS.surface,
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(229, 62, 62, ${opacity})`,
    labelColor: () => COLORS.textSecondary,
    style: { borderRadius: 16 },
    propsForBackgroundLines: { strokeWidth: 1, stroke: '#2A2A2A' }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MetricHeader 
        titulo="Monitoramento"
        subtitulo="Métricas analíticas persistentes"
        totalPessoas={totalPessoas}
        ambientesAtivos={ambientesAtivos}
        backgroundColor="#A21CAF"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.chartTitle}>Histórico de Fluxo Recente (Linha do Tempo)</Text>
        {lineValues.length > 0 ? (
          <LineChart
            data={{
              labels: lineLabels,
              datasets: [{ data: lineValues }]
            }}
            width={screenWidth}
            height={180}
            chartConfig={{
              ...chartConfigBase,
              color: (opacity = 1) => `rgba(49, 130, 206, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text style={styles.emptyText}>Nenhum registro persistido. Aguardando dados do barramento IoT...</Text>
        )}

        <Text style={styles.chartTitle}>Pico Máximo de Lotação por Sala (Histórico)</Text>
        {barData.length > 0 && barData.some(v => v > 0) ? (
          <BarChart
            data={{
              labels: barLabels,
              datasets: [{ data: barData }]
            }}
            width={screenWidth}
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfigBase}
            style={styles.chart}
          />
        ) : (
          <Text style={styles.emptyText}>Sem picos de ocupação registrados nas tabelas.</Text>
        )}

        <Text style={styles.chartTitle}>Uso Proporcional de Ambientes (Frequência de Entradas)</Text>
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth}
            height={160}
            chartConfig={chartConfigBase}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.emptyText}>Sem dados de divisão proporcional calculados.</Text>
        )}

        <Text style={styles.chartTitle}>Intensidade de Atividade do Sistema (Eventos por Dia)</Text>
        {contributionData.length > 0 ? (
          <ContributionGraph
            values={contributionData}
            endDate={new Date()}
            numDays={105}
            width={screenWidth}
            height={180}
            chartConfig={{
              ...chartConfigBase,
              color: (opacity = 1) => `rgba(56, 161, 105, ${opacity})`,
            }}
            style={styles.chart}
  
            tooltipDataAttrs={(value) => ({})} 
          />
        ) : (
          <Text style={styles.emptyText}>Aguardando amostragem diária para plotar densidade.</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  chartTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 26,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  chart: {
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
});