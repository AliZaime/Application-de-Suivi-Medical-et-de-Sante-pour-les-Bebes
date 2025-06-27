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
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from '../config';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

// --- Animation fond nuit (copié de couchePage) ---
const AnimatedNightBackground = () => {
  const waveAnim = React.useRef(new Animated.Value(0)).current;
  const starAnim = React.useRef(new Animated.Value(0)).current;
  const toyAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 16000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(starAnim, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(toyAnim, { toValue: 1, duration: 9000, useNativeDriver: false }),
        Animated.timing(toyAnim, { toValue: 0, duration: 9000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const starOpacity = starAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const toyY = toyAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 320],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#181d36',
      }} />
      <Animated.View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '120%',
        height: 180,
        transform: [{ translateX: waveTranslate }],
        opacity: 0.22,
      }}>
        <Svg width="120%" height="180" viewBox="0 0 500 180">
          <Defs>
            <SvgLinearGradient id="night1" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#232946" stopOpacity="1" />
              <Stop offset="100%" stopColor="#3a506b" stopOpacity="1" />
            </SvgLinearGradient>
          </Defs>
          <SvgPath
            d="M0,60 Q125,120 250,60 T500,60 V180 H0 Z"
            fill="url(#night1)"
          />
        </Svg>
      </Animated.View>
      <Animated.View style={{
        position: 'absolute',
        top: 80,
        left: 40,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#b8e0fe55',
        opacity: 0.4,
      }} />
      <Animated.View style={{
        position: 'absolute',
        top: 320,
        right: 60,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#ffd6e055',
        opacity: 0.4,
      }} />
      {[...Array(18)].map((_, i) => {
        const top = 20 + (i % 6) * 100;
        const left = 20 + (i * 40) % 320;
        return (
          <Animated.View
            key={'star'+i}
            style={{
              position: 'absolute',
              top,
              left,
              opacity: starOpacity,
              zIndex: 1,
            }}>
            <Svg width={i % 3 === 0 ? 18 : 12} height={i % 3 === 0 ? 18 : 12} viewBox="0 0 24 24">
              <SvgPath
                d="M12 2 L13.09 8.26 L19 8.27 L14 12.14 L15.18 18.02 L12 14.77 L8.82 18.02 L10 12.14 L5 8.27 L10.91 8.26 Z"
                fill={i % 2 === 0 ? "#fffbe4" : "#ffe4b8"}
              />
            </Svg>
          </Animated.View>
        );
      })}
      <Animated.View style={{
        position: 'absolute',
        top: toyY,
        left: 180,
        opacity: 0.85,
      }}>
        <Svg width={32} height={32} viewBox="0 0 32 32">
          <SvgPath d="M8 12 L16 8 L24 12 L16 16 Z" fill="#b8e0fe"/>
          <SvgPath d="M8 12 L8 20 L16 24 L16 16 Z" fill="#ffd6e0"/>
          <SvgPath d="M24 12 L24 20 L16 24 L16 16 Z" fill="#b8c1ec"/>
        </Svg>
      </Animated.View>
      <Animated.View style={{
        position: 'absolute',
        top: toyY,
        right: 120,
        opacity: 0.85,
      }}>
        <Svg width={32} height={32} viewBox="0 0 32 32">
          <SvgPath d="M8 24 Q6 20 12 18 Q10 12 18 12 Q28 12 24 22 Q28 22 26 24 Q24 26 8 24 Z" fill="#ffe4b8"/>
          <SvgPath d="M25 18 Q27 17 26 20" fill="#ffb6b6"/>
          <SvgPath d="M20 16 Q21 15 22 16" stroke="#222" strokeWidth={1}/>
        </Svg>
      </Animated.View>
    </View>
  );
};
// --- Fin animation fond nuit ---

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
          router.replace("/today");
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion :", error.response?.data || error.message);
        setMessage(error.response?.data?.error || "Erreur lors de la connexion.");
      });
  };

  return (
    <View style={styles.gradient}>
      <AnimatedNightBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/baby-icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Baby health</Text>
          {message === "Connexion réussie !" && (
            <Text style={styles.successMessage}>{message}</Text>
          )}
          {message && message !== "Connexion réussie !" && (
            <Text style={styles.errorMessage}>{message}</Text>
          )}
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#888"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => router.push("/Register")}>
            Pas encore de compte ? Inscrivez-vous
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#181d36',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  header: {
    alignItems: "center",
    paddingTop: 180,
    paddingBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "#ede9fe",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fffbe4",
    letterSpacing: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: "rgba(248, 246, 250, 0.15)",
    borderRadius: 18,
    marginHorizontal: 12,
    marginTop: 10,
    paddingBottom: 30,
    shadowColor: "#232946",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
},
  input: {
    width: "100%",
    backgroundColor: "#f4f3ff",
    borderWidth: 1.5,
    borderColor: "#b8c1ec",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
    color: "#232946",
  },
  button: {
    backgroundColor: "#7c5fff",
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
    color: "#a21caf",
    textAlign: "center",
  },
  link: {
    color: "#7c5fff",
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  successMessage: {
    marginTop: 18,
    marginBottom: 8,
    color: "#22c55e", // vert pastel
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(34,197,94,0.08)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
  },
  errorMessage: {
    marginTop: 18,
    marginBottom: 8,
    color: "#ef4444", // rouge doux
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(239,68,68,0.08)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "center",
  },
});
