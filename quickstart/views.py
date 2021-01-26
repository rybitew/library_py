from django.contrib.auth.models import User, Group
from django.db import IntegrityError
from django.shortcuts import redirect
from rest_framework import permissions
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from quickstart.models import Book
from quickstart.serializers import UserSerializer, GroupSerializer, BookReadSerializer


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


class BookViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Book.objects.all()
    serializer_class = BookReadSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def redirect_to_main(request):
    return redirect('http://localhost:4200', permanent=True)


@api_view(['POST'])
def login(request):
    user: User = User.objects.get(username=request.data['username'])
    if user is not None:
        if user.check_password(request.data['password']):
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            return Response(token, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def register(request):
    try:
        user = User.objects.create_user(request.data['username'], request.data['email'], request.data['password'])
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return Response(token, status=status.HTTP_201_CREATED)
    except IntegrityError and KeyError:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
