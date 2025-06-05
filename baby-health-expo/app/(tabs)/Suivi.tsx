import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../../config';

const Suivi = () => {
  const router = useRouter();
  const [parent, setParent] = useState<{
    name: string;
    email: string;
    phone: string;
    notification_preferences: string;
    gender: string;
  } | null>(null);
  const [babys, setBabys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const parentId = await AsyncStorage.getItem("parent_id");
        if (!parentId) {
          setError("Aucun ID de parent trouvé.");
          setLoading(false);
          return;
        }
        const parentResponse = await axios.get(`${config.API_BASE_URL}/api/parent/${parentId}/`);
        setParent(parentResponse.data);

        const babysResponse = await axios.get(`${config.API_BASE_URL}/api/user/get_babies_by_parent_id/${parentId}/`);
        setBabys(Array.isArray(babysResponse.data) ? babysResponse.data : []);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.gender === "fille" ? "#ffe4ec" : "#e3f0ff" }
      ]}
      activeOpacity={0.85}
      onPress={() => router.push(`/SuiviPage?babyId=${item.id ?? item.baby_id}`)}
    >
      <View style={styles.iconContainer}>
        <FontAwesome5
          name="baby"
          size={54}
          color={item.gender === "fille" ? "#E75480" : "#4682B4"}
        />
        <View style={[
          styles.badge,
          { backgroundColor: item.gender === "fille" ? "#F4C7C3" : "#A3CEF1" }
        ]}>
          <Text style={[
            styles.badgeText,
            { color: item.gender === "fille" ? "#E75480" : "#4682B4" }
          ]}>
            {item.gender === "fille" ? "Fille" : "Garçon"}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={styles.name}>{item.name}</Text>
        {item.birthdate && (
          <Text style={styles.birthdate}>Né(e) le {item.birthdate}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F4C7C3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mes enfants</Text>
          {parent && (
            <Text style={styles.parentName}>Parent : {parent.name}</Text>
          )}
        </View>
        <FlatList
          data={babys.filter(b => b && (b.id !== undefined || b.baby_id !== undefined))}
          keyExtractor={(item, index) => (item.id ?? item.baby_id ?? index).toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          numColumns={1}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun enfant trouvé.</Text>}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f8f6fa',
    padding: 0,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: "purple",
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#F4C7C3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 1,
  },
  parentName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    width: "100%",
    minHeight: 120,
    borderRadius: 22,
    marginBottom: 18,
    alignItems: 'center',
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 24,
  },
  badge: {
    marginTop: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  birthdate: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 40,
  },
  gradient: {
    flex: 1,
  },
});

export default Suivi;