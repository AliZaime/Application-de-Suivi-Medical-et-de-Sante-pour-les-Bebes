import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';

const Temperature = () => {
  const { babyId } = useLocalSearchParams();
  const [temperatures, setTemperatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  // Form state
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [temperature, setTemperature] = useState('');
  const [remarque, setRemarque] = useState('');

  useEffect(() => {
    fetchTemperatures();
  }, []);

  const fetchTemperatures = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.1.166:8000/api/temperatures/baby/${babyId}/`);
      setTemperatures(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (e) {
      setTemperatures([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (defaultDate = '', defaultHeure = '') => {
    setDate(defaultDate);
    setHeure(defaultHeure);
    setTemperature('');
    setRemarque('');
    setEditing(null);
  };

  const openEdit = (item) => {
    setEditing(item);
    setDate(item.date);
    setHeure(item.heure);
    setTemperature(item.temperature.toString());
    setRemarque(item.remarque);
    setModalVisible(true);
  };

  const openModal = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentHeure = now.toTimeString().slice(0, 5);
    resetForm(today, currentHeure);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!date || !heure || !temperature) {
      Alert.alert('Erreur', 'Date, heure et température sont obligatoires');
      return;
    }
    const payload = {
      date,
      heure,
      temperature: parseFloat(temperature),
      remarque,
      baby: parseInt(babyId, 10),
    };
    try {
      if (editing) {
        await axios.put(`http://192.168.1.166:8000/api/temperatures/${editing.id}/`, payload);
      } else {
        await axios.post(`http://192.168.1.166:8000/api/temperatures/`, payload);
      }
      setModalVisible(false);
      resetForm();
      fetchTemperatures();
    } catch (e) {
      if (e.response && e.response.data) {
        Alert.alert('Erreur', JSON.stringify(e.response.data));
      } else {
        Alert.alert('Erreur', 'Impossible de sauvegarder');
      }
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmation', 'Supprimer cette température ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.1.166:8000/api/temperatures/${id}/delete/`);
            fetchTemperatures();
          } catch (e) {
            Alert.alert('Erreur', 'Suppression impossible');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dateText}>
          {item.date} à {item.heure}
        </Text>
        <Text style={styles.tempText}>Température : {item.temperature} °C</Text>
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


  const getGraphData = () => {
    if (temperatures.length === 0) {
        return {
        labels: [],
        datasets: [{ data: [] }],
        };
    }
    // On trie les températures par date croissante
    const sortedTemps = [...temperatures].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Extraire les labels (dates uniques)
    const labels = [...new Set(sortedTemps.map(t => t.date))];

    // Pour chaque date, calculer la moyenne des températures
    const data = labels.map(label => {
        const tempsForDate = temperatures.filter(t => t.date === label);
        const sum = tempsForDate.reduce((acc, cur) => acc + cur.temperature, 0);
        return sum / tempsForDate.length;
    });

    return {
        labels,
        datasets: [{ data }],
    };
    };

  return (
    <LinearGradient
      colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Text style={styles.title}>Températures du bébé</Text>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#a21caf" />
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.graphBtn} onPress={() => setShowGraph(!showGraph)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {showGraph ? 'Masquer le graphique' : 'Afficher le graphique'}
            </Text>
          </TouchableOpacity>

          {showGraph && temperatures.length > 0 ? (
            <LineChart
                data={getGraphData()}
                width={Dimensions.get('window').width - 32}
                height={220}
                chartConfig={{
                backgroundColor: '#f8f6fa',
                backgroundGradientFrom: '#f8f6fa',
                backgroundGradientTo: '#a3cef1',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(162, 28, 175, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                }}
                style={{ marginVertical: 16, borderRadius: 16, alignSelf: 'center' }}
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
                    {indexData.toFixed(1)}
                </Text>
                )}
            />
            ) : showGraph ? (
            <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>
                Aucune température enregistrée pour afficher le graphique.
            </Text>
            ) : null}
          <FlatList
            data={temperatures}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucune température enregistrée.</Text>}
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
            <Text style={styles.modalTitle}>{editing ? 'Modifier' : 'Ajouter'} une température</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{date ? date : 'Choisir la date'}</Text>
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

            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
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
              placeholder="Température (°C)"
              placeholderTextColor= '#888'
              keyboardType="decimal-pad"
              value={temperature}
              onChangeText={setTemperature}
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Remarque (optionnel)"
              placeholderTextColor= '#888'
              multiline
              numberOfLines={2}
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
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#a3cef1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 3,
  },
  iconType: {
    marginRight: 16,
  },
  typeText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#6366f1',
  },
  dateText: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  causeText: {
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
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a21caf',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
    alignItems: 'center',
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  typeBtnActive: {
    borderColor: '#a21caf',
    backgroundColor: '#fbeffb',
  },
  causeBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  causeBtnActive: {
    borderColor: '#a21caf',
    backgroundColor: '#fbeffb',
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

export default Temperature;