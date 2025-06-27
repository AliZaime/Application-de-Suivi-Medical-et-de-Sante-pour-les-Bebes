import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ActivityIndicator, Dimensions, Platform, Animated, Easing } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from "react-native-svg";
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
  <View style={styles.gradient}>
    <AnimatedNightBackground />
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
              labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
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
          <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: '600', color: "#7c5fff" }}>Type de médicament</Text>
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
            <Text style={{ color: heure ? "#232946" : "#b8c1ec" }}>{heure ? heure : "Choisir l'heure"}</Text>
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
            placeholderTextColor="#888"
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
              <Text style={{ color: '#7c5fff' }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  </View>
);
};

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

const styles = StyleSheet.create({
  gradient: {
  flex: 1,
  backgroundColor: '#181d36',
  paddingTop: 30,
},
  title: {
  fontSize: 26,
  fontWeight: 'bold',
  color: '#fffbe4',
  textAlign: 'center',
  marginBottom: 20,
  marginTop: 80,
  letterSpacing: 1,
  textShadowColor: "#7c5fff",
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 8,
},
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f6fa',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 6,
    borderLeftColor: '#7c5fff',
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
  backgroundColor: "rgba(248,246,250,0.97)",
  borderRadius: 22,
  padding: 22,
  width: '90%',
  borderColor: '#ede9fe',
  borderWidth: 1.5,
  elevation: 8,
  shadowColor: "#b8c1ec",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.13,
  shadowRadius: 16,
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
  borderWidth: 1.5,
  borderColor: '#b8c1ec',
  borderRadius: 12,
  padding: 12,
  marginTop: 8,
  marginBottom: 4,
  backgroundColor: "#f4f3ff",
  color: "#232946",
  fontSize: 15,
},
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  saveBtn: {
  backgroundColor: '#7c5fff',
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
  borderColor: '#7c5fff',
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
  backgroundColor: '#7c5fff',
  borderRadius: 30,
  width: 60,
  height: 60,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 8,
  shadowColor: "#7c5fff",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.18,
  shadowRadius: 8,
},
  graphBtn: {
  backgroundColor: "#7c5fff",
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
