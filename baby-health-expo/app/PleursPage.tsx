import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import config from '../config';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from "react-native-svg";
import { Animated, Easing } from "react-native";

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
      <View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#181d36',
      }} />
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
};

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
      <View style={styles.gradient}>
        <AnimatedNightBackground />
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
      </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#181d36',
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fffbe4',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    letterSpacing: 1,
    textShadowColor: "#7c5fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphBtn: {
  backgroundColor: "#7c5fff",
  borderRadius: 10,
  padding: 12,
  alignSelf: "center",
  marginTop: 18,
  marginBottom: 20,
  minWidth: 180,
  alignItems: "center",
},
  card: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#232946',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 6,
    borderLeftColor: '#7c5fff',
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#a21caf',
  },
  sub: {
    color: '#fffbe4',
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
    backgroundColor: '#7c5fff',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#7c5fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
});
