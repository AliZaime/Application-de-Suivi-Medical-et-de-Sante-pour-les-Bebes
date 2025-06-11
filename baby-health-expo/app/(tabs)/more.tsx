import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CARD_SIZE = (Dimensions.get('window').width - 48) / 2;

const cards = [
    {
        key: 'Guides',
        label: 'Calendrier & Rendez-vous',
        icon: <FontAwesome5 name="calendar-check" size={36} color="rgb(197, 71, 128)" />,
        color: "#ffe4ec",
        route: '/appiontement',
    },
    {
        key: 'Developpement',
        label: 'Développement',
        icon: <FontAwesome5 name="lightbulb" size={36} color="#4682B4" />,
        color: "#e3f0ff",
        route: '/Developpement',
    },
    {
        key: 'note',
        label: 'Note',
        icon: <FontAwesome5 name="sticky-note" size={36} color="#a21caf" />,
        color: "#ffe4ec",
        route: '/note',
    },
];

const More = () => {
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
        <Text style={styles.title}>More</Text>
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
    marginBottom: 100,
    marginTop: 100,
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

export default More;