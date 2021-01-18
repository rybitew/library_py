from django.db import models


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

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title
