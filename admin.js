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

function createRowHTML(book, index) {
    return `
        <tr data-id="${book.id}">
           <td>${index}</td>
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
    `;
}

async function renderTable() {
    try {
        const response = await fetch(URL);
        const books = await response.json();
        tableBody.innerHTML = books
            .map((book, idx) => createRowHTML(book, idx + 1))
            .join('');
    } catch (err) {
        console.error(err);
        tableBody.innerHTML = '<tr><td colspan="6">Eroare la incarcare</td></tr>';
    }
}

addOrEditBtn.addEventListener('click', addOrEditBook);

async function addOrEditBook(e) {
    e.preventDefault();

    const newBook = {
        name: nameInput.value,
        author: authorInput.value,
        price: priceInput.value,
        category: categoryInput.value,
        imageURL: imageURLInput.value,
    };

    addOrEditBtn.disabled = true;
    addOrEditBtn.textContent = isEditMode ? 'Se salveaza...' : 'Se adauga...';

    try {
        const method = isEditMode ? 'PUT' : 'POST';
        const newUrl = isEditMode ? `${URL}/${productId}` : URL;

        const resp = await fetch(newUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook),
        });
        const savedBook = await resp.json();

        if (isEditMode) {
            updateRowInDOM(savedBook);
        } else {
            const currentRows = tableBody.querySelectorAll('tr').length;
            tableBody.insertAdjacentHTML('beforeend', createRowHTML(savedBook, currentRows + 1));
        }

        resetForm();
    } catch (err) {
        console.error('Save failed', err);
        await renderTable();
    } finally {
        addOrEditBtn.disabled = false;
        addOrEditBtn.textContent = 'Adauga';
    }
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
        const tr = getTableRow(clickedElement);
        productId = tr.dataset.id;
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
        const tr = getTableRow(clickedElement);
        productId = tr.dataset.id;

        tr.remove();
        reindexTableRows();

        fetch(`${URL}/${productId}`, { method: 'DELETE' })
            .then((res) => {
                if (!res.ok) throw new Error('Delete failed');
            })
            .catch(async (err) => {
                console.error(err);
                await renderTable();
            });
    }
}

function getTableRow(element) {
    return element.closest('tr');
}

function updateRowInDOM(book) {
    const tr = tableBody.querySelector(`tr[data-id="${book.id}"]`);
    if (!tr) return;
    const index = Array.from(tableBody.querySelectorAll('tr')).indexOf(tr) + 1;
    tr.outerHTML = createRowHTML(book, index);
}

function reindexTableRows() {
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((r, i) => {
        const firstTd = r.querySelector('td');
        if (firstTd) firstTd.textContent = i + 1;
    });
}
