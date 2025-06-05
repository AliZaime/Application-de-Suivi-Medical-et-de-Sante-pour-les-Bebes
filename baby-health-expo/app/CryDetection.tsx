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
    setTimeout(() => setMessage(null), 2000);
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
      setTimeout(() => router.back(), 2000);
    } catch {
      Alert.alert('Erreur', 'Erreur lors de la détection');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <LinearGradient colors={['#ffb6c1', '#f8f6fa', '#a3cef1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#a21caf', textAlign: 'center', marginBottom: 30 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  button: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 10, elevation: 4 },
  recordButton: { backgroundColor: '#4caf50' },
  stopButton: { backgroundColor: '#f44336' },
  pickButton: { backgroundColor: '#2196f3' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  messageBox: { marginTop: 20, padding: 10, backgroundColor: '#a21caf', borderRadius: 8, alignSelf: 'center' },
  messageText: { color: 'white', fontWeight: 'bold' },
  resultBox: { marginTop: 30, padding: 16, backgroundColor: '#e0f7fa', borderRadius: 12 },
  resultText: { fontSize: 18, fontWeight: '600', color: '#00796b', textAlign: 'center' },
});
