const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is listening...!");
});

app.listen(port, () => {
  console.log(`App is listening on port${port}`);
});
