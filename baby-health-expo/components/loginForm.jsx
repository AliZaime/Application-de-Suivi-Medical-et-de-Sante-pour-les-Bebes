import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Button,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import axios from "axios";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    const userData = {
      email: email.trim().toLowerCase(), // bon format
      password
    };

    axios
      .post('http://192.168.0.125:8000/api/user/auth/', userData)
      .then((response) => {
        setMessage('Connexion réussie !');
        console.log("Utilisateur connecté :", response.data);
        router.replace("/(tabs)/home");
      })
      .catch((error) => {
        console.error("Erreur de connexion :", error.response?.data || error.message);
        setMessage(error.response?.data?.error || "Erreur lors de la connexion.");
      });
  };

  return (

    <View style={styles.container}>
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
          
          {message && <Text style={styles.message}>{message}</Text>}

          <Text style={styles.link} onPress={() => router.push("/Register")}>
            Pas encore de compte ? Inscrivez-vous
          </Text>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
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
