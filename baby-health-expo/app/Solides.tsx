import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from "react-native-chart-kit";
import { useLocalSearchParams } from 'expo-router';

const Solides = () => {
  const { babyId } = useLocalSearchParams();

  const [solides, setSolides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [showGraph, setShowGraph] = useState(false);

  const [type, setType] = useState('fruit');
  const [date, setDate] = useState(new Date());
  const [heure, setHeure] = useState(new Date());
  const [quantite, setQuantite] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false); 

  useEffect(() => {
    fetchSolides();
  }, []);

  const fetchSolides = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.11.104:8000/api/solides/baby/${babyId}/`);
      setSolides(res.data.data || []);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les données des solides.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!date || !heure || !quantite) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    const payload = {
      type,
      date: date,
      heure: heure,
      quantite: parseInt(quantite, 10),
      baby: parseInt(babyId as string, 10),
    };

    try {
      if (editing) {
        await axios.put(`http://192.168.11.104:8000/api/solides/${editing.id}/`, payload);
      } else {
        await axios.post('http://192.168.11.104:8000/api/solides/', payload);
      }
      setModalVisible(false);
      setEditing(null);
      fetchSolides();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le solide');
    }
  };

  const openModal = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); 
    const currentTime = now.toTimeString().slice(0, 5);
    setDate(today);
    setHeure(currentTime);
    setQuantite('');
    setType('fruit');
    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setDate(item.date);
    setHeure(item.heure); 
    setQuantite(item.quantite.toString()); 
    setType(item.type); 
    setModalVisible(true); 
  };

  const getGraphData = () => {
    if (!Array.isArray(solides) || solides.length === 0) {
      return {
        labels: ["Aucune donnée"],
        datasets: [{ data: [0] }], 
      };
    }

    const groupedData = solides.reduce((acc: any, item: any) => {
      if (item.date && item.quantite && !isNaN(item.quantite)) {
        if (!acc[item.date]) {
          acc[item.date] = 0;
        }
        acc[item.date] += item.quantite;
      }
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const labels = sortedDates;
    const data = sortedDates.map((date) => groupedData[date]);

    return {
      labels,
      datasets: [{ data }],
    };
  };
  const handleDelete = async (id: number) => {
    Alert.alert('Confirmation', 'Supprimer ce solide ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.11.104:8000/api/solides/${id}/delete/`);
            fetchSolides();
          } catch (e) {
            Alert.alert('Erreur', 'Impossible de supprimer le solide');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Type : {item.type}</Text>
        <Text style={styles.dateText}>Date : {item.date} à {item.heure}</Text>
        <Text style={styles.tempsText}>Quantité : {item.quantite} g</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => openEdit(item)} style={{ marginRight: 10 }}>
          <FontAwesome5 name="edit" size={20} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <FontAwesome5 name="trash" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Text style={styles.title}>Solides</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#a21caf" />
      ) : (
        <>
          <TouchableOpacity style={styles.graphBtn} onPress={() => setShowGraph(!showGraph)}>
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
              withVerticalLabels={true}
              withHorizontalLabels={false}
              style={{ marginVertical: 16, borderRadius: 16, alignSelf: "center" }}
              bezier
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
            data={solides}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucun Solide enregistré.</Text>}
          />

        </>
      )}

      <TouchableOpacity style={styles.addBtn} onPress={openModal}>
        <FontAwesome5 name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Modifier' : 'Ajouter'} un solide</Text>
            <TouchableOpacity onPress={() => setShowTypePicker(true)}>
              <Text style={styles.input}>{type}</Text>
            </TouchableOpacity>
            <Modal visible={showTypePicker} animationType="slide" transparent>
              <View style={styles.modalBg}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Choisir un type</Text>
                  {["fruit", "legumes", "cereales", "viandes", "proteines"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setType(item);
                        setShowTypePicker(false);
                      }}
                    >
                      <Text style={styles.option}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{date || "Choisir la date"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date ? new Date(date) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate.toISOString().split('T')[0]);
                }}
              />
            )}
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text>{heure || "Choisir l'heure"}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={heure ? new Date(`1970-01-01T${heure}`) : new Date()}
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
              placeholder="Quantité (en g)"
              placeholderTextColor='#a1a1aa'
              keyboardType="numeric"
              value={quantite}
              onChangeText={setQuantite}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editing ? "Modifier" : "Ajouter"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
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
    paddingTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 50,
    color: '#a21caf',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '',
    marginBottom: 4,
  },
  dateText: {
    color: '#888',
    fontSize: 14,
  },
  tempsText: {
    color: '#a21caf',
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    color: 'blue',
  },
  deleteText: {
    color: 'red',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
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
  },
  modalTitle: {
    fontSize: 20,
    color: '#a21caf',
    fontWeight: 'bold',
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
  },
  option: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  graphBtn: {
    backgroundColor: '#a21caf',
    borderRadius: 10,
    padding: 12,
    alignSelf: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 40,
  },
});

export default Solides;