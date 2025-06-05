import joblib
import pandas as pd
import os

def predict_height(age_months, gender, height_cm):
    # Get the absolute path to the current script's directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define the paths to the model files using the absolute path
    model_path = os.path.join(base_dir, "models", "random_forest_model.joblib")
    scaler_path = os.path.join(base_dir, "models", "height_scaler.joblib")
    encoder_path = os.path.join(base_dir, "models", "gender_encoder.joblib")

    # Debug: Print the paths
    print("Model path:", model_path)
    print("Scaler path:", scaler_path)
    print("Encoder path:", encoder_path)

    # Check if the files exist
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}. Please ensure it exists.")
    if not os.path.exists(scaler_path):
        raise FileNotFoundError(f"Scaler file not found: {scaler_path}. Please ensure it exists.")
    if not os.path.exists(encoder_path):
        raise FileNotFoundError(f"Encoder file not found: {encoder_path}. Please ensure it exists.")

    # Load the objects
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    encoder = joblib.load(encoder_path)

    # Prepare the data
    sample = pd.DataFrame({
        'Age (months)': [age_months],
        'Gender': [encoder.transform([gender])[0]],
        'Height (cm)': [height_cm]
    })
    sample[['Height (cm)']] = scaler.transform(sample[['Height (cm)']])
    
    # Make a prediction
    prediction = model.predict(sample)
    return prediction[0]

# Example usage
if __name__ == "__main__":
    age_months = 204
    gender = 'Male'
    height_cm = 87
    try:
        prediction = predict_height(age_months, gender, height_cm)
        print(f"Prédiction ➜ {prediction}")
    except FileNotFoundError as e:
        print(e)
