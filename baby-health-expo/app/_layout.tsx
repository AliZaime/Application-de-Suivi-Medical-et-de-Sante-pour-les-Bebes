import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditBabyScreen from '../components/EdidtbabyScreen';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// 🔔 Configuration globale pour les notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,     // 🆕 remplace shouldShowAlert
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowList: true        // pour afficher dans le centre de notifications iOS
  }),
});


export default function RootLayout() {
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert("Les notifications ne sont pas autorisées.");
      }
    };

    requestPermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="couchePage" options={{ headerShown: false }} />
        <Stack.Screen name="Repas" options={{ headerShown: false }} />
        <Stack.Screen name="Biberon" options={{ headerShown: false }} />
        <Stack.Screen name="Tetee" options={{ headerShown: false }} />
        <Stack.Screen name="Solides" options={{ headerShown: false }} />
        <Stack.Screen name="SuiviPage" options={{ headerShown: false }} />
        <Stack.Screen name="Sommeil" options={{ headerShown: false }} />
        <Stack.Screen name="Sante" options={{ headerShown: false }} />
        <Stack.Screen name="Temperature" options={{ headerShown: false }} />
        <Stack.Screen name="Medicaments" options={{ headerShown: false }} />
        <Stack.Screen name="Symptomes" options={{ headerShown: false }} />
        <Stack.Screen name="appiontement" options={{ headerShown: false }} />
        <Stack.Screen name="growth" options={{ headerShown: false }} />
        <Stack.Screen name="PleursPage" options={{ headerShown: false }} />
        <Stack.Screen name="CryDetection" options={{ headerShown: false }} />
        <Stack.Screen name="addBaby" options={{ headerShown: false }} />
        <Stack.Screen name="GeneticPrediction" options={{ headerShown: false }} />
        <Stack.Screen name="addtracking" options={{ headerShown: false }} />
        <Stack.Screen name="vaccination" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
