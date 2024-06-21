window.onload = () => {
    fetch("http://localhost:8080/books")
    // fetch("data/books.json")
        .then(response => response.json())
        .then(data => showData(data));
}

function showData(data) {
    document.querySelector("h1").innerHTML = `${data.category}`;
    const ulFrag = document.createDocumentFragment();
    const booksList = document.createElement('ul');
    ulFrag.appendChild(booksList);

    for (const product in data.products) {
        const book = document.createElement('li');

        const bookStr = `<a href='book.html?bookId=${data.products[product].id}'>${data.products[product].name}</a>`;
        book.innerHTML = bookStr;

        booksList.appendChild(book);
    }

    document.getElementsByTagName("main")[0].appendChild(ulFrag);
}


