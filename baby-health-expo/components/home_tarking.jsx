import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";

export default function CroissanceScreen() {
  const router = useRouter();
  const [baby, setBaby] = useState(null);
  const [tracking, setTracking] = useState();
  const [allTrackings, setAllTrackings] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parentId = await AsyncStorage.getItem("parent_id");
        const babyResponse = await axios.get(`https://application-de-suivi-medical-et-de-sante.onrender.com/api/user/get_babies_by_parent_id/${parentId}/`);
        const babyData = babyResponse.data[0];
        setBaby(babyData);

        const trackingResponse = await axios.get(`https://application-de-suivi-medical-et-de-sante.onrender.com/api/user/get_last_traking/${babyData.baby_id}/`);
        const trackings = trackingResponse.data;
        setAllTrackings(trackings);
        setTracking(trackings.length > 0 ? trackings[0] : null);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        setTracking(null);
      }
    };
    fetchData();
  }, []);

  const calculateAgeInMonths = (dob) => {
    const birthDate = new Date(dob);
    const now = new Date();
    return (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
  };

  const ageMonths = baby ? calculateAgeInMonths(baby.date_of_birth) : 0;

  const bmi = tracking && tracking.height
    ? tracking.weight / Math.pow(tracking.height / 100, 2)
    : null;

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
  const onBarLayout = (event) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const renderChart = (accessor) => {
    const cleaned = [...allTrackings]
      .filter(t => {
        const value = t[accessor];
        return value !== null && !isNaN(parseFloat(value)) && isFinite(value);
      })
      .slice(0, 10)
      .reverse();

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

  const recentTrackings = [...allTrackings]
    .sort((a, b) => new Date(b.date_recorded) - new Date(a.date_recorded))
    .slice(0, 3);

  if (!baby || tracking === undefined) {
    return <Text style={{ marginTop: 50, textAlign: "center" }}>Chargement...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Svg viewBox="0 0 500 150" preserveAspectRatio="none" style={styles.wave}>
          <Path d="M-0.00,49.98 C150.00,150.00 349.90,-49.98 500.00,49.98 L500.00,150.00 L-0.00,150.00 Z" fill="#fff" />
        </Svg>
        <Image source={require("../assets/images/baby-icon.png")} style={styles.profileImage} />
        <Text style={styles.title}>Baby health</Text>
        <Text style={styles.name}>{baby.name}</Text>
        <Text style={styles.birthDate}>Date de naissance: {baby.date_of_birth}</Text>
      </View>

      {/* TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
        <View style={{ flexDirection: "row", paddingHorizontal: 10, gap: 20 }}>
          {["overview", "weight", "height", "head_circumference", "bmi"].map(tab => (
            <Text
              key={tab}
              style={selectedTab === tab ? styles.tabActive : styles.tab}
              onPress={() => setSelectedTab(tab)}
            >
              {tab === "overview" ? "Vue d’ensemble" :
               tab === "weight" ? "Poids" :
               tab === "height" ? "Taille" :
               tab === "head_circumference" ? "Périmètre crânien" :
               "Indice IMC"}
            </Text>
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

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/addtracking")}>
        <Text style={styles.addButtonText}>Ajouter une mesure</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  header: {
    backgroundColor: "#F4C7C3",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 80,
    position: "relative",
  },
  wave: { position: "absolute", bottom: 0, width: "100%", height: 100 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10, zIndex: 1 },
  title: { fontSize: 22, fontWeight: "bold", color: "#E57373", marginBottom: 8 },
  name: { fontSize: 24, fontWeight: "bold", color: "#000" },
  birthDate: { fontSize: 14, color: "#444" },
  tab: { color: "#999", fontSize: 14 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#E57373", paddingBottom: 4, fontWeight: "bold", fontSize: 14 },
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
