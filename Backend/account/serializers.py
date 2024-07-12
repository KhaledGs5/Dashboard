from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')

{
    "name" : "Ons" ,
    "email" : "ons@example.com",
    "first_name" : "Ons",
    "last_name" : "Mueller",
    "password" : "password123"   
}