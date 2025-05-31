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
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import axios from "axios";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [notification_preferences, setnotification_preferences] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password,
      notification_preferences: notification_preferences.trim(),
    };

    axios
      .post("http://192.168.11.111:8000/api/user/register/", userData)
      .then((response) => {
        setMessage("Inscription réussie !");
        router.push("/login");
      })
      .catch((error) => {
        setMessage("Erreur lors de l'inscription.");
        console.error(error.response?.data || error.message);
      });
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
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Préférence de notification"
          value={notification_preferences}
          onChangeText={setnotification_preferences}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        {message ? <Text style={{ marginTop: 10 }}>{message}</Text> : null}

        <Text style={styles.link} onPress={() => router.push("/login")}>
          Déjà un compte ? Connectez-vous
        </Text>
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
