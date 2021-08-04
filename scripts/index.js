// ==================== => global variables

const addEntryBtn = document.querySelector('#add-entry');
const cancelBtn = document.querySelector('#cancel-btn');
const cancelEntryBtn = document.querySelector('#cancel-entry-btn');
const confirmEditBtn = document.querySelector('#confirm-edit-btn');
const deleteBtn = document.querySelector('#delete-btn');
const deleteEntriesBtn = document.querySelector('#delete-entries');
const deleteEntryBtn = document.querySelector('#delete-entry-btn');
const deleteModal = document.querySelector('#delete-all-modal');
const editEntryHeader = document.querySelector('#edit-entry-modal > h3');
const editEntryModal = document.querySelector('#edit-entry-modal');
const entries = document.querySelector('#entries');
const errorMsgs = document.querySelectorAll('.modal small');
const libraryStatistics = document.querySelectorAll('.info-section > span');
const modalOverlay1 = document.querySelector('#modal-overlay-1');
const modalOverlay2 = document.querySelector('#modal-overlay-2');

let library = [],
    books = 0,
    booksCompleted = 0,
    pages = 0,
    pagesRead = 0;

const form = document.forms[0],
    inputs = form.elements;

let editing = 0,
    currentEntry;

function Book(title, author, language, summary, pagesRead, pagesTotal) {
    this.title = title;
    this.author = author;
    this.language = language;
    this.summary = summary;
    this.pagesRead = pagesRead;
    this.pagesTotal = pagesTotal;
}

Book.prototype.generateHTML = function () {
    const html = `<h3 class="entry-field title">${this.title}</h3><div class="description"><span class="entry-field author">Author: ${this.author}</span><span class="entry-field language">Language: ${this.language}</span><p class="entry-field summary"><span>Summary: </span>${this.summary}</p></div><div class="entry-footer"><span class="entry-field pages-read">${this.pagesRead}</span><span>|</span><span class="entry-field total-pages">${this.pagesTotal}</span></div>`;

    return html;
};

// ==================== => local storage

function saveLibrary() {
    const libraryString = JSON.stringify(library);
    localStorage.setItem('library', libraryString);
}

function retrieveLibrary() {
    return JSON.parse(localStorage.getItem('library'));
}

// ==================== => render entries

function addEntry(book) {
    const entry = document.createElement('div');
    entry.classList.add('entry');
    entry.innerHTML = book.generateHTML();

    books++;
    booksCompleted += book.pagesRead === book.pagesTotal ? 1 : 0;
    pages += book.pagesTotal;
    pagesRead += book.pagesRead;

    editStatistics();

    // listener that allows for entry editing
    entry.addEventListener('click', (e) => {
        editing = 1;
        currentEntry = e.currentTarget;
        showModal(modalOverlay2, currentEntry);
    });

    // stop click event on page number from triggering the listener on the book entry
    entry.lastChild.addEventListener('click', (e) => {
        const pageBtn = e.currentTarget;
        currentEntry = pageBtn.parentNode;
        changePage(pageBtn);
        e.stopPropagation();
    });
    entries.appendChild(entry);
    library.push(book);
    saveLibrary();
}

function renderEntries() {
    const retrievedEntries = retrieveLibrary();
    localStorage.clear();
    for (let i = 0; i < retrievedEntries.length; i++) {
        const bookData = retrievedEntries[i];
        const book = new Book(
            bookData.title,
            bookData.author,
            bookData.language,
            bookData.summary,
            bookData.pagesRead,
            bookData.pagesTotal
        );
        addEntry(book);
    }
}

window.addEventListener('load', () => {
    if (localStorage.length > 0) renderEntries();
});

// ==================== => change library statistics

function editStatistics() {
    libraryStatistics[0].textContent = books;
    libraryStatistics[1].textContent = booksCompleted;
    libraryStatistics[2].textContent = pages;
    libraryStatistics[3].textContent = pagesRead;
}

// ==================== => change page number

function changePage(pageBtn) {
    const children = pageBtn.childNodes;
    const oldPage = Number(children[0].textContent);
    const pagesTotal = Number(children[2].textContent);
    const newPageString = prompt(`New page: (min 0, max ${pagesTotal})`);
    const newPage = Number(newPageString);

    console.log(newPageString);

    if (
        newPageString === null ||
        !newPageString.length ||
        Number.isNaN(newPage) ||
        newPage < 0 ||
        newPage > pagesTotal
    ) {
        alert(`You must enter an integer between 0 and ${pagesTotal}`);
    } else {
        children[0].textContent = `${newPage}`;

        const pos = Array.from(currentEntry.parentNode.querySelectorAll('.entry')).indexOf(currentEntry);
        library[pos].pagesRead = newPage;

        if (oldPage === pagesTotal && newPage !== pagesTotal) {
            booksCompleted--;
        } else if (oldPage !== pagesTotal && newPage === pagesTotal) {
            booksCompleted++;
        }
        pagesRead += newPage - oldPage;
        editStatistics();
        saveLibrary();
    }
}

// ==================== => make modal visible

function showModal(modalOverlay, entry) {
    if (editing) {
        // if toggle is true, that means we are currently editing not creating a entry. Thus switch the header
        editEntryHeader.textContent = 'Edit Book Entry';
        deleteEntryBtn.style.display = 'inline-block';
        fillInputs(entry);
    } else {
        editEntryHeader.textContent = 'Add New Book';
    }
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
        if (editing) {
            deleteEntryBtn.style.display = 'none';
            editing = 0;
        }
    }, 200);
}

// ==================== => delete all entries
cancelBtn.addEventListener('click', () => hideModal(modalOverlay1));
deleteBtn.addEventListener('click', () => {
    hideModal(modalOverlay1);

    library = [];
    entries.innerHTML = '';

    books = booksCompleted = pages = pagesRead = 0;
    editStatistics();
    saveLibrary();
});

// ==================== => edit modal

function editEntry(book) {
    const entryFields = currentEntry.querySelectorAll('.entry-field');
    const pos = Array.from(currentEntry.parentNode.querySelectorAll('.entry')).indexOf(currentEntry);

    const oldPage = Number(library[pos].pagesRead);
    const oldPagesTotal = Number(library[pos].pagesTotal);
    const newPage = Number(book.pagesRead);
    const newPagesTotal = Number(book.pagesTotal);

    if (oldPage === oldPagesTotal && newPage !== newPagesTotal) {
        booksCompleted--;
    } else if (oldPage !== oldPagesTotal && newPage === newPagesTotal) {
        booksCompleted++;
    }

    pagesRead += newPage - oldPage;
    pages += newPagesTotal - oldPagesTotal;
    editStatistics();

    library[pos] = book;
    saveLibrary();

    entryFields[0].textContent = `${book.title}`;
    entryFields[1].textContent = `Author: ${book.author}`;
    entryFields[2].textContent = `Language: ${book.language}`;
    entryFields[3].innerHTML = `<span>Summary: </span>${book.summary}`;
    entryFields[4].textContent = `${book.pagesRead}`;
    entryFields[5].textContent = `${book.pagesTotal}`;
}

// ==================== => fill/clear inputs

function fillInputs(entry) {
    const pos = Array.from(entry.parentNode.querySelectorAll('.entry')).indexOf(entry);
    const book = library[pos];
    inputs['title-input'].value = book.title;
    inputs['author-input'].value = book.author;
    inputs['language-input'].value = book.language;
    inputs['summary-input'].value = book.summary;
    inputs['pages-read-input'].value = book.pagesRead;
    inputs['total-pages-input'].value = book.pagesTotal;
}

function clearInputs() {
    for (let i = 0; i < errorMsgs.length; i++) errorMsgs[i].textContent = '';
    for (let i = 0; i < inputs.length; i++) inputs[i].className = '';
    form.reset();
}

// ==================== => errors

const TITLE_REQUIRED = 'Title is required';
const AUTHOR_REQUIRED = 'Author is required';
const LANGUAGE_REQUIRED = 'Language is required';
const PAGES_READ_REQUIRED = 'Number of pages read needs to be an integer greater than or equal to 0';
const TOTAL_PAGES_REQUIRED = 'Total number of pages needs to be an integer greater than or equal to 0';
const READ_LESS_THAN_TOTAL_PAGES = 'Number of pages read needs to be lower than the total number of pages';

function showError(error) {
    errorMsgs[error.index].textContent = error.msg;
    inputs[error.index].className = 'error';
}

function hideError(index) {
    errorMsgs[index].textContent = '';
    inputs[index].className = '';
}

// ==================== => process input data

function validate() {
    const title = inputs['title-input'].value.trim();
    const author = inputs['author-input'].value.trim();
    const language = inputs['language-input'].value.trim();
    const summary = inputs['summary-input'].value.trim();
    const pagesReadString = inputs['pages-read-input'].value.trim();
    const pagesTotalString = inputs['total-pages-input'].value.trim();
    const pagesRead = Number(pagesReadString);
    const pagesTotal = Number(pagesTotalString);

    let valid = true,
        pagesGood = true;

    // title
    if (!title.length) {
        showError({ index: 0, msg: TITLE_REQUIRED });
        valid = false;
    } else {
        hideError(0);
    }

    // author
    if (!author.length) {
        showError({ index: 1, msg: AUTHOR_REQUIRED });
        valid = false;
    } else {
        hideError(1);
    }

    // summary not required :)

    // language
    if (!language.length) {
        showError({ index: 2, msg: LANGUAGE_REQUIRED });
        valid = false;
    } else {
        hideError(2);
    }

    // pages read
    if (!pagesReadString.length || Number.isNaN(pagesRead) || pagesRead < 0) {
        showError({ index: 4, msg: PAGES_READ_REQUIRED });
        valid = pagesGood = false;
    } else {
        hideError(4);
    }

    // total pages
    if (!pagesTotalString.length || Number.isNaN(pagesTotal) || pagesTotal < 0) {
        showError({ index: 5, msg: PAGES_READ_REQUIRED });
        valid = pagesGood = false;
    } else {
        hideError(5);
    }

    // edge case, pages read > total pages
    if (pagesGood) {
        if (pagesRead > pagesTotal) {
            showError({ index: 4, msg: READ_LESS_THAN_TOTAL_PAGES });
            valid = false;
        } else {
            hideError(4);
        }
    }

    return {
        valid: valid,
        book: new Book(title, author, language, summary, pagesRead, pagesTotal),
    };
}

// ==================== => entry modal buttons

confirmEditBtn.addEventListener('click', () => {
    // validate form
    const response = validate();
    if (response.valid) {
        // if a entry was edited
        if (editing) {
            editEntry(response.book);
        } else {
            // else if a new entry was created
            addEntry(response.book);
        }
        hideModal(modalOverlay2);
        form.reset();
    }
});

deleteEntryBtn.addEventListener('click', () => {
    const deleteConfirm = prompt(`Type out 'yes' if you're sure you want to delete this entry:`).trim();
    if (deleteConfirm !== 'yes') {
        return;
    }

    hideModal(modalOverlay2);
    setTimeout(clearInputs, 200);

    const pos = Array.from(currentEntry.parentNode.querySelectorAll('.entry')).indexOf(currentEntry);

    if (library[pos].pagesRead === library[pos].pagesTotal) {
        booksCompleted--;
    }
    books--;
    pages -= library[pos].pagesTotal;
    pagesRead -= library[pos].pagesRead;
    editStatistics();

    library.splice(pos, 1);
    currentEntry.remove();
    saveLibrary();
});

cancelEntryBtn.addEventListener('click', () => {
    hideModal(modalOverlay2);
    setTimeout(clearInputs, 200);
});
