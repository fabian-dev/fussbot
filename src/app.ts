import { SlackBot, SlackMessage } from "botkit";
import { handleHello } from "./skills/hello";
import { handleUptime } from "./skills/uptime";
import { handleCallMe } from "./skills/callme";
import { handleWhatIsMyName } from "./skills/whatismyname";

const Botkit = require("botkit");
const RedisStorage = require("botkit-storage-redis");

if (!process.env.SLACK_API_TOKEN) {
    console.log("Error: Specify Slacks API token in environment");
    process.exit(1);
}

if (!process.env.REDIS_URL) {
    console.log("Error: Specify redis url in environment");
    process.exit(1);
}

const redisStorage = RedisStorage({
    url: process.env.REDIS_URL,
});

const controller = Botkit.slackbot({
    debug: false,
    storage: redisStorage,
});

const slackBot: SlackBot = controller.spawn({
    token: process.env.SLACK_API_TOKEN,
}).startRTM();


registerDirect(["hello", "hi"],
    (bot, message) => handleHello(bot, message, controller.storage.users));

registerDirect(["call me (.*)", "my name is (.*)"],
    (bot, message) => handleCallMe(bot, message, controller.storage.users));

registerDirect(["what is my name", "who am i"],
    (bot, message) => handleWhatIsMyName(bot, message, controller.storage.users));

registerDirect(["uptime"], handleUptime);

function registerDirect(keywords: string[],
                        handler: (bot: SlackBot, message: SlackMessage) => void) {
    const directEvents = "direct_message,direct_mention,mention";

    controller.hears(keywords, directEvents, handler);
}
