from django.shortcuts import render, redirect, get_object_or_404
from .models import Order, OrderItem
from products.models import Product


def checkout(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        address = request.POST.get('address')
        phone = request.POST.get('phone')

        order = Order.objects.create(
            name=name,
            address=address,
            phone=phone
        )

        cart = request.session.get('cart', {})

        for product_id, quantity in cart.items():
            product = Product.objects.get(id=product_id)

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )

        request.session['cart'] = {}

        return redirect('order_success', order_id=order.id)
    
    return render(request, 'orders/checkout.html')


def order_success(request, order_id):
    return render(request, 'orders/success.html', {
        'order_id': order_id
    })


def order_history(request):
    orders = Order.objects.all().order_by('-created_at')
    return render(request, 'orders/history.html', {
        'orders': orders
    })


def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id)

    items = order.orderitem_set.all()

    total = sum(item.price * item.quantity for item in items)

    return render(request, 'orders/detail.html', {
        'order': order,
        'items': items,
        'total': total
    })