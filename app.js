window.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    setupSearch();
    setupSort();
});

const URL = 'https://68fe42d77c700772bb134d84.mockapi.io/books';

let allBooks = [];
let filteredBooks = [];
let currentFilter = 'all';
let currentSort = 'newest';
let currentSearch = '';

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `
        <span class="toast-icon">✓</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

function displayProducts() {
    fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network error!');
            }
            return response.json();
        })
        .then((books) => {
            allBooks = books;
            filterAndSort();
            generateCategoryFilters();
            updateCartCount();
        })
        .catch((error) => {
            console.error(error);
            document.querySelector('.products-container').innerHTML = 
                '<div style="grid-column: 1/-1; padding: 2rem; text-align: center;"><p> Eroare la incarcare carti.</p></div>';
        });
}

function generateCategoryFilters() {
    // include an "all" option + unique non-empty categories
    const categories = ['all', ...new Set(allBooks.map(book => book.category).filter(Boolean))];
    const filterContainer = document.getElementById('category-filters');

    filterContainer.innerHTML = categories
        .map(cat => {
            const label = cat === 'all' ? 'Toate' : cat;
            return `<button class="filter-btn" data-filter="${cat}">${label}</button>`;
        })
        .join('');

    // set initial active button based on currentFilter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === currentFilter) btn.classList.add('active');
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterAndSort();
        });
    });
}

function setupSearch() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        filterAndSort();
    });
}

function setupSort() {
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndSort();
    });
}

function filterAndSort() {
    let result = [...allBooks];

    // Search
    if (currentSearch) {
        result = result.filter(book => 
            (book.name || '').toLowerCase().includes(currentSearch) || 
            (book.author || '').toLowerCase().includes(currentSearch)
        );
    }

    // Filter by category
    if (currentFilter !== 'all') {
        result = result.filter(book => book.category === currentFilter);
    }

    // Sort
    switch(currentSort) {
        case 'price-low':
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'name':
            result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        default:
            // ensure numeric comparison for ids
            result.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
    }

    filteredBooks = result;
    renderProducts();
}

function renderProducts() {
    const container = document.querySelector('.products-container');
    const resultsCount = document.getElementById('results-count');

    if (filteredBooks.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 2rem;">
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>Nu au fost gasit carti</h3>
                    <p>Incearca o alta cautare sau categorie</p>
                </div>
            </div>
        `;
        resultsCount.textContent = '0 rezultate';
        return;
    }

    container.innerHTML = filteredBooks
        .map(
            (book) => `
            <div class="product-card">
                <div class="product-badge">-20%</div>
                <img
                    src="${book.imageURL || 'https://via.placeholder.com/240x320?text=No+Image'}"
                    alt="Book image"
                />
                <div class="product-info">
                    <h3>${book.name}</h3>
                    <div class="author">👤 ${book.author}</div>
                    <div class="category-tag">${book.category}</div>
                    <div class="price">${book.price} LEI</div>
                    <div class="buttons">
                        <a href="details.html?id=${book.id}" class="details-btn">
                            <i class="fas fa-book"></i> Detalii
                        </a>
                        <button data-id=${book.id} class="cart-btn">
                            <i class="fas fa-shopping-cart"></i> Adauga in Cos
                        </button>
                    </div>
                </div>
            </div>
            `
        )
        .join('');

    resultsCount.textContent = `${filteredBooks.length} carti`;

    // Attach cart button listeners
    const addToCartButtons = document.querySelectorAll('.cart-btn');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.id;
            const book = allBooks.find((b) => b.id === productId);

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
            updateCartCount();
            showToast(`✨ "${book.name}" adaugat in cos!`);
        });
    });
}