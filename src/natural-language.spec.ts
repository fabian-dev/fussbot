import { fuss, fussReply } from "./fuss-functions";
import { Adjacent, adjacentAdvAndNouns, Token } from "./natural-language";

describe("the adjacentAdvAndNouns", () => {

    it("should collect adjectives before nouns", () => {

        const tokens: Token[] = [
            { pos: { tag: "VERB" }, text: "egal"},
            { pos: { tag: "ADJ" }, text: "scheiß"},
            { pos: { tag: "NOUN" }, text: "Adler"}
        ] as Token[];

        const actual: Adjacent[] =  adjacentAdvAndNouns(tokens);

        expect(actual.length).toBe(1);

        expect(actual[0].adj).toBe("scheiß");
        expect(actual[0].noun).toBe("Adler");
    });

    it("should collect nouns before adjectives", () => {

        const tokens: Token[] = [
            { pos: { tag: "NOUN" }, text: "Adler"},
            { pos: { tag: "ADJ" }, text: "geschmeidig"},
            { pos: { tag: "VERB" }, text: "egal"}

        ] as Token[];

        const actual: Adjacent[] =  adjacentAdvAndNouns(tokens);

        expect(actual.length).toBe(1);

        expect(actual[0].adj).toBe("geschmeidig");
        expect(actual[0].noun).toBe("Adler");
    });

});
