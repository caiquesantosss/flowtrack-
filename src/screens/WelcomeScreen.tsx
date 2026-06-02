import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandContainer}>
        <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={3} fill={COLORS.primary} />
          <Path d="M12 2a10 10 0 0110 10M2 12A10 10 0 0112 2M12 6a6 6 0 016 6M6 12a6 6 0 016-6" stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
        </Svg>
        <Text style={styles.brandName}>FLOW TRACK</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Controle de presença</Text>
        <Text style={styles.subtitle}>Monitore ambientes em tempo real com tecnologia de sensores.</Text>

        <View style={styles.featureList}>
          
          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M18 20V10M12 20V4M6 20v-6" />
              </Svg>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Dashboard em tempo real</Text>
              <Text style={styles.featureDescription}>Visualize ocupação e status de todos os ambientes</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </Svg>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Alertas Inteligentes</Text>
              <Text style={styles.featureDescription}>Notificações de superlotação e movimentação</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <Circle cx={12} cy={12} r={10} />
                <Path d="M12 6v6l4 2" />
              </Svg>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Histórico completo</Text>
              <Text style={styles.featureDescription}>Acesse registros e relatórios detalhados</Text>
            </View>
          </View>

        </View>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.btnText}>ENTRAR</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: SIZES.paddingHorizontal,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  brandName: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 20,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  featureList: {
    marginTop: 36,
  },
  featureCard: {
    backgroundColor: '#CCCCCC',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  featureDescription: {
    color: '#555555',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  btn: {
    backgroundColor: COLORS.textPrimary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  btnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});