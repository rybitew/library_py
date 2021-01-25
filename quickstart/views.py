from django.contrib.auth.models import User, Group
from django.shortcuts import redirect
from rest_framework import permissions
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from quickstart.serializers import UserSerializer, GroupSerializer


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
