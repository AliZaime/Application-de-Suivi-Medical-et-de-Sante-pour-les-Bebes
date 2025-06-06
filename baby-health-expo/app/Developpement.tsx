import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import developmentData from '../assets/js/developpement_enrichi.json';
import { LinearGradient } from 'expo-linear-gradient';
const screenWidth = Dimensions.get('window').width;

const tabs = [
  ...developmentData.semaines,
  ...developmentData.mois,
];

const Developpement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const currentData = tabs[activeTab];

  return (
    <LinearGradient
              colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
        {tabs.map((tab, index) => (
          <TouchableOpacity key={tab.id} onPress={() => setActiveTab(index)}>
            <Text style={[styles.tabText, index === activeTab && styles.activeTab]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageInfoRow}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.imageInline}
          />
          <View style={styles.infoCardInline}>
            <Text style={styles.period}>{currentData.label}</Text>
            <Text style={styles.subText}>Taille</Text>
            <Text style={styles.range}>{currentData.taille}</Text>
            <Text style={styles.subText}>Poids</Text>
            <Text style={styles.range}>{currentData.poids}</Text>
          </View>
        </View>
        <Text style={styles.heading}>{currentData.titre}</Text>
        <Text style={styles.paragraph}>{currentData.description}</Text>
        {currentData.sections.map((section, idx) => (
          <View key={idx}>
            <Text style={styles.subHeading}>{section.titre}</Text>
            <Text style={styles.paragraph}>{section.contenu}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  back: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  tabText: {
    fontSize: 16,
    marginHorizontal: 10,
    paddingBottom: 4,
    color: '#555',
  },
  activeTab: {
    color: '#a21caf',
    borderBottomWidth: 2,
    borderBottomColor: '#a21caf',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 80,
    marginTop: 20,
  },
  imageInfoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  imageInline: {
    width: (screenWidth - 48) / 2,
    height: 140,
    borderRadius: 12,
    resizeMode: 'cover',
    marginRight: 12,
  },
  infoCardInline: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
  },
  period: {
    fontSize: 16,
    fontWeight: '600',
  },
  subText: {
    marginTop: 6,
    fontWeight: '600',
    fontSize: 14,
    color: '#555',
  },
  range: {
    fontSize: 15,
    marginBottom: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  paragraph: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
    lineHeight: 22,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
});

export default Developpement;
