import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="login" options={{ title: "Connexion" }} />
        <Stack.Screen name="Register" options={{ title: "Inscription" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="couchePage" options={{ headerShown: false }} />
        <Stack.Screen name="Repas" options={{ headerShown : false }} />
        <Stack.Screen name="Biberon" options={{ headerShown : false }} />
        <Stack.Screen name="Tetee" options={{ headerShown : false }} />
        <Stack.Screen name="Solides" options={{ headerShown : false }} />
        <Stack.Screen name="SuiviPage" options={{ headerShown: false }} />
        <Stack.Screen name="Sommeil" options={{ headerShown: false }} />
        <Stack.Screen name="Sante" options={{ headerShown: false }} />
        <Stack.Screen name="Temperature" options={{ headerShown: false }} />
        <Stack.Screen name="Medicaments" options={{ headerShown: false }} />
        <Stack.Screen name="Vaccins" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
