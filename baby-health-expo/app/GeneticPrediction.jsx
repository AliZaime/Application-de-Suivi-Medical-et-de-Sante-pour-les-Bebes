import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import config from "../config";
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
    <LinearGradient colors={["#FFD1DC", "#D0E8FF"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Prédiction de maladie génétique</Text>

        <TextInput style={styles.input} placeholder="Âge du bébé" keyboardType="numeric" onChangeText={(v) => handleChange("age", v)} />

        <Text style={styles.label}>Sexe</Text>
        <Picker selectedValue={form.gender} onValueChange={(v) => handleChange("gender", v)}>
          <Picker.Item label="Garçon" value="0" />
          <Picker.Item label="Fille" value="1" />
        </Picker>

        <Text style={styles.label}>Gènes hérités de la mère</Text>
        <Picker selectedValue={form.genes_mother} onValueChange={(v) => handleChange("genes_mother", v)}>
          <Picker.Item label="Non" value="0" />
          <Picker.Item label="Oui" value="1" />
        </Picker>

        <Text style={styles.label}>Gènes hérités du père</Text>
        <Picker selectedValue={form.inherited_father} onValueChange={(v) => handleChange("inherited_father", v)}>
          <Picker.Item label="Non" value="0" />
          <Picker.Item label="Oui" value="1" />
        </Picker>

        <TextInput style={styles.input} placeholder="Résultat Test 1" keyboardType="numeric" onChangeText={(v) => handleChange("test1", v)} />
        <TextInput style={styles.input} placeholder="Résultat Test 2" keyboardType="numeric" onChangeText={(v) => handleChange("test2", v)} />
        <TextInput style={styles.input} placeholder="Résultat Test 3" keyboardType="numeric" onChangeText={(v) => handleChange("test3", v)} />

        <Text style={styles.label}>Asphyxie à la naissance</Text>
        <Picker selectedValue={form.birth_asphyxia} onValueChange={(v) => handleChange("birth_asphyxia", v)}>
          <Picker.Item label="Non" value="0" />
          <Picker.Item label="Oui" value="1" />
        </Picker>

        <Text style={styles.label}>Résultat du test sanguin</Text>
        <Picker selectedValue={form.blood_test_result} onValueChange={(v) => handleChange("blood_test_result", v)}>
          <Picker.Item label="Normal" value="0" />
          <Picker.Item label="Inconclusif" value="1" />
          <Picker.Item label="Légèrement anormal" value="2" />
          <Picker.Item label="Anormal" value="3" />
        </Picker>

        <Button title="Prédire la maladie génétique" onPress={handleSubmit} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  label: {
    marginTop: 15,
    fontWeight: "bold",
  },
});
