import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const Solides = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tétée</Text>
      {/* Ajoute ici les fonctionnalités pour ajouter, modifier, supprimer et lister */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Solides;