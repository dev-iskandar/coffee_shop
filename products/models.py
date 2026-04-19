from django.db import models
from cloudinary.models import CloudinaryField


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    

class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        null=True,
        blank=True
    )

    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, max_length=150)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_name = models.CharField(max_length=150, default='no-image.jpg')
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    image = CloudinaryField('image')

    def __str__(self):
        return self.name