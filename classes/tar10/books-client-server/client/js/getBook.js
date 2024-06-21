function getBookId() {
	const aKeyValue = window.location.search.substring(1).split('&');

	const bookId = aKeyValue[0].split("=")[1];
    
	return bookId;
}

function showSelectedBook(data) {
    const selectionBookId = getBookId();
    let bookName;
    let bookPrice;

    for (const productKey in data.products) {
        let bookObj = data.products[productKey];

        if (bookObj.id == selectionBookId) {
            bookName = bookObj.name;
            bookPrice = bookObj.price;
            break;
        }
    }

    document.querySelector("h1").innerHTML = bookName;
    document.querySelector("#bookPrice").innerHTML = bookPrice;
}

window.onload = () => {
    fetch("http://localhost:8080/books")
    // fetch("data/books.json")
        .then(response => response.json())
        .then(data => showSelectedBook(data));
        // .then(data => console.log(data));
}
