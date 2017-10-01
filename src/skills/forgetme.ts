import { Message, SlackBot, Storage, User } from "botkit";

export function handleForgetMe(bot: SlackBot, message: Message, users: Storage<User>) {

    users.get(message.user || "", (err: Error, user: User) => {

        if (user && users.delete) {

            users.delete(message.user as string, (error: Error) => {
                bot.reply(message, "Got it. I forgot about you.");
            });
        }
    });
}
