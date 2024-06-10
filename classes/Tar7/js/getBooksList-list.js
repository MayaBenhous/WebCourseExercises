// window.onload = () => {
//     fetch("data/books.json")
// //פעולת פאטצ מחזירה אובייקט שנקרא פרומיס - מייצג תוצאה שעדיין לא מוכנה
// //משהו שיקרה (פעולה אסינכרונית) - הצלחה/כישלון
//         .then(response => response.json())
//         .then(data => console.log(data));
// }

function showData(data) {
  document.querySelector("h1").innerHTML = `${data.category}`;
  const ulFrag = document.createDocumentFragment();

  const booksList = document.createElement("ul");
  ulFrag.appendChild(booksList);
  for (const product in data.products) {
    const book = document.createElement("li");
    const bookStr = `<a href = 'book.html?bookId=${data.products[product].id}'>${data.products[product].name}</a>`;
    book.innerHTML = bookStr;
    booksList.appendChild(book);
  }
  document.getElementsByTagName("main")[0].appendChild(ulFrag);
}

window.onload = () => {
  fetch("data/books.json")
    .then((response) => response.json())
    .then((data) => showData(data));
};
