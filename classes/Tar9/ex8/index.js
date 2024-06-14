const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/savemusic", (req, res) => {
  const { songs = [] } = req.body;
  console.log("The songs are:", songs);
  res.json({success : 1});
});

app.listen(port, () =>
  console.log(`Express server listening on port ${port}!`)
);
