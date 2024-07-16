from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer
from .models import User
from rest_framework.response import Response
from rest_framework import status 
from django.contrib.auth.hashers import make_password, check_password

@api_view(['POST'])
def add_user(request):
    if request.method == 'POST':
        password = request.data['password']
        hashed_password = make_password(password)
        data = request.data.copy()
        data['password'] = hashed_password
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_user(request):
    if request.method == 'GET':
        email = request.query_params.get('email')
        password = request.query_params.get('password')
        
        if not email or not password:
            return Response({"error": "Both email and password parameters are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Failed to find user"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_user(request):
    email = request.query_params.get('email')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_user(request, id):
    if request.method == 'DELETE':
        try:
            user = User.objects.get(id=id)
            user.delete()
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)