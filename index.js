const IridiumProcessor = require("./IridiumProcessor").IridiumProcessor;
const { entities } = require("./entities.json");
const { port } = require("./config.json");
const { rules } = require("./rules.json");

const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

var processor = new IridiumProcessor(entities, rules);

app.get("/find", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    var finds = processor.findEntities(req.query.input);
    res.end(JSON.stringify(finds));
});

app.get("/rule", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    var finds = processor.findEntities(req.query.input);
    var rule = processor.findRule(finds);
    res.end(JSON.stringify(rule));
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});