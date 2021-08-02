let library = [];

function Book(title, author, pages, pagesRead, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.pagesRead = pagesRead;
    this.status = status;
}

function addBook(book) {
    library.push(book);
}
