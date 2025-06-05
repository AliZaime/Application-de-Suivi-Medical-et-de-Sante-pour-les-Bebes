import { useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import config from '../config'; 
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    const userData = {
      email: email.trim().toLowerCase(),
      password,
    };

    axios
      .post(`${config.API_BASE_URL}/api/user/login_parent/`, userData)

      .then(async (response) => {
        setMessage('Connexion réussie !');

        const parentId = response.data?.parent_id;
        const token = response.data?.token;

        if (!token || !parentId) {
          setMessage("Données manquantes dans la réponse !");
          return;
        }

        await AsyncStorage.setItem("parent_id", parentId.toString());
        await AsyncStorage.setItem("token", token);

        const babyResponse = await axios.get(`${config.API_BASE_URL}/api/user/get_babies_by_parent_id/${parentId}/`);

        const babies = babyResponse.data;

        if (babies.length === 0) {
          router.replace("/addBaby");
        } else {
          router.replace("/home");
          router.replace("/today"); // ✅ au moins un bébé → aller à l’accueil
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion :", error.response?.data || error.message);
        setMessage(error.response?.data?.error || "Erreur lors de la connexion.");
      });
  };

  return (
    <LinearGradient
          colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/baby-icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Baby health</Text>
        </View>

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
    paddingTop: 200,
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
  message: {
    marginTop: 10,
    color: "#333",
    textAlign: "center",
  },
  link: {
    color: "#a21caf",
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
