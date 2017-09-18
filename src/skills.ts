import { SlackBot, SlackController, SlackMessage } from "./botkit";

export class Skills {

    public static on(controller: SlackController) {
        return new Skills(controller);
    }

    private constructor(private controller: SlackController) {
    }

    public addDirectHandler(keywords: string[], handler: (bot: SlackBot, message: SlackMessage) => void): Skills {
        const directEvents = "direct_message,direct_mention,mention";

        this.controller.hears(keywords, directEvents, handler);

        return this;
    }
}
