from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, blank=True)
    password = models.CharField(max_length=200, blank=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.email
    
class Panel(models.Model):
    panelname = models.CharField(max_length=30)
    userid = models.ForeignKey(User, on_delete=models.CASCADE, related_name='panels')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['panelname', 'userid'], name='unique_panel_per_user')
        ]

    def __str__(self):
        return self.panelname
    
class Component(models.Model):
    compname = models.CharField(max_length=30)
    posx = models.IntegerField()
    posy = models.IntegerField()
    value = models.IntegerField()
    panelid = models.ForeignKey(Panel, on_delete=models.CASCADE, related_name='components')

    def __str__(self):
        return self.compname
