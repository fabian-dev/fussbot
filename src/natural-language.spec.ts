import { Adjacent, getAdjacentAdvAndNouns, Token } from "./natural-language";

function expectAdjacent(tokens: Token[], expected: Adjacent) {

    const actual: Adjacent[] = getAdjacentAdvAndNouns(tokens);

    expect(actual.length).toBe(1);
    expect(actual[0]).toEqual(expected);
}

describe("getAdjacentAdvAndNouns", () => {

    it("should collect adjectives before nouns", () => {

        const tokens: Token[] = [
            { pos: { tag: "VERB" }, text: "egal" },
            { pos: { tag: "ADJ" }, text: "scheiß" },
            { pos: { tag: "NOUN" }, text: "Adler" }
        ] as Token[];

        expectAdjacent(tokens, new Adjacent("scheiß", "Adler"));
    });

    it("should collect nouns before adjectives", () => {

        const tokens: Token[] = [
            { pos: { tag: "NOUN" }, text: "Adler" },
            { pos: { tag: "ADJ" }, text: "scheiß" },
            { pos: { tag: "VERB" }, text: "egal" }

        ] as Token[];

        expectAdjacent(tokens, new Adjacent("scheiß", "Adler"));
    });

});

describe("Adjacent", () => {

    it("should treat SCH special", () => {

        const adjacent = new Adjacent("scheiß", "Adler");

        const sut = adjacent.adjSound;

        expect(sut).toBe("sch");
    });

});
