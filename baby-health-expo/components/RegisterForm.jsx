import React, { useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import config from '../config'; 
export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [notification_preferences, setNotificationPreferences] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      gender,
      notification_preferences,
    };

    axios
      .post(`${config.API_BASE_URL}/api/user/register/`, userData)
      .then(() => {

        setMessage("Inscription réussie !");
        router.push("/login");
      })
      .catch((error) => {
        setMessage("Erreur lors de l'inscription.");
        console.error(error.response?.data || error.message);
      });
  };

  return (
    <LinearGradient
      colors={["#f8b5c8", "#dbeeff"]}
      style={styles.gradientContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* En-tête sans vague */}
        <View style={styles.header}>
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* Genre */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Sélectionner le genre" value="" />
              <Picker.Item label="Homme" value="homme" />
              <Picker.Item label="Femme" value="femme" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Préférence de notification */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={notification_preferences}
              onValueChange={(itemValue) =>
                setNotificationPreferences(itemValue)
              }
              style={styles.picker}
            >
              <Picker.Item label="Préférence de notification" value="" />
              <Picker.Item label="Email" value="email" />
              <Picker.Item label="SMS" value="sms" />
              <Picker.Item label="Aucun" value="aucun" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>

          {message ? (
            <Text style={{ marginTop: 10, color: "#333" }}>{message}</Text>
          ) : null}

          <Text style={styles.link} onPress={() => router.push("/login")}>
            Déjà un compte ? Connectez-vous
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
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
    color: "#333",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    color: "#333",
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
  link: {
    color: "#a21caf",
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
