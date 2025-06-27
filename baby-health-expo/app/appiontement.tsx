import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, TouchableOpacity } from 'react-native'; // Corrected TextInput import
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config';
import { scheduleReminder } from '../utils/notifications';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

// Helper function to get today's date in 'YYYY-MM-DD' format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Interface for appointment data
interface Appointment {
  appointment_id: number; // Assuming it's part of the data from the backend
  
  parent: number;
  place: string;
  time: string; // ISO string for date and time
  value: string; // Details of the appointment
}

// Interface for the data sent to add an appointment (appointment_id might be omitted)
interface NewAppointmentData {
  parent: number;
  place: string;
  time: string;
  value: string;
  appointment_id?: number; // Optional, as backend should generate it
}


const AppointmentPage = () => { // Renamed component
  const [formData, setFormData] = useState({ value: '', place: '', time: '' });
  const [formVisible, setFormVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [appointments, setAppointments] = useState<Appointment[]>([]); // Renamed state
  const [loading, setLoading] = useState(true);

  // State and handlers for DateTimePickerModal
  const [isDateTimePickerVisible, setDateTimePickerVisible] = useState(false);

  const showDateTimePicker = () => setDateTimePickerVisible(true);
  const hideDateTimePicker = () => setDateTimePickerVisible(false);

  const handleConfirm = (date: Date) => {
    // Format the time as HH:MM
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    setFormData({ ...formData, time: `${hours}:${minutes}` });
    hideDateTimePicker();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const parentId = await AsyncStorage.getItem('parent_id');
      if (!parentId) {
        console.log('No parent_id found in AsyncStorage');
        setAppointments([]); // Set to empty array if no parent_id
        setLoading(false);
        return;
      }
      const response = await axios.get(`${config.API_BASE_URL}/api/user/get_appointments_by_parent_id/${parentId}`);
      setAppointments(Array.isArray(response.data) ? response.data : []);
      console.log('User Appointment data:', response.data);
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Runs once on mount

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  // Prepare markedDates for the Calendar component
  const markedDates = appointments.reduce<Record<string, { selected?: boolean; selectedColor?: string; dots?: { color: string }[]; marked?: boolean }>>((acc, appointment) => {
    if (appointment && typeof appointment.time === 'string') {
      const date = appointment.time.split('T')[0];

      if (!acc[date]) {
        acc[date] = { dots: [] , marked: false }; // Initialize if date not already in accumulator
      } else if (!acc[date].dots) {
        acc[date].dots = []; // Ensure dots array exists
      }
      
      // Add a green dot for the appointment if not already present
      if (!acc[date].dots.some(dot => dot.color === 'green')) {
        acc[date].dots.push({ color: 'green' });
      }
      acc[date].marked = true; // Mark day as having an appointment
    }
    return acc;
  }, {
    // Initial value for the accumulator: mark the selectedDate
    // and add dots if selectedDate has appointments
    [selectedDate]: {
      selected: true,
      selectedColor: 'blue',
      dots: appointments
        .filter(app => app && typeof app.time === 'string' && app.time.split('T')[0] === selectedDate)
        .map(() => ({ color: 'green' })) // Add green dots if selected date has appointments
        // Ensure only one green dot is added for selectedDate in this initial setup
        .filter((dot, index, self) => self.findIndex(d => d.color === dot.color) === index), 
      marked: appointments.some(app => app && typeof app.time === 'string' && app.time.split('T')[0] === selectedDate)
    }
  });
  
  // Ensure selectedDate always has the 'selected' property, even if no appointments.
  // If selectedDate wasn't processed by reduce (no appointments on that day initially)
  // or if it was, ensure selection properties are there.
  if (markedDates[selectedDate]) {
    markedDates[selectedDate].selected = true;
    markedDates[selectedDate].selectedColor = 'blue';
  } else {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: 'blue',
      dots: [],
      marked: false
    };
  }


  const appointmentsForSelectedDate = appointments.filter(
    (appointment) => appointment && typeof appointment.time === 'string' && appointment.time.split('T')[0] === selectedDate
  );

  const daletAppiontemment = async (appointmentId: number) => {
    try {
      const parentId = await AsyncStorage.getItem('parent_id');
      const token = await AsyncStorage.getItem('token'); // Retrieve the token

      if (!parentId) {
        console.log('No parent_id found in AsyncStorage');
        Alert.alert('Error', 'Parent ID not found. Please login again.');
        return;
      }

      if (!token) {
        Alert.alert('Error', 'Authorization token not found. Please login again.');
        return;
      }

      await axios.delete(
        `${config.API_BASE_URL}/api/user/delete_appointment/${appointmentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Succès', 'Rendez-vous supprimé avec succès !');
      await fetchData(); // Refresh the appointments list
    } catch (error) {
      console.error('Error deleting appointment:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      Alert.alert('Erreur', 'Erreur lors de la suppression du rendez-vous. Veuillez réessayer.');
    }
  };

  const addAppointment = async () => {
    if (!formData.value || !formData.place || !formData.time) {
      Alert.alert('Validation Error', 'Veuillez remplir tous les champs.');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(formData.time)) {
        Alert.alert('Validation Error', 'Veuillez entrer l\'heure au format HH:MM (par exemple, 14:30).');
        return;
    }

    try {
      const parentId = await AsyncStorage.getItem('parent_id');
      const token = await AsyncStorage.getItem('token'); // 🔑 **Retrieve the token**

      if (!parentId) {
        console.log('No parent_id found in AsyncStorage');
        Alert.alert('Error', 'Parent ID not found. Please login again.');
        return;
      }

      if (!token) { // 🔑 **Check if token exists**
        Alert.alert('Error', 'Authorization token not found. Please login again.');
        return;
      }

      const newAppointmentData: NewAppointmentData = {
        parent: parseInt(parentId, 10),
        place: formData.place,
        time: `${selectedDate}T${formData.time}:00`,
        value: formData.value,
      };

      // 👇 **Include the Authorization header**
      await axios.post(
        `${config.API_BASE_URL}/api/user/add_appointment/`,
        newAppointmentData,
        {
          headers: {
            'Authorization': `Bearer ${token}` // 🔑 **Add the token here**
          }
        }
      );

      // 🔔 Notification quotidienne à l'heure du rendez-vous
      await scheduleReminder(
        "Rappel 📅",
        `Rendez-vous : ${formData.value}`,
        formData.time
      );
      
      Alert.alert('Succès', 'Rendez-vous ajouté avec succès !');
      await fetchData(); 
      setFormData({ value: '', place: '', time: '' });
      setFormVisible(false);
    } catch (error) {
      console.error('Error adding appointment:', error);
      // It's helpful to log the full error response for more details
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      Alert.alert('Erreur', 'Erreur lors de l\'ajout du rendez-vous. Veuillez réessayer.');
    }
  }

  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null); // Track the appointment being edited

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      value: appointment.value,
      place: appointment.place,
      time: appointment.time.split('T')[1].substring(0, 5), // Extract time in HH:MM format
    });
    setFormVisible(true);
  };

  const saveEditedAppointment = async () => {
    if (!formData.value || !formData.place || !formData.time) {
      Alert.alert('Validation Error', 'Veuillez remplir tous les champs.');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(formData.time)) {
      Alert.alert('Validation Error', 'Veuillez entrer l\'heure au format HH:MM (par exemple, 14:30).');
      return;
    }

    try {
      const parentId = await AsyncStorage.getItem('parent_id');
      const token = await AsyncStorage.getItem('token');

      if (!parentId) {
        Alert.alert('Error', 'Parent ID not found. Please login again.');
        return;
      }

      if (!token) {
        Alert.alert('Error', 'Authorization token not found. Please login again.');
        return;
      }

      const updatedAppointmentData: NewAppointmentData = {
        parent: parseInt(parentId, 10),
        place: formData.place,
        time: `${selectedDate}T${formData.time}:00`,
        value: formData.value,
      };

      await axios.put(
        `${config.API_BASE_URL}/api/user/update_appointment/${editingAppointment?.appointment_id}/`,
        updatedAppointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Succès', 'Rendez-vous modifié avec succès !');
      await fetchData(); // Refresh the appointments list
      setFormData({ value: '', place: '', time: '' });
      setFormVisible(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      Alert.alert('Erreur', 'Erreur lors de la modification du rendez-vous. Veuillez réessayer.');
    }
  };

  const AnimatedBackground = () => {
    const flowAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.loop(
        Animated.timing(flowAnim, {
          toValue: 1,
          duration: 16000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    }, []);

    const translateX = flowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -120],
    });

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '120%',
          height: 340,
          transform: [{ translateX }],
          opacity: 0.18,
        }}>
          <Svg width="120%" height="340" viewBox="0 0 500 340">
            <Defs>
              <SvgLinearGradient id="flow1" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#232946" stopOpacity="1" />
                <Stop offset="100%" stopColor="#7c5fff" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <SvgPath
              d="M0,120 Q125,200 250,120 T500,120 V340 H0 Z"
              fill="url(#flow1)"
            />
          </Svg>
        </Animated.View>
        <Animated.View style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '120%',
          height: 220,
          transform: [{ translateX: Animated.multiply(translateX, -1) }],
          opacity: 0.13,
        }}>
          <Svg width="120%" height="220" viewBox="0 0 500 220">
            <Defs>
              <SvgLinearGradient id="flow2" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#2ec4b6" stopOpacity="1" />
                <Stop offset="100%" stopColor="#232946" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <SvgPath
              d="M0,80 Q150,180 300,80 T500,80 V220 H0 Z"
              fill="url(#flow2)"
            />
          </Svg>
        </Animated.View>
      </View>
    );
  };

  const AnimatedLightBackground = () => {
    const anim = React.useRef(new Animated.Value(0)).current;
    const bubble1 = React.useRef(new Animated.Value(0)).current;
    const bubble2 = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 16000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubble1, { toValue: 1, duration: 9000, useNativeDriver: false }),
          Animated.timing(bubble1, { toValue: 0, duration: 9000, useNativeDriver: false }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubble2, { toValue: 1, duration: 12000, useNativeDriver: false }),
          Animated.timing(bubble2, { toValue: 0, duration: 12000, useNativeDriver: false }),
        ])
      ).start();
    }, []);

    const translateX = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -80],
    });

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Vague pastel haut */}
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '120%',
          height: 180,
          transform: [{ translateX }],
          opacity: 0.18,
        }}>
          <Svg width="120%" height="180" viewBox="0 0 500 180">
            <Defs>
              <SvgLinearGradient id="light1" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#b8e0fe" stopOpacity="1" />
                <Stop offset="100%" stopColor="#f8f6fa" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <SvgPath
              d="M0,60 Q125,120 250,60 T500,60 V180 H0 Z"
              fill="url(#light1)"
            />
          </Svg>
        </Animated.View>
        {/* Vague pastel bas */}
        <Animated.View style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '120%',
          height: 160,
          transform: [{ translateX: Animated.multiply(translateX, -1) }],
          opacity: 0.15,
        }}>
          <Svg width="120%" height="160" viewBox="0 0 500 160">
            <Defs>
              <SvgLinearGradient id="light2" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#ffe4f0" stopOpacity="1" />
                <Stop offset="100%" stopColor="#e0f7fa" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <SvgPath
              d="M0,80 Q150,140 300,80 T500,80 V160 H0 Z"
              fill="url(#light2)"
            />
          </Svg>
        </Animated.View>
        {/* Bulles flottantes */}
        <Animated.View style={{
          position: 'absolute',
          top: bubble1.interpolate({ inputRange: [0, 1], outputRange: [100, 40] }),
          left: 30,
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: '#b8e0fe55',
          opacity: 0.4,
        }} />
        <Animated.View style={{
          position: 'absolute',
          top: bubble2.interpolate({ inputRange: [0, 1], outputRange: [320, 180] }),
          right: 60,
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: '#ffe4f055',
          opacity: 0.4,
        }} />
      </View>
    );
  };

const AnimatedNightBackground = () => {
  const waveAnim = React.useRef(new Animated.Value(0)).current;
  const starAnim = React.useRef(new Animated.Value(0)).current;
  const toyAnim = React.useRef(new Animated.Value(0)).current;
  const bubble1 = React.useRef(new Animated.Value(0)).current;
  const bubble2 = React.useRef(new Animated.Value(0)).current;

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
    Animated.loop(
      Animated.sequence([
        Animated.timing(bubble1, { toValue: 1, duration: 11000, useNativeDriver: false }),
        Animated.timing(bubble1, { toValue: 0, duration: 11000, useNativeDriver: false }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bubble2, { toValue: 1, duration: 14000, useNativeDriver: false }),
        Animated.timing(bubble2, { toValue: 0, duration: 14000, useNativeDriver: false }),
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
    outputRange: [60, 120],
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
        top: bubble1.interpolate({ inputRange: [0, 1], outputRange: [120, 60] }),
        left: 40,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#b8e0fe55',
        opacity: 0.4,
      }} />
      <Animated.View style={{
        position: 'absolute',
        top: bubble2.interpolate({ inputRange: [0, 1], outputRange: [300, 180] }),
        right: 60,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#ffd6e055',
        opacity: 0.4,
      }} />
      {/* Étoiles scintillantes */}
      <Animated.View style={{
        position: 'absolute',
        top: 40,
        left: 40,
        opacity: starOpacity,
      }}>
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <SvgPath
            d="M12 2 L13.09 8.26 L19 8.27 L14 12.14 L15.18 18.02 L12 14.77 L8.82 18.02 L10 12.14 L5 8.27 L10.91 8.26 Z"
            fill="#fffbe4"
          />
        </Svg>
      </Animated.View>
      <Animated.View style={{
        position: 'absolute',
        top: 100,
        right: 60,
        opacity: starOpacity,
      }}>
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <SvgPath
            d="M12 2 L13.09 8.26 L19 8.27 L14 12.14 L15.18 18.02 L12 14.77 L8.82 18.02 L10 12.14 L5 8.27 L10.91 8.26 Z"
            fill="#ffe4b8"
          />
        </Svg>
      </Animated.View>
      {/* Plusieurs étoiles scintillantes */}
      {[...Array(18)].map((_, i) => {
        // Répartition sur toute la page
        const top = 20 + (i % 6) * 100; // 6 lignes
        const left = 20 + (i * 40) % 320; // positions horizontales variées
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
      {/* Cube bas */}
      <Animated.View style={{
        position: 'absolute',
        top: 420,
        left: 60,
        opacity: 0.7,
      }}>
        <Svg width={28} height={28} viewBox="0 0 32 32">
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
      {/* Canard bas */}
      <Animated.View style={{
        position: 'absolute',
        top: 500,
        right: 40,
        opacity: 0.7,
      }}>
        <Svg width={28} height={28} viewBox="0 0 32 32">
          <SvgPath d="M8 24 Q6 20 12 18 Q10 12 18 12 Q28 12 24 22 Q28 22 26 24 Q24 26 8 24 Z" fill="#ffe4b8"/>
          <SvgPath d="M25 18 Q27 17 26 20" fill="#ffb6b6"/>
          <SvgPath d="M20 16 Q21 15 22 16" stroke="#222" strokeWidth={1}/>
        </Svg>
      </Animated.View>
    </View>
  );
};

  return (
    <View style={{ flex: 1, backgroundColor: '#181d36' }}>
    <AnimatedNightBackground />
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Calendrier & Rendez-vous</Text>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType={'multi-dot'}
          current={selectedDate}
          key={selectedDate}
          style={styles.calendar}
        />
      {loading ? (
        <Text>Loading appointments...</Text>
      ) : (
        selectedDate && (
          <View style={styles.appointmentsList}>
            <Text style={styles.dateText}>Date sélectionnée : {selectedDate}</Text>
            {appointmentsForSelectedDate.length > 0 ? (
              appointmentsForSelectedDate.map((appointment) => (
                <View key={appointment.appointment_id} style ={styles.appointmentCard}>
                  <Text style={styles.appointmentText}>
                    Rendez-vous: {appointment.value}
                  </Text>
                  <Text style={styles.appointmentText}>
                    Lieu: {appointment.place}
                  </Text>
                  <Text style={styles.appointmentText}>
                    Time: {appointment.time.split('T')[1].substring(0,5)}
                  </Text>
                  <View style={styles.buttonAppointment}>
                      <Button color={"red"}  title='supprimer' onPress={ () => daletAppiontemment(appointment.appointment_id) } />
                      <Button color={"green"} title='modifier' onPress={() => handleEditAppointment(appointment)} />
                  </View>
                    

                </View>
              ))
            ) : (
              <Text style={styles.noAppointmentText}>Aucun rendez-vous pour cette date.</Text>
            )}
          </View>
        )
      )}

      {formVisible && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Description du rendez-vous"
            value={formData.value}
            onChangeText={(text) => setFormData({ ...formData, value: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Lieu"
            value={formData.place}
            onChangeText={(text) => setFormData({ ...formData, place: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Heure (HH:MM)"
            value={formData.time}
            onFocus={showDateTimePicker}
            editable={true}
          />
          <DateTimePickerModal
            isVisible={isDateTimePickerVisible}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={hideDateTimePicker}
          />
          <TouchableOpacity style={styles.addButton} onPress={editingAppointment ? saveEditedAppointment : addAppointment}>
            <Text style={styles.addButtonText}>{editingAppointment ? 'Modifier' : 'Ajouter'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => {
            setFormVisible(false);
            setFormData({ value: '', place: '', time: '' });
            setEditingAppointment(null);
          }}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}
      {!formVisible && (
        <TouchableOpacity
          style={{
            marginTop: 24,
            marginBottom: 24,
            alignSelf: 'center',
            backgroundColor: '#7c5fff',
            borderRadius: 22,
            paddingVertical: 15,
            paddingHorizontal: 38,
            shadowColor: '#7c5fff',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
          onPress={() => setFormVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={{
            color: '#fffbe4',
            fontSize: 18,
            fontWeight: 'bold',
            letterSpacing: 1,
            textAlign: 'center',
          }}>
            Ajouter un rendez-vous
          </Text>
        </TouchableOpacity>
      )}

      </ScrollView>
    </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 38,
    textAlign: 'center',
    color: '#fffbe4', // jaune pastel très lisible sur fond nuit
    letterSpacing: 1,
  },
  calendar: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    alignSelf: 'center',
    width: 340,
    elevation: 2,
    backgroundColor: '#232956',
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    color: '#b8c1ec', // lavande claire
    textAlign: 'center',
  },
  appointmentsList: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  appointmentCard: {
    backgroundColor: '#232946',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#7c5fff',
    marginBottom: 14,
    width: '95%',
    shadowColor: '#7c5fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 3,
  },
  appointmentText: {
    fontSize: 16,
    marginTop: 2,
    marginBottom: 2,
    color: '#fffbe4', // jaune pastel
    backgroundColor: 'transparent',
  },
  noAppointmentText: {
    fontSize: 16,
    marginTop: 5,
    color: '#b8c1ec',
    textAlign: 'center',
  },
  buttonAppointment: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
  },
  formContainer: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '88%',
  minHeight: 280,
  padding: 28,
  backgroundColor: '#232946ee', // légère transparence
  borderRadius: 32,
  elevation: 12,
  shadowColor: '#7c5fff',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.22,
  shadowRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
  transform: [
    { translateX: -0.44 * 360 }, // centré (360 = largeur estimée)
    { translateY: -0.5 * 320 }
  ],
  zIndex: 20,
  borderWidth: 1.5,
  borderColor: '#7c5fff55',
},
input: {
  width: '100%',
  height: 48,
  borderColor: '#7c5fff',
  borderWidth: 1.5,
  marginBottom: 16,
  paddingHorizontal: 14,
  borderRadius: 14,
  backgroundColor: '#181d36',
  color: '#fffbe4',
  fontSize: 17,
  shadowColor: '#7c5fff',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.09,
  shadowRadius: 6,
},
addButton: {
  marginTop: 10,
  paddingVertical: 13,
  paddingHorizontal: 32,
  borderRadius: 18,
  alignItems: 'center',
  backgroundColor: '#7c5fff',
  marginBottom: 8,
  width: '100%',
  shadowColor: '#7c5fff',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.13,
  shadowRadius: 8,
  
},
cancelButton: {
  marginTop: 0,
  paddingVertical: 11,
  paddingHorizontal: 32,
  borderRadius: 18,
  alignItems: 'center',
  backgroundColor: '#232946',
  borderWidth: 1.5,
  borderColor: '#7c5fff',
  width: '100%',
},
addButtonText: {
  color: '#fffbe4',
  fontSize: 17,
  fontWeight: 'bold',
  letterSpacing: 1,
},
cancelButtonText: {
  color: '#7c5fff',
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 1,
},
  button: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#7c5fff',
  },
  buttonText: {
    color: '#fffbe4',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentPage; // Renamed export