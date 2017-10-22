import { SlackBot, SlackMessage } from "botkit";
import { fussOneOf, fussReply } from "../fuss-functions";
import { getAdjacentAdvAndNouns, Token } from "../natural-language";
import { NaturalLanguageService } from "../natural-language-service";

export function handleForFuss(bot: SlackBot, message: SlackMessage, nlService: NaturalLanguageService) {

    if (message.match) {
        const toAnalyse = message.match[1];
        nlService.analyse(toAnalyse)
            .then(tokens => fussIfApplicable(tokens))
            .then(r => sendReply(bot, message, r));
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

        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: "pug",
        }, (err, res) => {
            if (err) {
                bot.botkit.log("Failed to add reaction in ", err);
            }
        });

        bot.reply(message, reply);
    }
}
