from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, blank=True)
    password = models.CharField(max_length=30, blank=True)
    confirmpassword = models.CharField(max_length=100 , blank=False)

    def __str__(self):
        return self.email
