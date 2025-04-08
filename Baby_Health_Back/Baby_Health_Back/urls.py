from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('userAPI.urls')),  # 🔥 C’est ce qui permet d’accéder à /api/messages/
]
