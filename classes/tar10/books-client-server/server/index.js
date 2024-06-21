const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const booksData = require("./data/books.json");

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Content-Type": "application/json",
  });
  next();
});

app.get("/books", (req, res) => {
  res.json(booksData);
});

app.listen(port);
console.log(`listening on port ${port}`);

// const express = require('express');
// const app = express();
// const port = process.env.PORT || 8080;
// const booksData = require('./data/books.json'); // לייבא את הקובץ ג'ייסון

// app.get("/books", (req, res) => {
//     res.json(booksData); // מחזיר ללקוח קובץ ג'ייסון
// });

// app.listen(port, () =>
//     console.log(`Express server listening on port ${port}!`)
// );
