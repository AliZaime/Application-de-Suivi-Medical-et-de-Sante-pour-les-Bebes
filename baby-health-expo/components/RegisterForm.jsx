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
import config from '../config';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

// Fond animé nuit
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

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const userData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      gender,
      notification_preferences: "email",
    };

    axios
      .post(`${config.API_BASE_URL}/api/user/registe/`, userData)
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
    <View style={styles.gradient}>
      <AnimatedNightBackground />
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
            placeholder="Nom complet"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />
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
            placeholder="Téléphone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#888"
          />

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
            placeholderTextColor="#888"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>

          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}

          <Text style={styles.link} onPress={() => router.push("/login")}>
            Déjà un compte ? Connectez-vous
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
  pickerContainer: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#b8c1ec",
    borderRadius: 14,
    marginBottom: 18,
    backgroundColor: "#f4f3ff",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#232946",
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#7c5fff",
    borderRadius: 25,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#7c5fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fffbe4",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  message: {
    marginTop: 10,
    color: "#a21caf",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  link: {
    color: "#7c5fff",
    marginTop: 22,
    fontSize: 15,
    textDecorationLine: "underline",
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
});
