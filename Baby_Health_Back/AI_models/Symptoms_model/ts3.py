import joblib
import pandas as pd

class MedicalDiagnosisTester:
    def __init__(self, model_path="medical_diagnosis_model.joblib"):
        """Charge le modèle sauvegardé"""
        saved_data = joblib.load(model_path)
        self.model = saved_data['model']
        self.label_encoders = saved_data['label_encoders']  # Dictionnaire d'encodeurs
        self.columns = saved_data['columns']
        self.symptom_severity = saved_data['symptom_severity']
        self.symptom_description = saved_data['symptom_description']
        self.symptom_precaution = saved_data['symptom_precaution']
    
    def predict_disease(self, symptoms_list):
        """
        Prédit la maladie à partir d'une liste de symptômes
        
        Args:
            symptoms_list: Liste des symptômes (ex: ["itching", "skin_rash"])
        
        Returns:
            Tuple: (maladie prédite, probabilités)
        """
        # Créer un DataFrame vide avec les mêmes colonnes
        input_data = pd.DataFrame(0, index=[0], columns=self.columns)
        
        # Remplir les symptômes fournis
        for i, symptom in enumerate(symptoms_list):
            if i < len(self.columns):
                col_name = self.columns[i]
                try:
                    # Utilise l'encodeur spécifique à cette colonne
                    le = self.label_encoders.get(col_name)
                    if le:
                        # Vérifie d'abord si le symptôme existe dans les classes de l'encodeur
                        if symptom in le.classes_:
                            encoded_symptom = le.transform([symptom])[0]
                            input_data.iloc[0, i] = encoded_symptom
                        else:
                            print(f"Symptôme non reconnu dans cette colonne: {symptom} (colonne: {col_name})")
                            print(f"Symptômes valides pour cette colonne: {list(le.classes_)}")
                except Exception as e:
                    print(f"Erreur lors de l'encodage du symptôme {symptom}: {str(e)}")
        
        # Faire la prédiction
        if not input_data.empty:
            prediction = self.model.predict(input_data)[0]
            probabilities = self.model.predict_proba(input_data)[0]
            return prediction, probabilities
        else:
            return None, None
    
    def get_disease_details(self, disease_name):
        """
        Récupère la description et les précautions pour une maladie
        
        Args:
            disease_name: Nom de la maladie
        
        Returns:
            Dict: {"description": str, "precautions": list}
        """
        details = {}
        
        # Description
        desc = self.symptom_description[self.symptom_description["Disease"] == disease_name]["Description"]
        details["description"] = desc.values[0] if not desc.empty else "No description available"
        
        # Precautions
        prec = self.symptom_precaution[self.symptom_precaution["Disease"] == disease_name]
        if not prec.empty:
            precautions = [prec[f"Precaution_{i}"].values[0] for i in range(1,5) 
                         if pd.notna(prec[f"Precaution_{i}"].values[0])]
            details["precautions"] = precautions
        else:
            details["precautions"] = ["No precautions available"]
        
        return details
    
    def full_diagnosis(self, symptoms_list):
        """
        Effectue un diagnostic complet avec prédiction et détails
        
        Args:
            symptoms_list: Liste des symptômes
        
        Returns:
            Dict: {"prediction": str, "probabilities": array, "details": dict}
        """
        prediction, probabilities = self.predict_disease(symptoms_list)
        if prediction is None:
            return {
                "error": "Impossible de faire une prédiction avec les symptômes fournis",
                "suggestions": "Vérifiez l'orthographe des symptômes ou essayez d'autres symptômes"
            }
        
        details = self.get_disease_details(prediction)
        
        return {
            "prediction": prediction,
            "probabilities": probabilities,
            "details": details
        }

# Exemple d'utilisation
if __name__ == "__main__":
    # Initialiser le tester avec le modèle sauvegardé
    tester = MedicalDiagnosisTester("Application-de-Suivi-Medical-et-de-Sante-pour-les-Bebes\Baby_Health_Back\AI_models\Symptoms_model\medical_diagnosis_model.joblib")
    
    # Faire une prédiction avec des symptômes
    #symptoms = ["itching", "skin_rash", "nodal_skin_eruptions"]
    #symptoms = ["high_fever", "chills", "fatigue", "cough", "headache"]
    #symptoms = ["excessive_hunger", "weight_loss", "fatigue", "polyuria"]
    #symptoms = ["headache", "dizziness", "blurred_vision", "chest_pain"]
    symptoms = ["cough", "high_fever", "weight_loss", "fatigue", "breathlessness"]
    #symptoms = ["high_fever", "headache", "joint_pain", "skin_rash", "vomiting"]
    #symptoms = ["back_pain", "weakness_in_limbs", "joint_pain", "neck_pain"]
    result = tester.full_diagnosis(symptoms)
    
    if "error" in result:
        print(result["error"])
        print(result["suggestions"])
    else:
        # Afficher les résultats
        print("\nRésultats du diagnostic:")
        print(f"Maladie prédite: {result['prediction']}")
        print(f"\nDescription: {result['details']['description']}")
        print("\nPrécautions recommandées:")
        for i, prec in enumerate(result['details']['precautions'], 1):
            print(f"{i}. {prec}")
        
        # Afficher les probabilités pour les 5 premières maladies
        diseases = tester.model.classes_
        top_indices = result['probabilities'].argsort()[::-1][:5]
        print("\nTop 5 des maladies probables:")
        for idx in top_indices:
            print(f"- {diseases[idx]}: {result['probabilities'][idx]:.2%}")