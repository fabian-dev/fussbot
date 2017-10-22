import { Adjacent } from "./natural-language";


export function fussReply(fussed: string): string {

    const replyTemplates = [
        "Ich denke du meinst %.",
        "% bitte!",
        "Ich nenn' das immer %."
    ];

    const randomReply = pickRandom<string>(replyTemplates);

    return randomReply.replace('%', fussed);
}

export function fussOneOf(adjacentes: Adjacent[]): string | null {

    const allFussed = fussAll(adjacentes);

    if (allFussed.length > 0) {
        return pickRandom<string>(allFussed);
    }

    return null;
}

export function fussAll(adjacentes: Adjacent[]): string[] {

    return adjacentes.filter(a => canFuss(a)).map(a => fuss(a));
}

export function canFuss(adjacent: Adjacent): boolean {
    return adjacent.isSoftNoun;
}

export function fuss(adjacent: Adjacent): string {
    return upperCaseFirst(adjacent.adjSound) + adjacent.noun.toLowerCase();
}

function upperCaseFirst(target: string) {
    return target.trim().charAt(0).toUpperCase() + target.trim().slice(1);
}

function pickRandom<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}
