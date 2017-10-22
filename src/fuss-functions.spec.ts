import { fuss, fussAll, fussOneOf, fussReply } from "./fuss-functions";
import { Adjacent } from "./natural-language";

describe("fussReply", () => {

    const sut = (fussed: string) => fussReply(fussed);

    it("should contain the fussed word", () => {

        const actual = sut("Schadler");

        expect(actual).toContain("Schadler");

    });

});

describe("fussOneOf", () => {

    const sut = (adjacentes: Adjacent[]) => fussOneOf(adjacentes);

    it("returns null if nothing is fussable", () => {

        const actual = sut([]);

        expect(actual).toBe(null);

    });

});

describe("fuss", () => {

    const sut = (adjacent: Adjacent) => fuss(adjacent);

    it("concatenates adj and noun", () => {

        const actual = sut(new Adjacent("scheiß", "Adler"));

        expect(actual).toBe("Schadler");

    });

});
