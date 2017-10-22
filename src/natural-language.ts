export class PartOfSpeech {
    private nlPOS: any;

    static wrap(nlPOS: any) {
        return new PartOfSpeech(nlPOS)
    }

    constructor(nlPOS: any) {
        this.nlPOS = nlPOS;
    }

    get tag(): string {
        return this.nlPOS.tag;
    }

    get mood(): string {
        return this.nlPOS.mood;
    }

    get properName(): string {
        return this.nlPOS.proper;
    }

    get voice(): string {
        return this.nlPOS.voice;
    }
}

export class Token {
    private nlToken: any;

    static wrap(nlToken: any) {
        return new Token(nlToken)
    }

    constructor(nlToken: any) {
        this.nlToken = nlToken;
    }

    get text(): string {
        return this.nlToken.text.content;
    }

    get dependency(): any {
        return this.nlToken.dependencyEdge;
    }

    get pos(): PartOfSpeech {
        return this.partOfSpeech;
    }

    get partOfSpeech(): PartOfSpeech {
        return PartOfSpeech.wrap(this.nlToken.partOfSpeech);
    }


    debug(): string {
        return `Tag: ${this.pos.tag} | Text: ${this.text}`;
    }
}

export class Adjacent {

    constructor(public adj: string, public noun: string) {
        if (adj == null || adj.length == 0 || noun == null || noun.length == 0) {
            throw new Error("Cannot construct invalid Adjacent");
        }
    }

    get adjSound(): string {
        const coherentSounds = ["sch", "pf"];

        for (const coherent of coherentSounds) {
            if (this.adj.toLowerCase().startsWith(coherent)) {
                return coherent;
            }
        }

        return this.adj.toLowerCase()[0];
    }

    get isSoftNoun(): boolean {
        return Adjacent.startsWithVowel(this.noun);
    }

    private static startsWithVowel(target: string) {
        return /^[aeiou]\w+$/i.test(target);
    }
}

export function getAdjacentAdvAndNouns(tokens: Token[]): Adjacent[] {
    const adjacents: Adjacent[] = [];

    pairwise(tokens, (curr, next) => {

        if (curr.pos.tag === "ADJ" && next.pos.tag === "NOUN") {
            adjacents.push(new Adjacent(curr.text, next.text));
        }
        if (curr.pos.tag === "NOUN" && next.pos.tag === "ADJ") {
            adjacents.push(new Adjacent(next.text, curr.text));
        }
    });
    return adjacents;
}


function pairwise(tokens: Token[], lambda: ((curr: Token, next: Token) => void)) {
    for (let i = 0; i < tokens.length - 1; i++) {
        lambda(tokens[i], tokens[i + 1]);
    }
}
