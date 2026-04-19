'use strict';

/* =========================================================
   CSRF TOKEN
========================================================= */

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
      }
    });
  }
  return cookieValue;
}


/* =========================================================
   TOAST SAFETY (fallback if missing)
========================================================= */

window.showToast = window.showToast || function (message, type = 'info') {
  const div = document.createElement('div');
  div.className = `alert-toast ${type}`;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
};


/* =========================================================
   ADD TO CART (AJAX)
========================================================= */

document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', async function (e) {
    e.preventDefault();

    const productId = this.dataset.id;
    if (!productId) return;

    try {
      const res = await fetch(`/cart/add/${productId}/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        }
      });

      const data = await res.json();

      if (data.success) {
        showToast('Added to cart', 'success');
      }

    } catch (err) {
      console.log(err);
      showToast('Error adding item', 'error');
    }
  });
});


/* =========================================================
   REMOVE FROM CART (AJAX)
========================================================= */

document.querySelectorAll('.btn-remove').forEach(btn => {
  btn.addEventListener('click', async function (e) {
    e.preventDefault();

    const card = this.closest('.cart-item-card');
    const productId = card?.dataset.id;

    if (!productId) return;

    try {
      const res = await fetch(`/cart/remove/${productId}/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        }
      });

      const data = await res.json();

      if (data.success) {
        card.remove();
        showToast('Item removed from cart', 'info');
        updateCartTotals();
      }

    } catch (err) {
      console.log(err);
      showToast('Error removing item', 'error');
    }
  });
});


/* =========================================================
   QUANTITY UPDATE (UI + AJAX READY)
   (сейчас только UI, backend можно добавить позже)
========================================================= */

document.querySelectorAll('.btn-qty').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    const qtyEl = this.closest('.qty-control')?.querySelector('.qty-value');

    if (!qtyEl) return;

    let current = parseInt(qtyEl.textContent || '0', 10);

    if (this.textContent.trim() === '+') {
      current++;
    } else {
      current = Math.max(0, current - 1);
    }

    qtyEl.textContent = current;
  });
});


/* =========================================================
   CART TOTAL UPDATE
========================================================= */

function updateCartTotals() {
  const items = document.querySelectorAll('.cart-item-card');
  const totalEl = document.querySelector('.cart-total-amount');

  if (!totalEl) return;

  let total = 0;

  items.forEach(card => {
    total += parseFloat(card.dataset.subtotal || '0');
  });

  totalEl.textContent = total.toLocaleString('en-US');
}