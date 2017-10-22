import { SlackBot, SlackMessage } from "botkit";
import { NaturalLanguageService } from "../natural-language-service";
import { Token } from "../natural-language";

export function handleDumpSyntax(bot: SlackBot, message: SlackMessage, nlService: NaturalLanguageService) {

    if (message.match) {
        const toAnalyse = message.match[1];
        nlService.analyse(toAnalyse).then(t => dumpTokens(bot, message, t));
    }
}

function dumpTokens(bot: SlackBot, message: SlackMessage, tokens: Token[]) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: "pug",
    }, (err, res) => {
        if (err) {
            bot.botkit.log("Dump Syntax Skill: Failed to add reaction in ", err);
        }
    });

    bot.reply(message, "Guys at Google judge this: " + JSON.stringify(tokens));

}
