function showData(data) {
  document.querySelector("h1").innerHTML = `${data.category}`;
  const ulFrag = document.createDocumentFragment();

  const bookSelect = document.createElement("select");
  ulFrag.appendChild(bookSelect);

  bookSelect.onchange = function () {
    const selectedBookId = bookSelect.value;
    if (selectedBookId) {
    //   window.location.href = `book.html?bookId=${selectedBookId}`;
      window.open (`book.html?bookId=${selectedBookId}`, '_blank');
    }
  };

  for (const product in data.products) {
    const selbook = document.createElement("option");
    selbook.value = data.products[product].id;
    selbook.textContent = data.products[product].name;
    bookSelect.appendChild(selbook);
  }

  document.getElementsByTagName("main")[0].appendChild(ulFrag);
}

window.onload = () => {
  fetch("data/books.json")
    .then((response) => response.json())
    .then((data) => showData(data));
};
