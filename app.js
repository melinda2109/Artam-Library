window.addEventListener('DOMContentLoaded', displayProducts);

const URL = 'https://68fe42d77c700772bb134d84.mockapi.io/books';

function displayProducts() {
    fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network error!');
            }
            return response.json();
        })
        .then((books) => {
            document.querySelector('.products-container').innerHTML = books
                .map(
                    (book) => `
            <div class="product-card">
                <img
                    src="${book.imageURL || 'https://via.placeholder.com/150'}"
                    alt="Book image"
                />
                <div class="product-info">
                    <h3>${book.name}</h3>
                    <div class="author">Autor: ${book.author}</div>
                    <div class="price">${book.price} LEI</div>
                    <div class="buttons">
                        <a href="details.html?id=${book.id}" class="details-btn">Detalii</a>
                        <button data-id=${book.id} class="cart-btn">Adauga in Cos</button>
                    </div>
                </div>
            </div>
            `
                )
                .join('');

            const addToCartButtons = document.querySelectorAll('.cart-btn');
            addToCartButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const book = books.find((b) => b.id === productId);

                    let cart = JSON.parse(localStorage.getItem('cart')) || {};

                    if (cart[productId]) {
                        cart[productId].quantity++;
                    } else {
                        cart[productId] = {
                            quantity: 1,
                            price: book.price,
                            image: book.imageURL,
                            name: book.name,
                            author: book.author,
                        };
                    }

                    localStorage.setItem('cart', JSON.stringify(cart));
                });
            });
        })
        .catch((error) => {
            console.error(error);
            document.querySelector('.products-container').innerHTML = '<p>Eroare la incarcare carti.</p>';
        });
}
