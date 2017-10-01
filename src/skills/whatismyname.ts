import { Conversation, Message, SlackBot, SlackMessage, Storage, User } from "botkit";

export function handleWhatIsMyName(bot: SlackBot, message: Message, users: Storage<User>) {

    users.get(message.user || "", (err: Error, user: User) => {

        if (user && user.name) {
            bot.reply(message, "Your name is " + user.name);

        } else {
            bot.startConversation(message, (err: Error, convo: Conversation<SlackMessage>) => {
                if (!err) {
                    convo.say("I do not know your name yet!");

                    convo.ask("What should I call you?", (answer: SlackMessage, convo: Conversation<SlackMessage>) => {

                        convo.ask("You want me to call you `" + answer.text + "`?", [
                            {
                                pattern: "yes",
                                callback(answer: SlackMessage, convo: Conversation<SlackMessage>) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                },
                            },
                            {
                                pattern: "no",
                                callback(answer: SlackMessage, convo: Conversation<SlackMessage>) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                },
                            },
                            {
                                default: true,
                                callback(answer: SlackMessage, convo: Conversation<SlackMessage>) {
                                    convo.repeat();
                                    convo.next();
                                },
                            },
                        ]);

                        convo.next();

                    }, { key: "nickname" }); // store the results in a field called nickname

                    convo.on("end", (convo: Conversation<SlackMessage>) => {
                        if (convo.status === "completed") {

                            users.get(message.user || "", (err: Error, user: User) => {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    } as User;
                                }
                                user.name = convo.extractResponse("nickname");
                                users.save(user, (error: Error) => {
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
}
