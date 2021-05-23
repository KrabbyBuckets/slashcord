import { Client } from "discord.js";
import fs from "fs";
import path from "path";

import Slashcord from "..";
import Command from "../extras/Command";
import Interaction from "../extras/Interaction";
import Slasherror from "../extras/SlashError";
import getFiles from "../utils/getFiles";

class CommandHandler {
  private commands: Map<string, Command> = new Map();
  constructor(handler: Slashcord, client: Client, dir: string) {
    const newDir = path.isAbsolute(dir)
      ? dir
      : path.join(require.main!.path, dir);

    // Checking if the directory exists.
    if (!fs.existsSync(newDir)) {
      throw new Slasherror(`The commands directory: "${dir}" does not exist!`);
    }

    const files = getFiles(newDir);
    const amount = files.length;
    if (amount < 0) return;

    console.log(
      `Slashcord >> Loaded ${amount} command${files.length === 1 ? "" : "s"}!`
    );

    for (const [file, fileName] of files) {
      (async () => {
        //@ts-ignore
        const command = require(file).default || require(file)
        const { name = fileName, description, options, testOnly } = command;

      if(!command) return;

      if (!description) {
        throw new Slasherror(
          `A description is required for the command: "${name}" since they are required in slash commands.`
        );
      }

      if (testOnly && !handler.testServers) {
        throw new Slasherror(`
          You specified "${name}" with the "testOnly" feature, yet there aren't test servers!
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
      })()
      
      
    }

    //@ts-ignore
    client.ws.on("INTERACTION_CREATE", async (interaction) => {
      
      const { name, options } = interaction.data;
      const cmdName = name.toLowerCase();

      const command = this.commands.get(cmdName);
      if (!command) return;

      interaction = new Interaction(await interaction, { client });

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
