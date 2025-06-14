import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import config from '../config'; 
import { scheduleReminder } from "../utils/notifications";


export default function CroissanceScreen() {
  const router = useRouter();
  const [baby, setBaby] = useState(null);
  const [tracking, setTracking] = useState();
  const [allTrackings, setAllTrackings] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [barWidth, setBarWidth] = useState(0);
  const { babyId } = useLocalSearchParams();
  const [gender, setGender] = useState("");
  const [heightCm, setHeightCm] = useState("");
 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const babyResponse = await axios.get(`${config.API_BASE_URL}/api/user/get_baby_by_id/${babyId}/`);
        const babyData = babyResponse.data;
        setBaby(babyData);

        const trackingResponse = await axios.get(`${config.API_BASE_URL}/api/user/get_last_traking/${babyId}/`);

        const trackings = trackingResponse.data;
        setAllTrackings(trackings);
        setTracking(trackings.length > 0 ? trackings[0] : null);
        checkTrackingAndAlert(trackings);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        setTracking(null);
      }
    };
    fetchData();
    const checkTrackingAndAlert = async (trackings) => {
      if (!Array.isArray(trackings) || trackings.length === 0) {
        await scheduleReminder(
          "Suivi de croissance 📈",
          "Vous n'avez ajouté aucune mesure cette semaine pour " + (baby?.name || "votre bébé"),
          "09:00" // tu peux changer l'heure du rappel ici
        );
        return;
      }

      const lastDate = new Date(trackings[0].date_recorded);
      const now = new Date();
      const diffInDays = (now - lastDate) / (1000 * 60 * 60 * 24);

      if (diffInDays > 7) {
        await scheduleReminder(
          "Suivi de croissance 📈",
          "N'oubliez pas de suivre la croissance de " + (baby?.name || "votre bébé") + " cette semaine",
          "09:00"
        );
      }
    };

  }, []);

  const calculateAgeInMonths = (dob) => {
    const birthDate = new Date(dob);
    const now = new Date();
    return (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
  };

  const predictHeight = async () => {
    if (!ageMonths || !gender || !heightCm) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/predict-height/`, {
        age_months: parseInt(ageMonths),
        gender,
        height_cm: parseFloat(heightCm),
        
      });
      setPrediction(response.data.prediction);
      
    } catch (error) {
      console.error("Erreur lors de la prédiction :", error);
      Alert.alert("Erreur", "Impossible de prédire la taille. Veuillez réessayer.");
    }
  };

  const ageMonths = baby ? calculateAgeInMonths(baby.date_of_birth) : 0;
  const bmi = tracking && tracking.height ? tracking.weight / Math.pow(tracking.height / 100, 2) : null;

  let bmiLabel = "Inconnu";
  let bmiColor = "#aaa";
  if (bmi !== null) {
    if (bmi < 14) {
      bmiLabel = "Sous-poids";
      bmiColor = "#4FC3F7";
    } else if (bmi < 17) {
      bmiLabel = "Poids santé";
      bmiColor = "#81C784";
    } else if (bmi < 19) {
      bmiLabel = "Surpoids";
      bmiColor = "#FFEB3B";
    } else {
      bmiLabel = "Obésité";
      bmiColor = "#E57373";
    }
  }

  const positionLeft = bmi !== null ? Math.min(Math.max((bmi - 13) / 6 * barWidth, 0), barWidth) : 0;
  const onBarLayout = (event) => setBarWidth(event.nativeEvent.layout.width);

  const renderChart = (accessor) => {
    const cleaned = [...allTrackings].filter(t => {
      const value = t[accessor];
      return value !== null && !isNaN(parseFloat(value)) && isFinite(value);
    }).slice(0, 10).reverse();

    const labels = cleaned.map(t => t.date_recorded);
    const data = cleaned.map(t => parseFloat(t[accessor]));

    if (data.length === 0) return <Text style={{ textAlign: 'center', marginTop: 10 }}>Aucune donnée valide</Text>;

    return (
      <LineChart
        data={{ labels, datasets: [{ data }] }}
        width={Dimensions.get("window").width * 2.6}
        height={220}
        yAxisSuffix={accessor === 'weight' ? 'kg' : 'cm'}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(244, 167, 160, ${opacity})`,
          labelColor: () => "#888",
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    );
  };

  const recentTrackings = [...allTrackings].sort((a, b) => new Date(b.date_recorded) - new Date(a.date_recorded)).slice(0, 3);

  const [showPredictCard, setShowPredictCard] = useState(false);
  const [prediction, setPrediction] = useState(null);

  if (!baby || tracking === undefined) {
    return <Text style={{ marginTop: 50, textAlign: "center" }}>Chargement...</Text>;
  }

  return (
    <LinearGradient colors={["#f8b5c8", "#dbeeff"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={require("../assets/images/baby-icon.png")} style={styles.profileImage} />
          <Text style={styles.title}>Baby health</Text>
          <Text style={styles.name}>{baby.name}</Text>
          <Text style={styles.birthDate}>Date de naissance: {baby.date_of_birth}</Text>
        </View>

        {/* TABS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 0 }}>
          <View style={{ flexDirection: "row", paddingHorizontal: 10, gap: 20 }}>
            {["overview", "weight", "height", "head_circumference", "bmi"].map(tab => (
              <View key={tab} style={{ alignItems: "center" }}>
                <Text
                  onPress={() => setSelectedTab(tab)}
                  style={selectedTab === tab ? styles.tabActive : styles.tab}
                >
                  {tab === "overview" ? "Vue d’ensemble" :
                  tab === "weight" ? "Poids" :
                  tab === "height" ? "Taille" :
                  tab === "head_circumference" ? "Périmètre crânien" :
                  "Indice IMC"}
                </Text>
                {selectedTab === tab && (
                  <View style={{ height: 2, backgroundColor: "#EC879D", width: "100%", marginTop: 2 }} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>


        {/* OVERVIEW */}
        {selectedTab === "overview" && tracking && (
          <View style={styles.measureContainer}>
            <View style={styles.card}>
              <Text style={styles.date}>{tracking.date_recorded}</Text>
              <Text style={styles.label}>Poids</Text>
              <Text style={styles.value}>{tracking.weight} <Text style={styles.unit}>kg</Text></Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.date}>{tracking.date_recorded}</Text>
              <Text style={styles.label}>Taille</Text>
              <Text style={styles.value}>{tracking.height} <Text style={styles.unit}>cm</Text></Text>
              <Text style={styles.subLabel}>Périmètre crânien</Text>
              <Text style={styles.value}>{tracking.head_circumference} <Text style={styles.unit}>cm</Text></Text>
            </View>
          </View>
        )}

        {/* CHARTS */}
        {["weight", "height", "head_circumference"].includes(selectedTab) && (
          <View style={{ padding: 20 }}>
            {allTrackings.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#999" }}>Aucune donnée disponible</Text>
            ) : (
              <>
                {recentTrackings.map((item, idx) => (
                  <Text key={idx} style={{ marginBottom: 5 }}>
                    {item.date_recorded} : {selectedTab === "weight" ? item.weight + " kg" : selectedTab === "height" ? item.height + " cm" : item.head_circumference + " cm"}
                  </Text>
                ))}
                <ScrollView horizontal>{renderChart(selectedTab)}</ScrollView>
              </>
            )}
          </View>
        )}

        {/* BMI */}
        {selectedTab === "bmi" && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Indice IMC</Text>
            <Text style={{ fontSize: 16 }}>Âge: {ageMonths} mois</Text>
            <Text style={{ fontSize: 16 }}>IMC: {bmi?.toFixed(2)} kg/m²</Text>
            <Text style={{ fontSize: 16, color: bmiColor, fontWeight: "bold", marginTop: 5 }}>{bmiLabel}</Text>

            <View style={{ width: "100%", marginTop: 20 }} onLayout={onBarLayout}>
              <View style={{ flexDirection: "row", height: 30 }}>
                <View style={{ flex: 1, backgroundColor: "#4FC3F7" }} />
                <View style={{ flex: 1, backgroundColor: "#81C784" }} />
                <View style={{ flex: 1, backgroundColor: "#FFEB3B" }} />
                <View style={{ flex: 1, backgroundColor: "#E57373" }} />
              </View>
              <View style={{ height: 30, position: "relative" }}>
                <View
                  style={{
                    position: "absolute",
                    left: positionLeft - 10,
                    top: 0,
                    width: 0,
                    height: 0,
                    borderLeftWidth: 10,
                    borderRightWidth: 10,
                    borderBottomWidth: 15,
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderBottomColor: bmiColor,
                  }}
                />
                <Text style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "#666" }}>Vous êtes ici</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/addtracking")}>
          <Text style={styles.addButtonText}>Ajouter une mesure</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowPredictCard(true)}>
          <Text style={styles.addButtonText}>Verifier</Text>
        </TouchableOpacity>

        {/* Predict Card Modal */}
        {showPredictCard && (
          <View style={{
            position: "absolute",
            top: 100,
            left: 20,
            right: 20,
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            elevation: 10,
            zIndex: 100,
            alignItems: "center"
          }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Vérifier la taille prédite</Text>
            <Text style={{ marginBottom: 10 }}>Remplissez les informations :</Text>
            <View style={{ width: "100%", marginBottom: 10 }}>
              <Text>Âge (mois)</Text>
              <View style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginBottom: 10,
                paddingHorizontal: 8
              }}>
                <Text
                  style={{ paddingVertical: 8 }}
                  selectable={false}
                >{ageMonths}</Text>
              </View>
              <Text>Genre</Text>
              <View style={{
                flexDirection: "row",
                marginBottom: 10,
                gap: 10
              }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: gender === "Male" ? "#F4A4A0" : "#eee",
                    borderRadius: 8,
                    padding: 8,
                    flex: 1,
                    alignItems: "center"
                  }}
                  onPress={() => setGender("Male")}
                >
                  <Text>Garçon</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: gender === "Female" ? "#F4A4A0" : "#eee",
                    borderRadius: 8,
                    padding: 8,
                    flex: 1,
                    alignItems: "center"
                  }}
                  onPress={() => setGender("Female")}
                >
                  <Text>Fille</Text>
                </TouchableOpacity>
              </View>
              <Text>Taille actuelle (cm)</Text>
              <View style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                marginBottom: 10,
                paddingHorizontal: 8
              }}>
                <TextInput
                  keyboardType="numeric"
                  value={heightCm}
                  onChangeText={setHeightCm}
                  placeholder="Entrer la taille en cm"
                  style={{ paddingVertical: 8 }}
                />
              </View>
              
            </View>
            <TouchableOpacity
              style={[styles.addButton, { width: "100%", marginBottom: 10 }]}
              onPress={async () => {
                await predictHeight();
              }}
            >
              <Text style={styles.addButtonText}>Vérifier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, { width: "100%", backgroundColor: "#ccc" }]}
              onPress={() => setShowPredictCard(false)}
            >
              <Text style={[styles.addButtonText, { color: "#333" }]}>Fermer</Text>
            </TouchableOpacity>
            {prediction && (
              <Text style={{ marginTop: 10, fontWeight: "bold" }}>
                Taille prédite : {prediction} 
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 80,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    zIndex: 1,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#E57373", marginBottom: 8 },
  name: { fontSize: 24, fontWeight: "bold", color: "#000" },
  birthDate: { fontSize: 14, color: "#444" },
   tab: {
    fontSize: 14,
    color: "gray",
    paddingVertical: 6,
    fontWeight: "500",
  },
  tabActive: {
    fontSize: 14,
    color: "#EC879D",
    paddingVertical: 6,
    fontWeight: "bold",
  },
  measureContainer: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 16 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, elevation: 3, width: "45%", alignItems: "center", marginBottom: 20 },
  date: { color: "#999", fontSize: 12 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  subLabel: { fontSize: 12, color: "#555", marginTop: 8 },
  value: { fontSize: 24, fontWeight: "bold", marginTop: 4 },
  unit: { fontSize: 14, color: "#666" },
  addButton: { backgroundColor: "#F4A4A0", borderRadius: 30, paddingVertical: 14, alignItems: "center", marginHorizontal: 40, marginBottom: 40 },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
