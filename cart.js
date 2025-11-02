document.addEventListener('DOMContentLoaded', showCart);

const cartContainer = document.querySelector('.cart-container');
const totalPriceContainer = document.querySelector('.total-price-container');

let cart;

function showCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || {};

    let total = 0;
    let totalNumberOfProducts = 0;

    cartContainer.innerHTML = '';

    for (let id in cart) {
        const book = cart[id];
        cartContainer.innerHTML += `
        <div class="card-cart">
            <img src="${book.image || 'https://via.placeholder.com/50'}" alt="Book image">
            <span class="cart-item-name">${book.name}</span>
            <span class="cart-item-author">Autor: ${book.author}</span>
            <span class="cart-item-price">Pret unitar: ${book.price} lei</span>
            <div class="cart-item-quantity">
                <button class="decrease" data-id="${id}">-</button>
                <span>${book.quantity}</span>
                <button class="increase" data-id="${id}">+</button>
            </div>
            <span class="cart-item-total">Total: ${(book.price * book.quantity).toFixed(2)} lei</span>
            <button data-id="${id}" class="delete"><i class="fa-solid fa-trash"></i> Sterge</button>
        </div>
        `;
        total += book.price * book.quantity;
        totalNumberOfProducts += book.quantity;
    }

    totalPriceContainer.innerHTML =
        total === 0
            ? 'Cosul de cumparaturi este gol'
            : `Total: ${total.toFixed(2)} lei`;

    cartCountContainer.innerHTML = totalNumberOfProducts;
    if (typeof updateCartCount === 'function') updateCartCount();
}

cartContainer.addEventListener('click', (e) => {
    const btn = e.target;
    const id = btn.dataset.id;
    if (!id) return;

    if (btn.classList.contains('increase')) {
        cart[id].quantity++;
    } else if (btn.classList.contains('decrease')) {
        if (cart[id].quantity > 1) {
            cart[id].quantity--;
        }
    } else if (btn.classList.contains('delete')) {
        delete cart[id];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    showCart();
});