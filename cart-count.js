function updateCartCount() {
    let cart;
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || {};
    } catch {
        cart = {};
    }

    const count = Object.values(cart)
        .reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

window.addEventListener('DOMContentLoaded', updateCartCount);
