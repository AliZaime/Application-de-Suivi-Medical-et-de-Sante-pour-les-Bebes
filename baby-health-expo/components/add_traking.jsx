import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import axios from "axios";

export default function AddTrackingForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [headCircumference, setHeadCircumference] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    const parentId = await AsyncStorage.getItem("parent_id");

    if (!token || !parentId) {
      setMessage("Authentification manquante.");
      return;
    }

    try {
      const babyRes = await axios.get(
        `http://192.168.57.8:8000/api/user/get_babies_by_parent_id/${parentId}/`
      );
      const babyId = babyRes.data[0].baby_id;

      const trackingData = {
        baby: babyId,
        weight: parseFloat(weight.replace(",", ".")),
        height: parseFloat(height.replace(",", ".")),
        head_circumference: parseFloat(headCircumference.replace(",", ".")),
        date_recorded: date.trim(),
        note: note.trim(),
      };

      const response = await axios.post(
        "http://192.168.57.8:8000/api/user/add_tracking/",
        trackingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Mesure enregistrée avec succès !");
      router.push("/home"); // ou router.back()

    } catch (error) {
      console.error("Erreur :", error);
      setMessage(
        error.response?.data?.error || "Erreur lors de l'enregistrement"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* En-tête avec vague et icône */}
      <View style={styles.header}>
        <Svg viewBox="0 0 500 150" preserveAspectRatio="none" style={styles.wave}>
          <Path
            d="M-0.00,49.98 C150.00,150.00 349.90,-49.98 500.00,49.98 L500.00,150.00 L-0.00,150.00 Z"
            fill="#fff"
          />
        </Svg>
        <Image
          source={require("../assets/images/baby-icon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Ajouter une nouvelle mesure</Text>
      </View>

      {/* Formulaire */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Date de la mesure (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Poids (ex: 6.5)"
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Taille (en cm)"
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Périmètre crânien (en cm)"
          keyboardType="decimal-pad"
          value={headCircumference}
          onChangeText={setHeadCircumference}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Notes (optionnel)"
          multiline
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>

        {message ? <Text style={{ marginTop: 10 }}>{message}</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  header: {
    position: "relative",
    backgroundColor: "#F4C7C3",
    alignItems: "center",
    paddingBottom: 60,
    paddingTop: 50,
  },
  wave: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 250,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    zIndex: 1,
    marginTop: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F2D7D5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: "#F4C7C3",
    borderRadius: 25,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});