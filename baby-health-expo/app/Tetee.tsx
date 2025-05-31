import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const Tetee = () => {
  const { babyId } = useLocalSearchParams(); // Récupère l'ID du bébé depuis l'URL
  const [teteeList, setTeteeList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTetee, setEditingTetee] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchTetees = async () => {
    try {
      const response = await axios.get(`http://192.168.1.139:8000/tetees/baby/${babyId}/`);
      if (response.data.data.length === 0) {
        setError(response.data.message); // Affiche le message "Aucune tétée trouvée pour ce bébé."
      } else {
        setTeteeList(response.data.data);
      }
    } catch (err) {
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  fetchTetees();
}, [babyId]);

    const handleSaveTetee = async (tetee) => {
    try {
        if (editingTetee) {
        // Modifier une tétée existante
        const response = await axios.put(`http://192.168.1.139:8000/tetees/${editingTetee.id}/`, tetee);
        setTeteeList((prev) =>
            prev.map((item) => (item.id === editingTetee.id ? response.data : item))
        );
        } else {
        // Ajouter une nouvelle tétée
        const response = await axios.post(`http://192.168.1.139:8000/tetees/`, tetee);
        setTeteeList((prev) => [...prev, response.data]);
        }
        setModalVisible(false);
        setEditingTetee(null);
    } catch (err) {
        setError("Erreur lors de la sauvegarde.");
    }
    };

  const handleDeleteTetee = async (id) => {
    try {
      await axios.delete(`http://192.168.1.139:8000/tetees/${id}/delete/`);
      setTeteeList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const openModal = () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5); // HH:mm
    setEditingTetee({ date: today, heure: currentTime, temps_passe: '', remarque: '', baby: babyId });
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F4C7C3" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Tétée</Text>
        {teteeList.length === 0 && (
          <Text style={styles.emptyMessage}>Aucune tétée enregistrée pour ce bébé.</Text>
        )}
        <FlatList
          data={teteeList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>Date : {item.date}</Text>
              <Text style={styles.cardText}>Heure : {item.heure}</Text>
              <Text style={styles.cardText}>Temps passé : {item.temps_passe} min</Text>
              <Text style={styles.cardText}>Remarque : {item.remarque}</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingTetee(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.editButton}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTetee(item.id)}>
                <Text style={styles.deleteButton}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {/* Bouton flottant pour ajouter une tétée */}
        <TouchableOpacity style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        {modalVisible && (
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingTetee ? 'Ajouter une Tétée' : 'Modifier une Tétée'}
            </Text>
            <Text>Date :</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{editingTetee?.date || 'Choisir une date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(editingTetee?.date || Date.now())}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const formattedDate = selectedDate.toISOString().slice(0, 10);
                    setEditingTetee((prev) => ({ ...prev, date: formattedDate }));
                  }
                }}
              />
            )}
            <Text>Heure :</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{editingTetee?.heure || 'Choisir une heure'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const hours = selectedTime.getHours().toString().padStart(2, '0');
                    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                    setEditingTetee((prev) => ({ ...prev, heure: `${hours}:${minutes}` }));
                  }
                }}
              />
            )}
            <Text>Temps passé (en minutes) :</Text>
            <TextInput
              style={styles.input}
              placeholder="Temps passé"
              keyboardType="numeric"
              value={editingTetee?.temps_passe?.toString() || ''}
              onChangeText={(text) =>
                setEditingTetee((prev) => ({ ...prev, temps_passe: parseInt(text, 10) }))
              }
            />
            <Text>Remarque :</Text>
            <TextInput
              style={styles.input}
              placeholder="Remarque"
              value={editingTetee?.remarque || ''}
              onChangeText={(text) => setEditingTetee((prev) => ({ ...prev, remarque: text }))}
            />
            <TouchableOpacity
              onPress={() => {
                handleSaveTetee(editingTetee);
              }}
            >
              <Text style={styles.saveButton}>Sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#a21caf',
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    color: '#6366f1',
    marginTop: 5,
  },
  deleteButton: {
    color: '#ef4444',
    marginTop: 5,
  },
  addButton: {
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
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modal: {
    position: 'absolute',
    top: '30%',
    left: '14%',
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#a21caf',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
  },
});

export default Tetee;