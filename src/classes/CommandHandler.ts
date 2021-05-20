import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { Slashcord } from "..";
import Command from "../extras/Command";
import Interaction from "../extras/Interaction";
import getFiles from "../utils/getFiles";

class CommandHandler {
  private commands: Map<string, Command> = new Map();
  constructor(handler: Slashcord, client: Client, dir: string) {
    // Checking if the directory exists.
    if (!fs.existsSync(dir)) {
      throw new Error(
        `Slashcord >> The commands directory: "${dir}" does not exist!`
      );
    }

    const files = getFiles(dir);
    const amount = files.length;
    if (amount < 0) return;

    console.log(`Slashcord >> Loaded ${amount} command(s)`);

    for (const [file, fileName] of files) {
      const command = require(file);
      const { name = fileName, description, options, testOnly } = command;

      if (!description) {
        throw new Error(
          `Slashcord >> A description is required for the command: "${name}" since they are required in slash commands.`
        );
      }

      if (testOnly && !handler.testServers.length) {
        throw new Error(`
          Slashcord >> You specified "${name}" with the "testOnly" feature, yet there aren't test servers!
        `);
      }

      if (testOnly) {
        for (const server of handler.testServers) {
          (async () => {
            await handler.slashCommands.create(
              name,
              description,
              options,
              server
            );
            this.commands.set(name, command);
          })();
        }
      } else {
        (async () => {
          await handler.slashCommands.create(name, description, options);
          this.commands.set(name, command);
        })();
      }
    }

    //@ts-ignore
    client.ws.on("INTERACTION_CREATE", (interaction) => {
      const { name, options } = interaction.data;
      const cmdName = name.toLowerCase();

      const command = this.commands.get(cmdName);
      // if (!command) return;

      interaction = new Interaction(interaction, { client });

      try {
        command!.execute({ client, interaction, args: options });
      } catch (err) {
        console.log(
          `Slashcord >> Error running the command: "${command!.name}":`,
          err
        );
      }
    });
  }
}

export = CommandHandler;