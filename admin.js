window.addEventListener('DOMContentLoaded', renderTable);

const URL = 'https://68fe42d77c700772bb134d84.mockapi.io/books';

const tableBody = document.querySelector('#products-table tbody');
const addOrEditBtn = document.querySelector('#add-or-edit-btn');
let isEditMode = false;
let productId;

const nameInput = document.getElementById('name');
const authorInput = document.getElementById('author');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const imageURLInput = document.getElementById('imageURL');

function renderTable() {
    fetch(URL)
        .then((response) => response.json())
        .then((books) => {
            tableBody.innerHTML = books
                .map(
                    (book, index) =>
                        `
            <tr data-id=${book.id}>
               <td>${index + 1}</td>
               <td class="cell-img">
                  <img src="${book.imageURL || 'https://via.placeholder.com/80'}" />
               </td>
               <td class="cell-name">${book.name}</td>
               <td class="cell-author">${book.author}</td>
               <td class="cell-price">${book.price}</td>
               <td>
                  <div class="actions">
                     <button class="btn edit" data-action="edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                     </button>
                     <button class="btn delete" data-action="delete">
                        <i class="fa-solid fa-trash"></i>
                     </button>
                  </div>
               </td>
            </tr>
            `
                )
                .join('');
        });
}

addOrEditBtn.addEventListener('click', addOrEditBook);

function addOrEditBook(e) {
    e.preventDefault();

    const newBook = {
        name: nameInput.value,
        author: authorInput.value,
        price: priceInput.value,
        category: categoryInput.value,
        imageURL: imageURLInput.value,
    };

    const method = isEditMode ? 'PUT' : 'POST';
    const newUrl = isEditMode ? `${URL}/${productId}` : URL;

    fetch(newUrl, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
    }).then(() => {
        renderTable();
        resetForm();
    });
}

function resetForm() {
    nameInput.value = '';
    authorInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    imageURLInput.value = '';

    if (isEditMode) {
        isEditMode = false;
        addOrEditBtn.innerHTML = 'Adauga';
    }
}

tableBody.addEventListener('click', handleActions);

function handleActions(e) {
    const clickedElement = e.target;

    if (clickedElement.closest('.edit')) {
        productId = getTableRow(clickedElement).dataset.id;
        fetch(`${URL}/${productId}`)
            .then((response) => response.json())
            .then((book) => {
                nameInput.value = book.name;
                authorInput.value = book.author;
                priceInput.value = book.price;
                categoryInput.value = book.category;
                imageURLInput.value = book.imageURL;
            });

        isEditMode = true;
        addOrEditBtn.innerHTML = 'Salveaza';
    } else if (clickedElement.closest('.delete')) {
        productId = getTableRow(clickedElement).dataset.id;
        fetch(`${URL}/${productId}`, { method: 'DELETE' }).then(() => renderTable());
    }
}

function getTableRow(element) {
    return element.closest('tr');
}
