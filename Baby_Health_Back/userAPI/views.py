from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView

from django.contrib.auth.models import User  # Assure-toi d'importer depuis auth.models


from rest_framework.response import Response
from django.http import HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth import authenticate



class TestView(APIView):
    def post(self, request, *args, **kwargs):
        return Response({"message": "POST request received"}, status=201)
    def get(self, request,format=None):
        print("API was called")
        return Response({"message": "GET request received"}, status=201)
        

    def put(self, request, *args, **kwargs):
        return Response({"message": "PUT request received"}, status=200)





""" @api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')  # facultatif
    last_name = request.data.get('last_name', '')    # facultatif

    if User.objects.filter(username=username).exists():
        return Response({"error": "Nom d'utilisateur déjà pris"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email déjà utilisé"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    return Response({
        "message": "Utilisateur créé avec succès",
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    }, status=status.HTTP_201_CREATED)

 """

@api_view(['POST'])
def register_user(request):
    username = request.data.get('Username')
    email = request.data.get('Email')
    password = request.data.get('Password')
    first_name = request.data.get('FirstName')
    last_name = request.data.get('LastName')
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Nom d'utilisateur déjà pris"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email déjà utilisé"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    
    return Response({"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        # Récupérer le username via l'email
        user = User.objects.get(email=email)
        user_auth = authenticate(username=user.username, password=password)

        if user_auth is not None:
            return Response({
                "message": "Connexion réussie",
                "username": user.username,
                "email": user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Mot de passe incorrect"}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"error": "Email non trouvé"}, status=status.HTTP_400_BAD_REQUEST)
