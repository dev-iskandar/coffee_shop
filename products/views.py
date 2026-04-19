from django.shortcuts import render
from .models import Product, Category

def product_list(request):
    category_slug = request.GET.get('category')

    products = Product.objects.filter(available=True)

    if category_slug and category_slug != 'all':
        products = products.filter(category__slug=category_slug)

    categories = Category.objects.all()

    context = {
        'products': products,
        'categories': categories,
        'active_category': category_slug
    }

    return render(request, 'products/product_list.html', context)