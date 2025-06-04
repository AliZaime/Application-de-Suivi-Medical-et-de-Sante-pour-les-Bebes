import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from "react-native-chart-kit";
import { useLocalSearchParams } from 'expo-router';

const Biberon = () => {
  const { babyId } = useLocalSearchParams();

  const [biberons, setBiberons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  // Form state
  const [quantite, setQuantite] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [source, setSource] = useState('sein');
  const [remarque, setRemarque] = useState('');

  const sources = [
    { label: 'Sein', value: 'sein' },
    { label: 'Lait artificiel', value: 'lait_artificiel' },
  ];

  useEffect(() => {
    fetchBiberons();
  }, []);

  const fetchBiberons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.11.104:8000/api/biberons/baby/${babyId}/`);
      setBiberons(res.data.data || []);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger les biberons');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuantite('');
    setDate('');
    setHeure('');
    setSource('sein');
    setRemarque('');
    setEditing(null);
  };

  const openModal = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // Format YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5); // Format HH:mm

    setDate(today); // Définit la date actuelle
    setHeure(currentTime); // Définit l'heure actuelle
    setQuantite('');
    setSource('sein');
    setRemarque('');
    setEditing(null); // Indique qu'il s'agit d'un ajout
    setModalVisible(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setQuantite(item.quantite.toString());
    setDate(item.date);
    setHeure(item.heure);
    setSource(item.source);
    setRemarque(item.remarque);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!quantite || !date || !heure) {
      Alert.alert('Erreur', 'Quantité, date et heure sont obligatoires');
      return;
    }

    if (isNaN(Number(quantite)) || Number(quantite) <= 0) {
      Alert.alert('Erreur', 'La quantité doit être un nombre positif');
      return;
    }

    const payload = {
      quantite: parseInt(quantite, 10),
      date,
      heure,
      source,
      remarque,
      baby: parseInt(babyId as string, 10), // Associe le biberon au bébé
    };

    try {
      if (editing) {
        await axios.put(`http://192.168.11.104:8000/api/biberons/${editing.id}/`, payload);
      } else {
        await axios.post('http://192.168.11.104:8000/api/biberons/', payload);
      }
      setModalVisible(false);
      fetchBiberons();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le biberon');
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmation', 'Supprimer ce biberon ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://192.168.11.104:8000/api/biberons/${id}/delete/`);
            fetchBiberons();
          } catch (e) {
            Alert.alert('Erreur', 'Impossible de supprimer le biberon');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dateText}>{item.date} à {item.heure}</Text>
        <Text style={styles.tempsText}>Quantité : {item.quantite} ml</Text>
        <Text style={styles.sourceText}>Source : {sources.find(s => s.value === item.source)?.label || item.source}</Text>
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

  const getGraphData = () => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    biberons.forEach(biberon => {
      const d = new Date(biberon.date);
      const day = d.getDay() === 0 ? 6 : d.getDay() - 1;
      counts[day] += biberon.quantite;
    });
    return {
      labels: jours,
      datasets: [{ data: counts }],
    };
  };

  return (
    <LinearGradient
      colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Text style={styles.title}>Biberons</Text>
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
            data={biberons}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucun biberon enregistré.</Text>}
          />
        </>
      )}
      <TouchableOpacity style={styles.addBtn} onPress={openModal}>
        <FontAwesome5 name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? "Modifier" : "Ajouter"} un biberon</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantité (en ml)"
              placeholderTextColor= "#888"
              keyboardType="numeric"
              value={quantite}
              onChangeText={(text) => setQuantite(text.replace(/[^0-9]/g, ''))}
            />
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
            <View style={styles.row}>
              <Text style={{ marginLeft: 8, color: '#555', fontSize : 16 }}>Source :</Text>
              {sources.map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.sourceBtn, source === s.value && styles.sourceBtnActive]}
                  onPress={() => setSource(s.value)}
                >
                  <Text>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
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

  list: {
    padding: 16,
    paddingBottom: 80,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
  },

  dateText: {
    color: '#888',
    fontSize: 14,
  },
  tempsText: {
    color: '#a21caf',
    fontSize: 14,
  },
  sourceText: {
    color: '#6366f1',
    fontSize: 14,
  },
  remarqueText: {
    color: '#555',
    fontSize: 13,
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
    color: '#a21caf',
    fontSize: 20,
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

  row: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
    gap: 20,
  },

  sourceBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  sourceBtnActive: {
    borderColor: '#a21caf',
    backgroundColor: '#fbeffb',
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

export default Biberon;