from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import add_tetee, delete_tetee, get_tetees_by_baby, login_parent,register_parent, get_parent_by_id, add_baby, get_baby_by_id, get_babies_by_parent_id, update_baby, get_appointments_by_parent_id, add_appointment, update_appointment, delete_appointment, update_tetee 
from .views import TestView, add_couche, update_couche, delete_couche, get_couches_by_baby


urlpatterns = [
    path('test', TestView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('user/register/', register_parent, name="register_user"),
    path('user/login_parent/',login_parent,name="login_user"),
    path('parent/<int:parent_id>/', get_parent_by_id, name='get_parent_by_id'),
    path('user/add_baby/', add_baby, name='add_baby'),
    path('user/get_baby_by_id/<int:baby_id>/', get_baby_by_id, name='get_baby_by_id'),
    path('user/get_babies_by_parent_id/<int:parent_id>/', get_babies_by_parent_id, name='get_babies_by_id'),
    path('user/update_baby/', update_baby, name='update_baby'),
    path('user/get_appointments_by_parent_id/<int:parent_id>/', get_appointments_by_parent_id, name='get_appointments_by_parent_id'),
    path('user/add_appointment/', add_appointment, name='add_appointment'),
    path('user/update_appointment/<int:appointment_id>/', update_appointment, name='update_appointment'),
    path('user/delete_appointment/<int:appointment_id>/', delete_appointment, name='delete_appointment'),
    path('couches/', add_couche, name='add_couche'), 
    path('couches/<int:couche_id>/', update_couche, name='update_couche'), 
    path('couches/<int:couche_id>/delete/', delete_couche, name='delete_couche'), 
    path('couches/baby/<int:baby_id>/', get_couches_by_baby, name='get_couches_by_baby'), 
    path('tetees/', add_tetee, name='add_tetee'),
    path('tetees/<int:tetee_id>/', update_tetee, name='update_tetee'), 
    path('tetees/<int:tetee_id>/delete/', delete_tetee, name='delete_tetee'),
    path('tetees/baby/<int:baby_id>/', get_tetees_by_baby, name='get_tetees_by_baby'),
]
