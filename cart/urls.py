from django.urls import path
from .views import add_to_cart, cart_detail
from .views import (
    add_to_cart,
    cart_detail,
    decrease_quantity,
    remove_from_cart
)

urlpatterns = [
    path('add/<int:product_id>/', add_to_cart, name='add_to_cart'),
    path('', cart_detail, name='cart_detail'),
    path('decrease/<int:product_id>/', decrease_quantity, name='decrease_quantity'),
    path('remove/<int:product_id>/', remove_from_cart, name='remove_from_cart'),
]