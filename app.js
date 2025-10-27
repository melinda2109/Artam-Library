const URL = 'https://68fe42d77c700772bb134d84.mockapi.io/books';

const getButton = document.getElementById('get');
const postButton = document.getElementById('post');
const booksContainer = document.getElementById('books');

const newName = document.getElementById("name");
const newAuthor = document.getElementById("author");
const newCategory = document.getElementById("category");
const newPrice = document.getElementById("price");

getButton.addEventListener('click', displayBooks);

function displayBooks() {
    fetch(URL)
        .then(response => response.json())
        .then(books => {
            booksContainer.innerHTML = books.map(book => `
                <div class="book-card">
                    <h3>${book.name}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <p><strong>Price:</strong> ${book.price} RON</p>
                </div>
            `).join('');
        })
        .catch(err => console.error(err));
}


postButton.addEventListener('click', addBook);

function addBook() {
    const Book = {
        name: newName.value,
        author: newAuthor.value,
        category: newCategory.value,
        price: newPrice.value
    };

    fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Book)
    })
    .then(response => response.json())
    .then(data => {
        displayBooks(); 
        newName.value = '';
        newAuthor.value = '';
        newCategory.value = '';
        newPrice.value = '';
    })
    .catch(err => console.error(err));
}
