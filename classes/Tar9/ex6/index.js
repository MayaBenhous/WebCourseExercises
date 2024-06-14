const express = require("express");
const app =express();
const port = process.env.PORT || 8080
;

app.all("*", (req, res, next) => {
    console.log("Checking if the user is connected");
    next();
});

app.get("/", (req, res) => res.json({page:"index.html"}));
app.post("/category", (req, res) => res.json({page:"category.html"}));
app.put("/product", (req, res) => res.json({page:"product.html"}));
app.get("/profile", (req, res) => {
    console.log("User is connected !");
    res.json({page:"profile.html"})
});

app.all("*", (req, res) => {
    res.status(404).json({error: "Page not found !"});
});

app.listen(port, () => 
    console.log(`Express server listening on port ${port}!`)
);