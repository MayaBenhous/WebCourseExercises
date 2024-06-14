const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/playmusic/:musicId", (req, res) => {
  const { musicId = null } = req.params;
  console.log("musicId", musicId);

  res.send(`<!DOCTYPE html>
    <html>
    <head>
    <title>Music id ${musicId}</title>
    </head>
    <body>
    <h1>Hello :-)</h1>
    </body>
    </html>`);
});

app.listen(port, () =>
  console.log(`Express server listening on port ${port}!`)
);
