class IridiumProcessor {
    entities = [];
    rules = [];

    constructor(entities, rules) {
        this.entities = entities;
        this.rules = rules;
    }

    levenshtein(a, b) {
        var t = [], u, i, j, m = a.length, n = b.length;
        if (!m) { return n; }
        if (!n) { return m; }
        for (j = 0; j <= n; j++) { t[j] = j; }
        for (i = 1; i <= m; i++) {
            for (u = [i], j = 1; j <= n; j++) {
                u[j] = a[i - 1] === b[j - 1] ? t[j - 1] : Math.min(t[j - 1], t[j], u[j - 1]) + 1;
            } t = u;
        } return u[n];
    }

    findEntities(input) {
        var inputLowercase = input.toLowerCase();
        var finds = [];

        for (var entity of this.entities) {
            var currentEntityFinds = [];
            for (var alias of entity.aliases) {
                if (inputLowercase.includes(alias.toLowerCase())) {
                    currentEntityFinds.push({ alias: alias, type: entity.type, name: entity.name, distance: this.levenshtein(alias, inputLowercase) });
                }
            }
            if (currentEntityFinds.length > 0) {
                currentEntityFinds = currentEntityFinds.sort(function (a, b) {
                    return a.distance - b.distance;
                });
                finds.push(currentEntityFinds[0]);
            }
        }

        finds = finds.map(f => { return { sourceText: f.alias, type: f.type, name: f.name } });

        return finds;
    }

    sortArrayByString(array) {
        return array.sort(function (a, b) {
            let x = a.toLowerCase();
            let y = b.toLowerCase();
            if (x > y) { return 1; }
            if (x < y) { return -1; }
            return 0;
        });
    }

    removeOne(array, thing) {
        const index = array.indexOf(thing);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    }

    arraysEqual(a, b) {
        return this.sortArrayByString(a).toString() === this.sortArrayByString(b).toString();
    }

    getItemCountInArray(array, item) {
        return array.filter(i => i === item).length;
    }

    addItemIfNotAlreadyInArray(array, item) {
        if (!array.includes(item)) array.push(item);
        return array;
    }

    findRule(finds) {
        var ruleFinds = [];
        var foundTypes = finds.map(f => { return f.type });

        var singleFinds = [];
        var unlimitedFinds = [];

        for (var type of foundTypes) {
            var count = this.getItemCountInArray(foundTypes, type);
            if (count == 1) {
                singleFinds = this.addItemIfNotAlreadyInArray(singleFinds, type);
            } else {
                unlimitedFinds = this.addItemIfNotAlreadyInArray(unlimitedFinds, type);
            }
        }

        for (var rule of this.rules) {
            var singleRelations = [];
            var unlimitedRelations = [];
            for (var relation of rule.relationship) {
                if (relation.maxQuantity == -1) {
                    unlimitedRelations.push(relation.entityName);
                } else {
                    for (var i = 0; i < relation.maxQuantity; i++) {
                        singleRelations.push(relation.entityName);
                    }
                }
            }

            if (this.arraysEqual(singleFinds, singleRelations) && this.arraysEqual(unlimitedFinds, unlimitedRelations)) {
                ruleFinds.push(rule);
            }
        }
        if (ruleFinds.length > 1) return { message: "Too many rules found! Found: " + ruleFinds.map(r => r.name).toString(), error: "ERR_TOO_MANY_RULES", success: false }
        if (ruleFinds.length == 0) return { message: "No rules found", error: "ERR_NO_RULES", success: false };
        else return { rule: ruleFinds[0].name, entities: finds, success: true };
    }

    findEntitiesAndRule(input) {
        var entities = this.findEntities(input);
        var rule = this.findRule(entities);
        return rule;
    }
}

module.exports = { IridiumProcessor };