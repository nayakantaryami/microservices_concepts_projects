require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { configureCors } = require("./config/corsConfig");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(configureCors());

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
