import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  Modal,
  FlatList,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import config from "../config";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path as SvgPath } from 'react-native-svg';
import { Animated, Easing } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

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

const ModernSelect = ({ label, value, options, onChange }) => {
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find(opt => opt.value === value)?.label || "Choisir...";

  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selectInput}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: value ? "#232946" : "#b8c1ec", fontSize: 16 }}>
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#7c5fff" />
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalSheet}>
            <FlatList
              data={options}
              keyExtractor={item => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={{
                    color: value === item.value ? "#7c5fff" : "#232946",
                    fontWeight: value === item.value ? "bold" : "normal",
                    fontSize: 16,
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function GeneticForm() {
  const [form, setForm] = useState({
    age: "",
    maternal_gene: "0",
    inherited_father: "0",
    genes_mother: "0",
    paternal_gene: "0",
    blood_cell: "5000",
    mother_age: "30",
    father_age: "35",
    resp_rate: "0",
    heart_rate: "0",
    test1: "",
    test2: "",
    test3: "",
    test4: "2.5",
    test5: "2.5",
    gender: "0",
    birth_asphyxia: "0",
    folic_acid: "1",
    maternal_illness: "0",
    radiation: "0",
    substance: "0",
    ivf: "0",
    anomalies: "0",
    abortion: "0",
    birth_defects: "1",
    white_cells: "8000",
    blood_test_result: "0",
    symptoms1: "0",
    symptoms2: "1",
    symptoms3: "2",
    symptoms4:  "3",
    symptoms5:   "4",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const input_data = [
        parseInt(form.age),
        parseInt(form.genes_mother),
        parseInt(form.inherited_father),
        parseInt(form.maternal_gene),
        parseInt(form.paternal_gene),
        parseInt(form.blood_cell),
        parseInt(form.mother_age),
        parseInt(form.father_age),
        parseInt(form.resp_rate),
        parseInt(form.heart_rate),
        parseFloat(form.test1),
        parseFloat(form.test2),
        parseFloat(form.test3),
        parseFloat(form.test4),
        parseFloat(form.test5),
        parseInt(form.gender),
        parseInt(form.birth_asphyxia),
        parseInt(form.birth_defects),
        parseInt(form.folic_acid),
        parseInt(form.maternal_illness),
        parseInt(form.radiation),
        parseInt(form.substance),
        parseInt(form.ivf),
        parseInt(form.anomalies),
        parseInt(form.abortion),
        parseInt(form.birth_defects),
        parseInt(form.white_cells),
        parseInt(form.blood_test_result),
        parseInt(form.symptoms1),
        parseInt(form.symptoms2),
        parseInt(form.symptoms3),
        parseInt(form.symptoms4),
        parseInt(form.symptoms5),
      ];

      const response = await axios.post(`${config.API_BASE_URL}/api/predict_disorder/`, {
        input_data,
      });

      const result = response.data;
      Alert.alert("Résultat",`Maladie prédite : ${result.predicted_label}\nConfiance : ${result.confidence}%`);
    } 
      catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de prédire. Vérifie les champs.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedNightBackground />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Prédiction génétique</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, {marginBottom:18}]}>
              <FontAwesome5 name="baby" size={16} color="#7c5fff" /> Âge du bébé
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 6"
              keyboardType="number-pad"
              value={form.age}
              onChangeText={(v) => handleChange("age", v)}
              placeholderTextColor="#b8c1ec"
              maxLength={2}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <Ionicons name="male-female" size={16} color="#7c5fff" /> Sexe
            </Text>
            <ModernSelect
              value={form.gender}
              onChange={v => handleChange("gender", v)}
              options={[
                { label: "Garçon", value: "0" },
                { label: "Fille", value: "1" },
              ]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <MaterialCommunityIcons name="human-female" size={16} color="#7c5fff" /> Gènes hérités de la mère
            </Text>
            <ModernSelect
              value={form.genes_mother}
              options={[
                { label: "Non", value: "0" },
                { label: "Oui", value: "1" },
              ]}
              onChange={(v) => handleChange("genes_mother", v)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <MaterialCommunityIcons name="human-male" size={16} color="#7c5fff" /> Gènes hérités du père
            </Text>
            <ModernSelect
              value={form.inherited_father}
              options={[
                { label: "Non", value: "0" },
                { label: "Oui", value: "1" },
              ]}
              onChange={(v) => handleChange("inherited_father", v)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <MaterialCommunityIcons name="test-tube" size={16} color="#7c5fff" /> Dosage hormonal
            </Text>
            <ModernSelect
              value={form.test1}
              onChange={v => handleChange("test1", v)}
              options={[
                { label: "Faible", value: "1" },
                { label: "Normal", value: "2.5" },
                { label: "Élevé", value: "4" },
              ]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <MaterialCommunityIcons name="brain" size={16} color="#7c5fff" /> Évaluation neurologique
            </Text>
            <ModernSelect
              value={form.test2}
              onChange={v => handleChange("test2", v)}
              options={[
                { label: "Normal", value: "2.5" },
                { label: "Ralentissement léger", value: "1.5" },
                { label: "Anomalie détectée", value: "4" },
              ]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <MaterialCommunityIcons name="dna" size={16} color="#7c5fff" /> Bilan génétique
            </Text>
            <ModernSelect
              value={form.test3}
              onChange={v => handleChange("test3", v)}
              options={[
                { label: "Non effectué", value: "0" },
                { label: "Résultat normal", value: "2.5" },
                { label: "Anomalie détectée", value: "4" },
              ]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <MaterialCommunityIcons name="baby-face-outline" size={16} color="#7c5fff" /> Asphyxie à la naissance
            </Text>
            <ModernSelect
              value={form.birth_asphyxia}
              onChange={v => handleChange("birth_asphyxia", v)}
              options={[
                { label: "Non", value: "0" },
                { label: "Oui", value: "1" },
              ]}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              <MaterialCommunityIcons name="water" size={16} color="#7c5fff" /> Résultat du test sanguin
            </Text>
            <ModernSelect
              value={form.blood_test_result}
              onChange={v => handleChange("blood_test_result", v)}
              options={[
                { label: "Normal", value: "0" },
                { label: "Inconclusif", value: "1" },
                { label: "Légèrement anormal", value: "2" },
                { label: "Anormal", value: "3" },
              ]}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
            <Ionicons name="search" size={20} color="#fffbe4" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Prédire la maladie génétique</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// --- Styles modernisés ---
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: '#181d36',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fffbe4',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 20,
    letterSpacing: 1,
    textShadowColor: "#7c5fff",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.82)", // plus clair et plus opaque
    borderRadius: 22,
    marginHorizontal: 12,
    marginTop: 0,
    paddingBottom: 36,
    shadowColor: "#b8c1ec",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: "#b8c1ec", // lavande pastel
  },
  formGroup: {
    width: "100%",
    marginBottom: 18,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff", // blanc pur pour contraste
    borderWidth: 1.5,
    borderColor: "#b8c1ec",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#232946", // texte foncé
    shadowColor: "#b8c1ec",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    color: "#7c5fff",
    fontSize: 15,
    letterSpacing: 0.2,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  pickerWrapper: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#b8c1ec",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#7c5fff",
    borderRadius: 25,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    shadowColor: "#7c5fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fffbe4",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  selectInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#b8c1ec",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 12,
    width: "80%",
    maxHeight: 340,
    elevation: 8,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
});