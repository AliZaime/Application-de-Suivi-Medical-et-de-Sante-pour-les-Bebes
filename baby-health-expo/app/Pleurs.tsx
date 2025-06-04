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
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import config from '../config'; 
export default function CryDetection() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [cryPrediction, setCryPrediction] = useState(null);
  const [message, setMessage] = useState(null);

  // Affiche un message temporaire
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  // Convertit un fichier audio en WAV via FFmpeg
  const convertToWav = async (fileUri) => {
    try {
      // Générer le chemin de sortie en .wav
      const outputUri = fileUri.replace(/\.[^/.]+$/, '.wav');

      // Commande FFmpeg (mono, 22050 Hz)
      const command = `-i "${fileUri}" -ar 22050 -ac 1 "${outputUri}"`;

      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();

      if (returnCode.isValueSuccess()) {
        console.log('Conversion terminée:', outputUri);
        return outputUri;
      } else {
        console.error('Erreur conversion FFmpeg:', await session.getFailStackTrace());
        return null;
      }
    } catch (error) {
      console.error('Erreur convertToWav:', error);
      return null;
    }
  };

  // Démarrer l’enregistrement audio
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission requise', 'Permission microphone refusée');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
      showMessage("Enregistrement démarré");
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de démarrer l’enregistrement');
    }
  };

  // Arrêter l’enregistrement audio et lancer la détection
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        showMessage("Enregistrement terminé");
        const wavUri = await convertToWav(uri);
        if (wavUri) {
          detectCryFile(wavUri);
        } else {
          Alert.alert('Erreur', 'Conversion audio impossible');
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d’arrêter l’enregistrement');
    }
  };

  // Choisir un fichier audio (sans conversion, supposé déjà WAV)
  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        showMessage("Fichier audio sélectionné");
        detectCryFile(fileUri);
      } else {
        console.log("Sélection annulée ou aucun fichier");
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner un fichier audio');
    }
  };

  // Envoyer le fichier au backend et récupérer la prédiction
  const detectCryFile = async (fileUri) => {
    setIsDetecting(true);
    setCryPrediction(null);
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: fileUri,
        name: 'audio.wav',
        type: 'audio/wav',
      });

      const response = await axios.post(
        `${config.API_BASE_URL}/api/cry_detection/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setCryPrediction(response.data);
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la détection du pleur');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détection de pleurs bébé</Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, isRecording ? styles.stopButton : styles.recordButton]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>{isRecording ? 'Arrêter' : 'Enregistrer'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.pickButton]} onPress={pickAudioFile}>
          <Text style={styles.buttonText}>Choisir un fichier</Text>
        </TouchableOpacity>
      </View>

      {message && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      {isDetecting && <ActivityIndicator size="large" color="#a21caf" style={{ marginTop: 20 }} />}

      {cryPrediction && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            Prédiction : {cryPrediction.label || cryPrediction.prediction}
          </Text>
          <Text style={styles.resultText}>
            Confiance : {(cryPrediction.confidence * 100).toFixed(2)} %
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f6fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a21caf',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    elevation: 4,
  },
  recordButton: {
    backgroundColor: '#4caf50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  pickButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#a21caf',
    borderRadius: 8,
    alignSelf: 'center',
  },
  messageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00796b',
    textAlign: 'center',
  },
});
