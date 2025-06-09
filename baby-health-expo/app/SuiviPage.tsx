import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CARD_SIZE = (Dimensions.get('window').width - 48) / 2;

const cards = [
  {
    key: 'couche',
    label: 'Couche',
    icon: <FontAwesome5 name="baby" size={40} color="rgb(197, 71, 128)" />,
    color: "#ffe4ec",
    route: '/couchePage',
  },
  {
    key: 'repas',
    label: 'Repas',
    icon: <FontAwesome5 name="utensils" size={40} color="#4682B4" />,
    color: "#e3f0ff",
    route: '/Repas',
  },
  {
    key: 'sommeil',
    label: 'Sommeil',
    icon: <FontAwesome5 name="bed" size={40} color="#4682B4" />,
    color: "#e3f0ff",
    route: '/Sommeil',
  },
  {
    key: 'sante',
    label: 'Santé',
    icon: <FontAwesome5 name="heartbeat" size={40} color="rgb(197, 71, 128)" />,
    color: "#ffe4ec",
    route: '/Sante',
  },
  {
    key: 'Pleurs',
    label: 'Pleurs',
    icon: <FontAwesome5 name="sad-cry" size={40} color="rgb(197, 71, 128)" />,
    color: "#ffe4ec",
    route: '/PleursPage',
  },
  {
    key: 'croissance',
    label: 'Croissance',
    icon: <FontAwesome5 name="chart-line" size={40} color="#4682B4" />,
    color: "#e3f0ff",
    route: '/growth', // ou autre route si renommée
  },
  {
    key: 'geneticPrediction',
    label: 'Genetic prediction',
    icon: <FontAwesome5 name="dna" size={40} color="#4682B4" />,
    color: "#e3f0ff",
    route: '/GeneticPrediction', // ou autre route si renommée
  },
];

const SuiviPage = () => {
  const { babyId } = useLocalSearchParams();
  const router = useRouter();

  const handleCardPress = (route: string) => {
  router.push(`${route}?babyId=${babyId}`);
};

  return (
    <LinearGradient
      colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Suivi du bébé</Text>
        <FlatList
          data={cards}
          numColumns={2}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => handleCardPress(item.route)}
              activeOpacity={0.85}
            >
              {item.icon}
              <Text style={styles.cardText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a21caf',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 80,
  },
  list: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SuiviPage;