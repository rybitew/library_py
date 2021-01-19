from rest_framework import status
from rest_framework.decorators import api_view
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


@api_view(['GET', 'POST', 'UPDATE', 'DELETE'])
def book_service(request: Request):
    if request.method == 'GET':
        title = request.query_params.get('title')
        author = request.query_params.get('author')
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
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if books is not None:
            serializer = BookReadSerializer(books, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response([], status=status.HTTP_200_OK)

    elif request.method == 'POST':
        authors = list(Author.objects.filter(name__in=request.data.get('authors')))
        authorIds = []
        if len(authors) > 0:
            for author in authors:
                authorIds.append(author.id)
        else:
            for name in request.data.get('authors'):
                author = {
                    "name": name,
                    "books": list()
                }
                authors.append(author)
            authorSerializer = AuthorSerializer(data=authors, many=True)
            if authorSerializer.is_valid():
                authorSerializer.save()

                for author in authorSerializer.data:
                    authorIds.append(author.get('id'))
            print('ERROR: book_service', authorSerializer.error_messages)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        book: dict = request.data
        book['authors'] = authorIds

        serializer = BookWriteSerializer(data=book)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        print('ERROR: book_service', serializer.error_messages)
        return Response(status=status.HTTP_400_BAD_REQUEST)
