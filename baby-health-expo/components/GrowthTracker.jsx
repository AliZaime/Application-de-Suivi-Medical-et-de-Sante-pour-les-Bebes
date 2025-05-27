// components/GrowthTracker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GrowthTracker() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivi de la croissance du bébé</Text>
      {/* Tu peux ajouter ici un graphique ou d'autres éléments */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  }
});
