from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView

from django.contrib.auth.models import User  # Assure-toi d'importer depuis auth.models


from rest_framework.response import Response
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import ParentSerializer, BabySerializer
from django.contrib.auth import authenticate

from django.contrib.auth import authenticate



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
    serializer = ParentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Parent créé avec succès'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_parent(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        parent = Parent.objects.get(email=email)
        if check_password(password, parent.password):  # vérification du hash
            serializer = ParentSerializer(parent)
            return Response({
                'message': 'Connexion réussie',
                'parent_id': parent.parent_id,  # 👈 ici l'id
                'parent': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    except Parent.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_400_BAD_REQUEST)


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
    serializer = BabySerializer(data=request.data)
    if serializer.is_valid():
        baby = serializer.save()
        return Response({
            'message': 'Bébé créé avec succès',
            'baby': BabySerializer(baby).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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



