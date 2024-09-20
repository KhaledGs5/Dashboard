from django.urls import path
from .views import add_user, get_user, update_user, delete_user, verify_pass, get_all_users, get_user_byid, add_project,get_all_panels,delete_panel,add_component,update_component,get_all_comps,delete_component,getData

urlpatterns = [
    path('add/', add_user, name='add_user'),
    path('get/', get_user, name='get_user'),
    path('verf/', verify_pass, name='verify_pass'),
    path('getall/', get_all_users , name='get_all_users'),
    path('getbyid/', get_user_byid, name='get_user_by_id'), 
    path('put/', update_user, name='update_user'),
    path('delete/', delete_user, name='delete_user'),
    path('addproj/', add_project, name='add_project'),
    path('getpanels/', get_all_panels, name='get_all_panels'),
    path('delpanel/', delete_panel, name='delete_panel'),
    path('addcomp/', add_component, name='add_component'),
    path('updatecomp/', update_component, name='update_component'),
    path('getcomps/', get_all_comps, name='get_all_comps'),
    path('delcomp/', delete_component, name='delete_component'),
    path('getdata/', getData, name='getData'),
]
