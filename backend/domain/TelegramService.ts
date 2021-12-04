import { Telegraf } from "telegraf";
import logger from "../../logger";
import { safeParseJSON } from "../../utils/strings";

export type CommandCallback = (args: { [x: string]: any }) => Promise<void>;
class TelegramService {
  bot = new Telegraf(process.env.TG_API_TOKEN);
  callbacks: Record<string, CommandCallback> = {};

  constructor() {
    if (!process.env.TG_API_TOKEN || !process.env.TG_USER_ID) {
      throw new Error("Missing TG_API_TOKEN and / or TG_USER_ID");
    }
    logger.info("Initializing telegram service...");
    this.bot.on("text", (ctx) => {
      const message = ctx.message.text;
      if (ctx.chat.id.toString() !== process.env.TG_USER_ID) {
        logger.error(
          `Received unexpected messages from user ${ctx.chat.id} who wrote ${message}. Message will be ignored`
        );
        return;
      }
      logger.info(`Received message from user on telegram: ${message}`);
      try {
        const { command, args } = this.parseCommand(message) ?? {};
        if (!command) {
          logger.info(
            `Message "${message}" cannot be parsed as command, skipping`
          );
          return;
        }
        const callback = this.callbacks[command];
        callback(args);
      } catch (e) {
        logger.error(`Error while searching / invoking callback: ${e.message}`);
      }
    });

    this.bot.launch();
  }

  sendMessage(message: string) {
    logger.info(`Sending message to user on Telegram ${message}`);
    this.bot.telegram.sendMessage(process.env.TG_USER_ID, message);
  }

  register(command: string, callback: CommandCallback) {
    this.callbacks[command] = callback;
  }

  asTyping() {
    this.bot.telegram.sendChatAction(process.env.TG_USER_ID, "typing");
  }

  parseCommand(rawCommand: string): {
    command: string;
    args: { [x: string]: string | number };
  } | null {
    const matchedCommand = Object.keys(this.callbacks)
      .sort((a, b) => b.length - a.length)
      .find((command) => rawCommand.startsWith(command));
    if (!matchedCommand) {
      return null;
    }
    logger.info(
      `Found matching command ${matchedCommand} for raw command ${rawCommand}`
    );
    try {
      const argString = rawCommand.replace(matchedCommand, "");
      const args = safeParseJSON(argString) ?? {};
      return { command: matchedCommand, args };
    } catch (e) {
      logger.error(`Failed to parse command ${rawCommand}: ${e.message}`);
    }
  }
}

export default new TelegramService();
