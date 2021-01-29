from django.db import models


class Library(models.Model):
    name = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    placeId = models.IntegerField(primary_key=True)
    displayedAddress = models.TextField()


class Author(models.Model):
    name = models.TextField()

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.TextField()
    authors = models.ManyToManyField(Author, related_name="books")
    genre = models.TextField()
    published = models.DateField()
    library = models.ForeignKey(Library, on_delete=models.CASCADE, related_name='books')

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title

    def get_library(self):
        return Library.objects.get(placeId=self.library.placeId)
