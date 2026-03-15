from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_api, name='test_api'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('generate/', views.GenerateView.as_view(), name='generate'),
    path('history/', views.HistoryView.as_view(), name='history'),
    path('delete/<int:generation_id>/', views.DeleteGenerationView.as_view(), name='delete_generation'),
]