import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import config from '../../config';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

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
        item.gender === "Fille"
          ? { backgroundColor: "#2d2546", borderColor: "#e09ec3" }
          : { backgroundColor: "#22304a", borderColor: "#7dcfff" }
      ]}
      activeOpacity={0.85}
      onPress={() => router.push(`/SuiviPage?babyId=${item.id ?? item.baby_id}`)}
    >
      <View style={styles.iconContainer}>
        <FontAwesome5
          name="baby"
          size={54}
          color={item.gender === "Fille" ? "#e09ec3" : "#7dcfff"}
        />
        <View style={[
          styles.badge,
          item.gender === "Fille"
            ? { backgroundColor: "#e09ec355" }
            : { backgroundColor: "#7dcfff55" }
        ]}>
          <Text style={[
            styles.badgeText,
            item.gender === "Fille"
              ? { color: "#e09ec3" }
              : { color: "#7dcfff" }
          ]}>
            {item.gender === "Fille" ? "Fille" : "Garçon"}
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
    <View style={{ flex: 1, backgroundColor: '#181d36' }}>
      <AnimatedNightBackground />
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
    </View>
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
    backgroundColor: "#232946",
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#7c5fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fffbe4',
    marginBottom: 4,
    letterSpacing: 1,
  },
  parentName: {
    fontSize: 16,
    color: '#b8c1ec',
    fontWeight: '600',
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingTop: 30,
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
    backgroundColor: "#232946",
    borderWidth: 1.5,
    borderColor: "#7c5fff55",
    shadowColor: "#7c5fff",
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
    backgroundColor: '#7c5fff22',
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#7c5fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fffbe4',
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  birthdate: {
    fontSize: 15,
    color: '#b8c1ec',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#b8c1ec',
    fontSize: 16,
    marginTop: 40,
  },
  gradient: {
    flex: 1,
  },
});

export default Suivi;