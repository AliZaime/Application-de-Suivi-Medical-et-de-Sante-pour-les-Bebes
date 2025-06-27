import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from "react-native-svg";
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from "react-native-chart-kit";
import { useLocalSearchParams } from 'expo-router';
import config from '../config'; 
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
      const res = await axios.get(`${config.API_BASE_URL}/api/solides/baby/${babyId}/`);
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
        await axios.put(`${config.API_BASE_URL}/api/solides/${editing.id}/`, payload);
      } else {
        await axios.post(`${config.API_BASE_URL}/api/solides/`, payload);
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
            await axios.delete(`${config.API_BASE_URL}/api/solides/${id}/delete/`);
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

  return (
    <View style={styles.gradient}>
      <AnimatedNightBackground />
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
    marginTop: 70,
    letterSpacing: 1,
    textShadowColor: "#7c5fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
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
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: "rgba(248,246,250,0.92)",
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
    color: '#a21caf',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
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
  graphBtn: {
    backgroundColor: '#7c5fff',
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