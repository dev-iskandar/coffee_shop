from django.urls import path
from .views import checkout, order_success, order_history, order_detail

urlpatterns = [
    path('', checkout, name='checkout'),
    path('success/<int:order_id>/', order_success, name='order_success'),  
    path('history/', order_history, name='order_history'),  
    path('<int:order_id>/', order_detail, name='order_detail'),
]