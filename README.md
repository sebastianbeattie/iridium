# Iridium
Natural Language Understanding / Named Entity Recognition bot

# What does it do?

It recognises named entities in natural language sentences.

In english: it can figure out what you're talking about and what to do with that information (based on a pre-defined set of rules and a dictionary of entities)

# How is it configured?

There are 2 important files: `rules.json` and `entities.json` which define what Iridium is looking for.

`entities.json` should looks a bit like this:

```
{
    "entities": [
        {
            "type": "<entity type>",
            "name": "<entity name>",
            "aliases": [
                "<other names for this entity>"
            ]
        }
    ]
}
```

And `rules.json` should look like this:

```
{
    "rules": [
        {
            "name": "<rule name>",
            "relationship": [
                {
                    "entityName": "<name of an entity>",
                    "maxQuantity": 1 (the quantity of this entity which can exist in one sentence)
                },
                {
                    "entityName": "<name of another entity>",
                    "maxQuantity": -1 (-1 means an unlimited number of occurrences)
                }
            ]
        }
    ]
}
```

Example files have been provided.