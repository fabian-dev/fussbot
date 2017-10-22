import { Token } from "./natural-language";

export function fussReply(fussed: string): string {

    const replyTemplates = [
        "Ich denke du meinst %",
        "% bitte!"
    ];

    const randomReply = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];

    return randomReply.replace('%', fussed);
}

export function fuss(input: Token[]): string {
    return "";
}

