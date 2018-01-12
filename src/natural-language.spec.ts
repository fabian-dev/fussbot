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

});

describe("Adjacent", () => {

    it("should treat SCH special in adjSound", () => {

        const adjacent = new Adjacent("scheiß", "Adler");

        const sut = adjacent.adjSound;

        expect(sut).toBe("sch");
    });

    it("should treat PF special in adjSound", () => {

        const adjacent = new Adjacent("pfeffriger", "Adler");

        const sut = adjacent.adjSound;

        expect(sut).toBe("pf");
    });

    it("should treat only soft nouns (those with a vowel at the beginning) as soft", () => {

        let adjacent = new Adjacent("scheiß", "Adler");

        let sut = adjacent.isSoftNoun;

        expect(sut).toBe(true);

        adjacent = new Adjacent("scheiß", "Kugel");

        sut = adjacent.isSoftNoun;

        expect(sut).toBe(false);
    });

});
