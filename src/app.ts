import { SlackBot, SlackMessage } from "botkit";
import { handleHello } from "./skills/hello";
import { handleUptime } from "./skills/uptime";
import { handleCallMe } from "./skills/callme";

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

registerDirect(["uptime"], handleUptime);

function registerDirect(keywords: string[],
                        handler: (bot: SlackBot, message: SlackMessage) => void) {
    const directEvents = "direct_message,direct_mention,mention";

    controller.hears(keywords, directEvents, handler);
}

/*
controller.hears(["what is my name", "who am i"], "direct_message,direct_mention,mention", function (bot, message) {

    controller.storage.users.get(message.user, function (err, user) {
        if (user && user.name) {
            bot.reply(message, "Your name is " + user.name);
        } else {
            bot.startConversation(message, function (err, convo) {
                if (!err) {
                    convo.say("I do not know your name yet!");
                    convo.ask("What should I call you?", function (response, convo) {
                        convo.ask("You want me to call you `" + response.text + "`?", [
                            {
                                pattern: "yes",
                                callback(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                },
                            },
                            {
                                pattern: "no",
                                callback(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                },
                            },
                            {
                                default: true,
                                callback(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                },
                            },
                        ]);

                        convo.next();

                    }, {key: "nickname"}); // store the results in a field called nickname

                    convo.on("end", function (convo) {
                        if (convo.status === "completed") {
                            bot.reply(message, "OK! I will update my dossier...");

                            controller.storage.users.get(message.user, function (err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse("nickname");
                                controller.storage.users.save(user, function (err, id) {
                                    bot.reply(message, "Got it. I will call you " + user.name + " from now on.");
                                });
                            });

                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, "OK, nevermind!");
                        }
                    });
                }
            });
        }
    });
});

*/
