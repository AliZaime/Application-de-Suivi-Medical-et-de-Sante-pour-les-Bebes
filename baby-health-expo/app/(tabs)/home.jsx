import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Home() {
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const parentId = await AsyncStorage.getItem("parent_id");
        if (!parentId) {
          setError("Aucun ID de parent trouvé.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://192.168.1.166:8000/api/parent/${parentId}/`);
        setParent(response.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    const checkTrackingAndAlert = async () => {
      try {
        const parentId = await AsyncStorage.getItem("parent_id");

        // ➤ Récupère le premier bébé
        const babyRes = await axios.get(
          `http://192.168.1.166:8000/api/user/get_babies_by_parent_id/${parentId}/`
        );
        const baby = babyRes.data[0];
        if (!baby) return;

        // ➤ Récupère le dernier tracking de ce bébé
        const trackingRes = await axios.get(
          `http://192.168.1.166:8000/api/user/get_last_traking/${baby.baby_id}/`
        );
        const lastTracking = trackingRes.data[0]; // tableau

        if (!lastTracking) {
          Alert.alert(
            "Rappel",
            "Aucune mesure enregistrée pour votre bébé.",
            [
              {
                text: "Ajouter maintenant",
                onPress: () => router.push("/addtracking"),
              },
              {
                text: "Plus tard",
                style: "cancel",
              },
            ]
          );
          return;
        }

        const lastDate = new Date(lastTracking.date_recorded);
        const today = new Date();
        const monday = new Date();
        monday.setDate(today.getDate() - today.getDay() + 1); // lundi de cette semaine

        if (lastDate < monday) {
          Alert.alert(
            "Rappel",
            "Vous n'avez pas encore enregistré les mesures de cette semaine !",
            [
              {
                text: "Ajouter maintenant",
                onPress: () => router.push("/addtracking"),
              },
              {
                text: "Plus tard",
                style: "cancel",
              },
            ]
          );
        }
      } catch (err) {
        console.error("Erreur tracking :", err.message);
      }
    };

    fetchParentData();
    checkTrackingAndAlert();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F4C7C3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil du Parent</Text>

      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>Nom :</Text>
          <Text style={styles.value}>{parent.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{parent.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Téléphone :</Text>
          <Text style={styles.value}>{parent.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Notifications :</Text>
          <Text style={styles.value}>
            {JSON.stringify(parent.notification_preferences)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  table: {
    backgroundColor: "#FDEDEC",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    color: "#333",
  },
});
