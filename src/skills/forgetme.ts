import { Message, SlackBot, Storage, User } from "botkit";

export function handleForgetMe(bot: SlackBot, message: Message, users: Storage<User>) {

    users.get(message.user || "", (err: Error, user: User) => {

        if (user) {
            // RedisStorage does not implement .delete but .remove
            // see open PR https://github.com/howdyai/botkit-storage-redis/pull/13
            (users as any).remove(message.user as string, (error: Error) => {
                bot.reply(message, "Got it. I forgot about you.");
            });
        }
    });
}
