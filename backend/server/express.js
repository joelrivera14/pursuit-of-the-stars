const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors({ origin: "*" }));

const planetsController = require("./controllers/planetsController");

app.use("/planets", planetsController);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// get ALL and get one
// planets controller
