import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ActivityIndicator, TextInput, Modal, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../../config';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

type RootStackParamList = {
  profile: undefined;
  addBaby: undefined;
  // add other routes here if needed
};

const Profile = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [parent, setParent] = useState<{ name: string; email: string; phone: string; notification_preferences: string; gender: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [babys, setBabys] = useState<any>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // État pour afficher/masquer la carte
  const [selectedBaby, setSelectedBaby] = useState<any>(null); // Bébé sélectionné pour modification
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const parentId = await AsyncStorage.getItem("parent_id");
        if (!parentId) {
          setError("Aucun ID de parent trouvé.");
          setLoading(false);
          return;
        }

        const parent = await axios.get(`${config.API_BASE_URL}/api/parent/${parentId}/`);
        setParent(parent.data);

        const babysResponse = await axios.get(`${config.API_BASE_URL}/api/user/get_babies_by_parent_id/${parentId}/`);
        console.log(babysResponse.data);
        setBabys(babysResponse.data.map((baby) => ({ ...baby, id: baby.baby_id })));
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, []);

  const handleDeleteBaby = async (babyId: number) => {
    console.log("Deleting baby with ID:", babyId); // Debug log
    if (!babyId) {
      console.error("ID du bébé manquant.");
      return;
    }
    try {
      const response = await axios.delete(`${config.API_BASE_URL}/api/delete_baby/${babyId}/`);
      console.log(response.data.message);
      setBabys((prevBabys: any[]) => prevBabys.filter((baby) => baby.id !== babyId));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression du bébé.");
    }
  };

  const handleEditBaby = (baby: any) => {
    setSelectedBaby(baby); // Définit le bébé sélectionné
    setIsEditModalVisible(true); // Affiche la carte de modification
  };

  const handleConfirmEdit = async () => {
    try {
      const response = await axios.put(`${config.API_BASE_URL}/api/user/update_baby/${selectedBaby.id}/`, selectedBaby);
      console.log(response.data.message);
      setBabys((prevBabys: any[]) =>
        prevBabys.map((baby) => (baby.id === selectedBaby.id ? selectedBaby : baby))
      );
      setIsEditModalVisible(false); // Masque la carte après confirmation
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du bébé.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F4C7C3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
              colors={['#ffb6c1', '#f8f6fa', '#a3cef1']} // Rose → blanc → bleu clair
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Profil du Parent</Text>
        {parent?.gender === "female" ? (
          <Image
            source={require('@/assets/images/female.png')}
            style={styles.avatar}
          />
        ) : parent?.gender === "male" ? (
          <Image
            source={require('@/assets/images/man.png')}
            style={styles.avatar}
          />
        ) : null}

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>Nom :</Text>
            <Text style={styles.babysValue}>{parent?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email :</Text>
            <Text style={styles.babysValue}>{parent?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Téléphone :</Text>
            <Text style={styles.babysValue}>{parent?.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Notifications :</Text>
            <Text style={styles.babysValue}>{parent?.notification_preferences}</Text>
          </View>
        </View>

        <Text style={styles.babysTitle}>Liste des Enfants</Text>
        <Button
          title="Ajouter un bébé"
          onPress={() => navigation.navigate("addBaby")}
          color="#4CAF50"
        />

        <View style={styles.tableBabys}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {babys.map((baby, index) => (
              <View
                key={baby.id || index}
                style={[
                  styles.babyCard,
                  baby.gender === "Fille"
                    ? { backgroundColor: "pink" }
                    : baby.gender === "Garçon"
                    ? { backgroundColor: "#37acef" }
                    : { backgroundColor: "transparent" }
                ]}
              >
                {baby.gender === "Fille" ? (
                  <Image
                    source={require('@/assets/images/Baby-Girl.png')}
                    style={styles.avatar}
                  />
                ) : baby.gender === "Garçon" ? (
                  <Image
                    source={require('@/assets/images/Baby-Boy.png')}
                    style={styles.avatar}
                  />
                ) : null}
                <View style={styles.babysRow}>
                  <Text style={styles.babysLabel}>Nom de l'Enfant :</Text>
                  <Text style={styles.babysValue}>{baby.name}</Text>
                </View>
                <View style={styles.babysRow}>
                  <Text style={styles.babysLabel}>Date de naissance :</Text>
                  <Text style={styles.babysValue}>{baby.date_of_birth}</Text>
                </View>
                <View style={styles.babysRow}>
                  <Text style={styles.babysLabel}>Groupe sanguin :</Text>
                  <Text style={styles.babysValue}>{baby.blood_type}</Text>
                </View>
                <View style={styles.buttonRow}>
                  <Button
                    title="Modifier"
                    onPress={() => handleEditBaby(baby)} // Affiche la carte de modification
                    color="#FFA500"
                  />
                  <Button
                    title="Supprimer"
                    onPress={() => handleDeleteBaby(baby.id)}
                    color="#FF0000"
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>

    {/* Carte de modification */}
    <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier les informations du bébé</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom de l'enfant"
              value={selectedBaby?.name}
              onChangeText={(text) => setSelectedBaby({ ...selectedBaby, name: text })}
            />

            {/* Replace birthdate input with DateTimePicker */}
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{dateOfBirth.toISOString().split("T")[0]}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDateOfBirth(selectedDate);
                    setSelectedBaby({ ...selectedBaby, date_of_birth: selectedDate.toISOString().split("T")[0] });
                  }
                }}
              />
            )}

            <View style={styles.pickerContainer}>
            <Picker selectedValue={bloodType} onValueChange={setBloodType} style={styles.picker}>
              <Picker.Item label="Sélectionner le groupe sanguin" value="" />
              <Picker.Item label="A+" value="A+" />
              <Picker.Item label="A-" value="A-" />
              <Picker.Item label="B+" value="B+" />
              <Picker.Item label="B-" value="B-" />
              <Picker.Item label="AB+" value="AB+" />
              <Picker.Item label="AB-" value="AB-" />
              <Picker.Item label="O+" value="O+" />
              <Picker.Item label="O-" value="O-" />
            </Picker>
          </View>

            {/* Add gender picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedBaby?.gender || ""}
                onValueChange={(value) => {
                  setSelectedBaby({ ...selectedBaby, gender: value });
                }}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionner le sexe" value="" />
                <Picker.Item label="Garçon" value="Garçon" />
                <Picker.Item label="Fille" value="Fille" />
              </Picker>
            </View>

            <View style={styles.buttonRow}>
              <Button title="Confirmer" onPress={handleConfirmEdit} color="#4CAF50" />
              <Button title="Annuler" onPress={() => setIsEditModalVisible(false)} color="#FF0000" />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 16,
    marginBottom: 200,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
    

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
    color: '#333',
  },
  table: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    
  },
  tableBabys: {
    width: '100%',
    marginTop: 20,

    gap: 10,
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  babysTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  babysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    width: '90%',
  },
  babysLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  babysValue: {
    fontSize: 16,
    color: 'black',
  },
  babyCard: {
    marginBottom: 16,
    marginRight: 10,
    backgroundColor: "transparent", // Default background color
    borderRadius: 8,
    width: 350,
    alignItems: 'center',
    padding: 25,
  },
  gradient: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '90%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#fff', // Ensure background is visible
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Profile;
