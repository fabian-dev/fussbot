import { SlackBot, SlackMessage } from "botkit";
import { NaturalLanguageService } from "../natural-language-service";

export function handlePOSDebug(bot: SlackBot, message: SlackMessage, nlService: NaturalLanguageService) {

    if (message.match) {
        const toAnalyse = message.match[1];
        nlService.analyse(toAnalyse).then(tokens => bot.reply(message, JSON.stringify(tokens)));
    }
}
