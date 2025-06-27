import React from "react";
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
  ActivityIndicator,
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
        style={{ borderRadius: 16, color:'#fff' }}
      />
    );
  };

  const recentTrackings = [...allTrackings].sort((a, b) => new Date(b.date_recorded) - new Date(a.date_recorded)).slice(0, 3);

  const [showPredictCard, setShowPredictCard] = useState(false);
  const [prediction, setPrediction] = useState(null);

  if (!baby || tracking === undefined) {
    return (
      <View style={styles.gradient}>
        <AnimatedNightBackground />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7c5fff" />
        </View>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#f8b5c8", "#dbeeff"]} style={{ flex: 1 }}>
      <AnimatedNightBackground />
      {(!baby || tracking === undefined) ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7c5fff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image source={require("../assets/images/baby-icon.png")} style={styles.profileImage} />
            <Text style={styles.title}>Baby health</Text>
            <Text style={styles.name}>{baby.name}</Text>
            <Text style={styles.birthDate}>Date de naissance: {baby.date_of_birth}</Text>
          </View>

          {/* TABS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 0 }}>
            <View style={{ flexDirection: "row", paddingHorizontal: 10, gap: 20, color:'#fff' }}>
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
                <Text style={{ textAlign: "center", color:'#fff' }}>Aucune donnée disponible</Text>
              ) : (
                <>
                  {recentTrackings.map((item, idx) => (
                    <Text key={idx} style={{ marginBottom: 5, color:'#fff' }}>
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
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10, color:'#fff' }}>Indice IMC</Text>
              <Text style={{ fontSize: 16, color:'#fff' }}>Âge: {ageMonths} mois</Text>
              <Text style={{ fontSize: 16, color:'#fff' }}>IMC: {bmi?.toFixed(2)} kg/m²</Text>
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
  <View style={styles.predictCard}>
    <Text style={styles.predictTitle}>Vérifier la taille prédite</Text>
    <Text style={{ marginBottom: 10, color: "#232946" }}>Remplissez les informations :</Text>
    <View style={{ width: "100%", marginBottom: 10 }}>
      <Text style={styles.predictLabel}>Âge (mois)</Text>
      <View style={styles.predictInputBox}>
        <Text style={styles.predictInputText}>{ageMonths}</Text>
      </View>
      <Text style={styles.predictLabel}>Genre</Text>
      <View style={styles.predictGenderRow}>
        <TouchableOpacity
          style={[
            styles.predictGenderBtn,
            gender === "Male" && styles.predictGenderBtnActive,
          ]}
          onPress={() => setGender("Male")}
        >
          <Text style={gender === "Male" ? styles.predictGenderTextActive : styles.predictGenderText}>Garçon</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.predictGenderBtn,
            gender === "Female" && styles.predictGenderBtnActive,
          ]}
          onPress={() => setGender("Female")}
        >
          <Text style={gender === "Female" ? styles.predictGenderTextActive : styles.predictGenderText}>Fille</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.predictLabel}>Taille actuelle (cm)</Text>
      <View style={styles.predictInputBox}>
        <TextInput
          keyboardType="numeric"
          value={heightCm}
          onChangeText={setHeightCm}
          placeholder="Entrer la taille en cm"
          style={styles.predictInputText}
          placeholderTextColor="#b8c1ec"
        />
      </View>
    </View>
    <TouchableOpacity
      style={[styles.addButton, { width: "100%", marginBottom: 10, backgroundColor: "#7c5fff" }]}
      onPress={async () => {
        await predictHeight();
      }}
    >
      <Text style={styles.addButtonText}>Vérifier</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.addButton, { width: "100%", backgroundColor: "#ede9fe" }]}
      onPress={() => setShowPredictCard(false)}
    >
      <Text style={[styles.addButtonText, { color: "#7c5fff" }]}>Fermer</Text>
    </TouchableOpacity>
    {prediction && (
      <Text style={{ marginTop: 10, fontWeight: "bold", color: "#a21caf" }}>
        Taille prédite : {prediction}
      </Text>
    )}
  </View>
)}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#181d36',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fffbe4',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7c5fff",
    marginBottom: 8,
  },
  name: { fontSize: 24, fontWeight: "bold", color: "#fffbe4" },
  birthDate: { fontSize: 14, color: "#b8c1ec" },
  tab: {
    fontSize: 14,
    color: "#b8c1ec",
    paddingVertical: 6,
    fontWeight: "500",
  },
  tabActive: {
    fontSize: 14,
    color: "#7c5fff",
    paddingVertical: 6,
    fontWeight: "bold",
  },
  measureContainer: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 16, color:'#fff' },
  card: {
    backgroundColor: "#232946",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    width: "45%",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#7c5fff",
    color:'#fff',
  },
  date: { color: "#b8c1ec", fontSize: 12 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: "#7c5fff" },
  subLabel: { fontSize: 12, color: "#b8c1ec", marginTop: 8 },
  value: { fontSize: 24, fontWeight: "bold", marginTop: 4, color: "#fffbe4" },
  unit: { fontSize: 14, color: "#b8c1ec" },
  addButton: {
    backgroundColor: "#a21caf",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 40,
    marginBottom: 40,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  scrollContent: { flexGrow: 1 },
  // Styles pour la Predict Card
  predictCard: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(248,246,250,0.97)",
    borderRadius: 18,
    padding: 20,
    elevation: 10,
    zIndex: 100,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#7c5fff",
    shadowColor: "#7c5fff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
  },
  predictTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#7c5fff",
  },
  predictLabel: {
    color: "#7c5fff",
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 6,
  },
  predictInputBox: {
    borderWidth: 1.5,
    borderColor: "#b8c1ec",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: "#f4f3ff",
  },
  predictInputText: {
    paddingVertical: 8,
    color: "#232946",
    fontSize: 16,
  },
  predictGenderRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  predictGenderBtn: {
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 8,
    flex: 1,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#b8c1ec",
  },
  predictGenderBtnActive: {
    backgroundColor: "#7c5fff",
    borderColor: "#7c5fff",
  },
  predictGenderText: {
    color: "#232946",
    fontWeight: "bold",
  },
  predictGenderTextActive: {
    color: "#fffbe4",
    fontWeight: "bold",
  },
});
