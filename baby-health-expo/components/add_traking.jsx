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
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config'; 
export default function AddTrackingForm() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [headCircumference, setHeadCircumference] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (selectedDate) => {
    const isoDate = selectedDate.toISOString().split("T")[0];
    setDate(isoDate);
    hideDatePicker();
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    const parentId = await AsyncStorage.getItem("parent_id");

    if (!token || !parentId) {
      setMessage("Authentification manquante.");
      return;
    }

    try {
      const babyRes = await axios.get(

        `${config.API_BASE_URL}/api/user/get_babies_by_parent_id/${parentId}/`

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

      await axios.post(
        `${config.API_BASE_URL}/api/user/add_tracking/`,
        trackingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Mesure enregistrée avec succès !");
      router.push("/today");
    } catch (error) {
      console.error("Erreur :", error);
      setMessage(
        error.response?.data?.error || "Erreur lors de l'enregistrement"
      );
    }
  };

  return (
    <View style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/baby-icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Ajouter une nouvelle mesure</Text>
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={showDatePicker} style={styles.input}>
            <Text style={{ color: date ? "#232946" : "#b8c1ec" }}>
              {date || "Sélectionner la date de mesure"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />
          <TextInput
            style={styles.input}
            placeholder="Poids (ex: 6.5)"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
            placeholderTextColor="#b8c1ec"
          />
          <TextInput
            style={styles.input}
            placeholder="Taille (en cm)"
            keyboardType="decimal-pad"
            value={height}
            onChangeText={setHeight}
            placeholderTextColor="#b8c1ec"
          />
          <TextInput
            style={styles.input}
            placeholder="Périmètre crânien (en cm)"
            keyboardType="decimal-pad"
            value={headCircumference}
            onChangeText={setHeadCircumference}
            placeholderTextColor="#b8c1ec"
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Notes (optionnel)"
            multiline
            value={note}
            onChangeText={setNote}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>
          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    backgroundColor: '#181d36',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    alignItems: "center",
    paddingTop: 90,
    paddingBottom: 40,
    gap: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fffbe4",
    letterSpacing: 1,
    textShadowColor: "#7c5fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBlock: 30,
    marginHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  input: {
    width: "100%",
    backgroundColor: "#f4f3ff",
    borderWidth: 1.5,
    borderColor: "#fgegg",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
    color: "#232946",
    shadowColor: "#7c5fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: "#7c5fff",
    borderRadius: 25,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#7c5fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fffbe4",
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    marginTop: 10,
    color: "#a21caf",
    fontWeight: "bold",
    textAlign: "center",
  },
});
