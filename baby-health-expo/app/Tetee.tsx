import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from "react-native-chart-kit";
import config from '../config'; 
const TeteePage = () => {
  const { babyId } = useLocalSearchParams();
  const [tetees, setTetees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  // Form state
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [tempsPasse, setTempsPasse] = useState('');
  const [remarque, setRemarque] = useState('');

  // Fetch tetees
  useEffect(() => {
    fetchTetees();
  }, []);

  const fetchTetees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/tetees/baby/${babyId}/`);
      console.log(babyId);
      setTetees(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (e) {
      setTetees([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (defaultDate = '', defaultHeure = '') => {
    setDate(defaultDate);
    setHeure(defaultHeure);
    setTempsPasse('');
    setRemarque('');
    setEditing(null);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setDate(item.date);
    setHeure(item.heure);
    setTempsPasse(item.temps_passe.toString());
    setRemarque(item.remarque);
    setModalVisible(true);
  };

  const openModal = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const currentHeure = now.toTimeString().slice(0, 5); // HH:mm
    resetForm(today, currentHeure);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!date || !heure || !tempsPasse) {
      Alert.alert('Erreur', 'Date, heure et temps passé sont obligatoires');
      return;
    }
    const payload = {
      date,
      heure,
      temps_passe: parseInt(tempsPasse, 10),
      remarque,
      baby: parseInt(babyId as string, 10),
    };
    try {
      if (editing) {
        await axios.put(`${config.API_BASE_URL}/api/tetees/${editing.id}/`, payload);
      } else {
        await axios.post(`${config.API_BASE_URL}/api/tetees/`, payload);
      }
      setModalVisible(false);
      resetForm();
      fetchTetees();
    } catch (e) {
      if (e.response && e.response.data) {
        Alert.alert('Erreur', JSON.stringify(e.response.data));
      } else {
        Alert.alert('Erreur', 'Impossible de sauvegarder');
      }
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmation', 'Supprimer cette tétée ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${config.API_BASE_URL}/api/tetees/${id}/delete/`);
            fetchTetees();
          } catch (e) {
            Alert.alert('Erreur', 'Suppression impossible');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dateText}>{item.date} à {item.heure}</Text>
        <Text style={styles.tempsText}>Temps passé : {item.temps_passe} min</Text>
        {item.remarque ? <Text style={styles.remarqueText}>Remarque : {item.remarque}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => openEdit(item)} style={{ marginRight: 10 }}>
        <FontAwesome5 name="edit" size={20} color="#6366f1" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <FontAwesome5 name="trash" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  function getGraphData() {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    tetees.forEach(tetee => {
      const d = new Date(tetee.date);
      const day = d.getDay() === 0 ? 6 : d.getDay() - 1;
      counts[day]++;
    });
    return {
      labels: jours,
      datasets: [{ data: counts }],
    };
  }

  return (
    <LinearGradient
      colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Text style={styles.title}>Tétées du bébé</Text>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#a21caf" />
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.graphBtn}
            onPress={() => setShowGraph(!showGraph)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {showGraph ? "Masquer le graphique" : "Afficher le graphique"}
            </Text>
          </TouchableOpacity>

          {showGraph && (
            <LineChart
              data={getGraphData()}
              width={Dimensions.get("window").width - 32}
              height={220}
              chartConfig={{
                backgroundColor: "#f8f6fa",
                backgroundGradientFrom: "#f8f6fa",
                backgroundGradientTo: "#a3cef1",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(162, 28, 175, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              style={{ marginVertical: 16, borderRadius: 16, alignSelf: "center" }}
              bezier
              withVerticalLabels={true}
              withHorizontalLabels={false}
              renderDotContent={({ x, y, index, indexData }) => (
                <Text
                  key={index}
                  style={{
                    position: 'absolute',
                    top: y - 24,
                    left: x - 8,
                    color: '#a21caf',
                    fontWeight: 'bold',
                    fontSize: 13,
                  }}
                >
                  {indexData}
                </Text>
              )}
            />
          )}
          <FlatList
            data={tetees}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucune tétée enregistrée.</Text>}
          />
        </>
      )}
      <TouchableOpacity style={styles.addBtn} onPress={openModal} disabled={loading}>
        <FontAwesome5 name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Modal ajout/modif */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? "Modifier" : "Ajouter"} une tétée</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date ? date : "Choisir la date"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date ? new Date(date + 'T' + (heure || '00:00')) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate.toISOString().slice(0, 10));
                  }
                }}
              />
            )}

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{heure ? heure : "Choisir l'heure"}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={date && heure ? new Date(date + 'T' + heure) : new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const hours = selectedTime.getHours().toString().padStart(2, '0');
                    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                    setHeure(`${hours}:${minutes}`);
                  }
                }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Temps passé (en minutes)"
              placeholderTextColor= "#888"
              keyboardType="numeric"
              value={tempsPasse}
              onChangeText={setTempsPasse}
            />
            <TextInput
              style={styles.input}
              placeholder="Remarque (optionnel)"
              placeholderTextColor= "#888"
              value={remarque}
              onChangeText={setRemarque}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editing ? "Modifier" : "Ajouter"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={{ color: '#6366f1' }}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#f8f6fa',
    paddingTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#a21caf',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 16,
  marginBottom: 14,
  borderLeftWidth: 6,
  borderLeftColor: '#a21caf', // couleur personnalisée
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
},
  dateText: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  tempsText: {
    color: '#a21caf',
    fontSize: 14,
    marginTop: 2,
  },
  remarqueText: {
    color: '#555',
    fontSize: 13,
    marginTop: 2,
    fontStyle: 'italic',
  },
  addBtn: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#a21caf',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    width: '90%',
    borderColor: '#fff',
    borderWidth: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a21caf',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 4,
    fontSize: 15,
    backgroundColor: '#f9fafb',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  saveBtn: {
    backgroundColor: '#a21caf',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  cancelBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: '#a21caf',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 40,
  },
  graphBtn: {
    backgroundColor: "#a21caf",
    borderRadius: 10,
    padding: 12,
    alignSelf: "center",
    marginTop: 18,
    marginBottom: 10,
    minWidth: 180,
    alignItems: "center",
  },
});

export default TeteePage;