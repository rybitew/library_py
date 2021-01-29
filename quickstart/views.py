from django.contrib.auth.models import User, Group
from django.db import IntegrityError
from django.shortcuts import redirect
from rest_framework import permissions
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from quickstart.models import Book, Library
from quickstart.serializers import UserSerializer, GroupSerializer, BookReadSerializer, LibrarySerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def redirect_to_main(request):
    return redirect('http://localhost:4200', permanent=True)


@api_view(['POST'])
def login(request):
    try:
        user: User = User.objects.get(username=request.data['username'])
        if user is not None:
            if user.check_password(request.data['password']):
                jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
                jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)
                return Response(token, status=status.HTTP_200_OK)
        return Response("Invalid username or password", status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist or KeyError:
        return Response("Invalid username or password", status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def register(request):
    try:
        user = User.objects.create_user(request.data['username'], request.data['email'], request.data['password'])
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return Response(token, status=status.HTTP_201_CREATED)
    except IntegrityError or KeyError:
        return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def library_location(request):
    return Response(Library.objects.all(), status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_library(request):
    library = request.data
    serializer = LibrarySerializer(data=library)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    print('ERROR: library_location', serializer.error_messages)
    print(serializer.data)
    return Response(status=status.HTTP_400_BAD_REQUEST)