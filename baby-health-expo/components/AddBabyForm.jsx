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
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import axios from "axios";

export default function AddBabyForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [date_of_birth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [blood_type, setBloodType] = useState("");
    const [profile_picture, setProfilePicture] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
  const babyData = {
    name: name.trim(),
    date_of_birth: date_of_birth.trim(),
    gender: gender.trim(),
    blood_type: blood_type.trim(),
    profile_picture: profile_picture.trim()
  };

  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      setMessage("Token non trouvé. Veuillez vous reconnecter.");
      return;
    }

    const response = await axios.post(
      "http://192.168.1.166:8000/api/user/add_baby/",
      babyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    setMessage("Ajout du bébé réussi !");
    router.push("/home");

  } catch (error) {
    let errorMsg = "Erreur lors de l'ajout.";

    if (error.response) {
      // 🔴 Erreur côté serveur avec réponse
      console.log("Erreur response.data:", error.response.data);
      console.log("Erreur status:", error.response.status);
      console.log("Erreur headers:", error.response.headers);

      if (error.response.data?.error) {
        errorMsg = error.response.data.error;
      } else if (typeof error.response.data === "string") {
        errorMsg = error.response.data;
      } else {
        errorMsg = JSON.stringify(error.response.data, null, 2);
      }

    } else if (error.request) {
      // ⚠️ La requête a été faite mais aucune réponse
      console.log("Erreur request:", error.request);
      errorMsg = "Aucune réponse reçue du serveur.";
    } else {
      // ❌ Erreur inattendue
      console.log("Erreur générique:", error.message);
      errorMsg = error.message;
    }

    setMessage(errorMsg);
  }
};


    return (
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header avec vague et logo */}
          <View style={styles.header}>
            <Svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              style={styles.wave}
            >
              <Path
                d="M-0.00,49.98 C150.00,150.00 349.90,-49.98 500.00,49.98 L500.00,150.00 L-0.00,150.00 Z"
                fill="#fff"
              />
            </Svg>
            <Image
              source={require("../assets/images/baby-icon.png")}
              style={styles.logo}
            />
            <Text style={styles.title}>Baby health</Text>
          </View>
    
          {/* Formulaire */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Date de naissance (AAAA-MM-JJ)"
              value={date_of_birth}
              onChangeText={setDateOfBirth}
            />
            <TextInput
              style={styles.input}
              placeholder="Sexe"
              value={gender}
              onChangeText={setGender}
            />
            <TextInput
              style={styles.input}
              placeholder="Groupe sanguin"
              value={blood_type}
              onChangeText={setBloodType}
            />
            <TextInput
              style={styles.input}
              placeholder="Photo de profil (URL)"
              value={profile_picture}
              onChangeText={setProfilePicture}
            />
    
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Ajouter</Text>
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
  link: {
    color: "#F4A4A0",
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});