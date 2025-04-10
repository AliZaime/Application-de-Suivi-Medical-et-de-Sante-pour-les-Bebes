import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from 'axios';

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
      .post('http://192.168.11.109:8000/api/user/auth/', userData)
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
      <Text style={styles.title}>Connexion</Text>

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

      <Button title="Se connecter" onPress={handleLogin} />
      
      {message && <Text style={styles.message}>{message}</Text>}

      <Text style={styles.link} onPress={() => router.push("/Register")}>
        Pas encore de compte ? Inscrivez-vous
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: "red",
  },
});
