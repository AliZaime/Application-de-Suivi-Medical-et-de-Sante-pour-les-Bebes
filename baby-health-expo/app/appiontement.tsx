import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native'; // Corrected TextInput import
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LinearGradient } from 'expo-linear-gradient';
import config from '../config';

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

  return (
    <LinearGradient
          colors={['#ffb6c1', '#f8f6fa', '#a3cef1']} // Rose → blanc → bleu clair
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
    
    <View style={styles.container}>
      
      <ScrollView>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType={'multi-dot'} // Enabled multi-dot marking
        current={selectedDate}
        key={selectedDate} // Re-render calendar if selectedDate month changes
      />
      <Text style={styles.title}>Calendrier & Rendez-vous</Text>
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
                      <Button color={"red"}  title='suprimer' onPress={ () => daletAppiontemment(appointment.appointment_id) } />
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
          <Button
            title={editingAppointment ? 'Modifier' : 'Ajouter'}
            onPress={editingAppointment ? saveEditedAppointment : addAppointment}
          />
          <Button
            color={"red"}
            title="Annuler"
            onPress={() => {
              setFormVisible(false);
              setFormData({ value: '', place: '', time: '' });
              setEditingAppointment(null);
            }}
          />
        </View>
      )}
      {!formVisible && (
        <Button title="Ajouter un rendez-vous" onPress={() => setFormVisible(true)} />
      )}

      </ScrollView>
    </View>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    height: '100%',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333', // Darker text for better contrast
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
    color: '#555',
  },
  appointmentText: {
    fontSize: 16,
    marginTop: 5,
    padding: 12,

    borderRadius: 8,
    marginBottom: 8,
    color: 'black', // Teal text color
  },
  noAppointmentText: {
    fontSize: 16,
    marginTop: 5,
    color: '#999',
    textAlign: 'center',
  },
  appointmentsList: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  formContainer: {
    alignSelf: 'center',
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -0.45 * 360 }, { translateY: -0.5 * 320 }], // Approximate centering
    // Adjust 360 and 320 to your form's width/height if needed
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#fdfdfd',
  },
  button: {
    marginTop: 10,
    paddingVertical: 12,
     // Teal button color
      borderRadius: 6,
      alignItems: 'center',
      },
      buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      },
      buttonAppointment : {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
      },
      appointmentCard : {
      backgroundColor: 'transparent', // Light teal background for appointments
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // For Android shadow
  },
  gradient: {
    flex: 1,
  },
});

export default AppointmentPage; // Renamed export