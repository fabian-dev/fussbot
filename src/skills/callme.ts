import { Message, SlackBot, Storage, User } from "../botkit";

export function handleCallMe(bot: SlackBot, message: Message, users: Storage<User>) {

    if (message.match) {

        const name = message.match[1];

        users.get(message.user || "", (err: Error, user: User) => {
            if (!user) {
                user = {
                    id: message.user,
                } as User;
            }

            user.name = name;
            users.save(user, (error: Error, id) => {
                bot.reply(message, "Got it. I will call you " + user.name + " from now on.");
            });
        });
    }
}
