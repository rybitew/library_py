from django.db.models import QuerySet
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from quickstart.models import Book, Author
from quickstart.serializers import BookWriteSerializer, BookReadSerializer, AuthorSerializer


@api_view(['GET'])
def get_all(request):
    books = Book.objects.all()
    if books is not None:
        serializer = BookWriteSerializer(books, many=True)
        return Response(serializer.data)
    return Response()


def delete_authors(authors):
    for author in authors:
        if author.books.all().count() < 2:
            author.delete()


@api_view(['GET'])
def book_get(request: Request):
    title = request.query_params.get('title')
    author = request.query_params.get('author')
    id = request.query_params.get('id')
    if title is not None and author is not None:
        books = list(Book.objects.raw('SELECT b.* FROM quickstart_book b '
                                      'JOIN quickstart_book_authors ba ON b.id = ba.book_id '
                                      'JOIN quickstart_author a ON a.id = ba.author_id '
                                      'WHERE b.title = %s COLLATE NOCASE AND a.name = %s COLLATE NOCASE',
                                      [title, author]))
    elif title is not None:
        books = list(Book.objects.filter(title=title))
    elif author is not None:
        books = list(Book.objects.raw('SELECT b.* FROM quickstart_book b '
                                      'JOIN quickstart_book_authors ba ON b.id = ba.book_id '
                                      'JOIN quickstart_author a ON a.id = ba.author_id '
                                      'WHERE a.name = %s COLLATE NOCASE',
                                      [author]))
    elif id is not None:
        books = [Book.objects.get(id=id)]
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    if books is not None:
        serializer = BookReadSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response([], status=status.HTTP_200_OK)


@api_view(['POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def book_mgmt(request: Request):
    if request.method == 'POST' or request.method == 'PUT':
        authors = list(Author.objects.filter(name__in=request.data.get('authors')))
        authorIds = []
        if len(authors) > 0:
            for author in authors:
                authorIds.append(author.id)
        else:
            for name in request.data.get('authors'):
                author = {
                    "name": name,
                    "books": []
                }
                authors.append(author)
            authorSerializer = AuthorSerializer(data=authors, many=True)
            if authorSerializer.is_valid():
                authorSerializer.save()

                for author in authorSerializer.data:
                    authorIds.append(author.get('id'))
            else:
                print('ERROR: book_service', authorSerializer.error_messages)
                print(authorSerializer.data)
                return Response(status=status.HTTP_400_BAD_REQUEST)

        bookData: dict = request.data
        bookData['authors'] = authorIds
        bookData['published'] = bookData['published'].split('T')[0]
        if request.method == 'POST':

            serializer = BookWriteSerializer(data=bookData)

            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_201_CREATED)

            print('ERROR: book_service', serializer.error_messages)
            print(serializer.data)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            book = Book.objects.get(id=bookData['id'])
            bookData.pop('id')
            oldAuthors: QuerySet = book.authors.exclude(id__in=authorIds)

            serializer = BookWriteSerializer(instance=book, data=bookData)
            if serializer.is_valid():
                serializer.save()
                delete_authors(oldAuthors)
                return Response(status=status.HTTP_200_OK)
            print('ERROR: book_service', serializer.error_messages)
            print(serializer.data)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        bookId = request.query_params.get('id')
        try:
            bookData: Book = Book.objects.get(id=bookId)
            authors = bookData.authors.all()

            delete_authors(authors)
            bookData.delete()
        except Book.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)