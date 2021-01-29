from django.contrib.auth.models import User, Group
from rest_framework import serializers

from quickstart.models import Book, Author, Library


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class LibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Library
        fields = ['placeId', 'name', 'latitude', 'longitude', 'displayedAddress']


class BookWriteSerializer(serializers.ModelSerializer):
    authors = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all(), many=True)

    class Meta:
        model = Book
        fields = ['title', 'genre', 'published', 'authors', 'library']


class BookReadSerializer(serializers.ModelSerializer):
    authors = serializers.StringRelatedField(many=True, read_only=True)
    library = LibrarySerializer()

    class Meta:
        model = Book
        fields = ['id', 'title', 'genre', 'published', 'authors', 'library']


class AuthorSerializer(serializers.ModelSerializer):
    books = BookWriteSerializer(many=True, read_only=True)

    class Meta:
        model = Author
        fields = ['id', 'name', 'books']
