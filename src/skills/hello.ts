import { SlackBot, SlackMessage, Storage, User } from "botkit";

export function handleHello(bot: SlackBot, message: SlackMessage, users: Storage<User>) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: "robot_face",
    }, (err, res) => {
        if (err) {
            bot.botkit.log("Failed to add emoji reaction :(", err);
        }
    });

    users.get(message.user || "", (err: Error, user: User) => {

        if (user && user.name) {
            bot.reply(message, "Hello " + user.name + "!!");
        } else {
            bot.reply(message, "Hello.");
        }
    });
}
