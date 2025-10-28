document.addEventListener('DOMContentLoaded', showCart);

const cartContainer = document.querySelector('.cart-container');
const totalPriceContainer = document.querySelector('.total-price-container');
const cartCountContainer = document.querySelector('#cart-count');
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
            <img width="50px" src="${book.image || 'https://via.placeholder.com/50'}" alt="Book image">
            <span>${book.name}</span>
            <span>Autor: ${book.author}</span>
            <span>Pret unitar: ${book.price} lei</span>
            <div>
                <button class="decrease" data-id="${id}">-</button>
                <span>${book.quantity}</span>
                <button class="increase" data-id="${id}">+</button>
            </div>
            <span>Total: ${(book.price * book.quantity).toFixed(2)} lei</span>
            <button data-id="${id}" class="delete">Sterge</button>
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
    showCart();
});
