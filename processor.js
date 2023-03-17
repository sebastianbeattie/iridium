const { NerManager } = require('node-nlp');

const manager = new NerManager({ threshold: 0.8 });

function loadEntities(entities) {
    console.log("Loading entities...");
    for (entity of entities) {
        manager.addNamedEntityText(entity.type, entity.name, ["en"], entity.aliases);
        console.log("Loaded entity '" + entity.name + "' of type '" + entity.type + "' with " + entity.aliases.length + " aliases");
    }
}

function findEntities(input, res) {
    res.setHeader("Content-Type", "application/json");

    manager.findEntities(input, "en").then(entities => {
        entities = entities.map(e => { return { option: e.option, sourceText: e.sourceText, entity: e.entity, utteranceText: e.utteranceText } });
        res.end(JSON.stringify({ entities: entities }));
    });
}

module.exports = { loadEntities, findEntities };