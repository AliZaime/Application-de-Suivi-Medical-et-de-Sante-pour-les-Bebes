import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import config from '../config';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";

export default function AddBabyForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const babyData = {
      name: name.trim(),
      date_of_birth: dateOfBirth.toISOString().split("T")[0],
      time_of_birth: timeOfBirth.trim(),
      gender,
      blood_type: bloodType,
      profile_picture: profilePicture.trim()
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setMessage("Token non trouvé. Veuillez vous reconnecter.");
        return;
      }

      await axios.post(`${config.API_BASE_URL}/api/user/add_baby/`, babyData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setMessage("Ajout du bébé réussi !");
      router.push("/home");

    } catch (error) {
      let errorMsg = "Erreur lors de l'ajout.";
      if (error.response) {
        if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        } else if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        } else {
          errorMsg = JSON.stringify(error.response.data, null, 2);
        }
      } else if (error.request) {
        errorMsg = "Aucune réponse reçue du serveur.";
      } else {
        errorMsg = error.message;
      }
      setMessage(errorMsg);
    }
  };

  return (
    <LinearGradient
      colors={["#f8b5c8", "#dbeeff"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={require("../assets/images/baby-icon.png")} style={styles.logo} />
          <Text style={styles.title}>Baby health</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{dateOfBirth.toISOString().split("T")[0]}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDateOfBirth(selectedDate);
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Heure de naissance (ex: 13:30)"
            value={timeOfBirth}
            onChangeText={setTimeOfBirth}
          />

          <View style={styles.pickerContainer}>
            <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
              <Picker.Item label="Sélectionner le sexe" value="" />
              <Picker.Item label="Garçon" value="Garçon" />
              <Picker.Item label="Fille" value="Fille" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={bloodType} onValueChange={setBloodType} style={styles.picker}>
              <Picker.Item label="Sélectionner le groupe sanguin" value="" />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Photo de profil (URL)"
            value={profilePicture}
            onChangeText={setProfilePicture}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>

          {message ? <Text style={{ marginTop: 10 }}>{message}</Text> : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
  },
  formContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
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
    elevation: 2,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#F2D7D5",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    backgroundColor: "#F4A4A0",
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
