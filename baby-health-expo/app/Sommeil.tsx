import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

const Sommeil = () => {
  const { babyId } = useLocalSearchParams();
  const router = useRouter();

  const [sommeils, setSommeils] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  
  const [remark, setRemark] = useState('');
  const [duration, setDuration] = useState(0); 

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

 
  const fetchSommeils = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.0.125:8000/api/sommeils/baby/${babyId}/`);
      setSommeils(response.data.data || []);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les données de sommeil.");
      setSommeils([]);
    } finally {
      setLoading(false);
    }
  };

  
  const calculateDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60));
  };

  useEffect(() => {
    fetchSommeils();
  }, []);


  useEffect(() => {
    setDuration(calculateDuration(dateDebut, dateFin));
  }, [dateDebut, dateFin]);

  const handleSave = async () => {
    if (!dateDebut || !dateFin) {
      Alert.alert('Erreur', 'Veuillez sélectionner les dates.');
      return;
    }
  
    const payload = {
      dateDebut: dateDebut.toISOString(),
      dateFin: dateFin.toISOString(),
      duration,
      remarque: remark, 
      baby: parseInt(babyId, 10),
    };

    try {
      if (editing) {
        await axios.put(`http://192.168.0.125:8000/api/sommeils/${editing.id}/`, payload);
      } else {
        await axios.post('http://192.168.0.125:8000/api/sommeils/', payload);
      }
      setModalVisible(false);
      setEditing(null);
      fetchSommeils();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le sommeil.');
    }
  };

  const openModal = () => {
    setDateDebut(new Date());
    setDateFin(new Date());
    setRemark('');
    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setDateDebut(new Date(item.dateDebut));
    setDateFin(new Date(item.dateFin));
    setRemark(item.remarque);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmation', 'Supprimer cet enregistrement de sommeil ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`http://192.168.0.125:8000/api/sommeils/${id}/delete/`);
            fetchSommeils();
          } catch (e) {
            Alert.alert('Erreur', 'Impossible de supprimer cet enregistrement.');
          }
        },
      },
    ]);
  };

  const getGraphData = () => {
    if (!Array.isArray(sommeils) || sommeils.length === 0) {
      return {
        labels: ["Aucune donnée"],
        datasets: [{ data: [0] }],
      };
    }

    // Regrouper les données par dateDebut
    const groupedData = sommeils.reduce((acc, item) => {
      if (item.dateDebut && item.duration && !isNaN(item.duration)) {
        if (!acc[item.dateDebut]) {
          acc[item.dateDebut] = 0;
        }
        acc[item.dateDebut] += item.duration;
      }
      return acc;
    }, {});

    // Trier les clés (dates) par ordre croissant d'après leur timestamp
    const sortedDates = Object.keys(groupedData).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Options pour un affichage abrégé (ex: "12 avr.")
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };

    // Transformer les dates en labels abrégés
    const labels = sortedDates.map(date =>
      new Date(date).toLocaleDateString('fr-FR', options)
    );
    
    const data = sortedDates.map((date) => groupedData[date]);

    return {
      labels,
      datasets: [{ data }],
    };
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>
            Début : {new Date(item.dateDebut).toLocaleString()}
        </Text>
        <Text style={styles.cardLabel}>
            Fin : {new Date(item.dateFin).toLocaleString()}
        </Text>
        <Text style={styles.cardText}>Durée : {item.duration} min</Text>
        {item.remarque ? (
            <Text style={styles.cardRemark}>Remarque : {item.remarque}</Text>
        ) : null}
        </View>
        <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionButton}>
            <FontAwesome5 name="edit" size={20} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
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
      <Text style={styles.title}>Suivi du Sommeil</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#a21caf" />
      ) : (
        <>
          <TouchableOpacity style={styles.graphBtn} onPress={() => setShowGraph(!showGraph)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {showGraph ? "Masquer le graphique" : "Afficher le graphique"}
            </Text>
          </TouchableOpacity>

          {showGraph && (
            <LineChart
              data={getGraphData()}
              width={Dimensions.get("window").width - 32}
              height={350}
              verticalLabelRotation={30}
              chartConfig={{
                backgroundColor: "#f8f6fa",
                backgroundGradientFrom: "#f8f6fa",
                backgroundGradientTo: "#a3cef1",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(162, 28, 175, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForLabels: {
                  fontSize: 12,
                  fontWeight: 'bold',
                },
                style: { borderRadius: 16 },
              }}
              style={{ marginVertical: 16, borderRadius: 16, alignSelf: "center" }}
              bezier
            />
          )}

          <FlatList
            data={sommeils}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucune donnée disponible.</Text>}
          />
        </>
      )}

      <TouchableOpacity style={styles.addBtn} onPress={openModal}>
        <FontAwesome5 name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? "Modifier" : "Ajouter"} un sommeil</Text>

            {/* Champ pour la date et l'heure de début */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowStartPicker(true)}
            >
              <Text>
                {dateDebut ? dateDebut.toLocaleString() : "Sélectionnez date et heure de début"}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={dateDebut || new Date()}
                mode="datetime"
                display="default"
                onChange={(event, selected) => {
                  setShowStartPicker(false);
                  if (selected) {
                    setDateDebut(selected);
                  }
                }}
              />
            )}

           
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowEndPicker(true)}
            >
              <Text>
                {dateFin ? dateFin.toLocaleString() : "Sélectionnez date et heure de fin"}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={dateFin || new Date()}
                mode="datetime"
                display="default"
                onChange={(event, selected) => {
                  setShowEndPicker(false);
                  if (selected) {
                    setDateFin(selected);
                  }
                }}
              />
            )}
            {(duration > 0 ) ? (
                <Text style={[styles.durationText, {color : 'green'}]}>Durée : {duration} min</Text>
                ) : (
                <Text style={styles.durationText}>Durée : {duration} min</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Remarque"
              placeholderTextColor="#888"
              value={remark}
              onChangeText={setRemark}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {editing ? "Modifier" : "Ajouter"}
                </Text>
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
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 7,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  cardRemark: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
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
  durationText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
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

export default Sommeil;