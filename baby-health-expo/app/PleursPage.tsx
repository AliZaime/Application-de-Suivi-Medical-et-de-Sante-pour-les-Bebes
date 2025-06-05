import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import config from '../config';

export default function PleursPage() {
  const { babyId } = useLocalSearchParams();
  const router = useRouter();
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGraph, setShowGraph] = useState(false);

  const fetchDetections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/cry_detections/${babyId}/`);
      setDetections(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setDetections([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Recharge à chaque retour sur la page
  useFocusEffect(
    useCallback(() => {
      fetchDetections();
    }, [])
  );

  const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getGraphData = () => {
    const counts = [0, 0, 0, 0, 0, 0, 0];
    detections.forEach((d) => {
      const day = new Date(d.detected_at).getDay();
      const dayIndex = day === 0 ? 6 : day - 1;
      counts[dayIndex]++;
    });
    return {
      labels: jours,
      datasets: [{ data: counts }],
    };
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.detected_at);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.card}>
        <FontAwesome5 name="baby" size={28} color="#a21caf" style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.sub}>Confiance : {(item.confidence * 100).toFixed(2)}%</Text>
          <Text style={styles.sub}>Le {formattedDate} à {formattedTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Text style={styles.title}>Historique des pleurs</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#a21caf" />
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.graphBtn} onPress={() => setShowGraph(!showGraph)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {showGraph ? 'Masquer le graphique' : 'Afficher le graphique'}
            </Text>
          </TouchableOpacity>

          {showGraph && (
            <LineChart
              data={getGraphData()}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#f8f6fa',
                backgroundGradientFrom: '#f8f6fa',
                backgroundGradientTo: '#a3cef1',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(162, 28, 175, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={{ marginVertical: 16, borderRadius: 16, alignSelf: 'center' }}
            />
          )}

          <FlatList
            data={detections}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>Aucune détection enregistrée.</Text>}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push(`/CryDetection?babyId=${babyId}`)}
      >
        <FontAwesome5 name="plus" size={22} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a21caf',
    textAlign: 'center',
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphBtn: {
    backgroundColor: '#a21caf',
    borderRadius: 10,
    padding: 12,
    alignSelf: 'center',
    marginVertical: 10,
    minWidth: 180,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#a21caf',
  },
  sub: {
    color: '#555',
    fontSize: 14,
    marginTop: 2,
  },
  list: {
    paddingBottom: 100,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#aaa',
  },
  addBtn: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#a21caf',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
