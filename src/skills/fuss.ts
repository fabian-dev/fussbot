import { SlackBot, SlackMessage } from "botkit";
import { fussOneOf, fussReply } from "../fuss-functions";
import { getAdjacentAdvAndNouns, Token } from "../natural-language";
import { NaturalLanguageService } from "../natural-language-service";

export function handleForFuss(bot: SlackBot, message: SlackMessage, nlService: NaturalLanguageService) {

    if (message.match) {
        const toAnalyse = message.match[1];

        nlService.analyse(toAnalyse).then(tokens => sendReply(bot, message, fussIfApplicable(tokens)));
    }
}

function fussIfApplicable(tokens: Token[]): string | null {

    console.log("Tokens in sentence are: ");
    for (let token of tokens) {
        console.log("TOKEN: " + token.debug());
    }

    const adjacentes = getAdjacentAdvAndNouns(tokens);

    if (adjacentes.length == 0) {
        console.log("No adjacentes in sentence");
    }


    const fussed = fussOneOf(adjacentes);

    if (fussed != null) {
        console.log("Fussed to: " + fussed);

        return fussReply(fussed);
    }

    console.log("Nothing to fuss");
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
