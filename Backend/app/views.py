from threading import Thread
import time
from rest_framework.decorators import api_view
from .serializers import UserSerializer,PanelSerializer,ComponentSerializer
from .models import User,Panel,Component
from rest_framework.response import Response
from rest_framework import status 
from django.contrib.auth.hashers import make_password, check_password
import paho.mqtt.client as paho

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
    
@api_view(['POST'])
def add_project(request):
    if request.method == 'POST':
        paneldata = request.data   
        serializer = PanelSerializer(data=paneldata)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_component(request):
    if request.method == 'POST':
        compData = request.data
        serializer = ComponentSerializer(data=compData)
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
        
@api_view(['GET'])
def verify_pass(request):
    if request.method == 'GET':
        userid = request.query_params.get('userid')
        password = request.query_params.get('password')
        print(userid)
        if not userid or not password:
            return Response({"error": "Both userid and password parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=userid)
            if check_password(password, user.password):
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Failed to find user"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def get_all_users(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def get_user_byid(request):
    if request.method == 'GET':
        userid = request.query_params.get('userid')

        user = User.objects.get(id = userid)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    
@api_view(['GET'])
def get_all_panels(request):
    if request.method == 'GET':
        userid = request.GET.get('userid')
        panels = Panel.objects.filter(userid=userid)
        serializer = PanelSerializer(panels, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def get_all_comps(request):
    if request.method == 'GET':
        panelid = request.GET.get('panelid')
        comps = Component.objects.filter(panelid=panelid)
        serializer = ComponentSerializer(comps, many=True)
        return Response(serializer.data)


mqtt_message = None
def on_message(client, userdata, message):
    global mqtt_message
    mqtt_message = message.payload.decode()
    print(f"Received message: {mqtt_message} on topic {message.topic} with QoS {message.qos}")

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe("test/status", qos=0)

def start_mqtt_listener():
    client = paho.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect("localhost", 1883, 60)
    client.loop_forever()

mqtt_thread = Thread(target=start_mqtt_listener)
mqtt_thread.daemon = True 
mqtt_thread.start()

@api_view(['GET'])
def getData(request):
    global mqtt_message
    
    if mqtt_message is not None:
        return Response({'message': mqtt_message}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'No message available'})
    
@api_view(['PUT'])
def update_user(request):
    if request.method == 'PUT':
        userid = request.data['userid']
        data = request.data.copy()
        
        password = request.data.get('password')
        if password:
            data['password'] = make_password(password)

        if not userid:
            return Response({"detail": "ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=userid)
            serializer = UserSerializer(user, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['PUT'])
def update_component(request):
    if request.method == 'PUT':
        compid = request.data['compid']

        if not compid:
            return Response({"detail": "ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            comp = Component.objects.get(id=compid)
            serializer = ComponentSerializer(comp, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['DELETE'])
def delete_user(request):
    if request.method == 'DELETE':
        userid = request.query_params.get('userid')  
        print(userid)
        if not userid:
            return Response({"detail": "User ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=userid)
            user.delete()
            return Response({"detail": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['DELETE'])
def delete_panel(request):
    if request.method == 'DELETE':
        panelid = request.query_params.get('panelid')  

        if not panelid:
            return Response({"detail": "Panel ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            panel = Panel.objects.get(id=panelid)
            panel.delete()
            return Response({"detail": "Panel deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"detail": "Panel not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['DELETE'])
def delete_component(request):
    if request.method == 'DELETE':
        compid = request.query_params.get('compid')  

        if not compid:
            return Response({"detail": "Panel ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            comp = Component.objects.get(id=compid)
            comp.delete()
            return Response({"detail": "Component deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"detail": "Component not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)