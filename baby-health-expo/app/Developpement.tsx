import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import developmentData from '../assets/json/developpement.json';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const tabs = [
  ...developmentData.semaines,
  ...developmentData.mois,
];

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
      {/* Dégradé nuit */}
      <View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#181d36',
      }} />
      {/* Vague nuit */}
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
      {/* Bulles pastel */}
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
      {/* Plusieurs étoiles partout */}
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
      {/* Jouet flottant : cube */}
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
      {/* Jouet flottant : canard */}
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

const Developpement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const currentData = tabs[activeTab];

  const imageMap = {
  "img1.png": require("../assets/images/img1.png"),
  "img2.png": require("../assets/images/img2.png"),
  "img3.png": require("../assets/images/img3.png"),
    };

  return (
    <View style={{ flex: 1, backgroundColor: '#181d36' }}>
      <AnimatedNightBackground />
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
              source={imageMap[currentData.image]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: 'transparent',
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
    color: '#b8c1ec',
    fontWeight: 'bold',
    opacity: 0.7,
  },
  activeTab: {
    color: '#7c5fff',
    borderBottomWidth: 2,
    borderBottomColor: '#7c5fff',
    opacity: 1,
  },
  contentContainer: {
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
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#7c5fff55',
  },
  infoCardInline: {
    flex: 1,
    backgroundColor: '#232946',
    paddingTop: 12,
    paddingHorizontal: 20,
    height: 200,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#7c5fff55',
    justifyContent: 'center',
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  period: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fffbe4',
    textAlign: 'center',
  },
  subText: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 17,
    color: '#b8c1ec',
  },
  range: {
    fontSize: 16,
    marginBottom: 4,
    color: '#fffbe4',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fffbe4',
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 15,
    color: '#b8c1ec',
    marginBottom: 10,
    lineHeight: 22,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#7c5fff',
  },
});

export default Developpement;