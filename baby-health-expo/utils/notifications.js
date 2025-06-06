import * as Notifications from 'expo-notifications';

export const scheduleReminder = async (titre, message, heure) => {
  const [h, m] = heure.split(":").map(Number); // extraire l'heure et les minutes

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titre,
        body: message,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: h,
        minute: m,
        repeats: true, // 🔁 répéter chaque jour
      },
    });
  } catch (error) {
    console.error("Erreur de programmation du rappel :", error);
  }
};
