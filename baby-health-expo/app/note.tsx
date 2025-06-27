import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

const NotePage = () => {
  const [parentId, setParentId] = useState<string | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');


  useEffect(() => {
    const getParentId = async () => {
      const parent = await AsyncStorage.getItem("parent_id");
      setParentId(parent);
    };
    getParentId();
  }, []);

  useEffect(() => {
    if (parentId) {
      fetchNotes();
    }
  }, [parentId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/notes/parent/${parentId}/`);
      if (res.data && res.data.notes) {
        setNotes(res.data.notes);
      }
    } catch (e) {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setContent('');
    setTitle('');

    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (note: any) => {
    setEditing(note);
    setContent(note.content);
    setTitle(note.title);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!content) {
      Alert.alert('Erreur', 'Le contenu de la note est obligatoire');
      return;
    }

    const payload = {
        content,
        title,
        parent: parseInt(parentId, 10),
        }


    console.log('Payload:', payload);

    try {
      if (editing) {
        await axios.put(`${config.API_BASE_URL}/api/notes/${editing.id}/`, payload);
      } else {
        await axios.post(`${config.API_BASE_URL}/api/notes/`, payload);
      }
      setModalVisible(false);
      fetchNotes();
    } catch (e) {
      console.error('Error saving note:', e);
      Alert.alert('Erreur', 'Impossible de sauvegarder la note');
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmation', 'Supprimer cette note ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${config.API_BASE_URL}/api/notes/${id}/delete/`);
            fetchNotes();
          } catch (e) {
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1, marginRight: 10 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardText}>{item.content}</Text>
        <Text style={styles.cardText}>{item.date_created.split("T")[0]}  {item.date_created.split("T")[1].slice(0, -1)}</Text>
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
    <View style={{ flex: 1, backgroundColor: '#181d36' }}>
      <AnimatedNightBackground />
      <View style={styles.container}>
        <Text style={styles.title}>Notes</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#7c5fff" />
        ) : (
          <FlatList
            data={notes}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucune note enregistrée.</Text>}
          />
        )}

        <TouchableOpacity style={styles.addBtn} onPress={openModal}>
          <FontAwesome5 name="plus" size={22} color="#fffbe4" />
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editing ? "Modifier" : "Ajouter"} une note</Text>
              <TextInput
                style={styles.input}
                placeholder="Titre de la note"
                placeholderTextColor="#b8c1ec"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Contenu de la note"
                placeholderTextColor="#b8c1ec"
                value={content}
                onChangeText={setContent}
                multiline
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={{ color: '#fffbe4', fontWeight: 'bold' }}>{editing ? "Modifier" : "Ajouter"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#7c5fff' }}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
      {/* Dégradé nuit */}
      <View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#181d36',
      }} />
      {/* Vague nuit */}
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
      {/* Bulles pastel */}
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
      {/* Plusieurs étoiles partout */}
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
      {/* Jouet flottant : cube */}
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
      {/* Jouet flottant : canard */}
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
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: 'transparent',
    marginTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 10,
    color: '#fffbe4',
    letterSpacing: 1,
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
    borderLeftColor: '#7c5fff',
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fffbe4',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#b8c1ec',
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#232946',
    borderRadius: 22,
    padding: 22,
    width: '90%',
    borderWidth: 1.5,
    borderColor: '#7c5fff55',
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fffbe4',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#7c5fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 4,
    fontSize: 15,
    backgroundColor: '#181d36',
    color: '#fffbe4',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  saveBtn: {
    backgroundColor: '#7c5fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  cancelBtn: {
    backgroundColor: '#232946',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: '#7c5fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#b8c1ec',
    fontSize: 16,
    marginTop: 40,
  },
});

export default NotePage;
