import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';
import { scheduleReminder } from '../../utils/notifications';


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


  

  const switchChildCards = () =>
    setCurrentChildIndex((prevIndex) => (prevIndex + 1) % childrenSchedules.length);

  const redirectToTracking = () => router.push('/(tabs)/Suivi');

  useEffect(() => {
    // Update today's date
    setTodayDate(
      new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    );

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
          setAdvices(response.data);
        } catch (error) {
          console.error('Error fetching advices:', error);
        }
      };

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

      const checkTrackingAlert = async () => {
        try {
          const parentId = await AsyncStorage.getItem("parent_id");
          if (!parentId) return;
          
          const babiesRes = await axios.get(`${config.API_BASE_URL}/api/user/get_babies_by_parent_id/${parentId}/`);
          const babies = babiesRes.data;
          
          for (const baby of babies) {
            const trackingRes = await axios.get(`${config.API_BASE_URL}/api/user/get_last_traking/${baby.baby_id}/`);
            const trackings = trackingRes.data;
            console.log("Checking tracking for baby:", baby.name, "->", baby.baby_id);

            if (!Array.isArray(trackings) || trackings.length === 0) {
              await scheduleReminder(
                "Suivi de croissance 📈",
                `Vous n'avez encore rien ajouté pour ${baby.name} cette semaine.`,
                "09:00"
              );
            } else {
              const lastDate = new Date(trackings[0].date_recorded);
              const now = new Date();
              const diffInDays = (now - lastDate) / (1000 * 60 * 60 * 24);
              if (diffInDays > 7) {
                await scheduleReminder(
                  "Suivi de croissance 📈",
                  `Aucune nouvelle mesure pour ${baby.name} depuis plus d'une semaine.`,
                  "09:00"
                );
              }
            }
          }
        } catch (e) {
          console.error("Erreur lors du check de suivi :", e);
        }
      };


      // Execute all fetch functions concurrently
      await Promise.all([fetchParentData(), fetchAdvices(), fetchChildrenSchedules()]);
      await checkTrackingAlert();
      setIsLoading(false); // End loading after all fetches are done
    };

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

  return (
    <LinearGradient
      colors={['#ffb6c1', '#f8f6fa', '#a3cef1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={{ flex: 1,height: '100%', marginBottom: 83 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff"  />
          </View>
        ) : (
          <>
            <View style={styles.headerSection}>
              <Text style={styles.dateText}>{todayDate}</Text>
              <Text style={styles.title}>Today</Text>
              <Text style={styles.greeting}>Hello, {parent?.name} </Text>
            </View>

            <View style={styles.scheduleSection}>
              <View style={styles.scheduleHeader}>
                <Text style={styles.sectionTitle}>
                  {childrenSchedules.length > 0
                    ? childrenSchedules[currentChildIndex]?.name || 'Baby'
                    : 'Baby'}
                </Text>
                <View style={styles.scheduleIcons}>
                  <TouchableOpacity onPress={switchChildCards}>
                    <FontAwesome name="exchange" size={24} color="black" style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={redirectToTracking}>
                    <FontAwesome name="arrow-right" size={24} color="black" style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </View>
              {(childrenSchedules[currentChildIndex]?.schedules || []).map(
                (schedule: { text: string; subText: string; color: string }, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.scheduleCard,
                      {
                        backgroundColor:
                          childrenSchedules[currentChildIndex]?.gender.toLowerCase() === 'boy'
                            ? '#a3cef1' // Blue for boys
                            : '#ffb6c1', // Pink for girls
                      },
                    ]}
                  >
                    <Text style={styles.scheduleText}>{schedule.text}</Text>
                    <Text style={styles.scheduleSubText}>{schedule.subText}</Text>
                  </View>
                )
              )}
            </View>

            {advices.map((advice, index) => (
              <View key={index} style={styles.adviceSection}>
                <Image
                  source={require('@/assets/images/Guide/Feeding2.png')}
                  style={styles.adviceImage}
                />
                <Text style={styles.adviceTitle}>{advice.title}</Text>
                <Text style={styles.adviceText} numberOfLines={2} ellipsizeMode="tail">
                  {advice.content}
                </Text>
                <TouchableOpacity
                  onPress={() => openAdviceModal(index)}
                  style={styles.expandIcon}
                >
                  <FontAwesome name="expand" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {selectedAdvice !== null && (
          <Modal
            visible={true}
            animationType="slide"
            transparent={true}
            onRequestClose={closeAdviceModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image
                  source={require('@/assets/images/Guide/Feeding2.png')}
                  style={styles.adviceImage}
                />
                <Text style={styles.adviceTitle}>{advices[selectedAdvice].title}</Text>
                <Text style={styles.adviceText}>{advices[selectedAdvice].content}</Text>
                <TouchableOpacity
                  onPress={closeAdviceModal}
                  style={styles.closeButton}
                >
                  <FontAwesome name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    marginBottom: 80,
    marginTop: 80,
  },
  headerSection: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  greeting: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  scheduleSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 8,
    
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scheduleCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleSubText: {
    fontSize: 14,
    color: '#999',
  },
  adviceSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  adviceImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: '#555',
  },
  expandIcon: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButton: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 1000,
  },
});

export default Today;
