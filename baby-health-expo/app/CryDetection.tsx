import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import axios from 'axios';
import config from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from "react-native-svg";
import { Animated, Easing } from "react-native";

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

export default function CryDetection() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [cryPrediction, setCryPrediction] = useState(null);
  const [message, setMessage] = useState(null);
  const { babyId } = useLocalSearchParams();
  const router = useRouter();

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  };

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission refusée');

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
    setIsRecording(true);
    showMessage("Enregistrement démarré");
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        showMessage("Enregistrement terminé");
        detectCryFile(uri);
      }
    } catch {
      Alert.alert('Erreur', "Impossible d’arrêter l’enregistrement");
    }
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        showMessage("Fichier audio sélectionné");
        detectCryFile(fileUri);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de choisir un fichier');
    }
  };

  const detectCryFile = async (fileUri) => {
    setIsDetecting(true);
    setCryPrediction(null);
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: fileUri,
        name: 'audio.m4a', // ou .3gp selon le format
        type: 'audio/x-m4a', // ou 'audio/3gpp'
      });
      formData.append('baby_id', babyId);

      const response = await axios.post(`${config.API_BASE_URL}/api/cry_detection/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCryPrediction(response.data);
      setTimeout(() => router.back(), 5000);
    } catch {
      Alert.alert('Erreur', 'Erreur lors de la détection');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <View style={styles.gradient}>
      <AnimatedNightBackground />
      <View style={styles.container}>
        <Text style={styles.title}>Détection de pleurs bébé</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={[styles.button, isRecording ? styles.stopButton : styles.recordButton]} onPress={isRecording ? stopRecording : startRecording}>
            <Text style={styles.buttonText}>{isRecording ? 'Arrêter' : 'Enregistrer'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.pickButton]} onPress={pickAudioFile}>
            <Text style={styles.buttonText}>Choisir un fichier</Text>
          </TouchableOpacity>
        </View>
        {message && <View style={styles.messageBox}><Text style={styles.messageText}>{message}</Text></View>}
        {isDetecting && <ActivityIndicator size="large" color="#a21caf" style={{ marginTop: 20 }} />}
        {cryPrediction && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>Prédiction : {cryPrediction.label}</Text>
            <Text style={styles.resultText}>Confiance : {(cryPrediction.confidence * 100).toFixed(2)}%</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, backgroundColor: '#181d36' },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fffbe4',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 50,
    letterSpacing: 1,
    textShadowColor: "#7c5fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  button: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 10, elevation: 4 },
  recordButton: { backgroundColor: '#4caf50' },
  stopButton: { backgroundColor: '#f44336' },
  pickButton: { backgroundColor: '#2196f3' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  messageBox: { marginTop: 20, padding: 10, backgroundColor: '#a21caf', borderRadius: 8, alignSelf: 'center' },
  messageText: { color: 'white', fontWeight: 'bold' },
  resultBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "rgba(248,246,250,0.97)",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#ede9fe",
    shadowColor: "#b8c1ec",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
  },
  resultText: { fontSize: 18, fontWeight: '600', color: '#7c5fff', textAlign: 'center' },
});
