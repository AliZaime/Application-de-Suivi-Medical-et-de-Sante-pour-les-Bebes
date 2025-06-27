import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from "react-native-chart-kit";
import config from '../config'; 
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

const coucheTypes = [
  { label: 'Mixte', value: 'mixte', icon: <MaterialCommunityIcons name="baby-face-outline" size={24} color="#a78bfa" /> },
  { label: 'Urine', value: 'urine', icon: <FontAwesome5 name="tint" size={24} color="#38bdf8" /> },
  { label: 'Souillée', value: 'souillee', icon: <MaterialCommunityIcons name="emoticon-poop" size={24} color="#fbbf24" /> },
];

const causes = [
  'Normale',
  'Diarrhée',
  'Molle',
  'Liquide',
  'Constipation',
  'Autre',
];

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

const CouchePage = () => {
  const { babyId } = useLocalSearchParams();
  const router = useRouter();
  const [couches, setCouches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  // Form state
  const [type, setType] = useState('mixte');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [cause, setCause] = useState('Normale');
  const [remarque, setRemarque] = useState('');

  // Fetch couches
  useEffect(() => {
    fetchCouches();
  }, []);

  const fetchCouches = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/couches/baby/${babyId}/`);
      setCouches(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setCouches([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (defaultDate = '', defaultHeure = '') => {
    setType('mixte');
    setDate(defaultDate);
    setHeure(defaultHeure);
    setCause('Normale');
    setRemarque('');
    setEditing(null);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setType(item.type);
    setDate(item.date);
    setHeure(item.heure);
    setCause(item.cause);
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
    if (!date || !heure) {
      Alert.alert('Erreur', 'Date et heure obligatoires');
      return;
    }
    const payload = {
      type,
      date,
      heure,
      cause,
      remarque,
      baby: parseInt(babyId as string, 10), // ou baby_id selon ton backend
    };
    try {
      if (editing) {
        await axios.post(`${config.API_BASE_URL}/api/couches/${editing.id}/`, payload);
      } else {
        await axios.post(`${config.API_BASE_URL}/api/couches/`, payload);
      }
      setModalVisible(false);
      resetForm();
      fetchCouches();
    } catch (e) {
      if (e.response && e.response.data) {
        Alert.alert('Erreur', JSON.stringify(e.response.data));
      } else {
        Alert.alert('Erreur', 'Impossible de sauvegarder');
      }
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmation', 'Supprimer cette couche ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${config.API_BASE_URL}/api/couches/${id}/delete/`);
            fetchCouches();
          } catch (e) {
            Alert.alert('Erreur', 'Suppression impossible');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => {
    const typeObj = coucheTypes.find(t => t.value === item.type);
    return (
      <View
        style={[
          styles.card,
          item.gender === "Fille"
            ? { borderLeftColor: "#e09ec3" }
            : { borderLeftColor: "#7dcfff" }
        ]}
      >
        <View style={styles.iconType}>{typeObj?.icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.typeText}>{typeObj?.label ?? item.type}</Text>
          <Text style={styles.dateText}>{item.date} à {item.heure}</Text>
          <Text style={styles.causeText}>Cause : {item.cause}</Text>
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
  };

  // Exemple de données (à générer à partir de tes données réelles)
  const data = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        data: [3, 2, 4, 1, 5, 2, 3], // nombre de couches par jour
      },
    ],
  };

  // Fonction utilitaire pour obtenir le jour de la semaine en français (lundi en premier)
  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  function getGraphData() {
    // On compte le nombre de couches par jour de la semaine (lundi=0, ..., dimanche=6)
    const counts = [0, 0, 0, 0, 0, 0, 0];
    couches.forEach(couche => {
      const d = new Date(couche.date);
      // getDay() : 0=Dim, 1=Lun, ..., 6=Sam
      // Pour avoir lundi=0, ..., dimanche=6 :
      const day = d.getDay() === 0 ? 6 : d.getDay() - 1;
      counts[day]++;
    });
    return {
      labels: jours,
      datasets: [{ data: counts }],
    };
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#181d36' }}>
      <AnimatedNightBackground />
        <Text style={styles.title}>Couches du bébé</Text>
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
              data={couches}
              keyExtractor={item => item.id?.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              ListEmptyComponent={<Text style={styles.emptyText}>Aucune couche enregistrée.</Text>}
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
              <Text style={styles.modalTitle}>{editing ? "Modifier" : "Ajouter"} une couche</Text>
              <View style={styles.row}>
                {coucheTypes.map(t => (
                  <TouchableOpacity key={t.value} style={[
                    styles.typeBtn,
                    type === t.value && styles.typeBtnActive
                  ]} onPress={() => setType(t.value)}>
                    {t.icon}
                    <Text style={{ marginLeft: 6 }}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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
              <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Cause</Text>
              <View style={styles.row}>
                {causes.map(c => (
                  <TouchableOpacity key={c} style={[
                    styles.causeBtn,
                    cause === c && styles.causeBtnActive
                  ]} onPress={() => setCause(c)}>
                    <Text>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Remarque (optionnel)"
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fffbe4',
    textAlign: 'center',
    marginBottom: 18,
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
  backgroundColor: '#232946',
  borderRadius: 18,
  padding: 16,
  marginBottom: 14,
  borderLeftWidth: 6,
  borderLeftColor: '#7c5fff', // violet doux
  shadowColor: '#7c5fff',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.13,
  shadowRadius: 8,
  elevation: 4,
},
  iconType: {
    marginRight: 16,
  },
  typeText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#b8c1ec',
  },
  dateText: {
    color: '#b8c1ec',
    fontSize: 14,
    marginTop: 2,
  },
  causeText: {
    color: '#7c5fff',
    fontSize: 14,
    marginTop: 2,
  },
  remarqueText: {
    color: '#fffbe4',
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
    elevation: 6,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#f8f6fa',      // blanc cassé très clair
    borderRadius: 18,
    padding: 22,
    width: '90%',
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#b8c1ec',          // lavande clair
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7c5fff',                // violet doux
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
    borderWidth: 1.5,
    borderColor: '#b8c1ec',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: '#e9e7fd',      // lavande très pâle
  },
  typeBtnActive: {
    borderColor: '#7c5fff',
    backgroundColor: '#ede9fe',      // violet pastel
  },
  causeBtn: {
    borderWidth: 1.5,
    borderColor: '#b8c1ec',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#e9e7fd',
  },
  causeBtnActive: {
    borderColor: '#7c5fff',
    backgroundColor: '#ede9fe',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#b8c1ec',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 4,
    fontSize: 15,
    backgroundColor: '#f4f3ff',      // blanc lavande très clair
    color: '#232946',                // texte foncé pour contraste
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  saveBtn: {
    backgroundColor: '#b8c1ec',      // lavande clair
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  cancelBtn: {
    backgroundColor: '#f8f6fa',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: '#b8c1ec',
  },
  emptyText: {
    textAlign: 'center',
    color: '#b8c1ec',
    fontSize: 16,
    marginTop: 40,
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

export default CouchePage;