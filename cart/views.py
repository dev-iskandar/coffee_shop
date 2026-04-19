from django.shortcuts import render
from django.shortcuts import redirect, get_object_or_404
from products.models import Product
from django.http import JsonResponse


def add_to_cart(request, product_id):
    cart = request.session.get('cart', {})

    product_id = str(product_id)
    cart[product_id] = cart.get(product_id, 0) + 1

    request.session['cart'] = cart
    request.session.modified = True

    return JsonResponse({
        'success': True,
        "product_id": product_id,
        "quantity": cart[product_id]
    })


def cart_detail(request):
    cart = request.session.get('cart', {})

    products = []
    total = 0

    for product_id, quantity in cart.items():
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            continue

        item_total = product.price * quantity
        total += item_total

        products.append({
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'quantity': quantity,
            'total_price': product.price * quantity
        })

    return render(request, 'cart/cart_detail.html', {
        'products': products,
        'total': total
    })


def decrease_quantity(request, product_id):
    cart = request.session.get('cart', {})

    product_id = str(product_id)

    if product_id in cart:
        cart[product_id] -= 1

        if cart[product_id] <= 0:
            del cart[product_id]

    request.session['cart'] = cart
    return redirect('cart_detail')


def remove_from_cart(request, product_id):
    cart = request.session.get('cart', {})

    product_id = str(product_id)

    if product_id in cart:
        del cart[product_id]

    request.session['cart'] = cart
    request.session.modified = True

    return JsonResponse({
        "success": True,
        "product_id": product_id
    })