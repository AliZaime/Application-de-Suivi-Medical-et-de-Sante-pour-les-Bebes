import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function CroissanceScreen() {
  const router = useRouter();
  const [baby, setBaby] = useState(null);
  const [tracking, setTracking] = useState(undefined); // undefined pour différencier "chargement" vs "null"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentId = await AsyncStorage.getItem("parent_id");
        const token = await AsyncStorage.getItem("token");

        const babyResponse = await axios.get(`http://192.168.11.109:8000/api/user/get_babies_by_parent_id/${parentId}/`);
        const babyData = babyResponse.data[0];
        setBaby(babyData);

        const trackingResponse = await axios.get(`http://192.168.11.109:8000/api/user/get_last_traking/${babyResponse.data[0].baby_id}/`);
        const trackingData = trackingResponse.data;

        if (trackingData.length > 0) {
          setTracking(trackingData[0]);
        } else {
          setTracking(null); // aucun enregistrement
        }
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        setTracking(null);
      }
    };

    fetchData();
  }, []);

  if (!baby || tracking === undefined) {
    return <Text style={{ marginTop: 50, textAlign: "center" }}>Chargement...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Svg viewBox="0 0 500 150" preserveAspectRatio="none" style={styles.wave}>
          <Path d="M-0.00,49.98 C150.00,150.00 349.90,-49.98 500.00,49.98 L500.00,150.00 L-0.00,150.00 Z" fill="#fff" />
        </Svg>
        <Image source={require("../assets/images/baby-icon.png")} style={styles.profileImage} />
        <Text style={styles.title}>Baby health</Text>
        <Text style={styles.name}>{baby.name}</Text>
        <Text style={styles.birthDate}>Date de naissance: {baby.date_of_birth}</Text>
      </View>

      <View style={styles.tabNav}>
        <Text style={styles.tabActive}>Vue d’ensemble</Text>
        <Text style={styles.tab}>Poids</Text>
        <Text style={styles.tab}>Taille</Text>
        <Text style={styles.tab}>Périmètre crânien</Text>
      </View>

      <View style={styles.measureContainer}>
        {tracking ? (
          <>
            <View style={styles.card}>
              <Text style={styles.date}>{tracking.date_recorded}</Text>
              <Text style={styles.label}>Poids</Text>
              <Text style={styles.value}>{tracking.weight} <Text style={styles.unit}>kg</Text></Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.date}>{tracking.date_recorded}</Text>
              <Text style={styles.label}>Taille</Text>
              <Text style={styles.value}>{tracking.height} <Text style={styles.unit}>cm</Text></Text>
              <Text style={styles.subLabel}>Périmètre crânien</Text>
              <Text style={styles.value}>{tracking.head_circumference} <Text style={styles.unit}>cm</Text></Text>
            </View>
          </>
        ) : (
          <Text style={{ textAlign: "center", color: "#999", marginTop: 20, marginBottom: 20 }}>
            Aucun enregistrement n’est effectué
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/addtracking")}>
        <Text style={styles.addButtonText}>Ajouter une mesure</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#F4C7C3",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 80,
    position: "relative",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E57373",
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  birthDate: {
    fontSize: 14,
    color: "#444",
  },
  tabNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  tab: {
    color: "#999",
    fontSize: 14,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#E57373",
    paddingBottom: 4,
    fontWeight: "bold",
    fontSize: 14,
  },
  measureContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    width: "45%",
    alignItems: "center",
    marginBottom: 20,
  },
  date: {
    color: "#999",
    fontSize: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  subLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  unit: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#F4A4A0",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 40,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
