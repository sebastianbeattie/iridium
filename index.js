const iridiumProcessor = require("./processor");
const { entities } = require("./entities.json");
const { port } = require("./config.json");

const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));


iridiumProcessor.loadEntities(entities);

app.get("/analyse", (req, res) => {
    iridiumProcessor.findEntities(req.query.input, res);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});