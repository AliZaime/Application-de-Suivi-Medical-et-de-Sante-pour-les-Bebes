import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Profile = () => {
  const [parent, setParent] = useState<{ name: string; email: string; phone: string; notification_preferences: string; gender: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [babys, setBabys] = useState<any>([]); 
  
  
  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const parentId = await AsyncStorage.getItem("parent_id");
        if (!parentId) {
          setError("Aucun ID de parent trouvé.");
          setLoading(false);
          return;
        }

        const parent = await axios.get(`http://192.168.11.111:8000/api/parent/${parentId}/`);
        setParent(parent.data);

        const babysResponse = await axios.get(`http://192.168.11.111:8000/api/user/get_babies_by_parent_id/${parentId}/`);
        console.log(babysResponse.data);
        setBabys(babysResponse.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, []);

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
        <View  style={styles.tableBabys}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
          {babys.map((baby, index) => (
            <View
              key={baby.id || index}
              style={[
                styles.babyCard,
                baby.gender === "girl"
                  ? { backgroundColor: "pink" }
                  : baby.gender === "Boy"
                  ? { backgroundColor: "#37acef" }
                  : { backgroundColor: "transparent" }
              ]}
            >
              {baby.gender === "girl" ? (
                <Image
                  source={require('@/assets/images/Baby-Girl.png')}
                  style={styles.avatar}
                />
              ) : baby.gender === "Boy" ? (
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
                <Text style={styles.babysLabel}>date_of_birth :</Text>
                <Text style={styles.babysValue}>{baby.date_of_birth}</Text>
              </View>
              <View style={styles.babysRow}>
                <Text style={styles.babysLabel}>blood_type :</Text>
                <Text style={styles.babysValue}>{baby.blood_type}</Text>
              </View>
            </View>
          ))}
          </ScrollView>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
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
    backgroundColor: '#fff',
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
  
});

export default Profile;
