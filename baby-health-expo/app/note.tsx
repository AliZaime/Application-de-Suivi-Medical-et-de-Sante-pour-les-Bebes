import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from 'react-native-modal-datetime-picker';

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
    <LinearGradient colors={['#ffb6c1', '#f8f6fa', '#a3cef1']} style={styles.gradient}>
      <Text style={styles.title}>Notes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#a21caf" />
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
        <FontAwesome5 name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? "Modifier" : "Ajouter"} une note</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de la note"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Contenu de la note"
              value={content}
              onChangeText={setContent}
              multiline
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
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 6,
    borderLeftColor: '#a21caf',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
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
    fontWeight: 'bold',
    color: '#a21caf',
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
});

export default NotePage;
