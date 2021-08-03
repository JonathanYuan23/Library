// ==================== => global variables

const addEntryBtn = document.querySelector('#add-entry');
const cancelBtn = document.querySelector('#cancel-btn');
const cancelEntryBtn = document.querySelector('#cancel-entry-btn')
const confirmEditBtn = document.querySelector('#confirm-edit-btn');
const deleteBtn = document.querySelector('#delete-btn');
const deleteEntriesBtn = document.querySelector('#delete-entries');
const deleteEntryBtn = document.querySelector('#delete-entry-btn')
const deleteModal = document.querySelector('#delete-all-modal');
const editEntryModal = document.querySelector('#edit-entry-modal');
const entries = document.querySelector('#entries');
const modalOverlay1 = document.querySelector('#modal-overlay-1');
const modalOverlay2 = document.querySelector('#modal-overlay-2');

let library = [];

let toggleDeleteEntryBtn = 0;

function Book(title, author, language, summary, pagesRead, pagesTotal) {
    this.title = title;
    this.author = author;
    this.language = language;
    this.summary = summary;
    this.pagesTotal = pagesTotal;
    this.pagesRead = pagesRead;
}

Book.prototype.generateHTML = function () {
    const html = 
            `<h3 class="title">${this.title}</h3><div class="description"><span class="author">Author: ${this.author}</span><span class="language">Language: ${this.language}</span><p class="summary"><span>Summary: </span>${this.summary}</p></div><div class="entry-footer"><span class="pages-read">${this.pagesRead}</span><span>|</span><span class="total-pages">${this.pagesTotal}</span></div>`;
    return html;
};

// ==================== => render entries

function addEntry(book) {
    const entry = document.createElement('div');
    entry.classList.add('entry');
    entry.innerHTML = book.generateHTML();

    // listener that allows for entry editing
    entry.addEventListener('click', () => {
        toggleDeleteEntryBtn = 1;
        showModal(modalOverlay2);
    });

    // stop click event on page number from triggering the listener on the book entry
    entry.lastChild.addEventListener('click', (e) => {
        const pageBtn = e.currentTarget;
        changePage(pageBtn);
        e.stopPropagation();
    });
    entries.appendChild(entry);
}

function renderEntries() {
    for (let i = 0; i < library.length; i++) {
        const book = library[i];
        addEntry(book);
        entries.appendChild(entry);
    }
}

let hp = new Book('Harry Potter', 'JK Rowling', 'English', '', 100, 200);
addEntry(hp);

// ==================== => edit entry fields

function changePage(pageBtn) {
    const children = pageBtn.childNodes;
    const pagesTotal = Number(children[2].textContent);
    const newPage = Number(prompt(`New page: (min 1, max ${pagesTotal})`));
    if(!newPage || newPage > pagesTotal) alert(`You must enter an integer between 1 and ${pagesTotal}`);
    else children[0].textContent = `${newPage}`;
}

// ==================== => make modal visible

function showModal(modalOverlay) {
    if(toggleDeleteEntryBtn) deleteEntryBtn.style.display = 'inline-block';
    modalOverlay.classList.add('overlay-visible');
    modalOverlay.classList.add('overlay-full-opacity');
}

// buttons that make modals appear
deleteEntriesBtn.addEventListener('click', () => showModal(modalOverlay1));
addEntryBtn.addEventListener('click', () => showModal(modalOverlay2));

// ==================== => hide modal

function hideModal(modalOverlay) {
    modalOverlay.classList.remove('overlay-full-opacity');
    setTimeout(() => {
        modalOverlay.classList.remove('overlay-visible');
        if (toggleDeleteEntryBtn) {
            deleteEntryBtn.style.display = 'none';
            toggleDeleteEntryBtn = 0;
        }
    }, 200);
}

// buttons in delete all modal
cancelBtn.addEventListener('click', () => hideModal(modalOverlay1));
deleteBtn.addEventListener('click', () => {
    hideModal(modalOverlay1);
    entries.innerHTML = '';
});

function valid() {
    return true;
}

// buttons in edit entry modal
confirmEditBtn.addEventListener('click', () => {
    // validate form
    if (valid()) {
        // if a new entry is created
        // ...
        // else if a entry was edited
        // ...
        hideModal(modalOverlay2);
    } else{
    }
});

deleteEntryBtn.addEventListener('click', () => {
    hideModal(modalOverlay2);
    // delete entry
});

cancelEntryBtn.addEventListener('click', () => {
    hideModal(modalOverlay2);
    // delete entry
});

