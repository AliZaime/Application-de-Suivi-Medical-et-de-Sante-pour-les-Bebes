from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView

from django.contrib.auth.models import User  # Assure-toi d'importer depuis auth.models
from rest_framework_simplejwt.tokens import RefreshToken


from rest_framework.response import Response
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import ParentSerializer, BabySerializer
from django.contrib.auth import authenticate

from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes



from django.contrib.auth.hashers import check_password
from .models import Parent,Baby


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
    name = request.data.get('name')
    email = request.data.get('email')
    password = request.data.get('password')
    phone = request.data.get('phone')
    notification_preferences = request.data.get('notification_preferences')

    if User.objects.filter(username=email).exists():
        return Response({'error': 'Utilisateur déjà existant'}, status=400)

    try:
        # 1. Créer l'utilisateur Django
        user = User.objects.create_user(username=email, email=email, password=password)

        # 2. Préparer les données pour le serializer
        parent_data = {
            'user': user.id,  # 🔗 lien vers le User créé
            'name': name,
            'email': email,
            'phone': phone
        }

        serializer = ParentSerializer(data=parent_data)

        if serializer.is_valid():
            parent = serializer.save()

            # 3. Créer le token JWT
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Compte parent créé avec succès',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'parent': serializer.data
            }, status=201)

        else:
            user.delete()  # rollback si erreur dans le serializer
            return Response(serializer.errors, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def login_parent(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user is not None:
        try:
            # récupérer le parent lié à ce user
            parent = Parent.objects.get(user=user)
            serializer = ParentSerializer(parent)

            # générer les tokens
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Connexion réussie',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'parent': serializer.data
            }, status=status.HTTP_200_OK)

        except Parent.DoesNotExist:
            return Response({'error': 'Profil parent introuvable'}, status=404)

    return Response({'error': 'Email ou mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def get_parent_by_id(request, parent_id):
    try:
        parent = Parent.objects.get(parent_id=parent_id)
        serializer = ParentSerializer(parent)
        return Response(serializer.data)
    except Parent.DoesNotExist:
        return Response({'error': 'Parent non trouvé'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_baby(request):
    try:
        # 🔐 Récupère le parent associé à l'utilisateur connecté
        parent = Parent.objects.get(user=request.user)

        # 📦 Copie des données et injection automatique du parent
        data = request.data.copy()
        data['parent'] = parent.id

        serializer = BabySerializer(data=data)
        if serializer.is_valid():
            baby = serializer.save()
            return Response({
                'message': 'Bébé créé avec succès',
                'baby': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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



