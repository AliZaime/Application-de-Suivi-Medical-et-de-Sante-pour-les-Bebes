from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView

from django.contrib.auth.models import User  # Assure-toi d'importer depuis auth.models
from rest_framework_simplejwt.tokens import RefreshToken

import jwt
from datetime import datetime, timedelta
from django.conf import settings  

from rest_framework.response import Response
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import ParentSerializer, BabySerializer, AppointmentSerializer, CoucheSerializer, TemperatureSerializer, TeteeSerializer, AdviceSerializer
from .models import Parent,Baby, Appointment, Couche, Temperature, Tetee, advice
from .serializers import BiberonSerializer, ParentSerializer, BabySerializer, AppointmentSerializer, CoucheSerializer, SolidesSerializer, SommeilSerializer, TeteeSerializer,BabyTrackingSerializer
from .models import Biberon, Parent,Baby, Appointment, Couche, Solides, Sommeil, Tetee,BabyTracking
from django.contrib.auth import authenticate

from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from django.contrib.auth.hashers import check_password


##############
import os
import numpy as np
import librosa
import tensorflow as tf
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.conf import settings
from tensorflow.keras.layers import InputLayer
from keras.layers import TFSMLayer



class TestView(APIView):
    def post(self, request, *args, **kwargs):
        return Response({"message": "POST request received"}, status=201)
    def get(self, request,format=None):
        print("API was called")
        return Response({"message": "GET request received"}, status=201)
        

    def put(self, request, *args, **kwargs):
        return Response({"message": "PUT request received"}, status=200)


@api_view(['POST'])
def register_parent(request):
    serializer = ParentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # ✅ Ne touche pas au mot de passe ici
        return Response({'message': 'Parent créé avec succès'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_parent(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        parent = Parent.objects.get(email=email)
        if check_password(password, parent.password):
            # 🔐 Créer un token JWT manuellement
            payload = {
                'parent_id': parent.parent_id,
                'exp': datetime.utcnow() + timedelta(days=1),
                'iat': datetime.utcnow()
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            
            serializer = ParentSerializer(parent)
            return Response({
                'message': 'Connexion réussie',
                'token': token,
                'parent_id': parent.parent_id,
                'parent': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Mot de passe incorrect'}, status=400)
    except Parent.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, status=400)



@api_view(['GET'])
def get_parent_by_id(request, parent_id):
    try:
        parent = Parent.objects.get(parent_id=parent_id)
        serializer = ParentSerializer(parent)
        return Response(serializer.data)
    except Parent.DoesNotExist:
        return Response({'error': 'Parent non trouvé'}, status=500)

@api_view(['POST'])
def add_baby(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({'error': 'Token manquant ou invalide'}, status=401)

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        parent_id = payload['parent_id']
        parent = Parent.objects.get(parent_id=payload['parent_id'])

        data = request.data.copy()
        data['parent'] = parent.parent_id
        print("Données reçues :", request.data)
        serializer = BabySerializer(data=data)
        if serializer.is_valid():
            baby = serializer.save()
            return Response({
                'message': 'Bébé créé avec succès',
                'baby': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except jwt.ExpiredSignatureError:
        return Response({'error': 'Token expiré'}, status=401)
    except jwt.InvalidTokenError:
        return Response({'error': 'Token invalide'}, status=401)
    except Parent.DoesNotExist:
        return Response({'error': 'Parent introuvable'}, status=404)


@api_view(['GET'])
def get_baby_by_id(request, baby_id):
    try:
        baby = Baby.objects.get(baby_id=baby_id)
        serializer = BabySerializer(baby)
        return Response(serializer.data)
    except Baby.DoesNotExist:
        return Response({'error': 'Bébé non trouvé'}, status=500)
    
@api_view(['GET'])
def get_babies_by_parent_id(request, parent_id):
    try:
        parent = Parent.objects.get(parent_id=parent_id)
        babies = parent.babies.all()
        serializer = BabySerializer(babies, many=True)
        return Response(serializer.data)
    except Parent.DoesNotExist:
        return Response({'error': 'Parent non trouvé'}, status=500)

@api_view(['POST'])
def update_baby(request, baby_id):
    try:
        baby = Baby.objects.get(baby_id=baby_id)
        serializer = BabySerializer(baby, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Baby.DoesNotExist:
        return Response({'error': 'Bébé non trouvé'}, status=500)




@api_view(['GET'])
def get_appointments_by_parent_id(request, parent_id):
    try:
        parent = Parent.objects.get(parent_id=parent_id)
        appointments = parent.appointments.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    except Parent.DoesNotExist:
        return Response({'error': 'Parent non trouvé'}, status=500)

@api_view(['POST'])
def add_appointment(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        print("Authorization header missing or invalid")  # Log missing or invalid header
        return Response({'error': 'Token manquant ou invalide'}, status=401)

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        parent_id = payload['parent_id']
        print(f"Decoded token payload: {payload}")  # Log decoded token payload
        parent = Parent.objects.get(parent_id=parent_id)

        data = request.data.copy()
        data['parent'] = parent.parent_id
        serializer = AppointmentSerializer(data=data)
        if serializer.is_valid():
            appointment = serializer.save()
            return Response({
                'message': 'Rendez-vous créé avec succès',
                'appointment': serializer.data
            }, status=status.HTTP_201_CREATED)
        print(f"Serializer errors: {serializer.errors}")  # Log serializer errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except jwt.ExpiredSignatureError:
        print("Token expired")  # Log token expiration
        return Response({'error': 'Token expiré'}, status=401)
    except jwt.InvalidTokenError:
        print("Invalid token")  # Log invalid token
        return Response({'error': 'Token invalide'}, status=401)
    except Parent.DoesNotExist:
        print("Parent not found")  # Log missing parent
        return Response({'error': 'Parent introuvable'}, status=404)

@api_view(['POST', 'PUT'])
def update_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(appointment_id=appointment_id)
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Appointment.DoesNotExist:
        return Response({'error': 'Rendez-vous non trouvé'}, status=500)

@api_view(['DELETE'])
def delete_appointment(request, appointment_id):
    try:
        # Retrieve the appointment by ID
        appointment = Appointment.objects.get(appointment_id=appointment_id)
        appointment.delete()  # Delete the appointment
        return Response({'message': 'Rendez-vous supprimé avec succès'}, status=status.HTTP_200_OK)
    except Appointment.DoesNotExist:
        # Handle case where appointment does not exist
        return Response({'error': 'Rendez-vous introuvable'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log unexpected errors
        print(f"Unexpected error: {e}")
        return Response({'error': 'Erreur interne du serveur'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_couche(request):
    serializer = CoucheSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Couche ajoutée avec succès', 'couche': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_couche(request, couche_id):
    try:
        couche = Couche.objects.get(id=couche_id)
        serializer = CoucheSerializer(couche, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Couche modifiée avec succès', 'couche': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Couche.DoesNotExist:
        return Response({'error': 'Couche non trouvée'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_couche(request, couche_id):
    try:
        couche = Couche.objects.get(id=couche_id)
        couche.delete()
        return Response({'message': 'Couche supprimée avec succès'}, status=status.HTTP_200_OK)
    except Couche.DoesNotExist:
        return Response({'error': 'Couche non trouvée'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_couches_by_baby(request, baby_id):
    couches = Couche.objects.filter(baby_id=baby_id).order_by('-date', '-heure')
    serializer = CoucheSerializer(couches, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_tetee(request):
    serializer = TeteeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Tétée ajoutée avec succès', 'tetee': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_tetees_by_baby(request, baby_id):
    tetees = Tetee.objects.filter(baby_id=baby_id).order_by('-date', '-heure')
    if not tetees.exists():
        return Response({'message': 'Aucune tétée trouvée pour ce bébé.', 'data': []}, status=status.HTTP_200_OK)
    serializer = TeteeSerializer(tetees, many=True)
    return Response({'message': 'Tétées récupérées avec succès.', 'data': serializer.data}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_tetee(request, tetee_id):
    try:
        tetee = Tetee.objects.get(id=tetee_id)
        serializer = TeteeSerializer(tetee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Tétée modifiée avec succès', 'tetee': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Tetee.DoesNotExist:
        return Response({'error': 'Tétée non trouvée'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_tetee(request, tetee_id):
    try:
        tetee = Tetee.objects.get(id=tetee_id)
        tetee.delete()
        return Response({'message': 'Tétée supprimée avec succès'}, status=status.HTTP_200_OK)
    except Tetee.DoesNotExist:
        return Response({'error': 'Tétée non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_tetees_by_baby(request, baby_id):
    print(f"baby_id reçu : {baby_id}")  # Log pour vérifier l'ID reçu
    tetees = Tetee.objects.filter(baby_id=baby_id).order_by('-date', '-heure')
    if not tetees.exists():
        print("Aucune tétée trouvée.")  # Log si aucune tétée n'est trouvée
        return Response({'message': 'Aucune tétée trouvée pour ce bébé.', 'data': []}, status=status.HTTP_200_OK)
    serializer = TeteeSerializer(tetees, many=True)
    print(f"Tétées trouvées : {serializer.data}")  # Log les données trouvées
    return Response({'message': 'Tétées récupérées avec succès.', 'data': serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_advice(request):
    advice_list = advice.objects.all()
    serializer = AdviceSerializer(advice_list, many=True)
    return Response(serializer.data)
@api_view(['GET'])
def get_advice_by_category(request, category_name):
    try:
        advice_list = advice.objects.filter(cattegory=category_name)
        if not advice_list.exists():
            return Response({'message': 'Aucun avis trouvé pour cette catégorie.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AdviceSerializer(advice_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_children_schedules(request, parent_id):
    try:
        babies = Baby.objects.filter(parent_id=parent_id)  # Filter babies by parent_id
        schedules = []
        for baby in babies:
            couches = Couche.objects.filter(baby=baby).order_by('-date', '-heure')[:1]
            tetees = Tetee.objects.filter(baby=baby).order_by('-date', '-heure')[:1]

            schedule = {
                'name': baby.name,
                'gender': baby.gender,
                'schedules': [
                    {
                        'text': f"Last feed - {tetees[0].temps_passe} mins" if tetees else "No feed data",
                        'subText': 'Enter feed'
                    },
                    {
                        'text': f"Last diaper - {couches[0].type}" if couches else "No diaper data",
                        'subText': 'Enter diaper'
                    },
                ]
            }
            schedules.append(schedule)
        return Response({'childrenSchedules': schedules}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])   
def get_tracking_by_baby_id(request, baby_id):
    try:
        trackings = BabyTracking.objects.filter(baby__baby_id=baby_id).order_by('-date_recorded')
        serializer = BabyTrackingSerializer(trackings, many=True)
        return Response(serializer.data)
    except:
        return Response({"error": "Erreur lors du chargement"}, status=500)
    
@api_view(['POST'])
def add_biberon(request):
    serializer = BiberonSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Biberon ajouté avec succès', 'biberon': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_biberons_by_baby(request, baby_id):
    biberons = Biberon.objects.filter(baby_id=baby_id).order_by('-date', '-heure')
    serializer = BiberonSerializer(biberons, many=True)
    return Response({'message': 'Biberons récupérés avec succès.', 'data': serializer.data}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_biberon(request, biberon_id):
    try:
        biberon = Biberon.objects.get(id=biberon_id)
        serializer = BiberonSerializer(biberon, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Biberon modifié avec succès', 'biberon': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Biberon.DoesNotExist:
        return Response({'error': 'Biberon non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def delete_biberon(request, biberon_id):
    try:
        biberon = Biberon.objects.get(id=biberon_id)
        biberon.delete()
        return Response({'message': 'Biberon supprimé avec succès'}, status=status.HTTP_200_OK)
    except Biberon.DoesNotExist:
        return Response({'error': 'Biberon non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def add_solide(request):
    serializer = SolidesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Solide ajouté avec succès', 'solide': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_solides_by_baby(request, baby_id):
    solides = Solides.objects.filter(baby_id=baby_id).order_by('-date', '-heure')
    serializer = SolidesSerializer(solides, many=True)
    return Response({'message': 'Solides récupérés avec succès.', 'data': serializer.data}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_solide(request, solide_id):
    try:
        solide = Solides.objects.get(id=solide_id)
        serializer = SolidesSerializer(solide, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Solide modifié avec succès', 'solide': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Solides.DoesNotExist:
        return Response({'error': 'Solide non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def delete_solide(request, solide_id):
    try:
        solide = Solides.objects.get(id=solide_id)
        solide.delete()
        return Response({'message': 'Solide supprimé avec succès'}, status=status.HTTP_200_OK)
    except Solides.DoesNotExist:
        return Response({'error': 'Solide non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def add_sommeil(request):
    serializer = SommeilSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Sommeil ajouté avec succès', 'sommeils': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_sommeil(request, sommeil_id):
    try:
        sommeil = Sommeil.objects.get(id=sommeil_id)
        serializer = SommeilSerializer(sommeil, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Sommeil modifié avec succès', 'sommeils': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Sommeil.DoesNotExist:
        return Response({'error': 'Sommeil non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def delete_sommeil(request, sommeil_id):
    try:
        sommeil = Sommeil.objects.get(id=sommeil_id)
        sommeil.delete()
        return Response({'message': 'Sommeil supprimé avec succès'}, status=status.HTTP_200_OK)
    except Sommeil.DoesNotExist:
        return Response({'error': 'Sommeil non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_sommeils_by_baby(request, baby_id):
    sommeils = Sommeil.objects.filter(baby_id=baby_id).order_by('-dateDebut')
    serializer = SommeilSerializer(sommeils, many=True)
    return Response({'message': 'Sommeils récupérés avec succès.', 'data': serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_tracking(request):
    # Vérification du token JWT
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({'error': 'Token manquant ou invalide'}, status=401)

    token = auth_header.split(" ")[1]
    try:
        jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({'error': 'Token expiré'}, status=401)
    except jwt.InvalidTokenError:
        return Response({'error': 'Token invalide'}, status=401)

    # Création du tracking
    data = request.data
    serializer = BabyTrackingSerializer(data=data)
    
    if serializer.is_valid():
        tracking = serializer.save()
        return Response({
            'message': 'Mesure enregistrée avec succès',
            'tracking': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def save_expo_token(request):
    token = request.data.get('token')
    parent_id = request.data.get('parent_id')

    if not token or not parent_id:
        return Response({'error': 'Token ou ID manquant'}, status=400)

    try:
        parent = Parent.objects.get(parent_id=parent_id)
        parent.expo_token = token
        parent.save()
        return Response({'message': 'Token enregistré avec succès'})
    except Parent.DoesNotExist:
        return Response({'error': 'Parent non trouvé'}, status=404)
    
@api_view(['POST'])
def add_temperature(request):
    serializer = TemperatureSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Température ajoutée avec succès', 'temperature': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_temperatures_by_baby(request, baby_id):
    temperatures = Temperature.objects.filter(baby_id=baby_id).order_by('-date', '-heure')
    serializer = TemperatureSerializer(temperatures, many=True)
    return Response({'message': 'Températures récupérées avec succès.', 'data': serializer.data}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_temperature(request, temperature_id):
    try:
        temperature = Temperature.objects.get(id=temperature_id)
        serializer = TemperatureSerializer(temperature, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Température modifiée avec succès', 'temperature': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Temperature.DoesNotExist:
        return Response({'error': 'Température non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def delete_temperature(request, temperature_id):
    try:
        temperature = Temperature.objects.get(id=temperature_id)
        temperature.delete()
        return Response({'message': 'Température supprimée avec succès'}, status=status.HTTP_200_OK)
    except Temperature.DoesNotExist:
        return Response({'error': 'Température non trouvée'}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['POST'])
def detect_cry(request):
    file = request.FILES.get("audio")
    if not file:
        return Response({"error": "Aucun fichier audio reçu"}, status=400)

    try:
        # Prétraitement audio
        y, sr = librosa.load(file, sr=22050)
        S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
        S_dB = librosa.power_to_db(S, ref=np.max)

        if S_dB.shape[1] < 44:
            S_dB = np.pad(S_dB, ((0, 0), (0, 44 - S_dB.shape[1])), mode='constant')
        else:
            S_dB = S_dB[:, :44]

        input_tensor = np.expand_dims(S_dB, axis=(0, -1))  # (1, 128, 44, 1)
        print(f"input_tensor shape: {input_tensor.shape}")

        # Charger le modèle Keras
        model_path = r"C:\Users\Y.STORE\OneDrive\Bureau\Application-de-Suivi-Medical-et-de-Sante-pour-les-Bebes\Baby_Health_Back\mstc_baby_cry_model"
        model = tf.keras.Sequential([
            TFSMLayer(model_path, call_endpoint='serve')
        ])

        print("Modèle chargé avec succès")

        # Labels avec suffixe _augmented
        labels = [
            'belly_pain_augmented',
            'burping_augmented',
            'discomfort_augmented',
            'hungry_augmented',
            'tired_augmented'
        ]

        label_map = {
            'belly_pain_augmented': "Douleur au ventre",
            'burping_augmented': "Besoin de roter",
            'discomfort_augmented': "Inconfort",
            'hungry_augmented': "Faim",
            'tired_augmented': "Fatigue"
        }

        prediction = model.predict(input_tensor)
        print(f"prediction raw: {prediction}")

        pred_index = int(np.argmax(prediction))
        pred_label = labels[pred_index]
        confidence = float(np.max(prediction))

        return Response({
            "prediction": pred_label,
            "label": label_map.get(pred_label, pred_label),
            "confidence": confidence
        })

    except Exception as e:
        print(f"Erreur dans detect_cry: {e}")
        return Response({"error": "Erreur interne du serveur"}, status=500)
