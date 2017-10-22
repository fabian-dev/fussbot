import { Adjacent } from "./natural-language";


export function fussReply(fussed: string): string {

    const replyTemplates = [
        "Ich denke du meinst %",
        "% bitte!"
    ];

    const randomReply = pickRandom<string>(replyTemplates);

    return randomReply.replace('%', fussed);
}

export function fussOneOf(adjacentes: Adjacent[]): string | null {

    const allFussed = fussAll(adjacentes);

    if (allFussed.length > 0) {
        console.log("Will pick a random fussed");

        return pickRandom<string>(allFussed);
    }

    return null;
}

export function fussAll(adjacentes: Adjacent[]): string[] {

    const allFussed = adjacentes.filter(a => canFuss(a)).map(a => fuss(a));

    console.log("All fussed is: " + JSON.stringify(allFussed));

    return allFussed;
}

export function canFuss(adjacent: Adjacent): boolean {
    return true;
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
