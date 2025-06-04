import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CARD_SIZE = (Dimensions.get('window').width - 48) / 2;

const repasTypes = [
  {
    key: 'temperature',
    label: 'Température',
    icon: <FontAwesome5 name="thermometer-half" size={40} color="#E75480" />,
    color: "#ffe4ec",
    route: '/Temperature',
  },
  {
    key: 'medicaments',
    label: 'Médicaments',
    icon: <FontAwesome5 name="pills" size={40} color="#4682B4" />,
    color: "#e3f0ff",
    route: '/Medicaments',
  },
  {
    key: 'vaccins',
    label: 'Vaccins',
    icon: <FontAwesome5 name="syringe" size={40} color="#FFA500" />,
    color: "#fff5e6",
    route: '/Vaccins',
  },
  {
    key: 'symptomes',
    label: 'Symptômes',
    icon: <FontAwesome5 name="head-side-cough" size={40} color="rgb(14, 93, 14)" />,
    color: '#rgb(207, 231, 185)',
    route: '/Symptomes',
  },
];

const Sante = () => {
  const router = useRouter();
  const { babyId } = useLocalSearchParams();

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
      <FlatList
        data={repasTypes}
        numColumns={2}
        keyExtractor={item => item.key}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
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

export default Sante;