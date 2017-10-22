import { Token } from "./natural-language";
import { exitIfAnyMissing } from "./utils";

export class NaturalLanguageService {

    static fromEnvVars(): NaturalLanguageService {
        exitIfAnyMissing(['GCP_PROJECT_ID', 'GCP_CLIENT_EMAIL', 'GCP_PRIVATE_KEY_BASE64']);

        return new NaturalLanguageService(
            process.env.GCP_PROJECT_ID as string,
            process.env.GCP_CLIENT_EMAIL as string,
            process.env.GCP_PRIVATE_KEY_BASE64 as string);
    }

    private client: any;

    constructor(projectID: string, clientEmail: string, privateKeyBase64: string) {

        const privateKey = Buffer.from(privateKeyBase64, "base64").toString('utf8');

        const options = {
            credentials: {
                projectId: projectID,
                client_email: clientEmail,
                private_key: privateKey
            }
        };

        const language = require('@google-cloud/language');
        this.client = new language.LanguageServiceClient(options);
    }

    analyse(text: string): Promise<Token[]> {
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        return this.client.analyzeSyntax({ document: document })
            .then((results: any) => {

                const syntaxTokens = results[0].tokens;

                return syntaxTokens.map((t: any) => Token.wrap(t));
            });
    }

}
