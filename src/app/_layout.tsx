import { Stack } from 'expo-router';
import { FlowSenseProvider } from '../contexts/FlowSenseContext';

export default function RootLayout() {
  return (
    <FlowSenseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </FlowSenseProvider>
  );
}