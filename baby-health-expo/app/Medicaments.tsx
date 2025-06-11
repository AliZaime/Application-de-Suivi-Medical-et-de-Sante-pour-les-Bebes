import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart } from 'react-native-chart-kit';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import config from '../config'; 
import { scheduleReminder } from '../utils/notifications';

const medicamentTypes = [
  {
    label: 'Antalgique',
    value: 'antalgique',
    icon: <FontAwesome5 name="prescription-bottle-alt" size={24} color="#f87171" />,
  },
  {
    label: 'Antibiotique',
    value: 'antibiotique',
    icon: <MaterialCommunityIcons name="pill" size={24} color="#60a5fa" />,
  },
  {
    label: 'Vitamine',
    value: 'vitamine',
    icon: <FontAwesome5 name="capsules" size={24} color="#facc15" />,
  },
  {
    label: 'Probiotique',
    value: 'probiotique',
    icon: <MaterialCommunityIcons name="bacteria" size={24} color="#4ade80" />,
  },
  {
    label: 'Autre',
    value: 'autre',
    icon: <MaterialCommunityIcons name="medical-bag" size={24} color="#a78bfa" />,
  },
];

const colorMap = {
  antalgique: '#f87171',
  antibiotique: '#60a5fa',
  vitamine: '#facc15',
  probiotique: '#4ade80',
  autre: '#a78bfa'
};

const Medicament = () => {
  const { babyId } = useLocalSearchParams();
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const [nom, setNom] = useState('');
  const [type, setType] = useState('');
  const [heure, setHeure] = useState('');
  const [dose, setDose] = useState('');
  const [remarque, setRemarque] = useState('');

  

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const fetchMedicaments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/medicaments/baby/${babyId}/`);
      setMedicaments(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setMedicaments([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNom('');
    setType('');
    setHeure('');
    setDose('');
    setRemarque('');
    setEditing(null);
  };

  const openEdit = (item) => {
    setEditing(item);
    setNom(item.name);
    setType(item.type || '');
    setHeure(item.heure);
    setDose(item.dosage.toString());
    setRemarque(item.remarque);
    setModalVisible(true);
  };

  const openModal = () => {
    const now = new Date();
    const currentHeure = now.toTimeString().slice(0, 5);
    resetForm();
    setHeure(currentHeure);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nom || !type || !heure || !dose) {
      Alert.alert('Erreur', 'Tous les champs sauf remarque sont obligatoires');
      return;
    }

    const payload = {
      name: nom,
      type,
      heure,
      dosage: parseFloat(dose),
      remarque,
      baby: parseInt(babyId, 10),
    };

    try {
      if (editing) {
        await axios.put(`${config.API_BASE_URL}/api/medicaments/${editing.id}/`, payload);
      } else {
        await axios.post(`${config.API_BASE_URL}/api/medicaments/`, payload);
        // 🔔 Notification quotidienne à l'heure indiquée
        await scheduleReminder(
          "Prise de médicament 💊",
          `N'oubliez pas de prendre ${nom}`,
          heure
        );
      }
      setModalVisible(false);
      resetForm();
      fetchMedicaments();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmation', 'Supprimer ce médicament ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${config.API_BASE_URL}/api/medicaments/${id}/delete/`);
            fetchMedicaments();
          } catch {
            Alert.alert('Erreur', 'Suppression impossible');
          }
        },
      },
    ]);
  };

  const getPieChartData = () => {
    const counts = {};
    medicaments.forEach((m) => {
      counts[m.type] = (counts[m.type] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      count: value,
      color: colorMap[key] || '#ccc',
      legendFontColor: '#000',
      legendFontSize: 14,
    }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dateText}>A {item.heure}</Text>
        <Text style={styles.nomText}>Nom : {item.name}</Text>
        <Text style={styles.typeText}>Type : {item.type || 'Non précisé'}</Text>
        <Text style={styles.doseText}>Dose : {item.dosage} </Text>
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

  return (
    <LinearGradient
          colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
      <Text style={styles.title}>Médicaments du bébé</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#a21caf" />
      ) : (
        <>
          <TouchableOpacity style={styles.graphBtn} onPress={() => setShowGraph(!showGraph)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {showGraph ? 'Masquer le graphique' : 'Afficher graphique global'}
            </Text>
          </TouchableOpacity>

          {showGraph && (
            <PieChart
                data={getPieChartData()}
                width={Dimensions.get('window').width - 40}
                height={230}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="20"
                absolute
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, // gris doux
                    propsForLabels: {
                    fontSize: 14,
                    fontWeight: "600",
                    },
                }}
                center={[0, 0]}
                hasLegend={true}
                style={{
                    alignSelf: 'center',
                    marginTop: 20,
                    marginBottom: 20,
                    borderRadius: 20,
                    backgroundColor: '#eef2f7',
                    borderColor: '#d1d5db',
                    borderWidth: 2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                }}
                />
          )}

          <FlatList
            data={medicaments}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucun médicament enregistré.</Text>}
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
            <Text style={styles.modalTitle}>{editing ? 'Modifier' : 'Ajouter'} un médicament</Text>
            <TextInput style={styles.input} placeholder="Nom du médicament" value={nom} onChangeText={setNom} />
            <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: '600' }}>Type de médicament</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
                {medicamentTypes.map((item) => (
                    <TouchableOpacity
                    key={item.value}
                    onPress={() => setType(item.value)}
                    style={[
                        styles.typeBtn,
                        type === item.value && styles.typeBtnActive,
                    ]}
                    >
                    {item.icon}
                    <Text style={{ marginLeft: 6 }}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text>{heure ? heure : "Choisir l'heure"}</Text>
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    display="default"
                    onChange={(e, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                        const h = selectedTime.getHours().toString().padStart(2, '0');
                        const m = selectedTime.getMinutes().toString().padStart(2, '0');
                        setHeure(`${h}:${m}`);
                    }
                    }}
                />
                )}
            <TextInput
              style={styles.input}
              placeholder="Dose ou quantité"
              keyboardType="numeric"
              value={dose}
              onChangeText={setDose}
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Remarque (optionnel)"
              multiline
              numberOfLines={2}
              value={remarque}
              onChangeText={setRemarque}
              placeholderTextColor= '#888'
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  {editing ? 'Modifier' : 'Ajouter'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
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
  dateText: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  nomText: {
    fontSize: 15,
    color: 'rgba(11, 116, 107, 0.8)',
  },
  typeText: {
    fontSize: 15,
    color: 'rgba(12, 113, 185, 0.8)',
    marginTop: 4,
  },
  doseText: {
    fontSize: 15,
    color: 'rgba(245, 158, 11, 0.8)',
    marginTop: 4,
  },

  tempText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  remarqueText: {
    color: '#6b7280',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
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

export default Medicament;
