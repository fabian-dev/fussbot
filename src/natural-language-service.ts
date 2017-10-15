import { exitIfAnyMissing } from "./utils";

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

    toString() {
        return `${this.tag} | ${this.mood} | ${this.properName} | ${this.voice}`;
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
}

export class NaturalLanguageService {

    private client: any;

    static fromEnvVars() {
        exitIfAnyMissing(['GCP_PROJECT_ID', 'GCP_CLIENT_EMAIL', 'GCP_PRIVATE_KEY']);

        return new NaturalLanguageService(
            process.env.GCP_PROJECT_ID as string,
            process.env.GCP_CLIENT_EMAIL as string,
            process.env.GCP_PRIVATE_KEY as string);
    }

    constructor(gcpProjectId: string, gcpClientEmail: string, gcpPrivateKey: string) {
        const options = {
            credentials: {
                projectId: gcpProjectId,
                client_email: gcpClientEmail,
                private_key: gcpPrivateKey
            }
        };
        this.client = require('@google-cloud/language').LanguageServiceClient(options);
    }

    analyse(text: string): Promise<Token[]> {
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        return this.client.analyzeSyntax({ document: document })
            .then((results: any) => {

                const syntaxTokens = results[0].tokens;

                const tokens: Token[] = syntaxTokens.map((t: any) => Token.wrap(t));

                /*
                for (let token of tokens) {
                    console.log("Text= " + token.text);
                    console.log("partOfSpeech= " + token.pos.toString());
                    console.log("dependency= " + JSON.stringify(token.dependency));
                }
                */

                return tokens;
            });
    }

}