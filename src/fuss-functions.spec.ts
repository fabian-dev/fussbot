import { fuss, fussReply } from "./fuss-functions";

describe("fussReply", () => {

    const sut = (fussed: string) => fussReply(fussed);

    it("should contain the fussed word", () => {

        const actual = sut("Schadler");

        console.log(actual);

        expect(actual).toContain("Schadler");

    });

});
