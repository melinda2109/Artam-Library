const BASE_URL = 'https://68fe42d77c700772bb134d84.mockapi.io/books';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const container = document.querySelector('.details-container');

    if (!id) {
        container.innerHTML = '<p>ID lipsă din URL.</p>';
        return;
    }

    fetch(`${BASE_URL}/${encodeURIComponent(id)}`)
        .then(res => {
            if (!res.ok) throw new Error('Network error');
            return res.json();
        })
        .then(book => {
            // Fallbackuri pentru chei diferite din API
            const image = book.imageURL || book.image || 'https://via.placeholder.com/150';
            const title = book.name || book.title || 'Titlu necunoscut';
            const author = book.author || book.writer || 'Autor necunoscut';
            const category = book.category || book.categorie || 'Categorie necunoscuta';
            const price = book.price ?? book.pret ?? '—';

            container.innerHTML = `
                <div class="book-details-card">
                    <img src="${image}" alt="Book Image">
                    <h2>${title}</h2>
                    <p><strong>Autor:</strong> ${author}</p>
                    <p><strong>Categorie:</strong> ${category}</p>
                    <p><strong>Pret:</strong> ${price} lei</p>
                    <button id="add-to-cart">Adauga in Cos</button>
                </div>
            `;

            document.getElementById('add-to-cart').addEventListener('click', () => {
                const productId = String(book.id || id);
                const cart = JSON.parse(localStorage.getItem('cart')) || {};

                if (cart[productId]) {
                    cart[productId].quantity++;
                } else {
                    cart[productId] = {
                        quantity: 1,
                        price: price,
                        image: image,
                        name: title,
                        author: author,
                    };
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                // optional: notificare scurtă
            });
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p>Eroare la incarcare detalii carte.</p>';
        });
});
