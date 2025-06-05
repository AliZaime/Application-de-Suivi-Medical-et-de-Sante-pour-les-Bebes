import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Modal, FlatList, Alert, ActivityIndicator,
  ScrollView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import config from '../config'; 

const symptomesList = [
  { label: "Douleur abdominale", value: "abdominal_pain" },
  { label: "Menstruation anormale", value: "abnormal_menstruation" },
  { label: "Acidité", value: "acidity" },
  { label: "Insuffisance hépatique aiguë", value: "acute_liver_failure" },
  { label: "Sensorium altéré", value: "altered_sensorium" },
  { label: "Anxiété", value: "anxiety" },
  { label: "Mal de dos", value: "back_pain" },
  { label: "Douleur au ventre", value: "belly_pain" },
  { label: "Points noirs", value: "blackheads" },
  { label: "Inconfort de la vessie", value: "bladder_discomfort" },
  { label: "Ampoule", value: "blister" },
  { label: "Sang dans les expectorations", value: "blood_in_sputum" },
  { label: "Selles sanglantes", value: "bloody_stool" },
  { label: "Vision floue et déformée", value: "blurred_and_distorted_vision" },
  { label: "Essoufflement", value: "breathlessness" },
  { label: "Ongles cassants", value: "brittle_nails" },
  { label: "Ecchymoses", value: "bruising" },
  { label: "Brûlure à la miction", value: "burning_micturition" },
  { label: "Douleur thoracique", value: "chest_pain" },
  { label: "Frissons", value: "chills" },
  { label: "Mains et pieds froids", value: "cold_hands_and_feets" },
  { label: "Coma", value: "coma" },
  { label: "Congestion", value: "congestion" },
  { label: "Constipation", value: "constipation" },
  { label: "Envie continue d'uriner", value: "continuous_feel_of_urine" },
  { label: "Éternuements continus", value: "continuous_sneezing" },
  { label: "Toux", value: "cough" },
  { label: "Crampes", value: "cramps" },
  { label: "Urine foncée", value: "dark_urine" },
  { label: "Déshydratation", value: "dehydration" },
  { label: "Dépression", value: "depression" },
  { label: "Diarrhée", value: "diarrhoea" },
  { label: "Taches décolorées", value: "dischromic_patches" },
  { label: "Distension abdominale", value: "distention_of_abdomen" },
  { label: "Vertiges", value: "dizziness" },
  { label: "Lèvres sèches et picotements", value: "drying_and_tingling_lips" },
  { label: "Thyroïde élargie", value: "enlarged_thyroid" },
  { label: "Faim excessive", value: "excessive_hunger" },
  { label: "Contacts extraconjugaux", value: "extra_marital_contacts" },
  { label: "Antécédents familiaux", value: "family_history" },
  { label: "Rythme cardiaque rapide", value: "fast_heart_rate" },
  { label: "Fatigue", value: "fatigue" },
  { label: "Surcharge liquidienne", value: "fluid_overload" },
  { label: "Urine à mauvaise odeur", value: "foul_smell_of_urine" },
  { label: "Maux de tête", value: "headache" },
  { label: "Fièvre élevée", value: "high_fever" },
  { label: "Douleur à l'articulation de la hanche", value: "hip_joint_pain" },
  { label: "Antécédents d'alcool", value: "history_of_alcohol_consumption" },
  { label: "Appétit accru", value: "increased_appetite" },
  { label: "Indigestion", value: "indigestion" },
  { label: "Ongles enflammés", value: "inflammatory_nails" },
  { label: "Démangeaisons internes", value: "internal_itching" },
  { label: "Taux de sucre irrégulier", value: "irregular_sugar_level" },
  { label: "Irritabilité", value: "irritability" },
  { label: "Irritation anale", value: "irritation_in_anus" },
  { label: "Douleur articulaire", value: "joint_pain" },
  { label: "Douleur au genou", value: "knee_pain" },
  { label: "Manque de concentration", value: "lack_of_concentration" },
  { label: "Léthargie", value: "lethargy" },
  { label: "Perte d'appétit", value: "loss_of_appetite" },
  { label: "Perte d'équilibre", value: "loss_of_balance" },
  { label: "Perte d'odorat", value: "loss_of_smell" },
  { label: "Malaise", value: "malaise" },
  { label: "Fièvre légère", value: "mild_fever" },
  { label: "Sautes d'humeur", value: "mood_swings" },
  { label: "Raideur des mouvements", value: "movement_stiffness" },
  { label: "Expectorations muqueuses", value: "mucoid_sputum" },
  { label: "Douleur musculaire", value: "muscle_pain" },
  { label: "Fonte musculaire", value: "muscle_wasting" },
  { label: "Faiblesse musculaire", value: "muscle_weakness" },
  { label: "Nausée", value: "nausea" },
  { label: "Douleur au cou", value: "neck_pain" },
  { label: "Éruptions cutanées nodulaires", value: "nodal_skin_eruptions" },
  { label: "Obésité", value: "obesity" },
  { label: "Douleur derrière les yeux", value: "pain_behind_the_eyes" },
  { label: "Douleur lors des selles", value: "pain_during_bowel_movements" },
  { label: "Douleur dans la région anale", value: "pain_in_anal_region" },
  { label: "Marche douloureuse", value: "painful_walking" },
  { label: "Palpitations", value: "palpitations" },
  { label: "Gaz", value: "passage_of_gases" },
  { label: "Taches dans la gorge", value: "patches_in_throat" },
  { label: "Mucosités", value: "phlegm" },
  { label: "Urine fréquente", value: "polyuria" },
  { label: "Veines proéminentes sur le mollet", value: "prominent_veins_on_calf" },
  { label: "Visage et yeux gonflés", value: "puffy_face_and_eyes" },
  { label: "Boutons remplis de pus", value: "pus_Filled_pimples" },
  { label: "Transfusions sanguines reçues", value: "receiving_blood_transfusion" },
  { label: "Injections non stériles reçues", value: "receiving_unsterile_injections" },
  { label: "Plaies autour du nez", value: "red_sore_around_nose" },
  { label: "Taches rouges sur le corps", value: "red_spots_over_body" },
  { label: "Rougeur des yeux", value: "redness_of_eyes" },
  { label: "Agitation", value: "restlessness" },
  { label: "Nez qui coule", value: "runny_nose" },
  { label: "Expectorations rouillées", value: "rusty_sputum" },
  { label: "Croûtes", value: "scurring" },
  { label: "Frissons", value: "shivering" },
  { label: "Poussière argentée", value: "silver_like_dusting" },
  { label: "Pression des sinus", value: "sinus_pressure" },
  { label: "Desquamation de la peau", value: "skin_peeling" },
  { label: "Éruption cutanée", value: "skin_rash" },
  { label: "Trouble de la parole", value: "slurred_speech" },
  { label: "Petits creux dans les ongles", value: "small_dents_in_nails" },
  { label: "Vertiges rotatoires", value: "spinning_movements" },
  { label: "Taches d'urine", value: "spotting_urination" },
  { label: "Raideur de la nuque", value: "stiff_neck" },
  { label: "Saignement gastrique", value: "stomach_bleeding" },
  { label: "Douleur à l'estomac", value: "stomach_pain" },
  { label: "Yeux enfoncés", value: "sunken_eyes" },
  { label: "Transpiration", value: "sweating" },
  { label: "Ganglions enflés", value: "swelled_lymph_nodes" },
  { label: "Articulations enflées", value: "swelling_joints" },
  { label: "Gonflement de l'estomac", value: "swelling_of_stomach" },
  { label: "Vaisseaux sanguins enflés", value: "swollen_blood_vessels" },
  { label: "Extrémités gonflées", value: "swollen_extremeties" },
  { label: "Jambes enflées", value: "swollen_legs" },
  { label: "Irritation de la gorge", value: "throat_irritation" },
  { label: "Apparence toxique (typhus)", value: "toxic_look_(typhos)" },
  { label: "Ulcères sur la langue", value: "ulcers_on_tongue" },
  { label: "Instabilité", value: "unsteadiness" },
  { label: "Troubles visuels", value: "visual_disturbances" },
  { label: "Vomissements", value: "vomiting" },
  { label: "Larmoiement", value: "watering_from_eyes" },
  { label: "Faiblesse des membres", value: "weakness_in_limbs" },
  { label: "Faiblesse d'un côté du corps", value: "weakness_of_one_body_side" },
  { label: "Prise de poids", value: "weight_gain" },
  { label: "Perte de poids", value: "weight_loss" },
  { label: "Croûte jaune suintante", value: "yellow_crust_ooze" },
  { label: "Urine jaune", value: "yellow_urine" },
  { label: "Jaunissement des yeux", value: "yellowing_of_eyes" },
  { label: "Peau jaunâtre", value: "yellowish_skin" },
  { label: "Démangeaisons", value: "itching" }
];

const Symptomes = () => {
  const { babyId } = useLocalSearchParams();
  const [symptomes, setSymptomes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [remarque, setRemarque] = useState('');
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [results, setResults] = useState(null);
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(true);
  const [lastPayload, setLastPayload] = useState(null);

  useEffect(() => {
    fetchSymptomes();
  }, []);

  const fetchSymptomes = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/symptomes/baby/${babyId}/`);
      console.log('Symptômes récupérés:', res.data);
      setSymptomes(res.data.data);
    } catch {
      setSymptomes([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setRemarque('');
    setDate(new Date());
    setEditing(null);
    setResults(null);
    setSearch('');
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => prev.includes(symptom)
      ? prev.filter(s => s !== symptom)
      : [...prev, symptom]);
  };

  const filteredSymptomes = useMemo(() =>
    symptomesList.filter(symptome =>
      symptome.label.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const openEdit = (item) => {
    setEditing(item);
    setSelectedSymptoms(item.symptomes);
    setRemarque(item.remarque);
    setDate(new Date(`${item.date}T${item.heure}`));
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmation', 'Supprimer cette entrée ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${config.API_BASE_URL}/api/symptomes/${id}/delete/`, {
              headers: { 'Content-Type': 'application/json' },
            });
            fetchSymptomes();
          } catch (err) {
            console.error('Erreur suppression:', err.response?.data || err.message);
            Alert.alert('Erreur', err.response?.data?.error || 'Échec de la suppression.');
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!selectedSymptoms.length) {
      Alert.alert('Erreur', 'Veuillez sélectionner des symptômes');
      return;
    }
    const payload = {
      baby: parseInt(babyId),
      date: date.toISOString().split('T')[0],
      heure: date.toTimeString().slice(0, 5),
      symptomes: selectedSymptoms,
      remarque,
      predicted_disease: results?.predicted_disease || '',
      description: results?.description || '',
      precautions: results?.precautions || [],
      top_5_diseases: results?.top_5 || [],
    };
    setLastPayload(payload);
    try {
      if (editing) {
        await axios.put(`${config.API_BASE_URL}/api/symptomes/${editing.id}/`, payload);
      } else {
        const res = await axios.post(`${config.API_BASE_URL}/api/symptomes/`, payload);
        setResults(res.data.result);
      }
      setModalVisible(false);
      resetForm();
      fetchSymptomes();
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      Alert.alert('Erreur', "Échec de l'enregistrement");
    }
  };

  const renderItem = ({ item }) => (
  <View style={styles.card}>
  <View style={{ flex: 1 }}>
    <Text style={styles.tempText}>
      📅     {item.date || 'N/A'} à {item.heure || 'N/A'}
    </Text>
    <Text style={styles.causeText}>
      🩺     Symptômes : {Array.isArray(item.symptomes) ? item.symptomes.join(', ') : 'N/A'}
    </Text>
    {item.remarque
      ? <Text style={styles.remarqueText}>📝      {item.remarque}</Text>
      : null}
  </View>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <TouchableOpacity onPress={() => openEdit(item)} style={styles.cardActionBtn}>
      <FontAwesome5 name="edit" size={18} style={styles.cardIcon} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.cardActionBtn}>
      <FontAwesome5 name="trash" size={18} color="#ef4444" />
    </TouchableOpacity>
  </View>
</View>
);

  return (
    <LinearGradient colors={['#ffb6c1', '#f8f6fa', '#a3cef1']} style={styles.gradient}>
      <Text style={styles.title}>Symptômes enregistrés</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#a21caf" />
      ) : (
        <FlatList
          data={symptomes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun symptôme enregistré.</Text>}
        />
      )}

      <TouchableOpacity style={styles.addBtn} onPress={() => { resetForm(); setModalVisible(true); }}>
        <FontAwesome5 name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Modifier' : 'Ajouter'} un symptôme</Text>

            {(!results || !showResults) && (
              <>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                  <Text>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker value={date} mode="date" display="default" onChange={(e, selected) => {
                    setShowDatePicker(false);
                    if (selected) setDate(new Date(selected));
                  }} />
                )}

                <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                  <Text>{date.toTimeString().slice(0, 5)}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker value={date} mode="time" display="default" onChange={(e, selected) => {
                    setShowTimePicker(false);
                    if (selected) {
                      const updated = new Date(date);
                      updated.setHours(selected.getHours(), selected.getMinutes());
                      setDate(updated);
                    }
                  }} />
                )}

                <TextInput
                  placeholder="Rechercher un symptôme"
                  value={search}
                  onChangeText={setSearch}
                  style={styles.input}
                />

                <ScrollView style={{ maxHeight: 150 }}>
                  {filteredSymptomes.map(({ label, value }) => (
                    <TouchableOpacity
                      key={value}
                      style={[styles.symptomBtn, selectedSymptoms.includes(value) && styles.symptomBtnActive]}
                      onPress={() => toggleSymptom(value)}>
                      <Text>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TextInput
                  placeholder="Remarque (optionnel)"
                  value={remarque}
                  onChangeText={setRemarque}
                  multiline
                  style={[styles.input, { height: 60 }]}
                />
              </>
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={async () => {
              if (!selectedSymptoms.length) return Alert.alert("Erreur", "Sélectionnez au moins un symptôme");
              setPredicting(true);
              try {
                const res = await axios.post(`${config.API_BASE_URL}/api/symptomes/predict`, {
                  baby_id: babyId,
                  date: date.toISOString().split('T')[0],
                  heure: date.toTimeString().slice(0, 5),
                  symptomes: selectedSymptoms,
                  remarque
                });
                setResults(res.data);
              } catch {
                Alert.alert("Erreur", "La prédiction a échoué");
              } finally {
                setPredicting(false);
              }
            }}>
              {predicting
                ? <ActivityIndicator color="#fff" />
                : <Text style={{ color: '#fff', fontWeight: 'bold' }}>Prédire</Text>}
            </TouchableOpacity>

            {results && (
              <>
                <TouchableOpacity onPress={() => setShowResults(!showResults)} style={styles.saveBtn}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    {showResults ? 'Masquer les résultats' : 'Afficher les résultats'}
                  </Text>
                </TouchableOpacity>

                {showResults && (
                  <View style={styles.resultsBox}>
                    <Text style={styles.resultText}>Maladie prédite : <Text style={styles.predictedDisease}>{results.predicted_disease}</Text></Text>
                    <Text style={styles.resultSub}>Description :</Text>
                    <Text style={styles.resultContent}>{results.description}</Text>
                    <Text style={styles.resultSub}>Précautions :</Text>
                    <Text style={styles.resultContent}>{results.precautions?.join(', ')}</Text>
                    <Text style={[styles.resultSub, { marginTop: 8 }]}>Top 5 maladies possibles :</Text>
                    {results.top_5?.map((d, i) => (
                      <Text key={i} style={styles.resultItem}>- {d.disease} <Text style={styles.probability}>({d.probability})</Text></Text>
                    ))}
                  </View>
                )}
              </>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editing ? 'Modifier' : 'Ajouter'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#a21caf' }]}
                onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={{ color: '#a21caf', fontWeight: 'bold' }}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1, paddingTop: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#a21caf', textAlign: 'center', marginVertical: 10, marginTop: 80 },
  list: { padding: 16, paddingBottom: 80, minHeight: 100 },
  card: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  borderRadius: 18,
  padding: 16,
  marginBottom: 14,
  borderLeftWidth: 6,
  borderLeftColor: '#a21caf', // couleur personnalisée
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 4,
},
cardActionBtn: {
  marginLeft: 12,
  padding: 8,
  borderRadius: 8,
  backgroundColor: '#f3f4f6',
},
cardIcon: {
  color: '#4b5563',
},

  input: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10,
    marginVertical: 6, backgroundColor: '#f9fafb',
  },
  symptomGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12,
  },
  symptomBtn: {
    padding: 8, borderRadius: 10, backgroundColor: '#f3f4f6', margin: 5,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  symptomBtnActive: {
    backgroundColor: '#fbeffb', borderColor: '#a21caf',
  },
  saveBtn: {
    backgroundColor: '#a21caf', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10,
  },
  modalBg: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 18, padding: 20, width: '90%', elevation: 6,
  },
  modalTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#a21caf', textAlign: 'center', marginBottom: 10,
  },
  tempText: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  causeText: {
    color: 'rgba(11, 121, 22, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  remarqueText: {
    color: '#555',
    fontSize: 13,
    marginTop: 2,
    fontStyle: 'italic',
  },
  addBtn: {
    position: 'absolute', right: 24, bottom: 32, backgroundColor: '#a21caf', borderRadius: 30,
    width: 60, height: 60, alignItems: 'center', justifyContent: 'center', elevation: 6,
  },
  emptyText: {
    textAlign: 'center', color: '#aaa', fontSize: 16, marginTop: 40,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: '600', marginBottom: 6, marginLeft:10
  },
searchInput: {
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 8,
  padding: 10,
  backgroundColor: '#fff',
  marginBottom: 10,
},
symptomLabel: {
  fontSize: 14,
  color: '#111827',
},

resultsBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a21caf',
    marginBottom: 6,
  },
  predictedDisease: {
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  resultSub: {
    fontWeight: '600',
    color: '#111827',
    marginTop: 6,
  },
  resultContent: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  resultItem: {
    fontSize: 14,
    color: '#111827',
    marginVertical: 1,
  },
  probability: {
    color: '#4b5563',
    fontStyle: 'italic',
  },
});

export default Symptomes;
