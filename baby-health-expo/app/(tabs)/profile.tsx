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
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

type RootStackParamList = {
  profile: undefined;
  addBaby: undefined;
  // add other routes here if needed
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
}

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

  const CustomButton = ({ title, onPress, color = "#7c5fff", textColor = "#fffbe4", style = {} }) => (
    <TouchableOpacity onPress={onPress} style={[{
      backgroundColor: color,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginHorizontal: 4,
      marginVertical: 4,
      shadowColor: color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 2,
      alignItems: 'center',
    }, style]}>
      <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );

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
    <View style={{ flex: 1, backgroundColor: '#181d36' }}>
      <AnimatedNightBackground />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Profil du Parent</Text>
          {parent?.gender === "femme" ? (
            <Image
              source={require('@/assets/images/female.png')}
              style={styles.avatar}
            />
          ) : parent?.gender === "homme" ? (
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
          <CustomButton
            title="Ajouter un bébé"
            onPress={() => navigation.navigate("addBaby")}
            color="#7c5fff"
          />

          <View style={styles.tableBabys}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {babys.map((baby, index) => (
                <View
                  key={baby.id || index}
                  style={[
                    styles.babyCard,
                    baby.gender === "Fille"
                      ? { backgroundColor: "#b8c1ec" }
                      : baby.gender === "Garçon"
                      ? { backgroundColor: "#b5e3ff" }
                      : { backgroundColor: "#232946" }
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
                    <CustomButton
                      title="Modifier"
                      onPress={() => handleEditBaby(baby)}
                      color="#7c5fff"
                    />
                    <CustomButton
                      title="Supprimer"
                      onPress={() => handleDeleteBaby(baby.id)}
                      color="#ff4d6d"
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
              <CustomButton
                title="Confirmer"
                onPress={handleConfirmEdit}
                color="#7c5fff"
              />
              <CustomButton
                title="Annuler"
                onPress={() => setIsEditModalVisible(false)}
                color="#232946"
                textColor="#7c5fff"
                style={{ borderWidth: 1.5, borderColor: "#7c5fff" }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    width: 150,
    height: 150,
    borderRadius: 55, // cercle parfait
    marginBottom: 18,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#7c5fff', // halo violet doux
    backgroundColor: '#232946', // fond nuit derrière l'image
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
    color: '#fffbe4',
    marginTop: 80,
  },
  table: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#232946',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
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
    color: '#b8c1ec',
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
    color: '#fffbe4',
  },
  babysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#181d36',
    borderRadius: 8,
    width: '90%',
  },
  babysLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b8c1ec',
  },
  babysValue: {
    fontSize: 16,
    color: '#fffbe4',
    fontWeight: 'bold',
  },
  babyCard: {
    marginBottom: 16,
    marginRight: 10,
    borderRadius: 18,
    width: 340,
    alignItems: 'center',
    padding: 22,
    backgroundColor: "#232946",
    borderWidth: 1.5,
    borderColor: "#7c5fff55",
    shadowColor: "#7c5fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    flex: 1,
    marginBottom: 84,
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
    backgroundColor: '#232946',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#7c5fff55',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fffbe4',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#7c5fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#181d36',
    color: '#fffbe4',
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: '#7c5fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#232946',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Profile;
