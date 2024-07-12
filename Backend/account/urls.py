from django.urls import path
from .views import add_user, get_user, update_user, delete_user

urlpatterns = [
    path('add/', add_user, name='add_user'),
    path('get/', get_user, name='get_user'),
    path('put/<int:id>/', update_user, name='update_user'),
    path('delete/<int:id>/', delete_user, name='delete_user'),
]
