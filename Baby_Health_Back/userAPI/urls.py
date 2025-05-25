from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import login_parent,register_parent, get_parent_by_id, add_baby, get_baby_by_id, get_babies_by_parent_id, update_baby
from .views import TestView


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
    
    
]
