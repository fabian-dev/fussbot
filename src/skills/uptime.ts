import { Message, SlackBot } from "../botkit";
import * as os from "os";

export function handleUptime(bot: SlackBot, message: Message) {

    const hostname = os.hostname();
    const uptime = formatUptime(process.uptime());

    bot.reply(message,
        ":robot_face: I am a bot named <@" + bot.identity.name +
        ">. I have been running for " + uptime + " on " + hostname + ".");

}

function formatUptime(uptime: any) {
    let unit = "second";
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = "minute";
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = "hour";
    }
    if (uptime !== 1) {
        unit = unit + "s";
    }

    uptime = uptime + " " + unit;
    return uptime;
}
