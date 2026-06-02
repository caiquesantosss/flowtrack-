import React from 'react';
import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/theme';
import Svg, { Circle } from 'react-native-svg';
import { ColorValue } from 'react-native';

function TabIcon({ color }: { color: ColorValue }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Circle cx={6} cy={6} r={4} fill={color as string} />
    </Svg>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: '#161616',
          borderTopWidth: 1,
          borderTopColor: '#222',
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Início',
          tabBarIcon: ({ color }) => <TabIcon color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="monitor" 
        options={{ 
          title: 'Monitor',
          tabBarIcon: ({ color }) => <TabIcon color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="historico" 
        options={{ 
          title: 'Histórico',
          tabBarIcon: ({ color }) => <TabIcon color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="alerta" 
        options={{ 
          title: 'Alerta',
          tabBarIcon: ({ color }) => <TabIcon color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="adm" 
        options={{ 
          title: 'Adm',
          tabBarIcon: ({ color }) => <TabIcon color={color} /> 
        }} 
      />
    </Tabs>
  );
}