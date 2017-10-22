import { SlackBot, SlackMessage } from "botkit";
import { NaturalLanguageService } from "./natural-language-service";
import { handleCallMe } from "./skills/callme";
import { handleForgetMe } from "./skills/forgetme";
import { handleAmbientFuss } from "./skills/fuss";
import { handleHello } from "./skills/hello";
import { handlePOSDebug } from "./skills/pos-debug";
import { handleUptime } from "./skills/uptime";
import { handleWhatIsMyName } from "./skills/whatismyname";
import { exitIfMissing } from "./utils";

const Botkit = require("botkit");
const RedisStorage = require("botkit-storage-redis");

exitIfMissing('REDIS_URL');
const redisStorage = RedisStorage({
    url: process.env.REDIS_URL,
});

const controller = Botkit.slackbot({
    debug: false,
    storage: redisStorage,
});

exitIfMissing('SLACK_API_TOKEN');
const slackBot: SlackBot = controller.spawn({
    token: process.env.SLACK_API_TOKEN,
}).startRTM();

const naturalLanguageService = NaturalLanguageService.fromEnvVars();


registerDirect(["hello", "hi"],
    (bot, message) => handleHello(bot, message, controller.storage.users));

registerDirect(["call me (.*)", "my name is (.*)"],
    (bot, message) => handleCallMe(bot, message, controller.storage.users));

registerDirect(["forget me"],
    (bot, message) => handleForgetMe(bot, message, controller.storage.users));

registerDirect(["what is my name", "who am i"],
    (bot, message) => handleWhatIsMyName(bot, message, controller.storage.users));

registerDirect(["uptime"], handleUptime);

registerDirect(["nl (.*)", "pos (.*)"],
    (bot, message) => handlePOSDebug(bot, message, naturalLanguageService));


function registerDirect(keywords: string[],
                        handler: (bot: SlackBot, message: SlackMessage) => void) {
    const directEvents = "direct_message,direct_mention,mention";

    controller.hears(keywords, directEvents, handler);
}


registerAmbient((bot, message) => handleAmbientFuss(bot, message, naturalLanguageService));

function registerAmbient(handler: (bot: SlackBot, message: SlackMessage) => void) {
    controller.on("ambient", handler);
}
