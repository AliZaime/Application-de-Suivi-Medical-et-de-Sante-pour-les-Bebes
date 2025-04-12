from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import register_parent, login_parent
from .views import TestView


urlpatterns = [
    path('test', TestView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('user/register/', register_parent, name="register_user"),
    path('user/auth/',login_parent,name="login_user")
    
]
