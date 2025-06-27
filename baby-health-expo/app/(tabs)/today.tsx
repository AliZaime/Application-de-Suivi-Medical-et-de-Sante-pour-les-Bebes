import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { Path } from 'react-native-svg';
import { Animated, Easing } from 'react-native'; // Ajout pour animations
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';

const Today = () => {
  const [todayDate, setTodayDate] = useState(
    new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  );
  const router = useRouter();
  const [parent, setParent] = useState<{ name: string} | null>(null);

  const [currentChildIndex, setCurrentChildIndex] = useState(0);
  const [advices, setAdvices] = useState<{ image: string; title: string; content: string }[]>([]);
  const [expandedAdvices, setExpandedAdvices] = useState<boolean[]>([]);
  const [selectedAdvice, setSelectedAdvice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [childrenSchedules, setChildrenSchedules] = useState<{ name: string; gender: string; schedules: { text: string; subText: string; color: string }[] }[]>([]);

  const images = {
  "VaccineCalendar.png": require('@/assets/images/Guide/VaccineCalendar.png'),
  "BabyproofingHome.png": require('@/assets/images/Guide/BabyproofingHome.png'),
  "AvoidingChokingHazards.png": require('@/assets/images/Guide/AvoidingChokingHazards.png'),
  "MotorSkillDevelopment.png": require('@/assets/images/Guide/MotorSkillDevelopment.png'),
  "CarSeatSafety.png": require('@/assets/images/Guide/CarSeatSafety.png'),
  "DiaperRashPrevention.png": require('@/assets/images/Guide/DiaperRashPrevention.png'),
  "ManagingNightWakings.png": require('@/assets/images/Guide/ManagingNightWakings.png'),
  "PostpartumSelf-Care.png": require('@/assets/images/Guide/PostpartumSelf-Care.png'),
  "WhentoSeeaPediatrician.png": require('@/assets/images/Guide/WhentoSeeaPediatrician.png'),
  "TummyTimeBenefits.png": require('@/assets/images/Guide/TummyTimeBenefits.png'),
  "TrackingMilestones.png": require('@/assets/images/Guide/TrackingMilestones.png'),
  "ManagingFever.png": require('@/assets/images/Guide/ManagingFever.png'),
  "ColicReliefTips.png": require('@/assets/images/Guide/ColicReliefTips.png'),
  "CreateaBedtimeRoutine.png": require('@/assets/images/Guide/CreateaBedtimeRoutine.png'),
  "BurpingTechniques.png": require('@/assets/images/Guide/BurpingTechniques.png'),
  "SafeSleepPractices.png": require('@/assets/images/Guide/SafeSleepPractices.png'),
  "SignsBabyisFull.png": require('@/assets/images/Guide/SignsBabyisFull.png'),
  "PartnerSupport.png": require('@/assets/images/Guide/PartnerSupport.png'),
  "CleaningBabyBottles.png": require('@/assets/images/Guide/CleaningBabyBottles.png'),
  "ManagingSleepDeprivation.png": require('@/assets/images/Guide/ManagingSleepDeprivation.png'),
  "WhyVaccinesMatter.png": require('@/assets/images/Guide/WhyVaccinesMatter.png'),
  "Post-vaccineReactions.png": require('@/assets/images/Guide/Post-vaccineReactions.png'),
  "BathingBasics.png": require('@/assets/images/Guide/BathingBasics.png'),
  "BreastfeedingLatchTips.png": require('@/assets/images/Guide/BreastfeedingLatchTips.png'),
};

  

  const switchChildCards = () =>
    setCurrentChildIndex((prevIndex) => (prevIndex + 1) % childrenSchedules.length);

  const redirectToTracking = () => router.push('/(tabs)/Suivi');

  const fetchChildrenSchedules = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const parentId = await AsyncStorage.getItem('parent_id');

      if (!token || !parentId) {
        console.error('Token or Parent ID is missing');
        return;
      }

      const response = await axios.get(`${config.API_BASE_URL}/api/user/get_children_schedules/${parentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response:', response.data);

      const schedules = response.data.childrenSchedules.map((child: { name: string; gender: string; schedules: any[] }) => ({
        ...child,
        color: child.gender.toLowerCase() === 'girl' ? '#ffb6c1' : '#a3cef1',
      }));
      setChildrenSchedules(schedules as { name: string; gender: string; schedules: { text: string; subText: string; color: string }[] }[]);
    } catch (error) {
      console.error('Error fetching children schedules:', error.response?.data || error.message);
    }
  };

  const fetchData = async () => {
    setIsLoading(true); // Start loading

    const fetchParentData = async () => {
      try {
        const parentId = await AsyncStorage.getItem("parent_id");
        const parent = await axios.get(`${config.API_BASE_URL}/api/parent/${parentId}/`);
        setParent(parent.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAdvices = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/advice/`);
        console.log('Advices fetched:', response.data);
        setAdvices(response.data);
      } catch (error) {
        console.error('Error fetching advices:', error);
      }
    };

    // Execute all fetch functions concurrently
    await Promise.all([fetchParentData(), fetchAdvices(), fetchChildrenSchedules()]);

    setIsLoading(false); // End loading after all fetches are done
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setExpandedAdvices(new Array(advices.length).fill(false));
  }, [advices]);

  const toggleExpand = (index: number) => {
    setExpandedAdvices((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const openAdviceModal = (index: number) => setSelectedAdvice(index);

  const closeAdviceModal = () => setSelectedAdvice(null);

  const handleScroll = async (event: any) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y <= -150) {
      setIsLoading(true); // Show loading indicator
      try {
        await fetchChildrenSchedules(); // Refetch data
      } catch (error) {
        console.error('Error refetching ChildrenSchedules:', error);
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    }
  };

  // Animation pour les cartes planning et conseils
  const scheduleAnim = useRef(new Animated.Value(0)).current;
  const adviceAnim = useRef(new Animated.Value(0)).current;
  const modalImageAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scheduleAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    Animated.timing(adviceAnim, {
      toValue: 1,
      duration: 900,
      delay: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, [childrenSchedules, advices]);

  // Animation image modal
  useEffect(() => {
    if (selectedAdvice !== null) {
      modalImageAnim.setValue(0);
      Animated.spring(modalImageAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 60,
      }).start();
    }
  }, [selectedAdvice]);

  return (
    <View style={{ flex: 1, backgroundColor: '#181d36' }}>
      <AnimatedNightBackground />
      <View style={{ flex: 1, height: '100%', marginBottom: 80 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#a3cef1" />
            </View>
          ) : (
            <>
              <View style={styles.headerSection}>
                <Text style={styles.dateText}>{todayDate}</Text>
                <Text style={styles.title}>Today</Text>
                <Text style={styles.greeting}>Hello, {parent?.name} </Text>
              </View>

              <Animated.View
                style={[
                  styles.scheduleSection,
                  {
                    opacity: scheduleAnim,
                    transform: [
                      {
                        translateY: scheduleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [40, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.scheduleHeader}>
                  <Text style={styles.sectionTitle}>
                    {childrenSchedules.length > 0
                      ? childrenSchedules[currentChildIndex]?.name || 'Baby'
                      : 'Baby'}
                  </Text>
                  <View style={styles.scheduleIcons}>
                    <TouchableOpacity
                      onPress={switchChildCards}
                      style={styles.iconButton}
                      accessibilityLabel="Switch child"
                    >
                      <FontAwesome name="exchange" size={24} color="#7b8fa1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={redirectToTracking}
                      style={styles.iconButton}
                      accessibilityLabel="Go to tracking"
                    >
                      <FontAwesome name="arrow-right" size={24} color="#7b8fa1" />
                    </TouchableOpacity>
                  </View>
                </View>
                {(childrenSchedules[currentChildIndex]?.schedules || []).map(
                  (schedule: { text: string; subText: string; color: string }, index: number) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.scheduleCard,
                        {
                          backgroundColor:
                            childrenSchedules[currentChildIndex]?.gender.toLowerCase() === 'boy'
                              ? '#b5e3ff'
                              : '#b8c1ec', // lavande claire, douce et compatible nuit
                          opacity: scheduleAnim,
                          transform: [
                            {
                              scale: scheduleAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.95, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Text style={styles.scheduleText}>{schedule.text}</Text>
                      <Text style={styles.scheduleSubText}>{schedule.subText}</Text>
                    </Animated.View>
                  )
                )}
              </Animated.View>

              {advices.map((advice, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.adviceSection,
                    {
                      opacity: adviceAnim,
                      transform: [
                        {
                          translateY: adviceAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [40, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Image
                    source={images[advice.image]}
                    style={styles.adviceImage}
                  />
                  <Text style={styles.adviceTitle}>{advice.title}</Text>
                  <Text style={styles.adviceText} numberOfLines={2} ellipsizeMode="tail">
                    {advice.content}
                  </Text>
                  <TouchableOpacity
                    onPress={() => openAdviceModal(index)}
                    style={styles.expandIcon}
                    accessibilityLabel="Show more advice"
                  >
                    <FontAwesome name="expand" size={24} color="#7b8fa1" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </>
          )}

          {selectedAdvice !== null && (
            <Modal
              visible={true}
              animationType="fade"
              transparent={true}
              onRequestClose={closeAdviceModal}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Animated.Image
                    source={images[advices[selectedAdvice].image]}
                    style={[
                      styles.modalAdviceImage,
                      {
                        transform: [
                          {
                            scale: modalImageAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.85, 1],
                            }),
                          },
                        ],
                        opacity: modalImageAnim,
                      },
                    ]}
                  />
                  <Text style={styles.adviceTitle}>{advices[selectedAdvice].title}</Text>
                  <Text style={styles.adviceText}>{advices[selectedAdvice].content}</Text>
                  <TouchableOpacity
                    onPress={closeAdviceModal}
                    style={styles.closeButton}
                    accessibilityLabel="Close advice"
                  >
                    <FontAwesome name="close" size={28} color="#7b8fa1" />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const AnimatedNightBackground = () => {
  // 3 bulles animées
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim1, { toValue: 1, duration: 9000, useNativeDriver: false }),
        Animated.timing(anim1, { toValue: 0, duration: 9000, useNativeDriver: false }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim2, { toValue: 1, duration: 12000, useNativeDriver: false }),
        Animated.timing(anim2, { toValue: 0, duration: 12000, useNativeDriver: false }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim3, { toValue: 1, duration: 15000, useNativeDriver: false }),
        Animated.timing(anim3, { toValue: 0, duration: 15000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={{
          position: 'absolute',
          top: anim1.interpolate({ inputRange: [0, 1], outputRange: [100, 250] }),
          left: 30,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#e3f6fd88',
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: anim2.interpolate({ inputRange: [0, 1], outputRange: [400, 200] }),
          right: 40,
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: '#f8e1f488',
          opacity: 0.5,
          zIndex: 0,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          bottom: anim3.interpolate({ inputRange: [0, 1], outputRange: [80, 200] }),
          left: 120,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: '#e0f7fa88',
          opacity: 0.4,
          zIndex: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 80,
    marginTop: 60,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    color: '#b8c1ec',
    textAlign: 'center',
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
    color: '#fffbe4',
    letterSpacing: 1,
  },
  greeting: {
    fontSize: 18,
    textAlign: 'center',
    color: '#b8c1ec',
    marginTop: 2,
  },
  scheduleSection: {
    marginBottom: 28,
    backgroundColor: '#232946ee',
    padding: 18,
    borderRadius: 24,
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    backgroundColor: '#181d36',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c5fff',
    marginBottom: 0,
    letterSpacing: 0.5,
  },
  scheduleCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#7c5fff55',
    backgroundColor: '#232946',
  },
  scheduleText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fffbe4',
    marginBottom: 2,
  },
  scheduleSubText: {
    fontSize: 15,
    color: 'rgb(22, 154, 210)'
  },
  adviceSection: {
    backgroundColor: '#232946ee',
    padding: 18,
    borderRadius: 24,
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#7c5fff55',
  },
  adviceImage: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    marginBottom: 12,
    backgroundColor: '#181d36',
  },
  adviceTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fffbe4',
    textAlign: 'center',
  },
  adviceText: {
    fontSize: 15,
    color: '#b8c1ec',
    textAlign: 'center',
    marginBottom: 6,
  },
  expandIcon: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#181d36',
    borderRadius: 16,
    padding: 8,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 29, 54, 0.18)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#232946',
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#7c5fff55',
  },
  modalAdviceImage: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    marginBottom: 14,
    backgroundColor: '#181d36',
  },
  closeButton: {
    marginTop: 18,
    backgroundColor: '#181d36',
    borderRadius: 16,
    padding: 10,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  cardGradient: {
    padding: 18,
    borderRadius: 24,
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default Today;