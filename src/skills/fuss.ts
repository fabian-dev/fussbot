import { SlackBot, SlackMessage } from "botkit";
import { fussOneOf, fussReply } from "../fuss-functions";
import { getAdjacentAdvAndNouns, Token } from "../natural-language";
import { NaturalLanguageService } from "../natural-language-service";

export function handleForFuss(bot: SlackBot, message: SlackMessage, nlService: NaturalLanguageService) {

    if (message.match) {
        const toAnalyse = message.match[1];

        nlService.analyse(toAnalyse)
            .then(tokens => sendReply(bot, message, fussIfApplicable(tokens)));
    }
}

function fussIfApplicable(tokens: Token[]): string | null {

    const adjacentes = getAdjacentAdvAndNouns(tokens);

    const fussed = fussOneOf(adjacentes);

    if (fussed != null) {
        return fussReply(fussed);
    }
    return null;
}

function sendReply(bot: SlackBot, message: SlackMessage, reply: string | null) {

    if (reply != null) {
        bot.reply(message, `:pug: ${reply}`);
    }
}
