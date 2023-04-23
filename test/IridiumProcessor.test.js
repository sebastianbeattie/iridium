const IridiumProcessor = require("../IridiumProcessor").IridiumProcessor;
const { entities } = require("./entities.json");
const { rules } = require("./rules.json");

const underTest = new IridiumProcessor(entities, rules);

test("Levenshtein distance is correct when provided texts are different", () => {
    expect(underTest.levenshtein("dog", "cat")).toBe(3);
});

test("Levenshtein distance is correct when provided texts are the same", () => {
    expect(underTest.levenshtein("word", "word")).toBe(0);
});

test("Sort array by string sorts correctly", () => {
    const testArray = ["d", "c", "b", "a"];
    const expectedArray = ["a", "b", "c", "d"];
    expect(underTest.sortArrayByString(testArray)).toStrictEqual(expectedArray);
});

test("Sort array by string sorts correctly when array is already sorted", () => {
    const testArray = ["a", "b", "c", "d"];
    const expectedArray = ["a", "b", "c", "d"];
    expect(underTest.sortArrayByString(testArray)).toStrictEqual(expectedArray);
});

test("Remove one only removes one occurrence", () => {
    var testArray = ["a", "a", "b", "b"];
    const expectedArray = ["a", "b", "b"];
    expect(underTest.removeOne(testArray, "a")).toStrictEqual(expectedArray);
});

test("Arrays equal returns true", () => {
    const anArray = ["a", "b", "c", "d"];
    const theSameArray = ["a", "b", "c", "d"];
    expect(underTest.arraysEqual(anArray, theSameArray)).toBe(true);
});

test("Arrays equal returns false", () => {
    const anArray = ["a", "b", "c", "d"];
    const aDifferentArray = ["a", "b", "c"];
    expect(underTest.arraysEqual(anArray, aDifferentArray)).toBe(false);
});

test("Get item count returns correct count", () => {
    const testArray = ["a", "a", "b", "c", "d"];
    expect(underTest.getItemCountInArray(testArray, "a")).toBe(2);
});

test("Add item only adds if item does not exist", () => {
    var testArray = ["a", "b"];
    const expectedArray = ["a", "b", "c"];
    testArray = underTest.addItemIfNotAlreadyInArray(testArray, "a");
    testArray = underTest.addItemIfNotAlreadyInArray(testArray, "c");
    expect(testArray).toStrictEqual(expectedArray);
});

test("Useless sentence should return nothing", () => {
    const testPhrase = "Absolutely nothing";
    expect(underTest.findEntitiesAndRule(testPhrase)).toStrictEqual({ message: "No rules found", error: "ERR_NO_RULES" });
});

test("Useful sentence should return the right rule", () => {
    const testPhrase = "Turn on the lights in my bedroom";
    const expectedResponse = { rule: "OneActionOnePlaceOneThing", entities: [{ sourceText: "my bedroom", type: "place", name: "bedroom" }, { sourceText: "lights", type: "thing", name: "lights" }, { sourceText: "turn on", type: "action", name: "turn on" }] };
    expect(underTest.findEntitiesAndRule(testPhrase)).toStrictEqual(expectedResponse);
});

test("Duplicated rule should return error", () => {
    const testPhrase = "Turn on the lights and the heating in my room";
    const expectedResponse = { message: "Too many rules found! Found: OneActionOnePlaceManyThings,OneActionOnePlaceManyThingsButDuplicated", error: "ERR_TOO_MANY_RULES" };
    expect(underTest.findEntitiesAndRule(testPhrase)).toStrictEqual(expectedResponse);
});