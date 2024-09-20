from rest_framework import serializers
from .models import User,Panel,Component

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'is_admin')

class PanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panel
        fields = ('id', 'panelname', 'userid')

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = ('id' , 'compname', 'posx' , 'posy', 'value' ,'panelid')