import { SlackBot, SlackController, SlackMessage, User } from "../botkit";

export function register(controller: SlackController) {
    controller.hears(["hello", "hi"], "direct_message,direct_mention,mention", (b, m) => handle(b, m, controller));
}

function handle(bot: SlackBot, message: SlackMessage, controller: SlackController) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: "robot_face",
    }, (err, res) => {
        if (err) {
            bot.botkit.log("Failed to add emoji reaction :(", err);
        }
    });

    // Todo: get rid of controller here

    controller.storage.users.get(message.user || "", (err: Error, user: User) => {

        if (user && user.name) {
            bot.reply(message, "Hello " + user.name + "!!");
        } else {
            bot.reply(message, "Hello.");
        }
    });
}
