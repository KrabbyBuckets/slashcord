<a href="https://npmjs.com/package/slashcord"><img src="https://img.shields.io/npm/dt/slashcord.svg?maxAge=3600"></img></a>
![Slashcord](./img/downloa.png)

# Slashcord!

📌
A simple to use command handler that was made specifically
for **slash commands**, which features that any developer can use!

# Installation

Assuming you use **npm**, do the following commands:

```bash
npm i discord.js
npm i slashcord
```

# Usage

**Slashcord** is very simple to use, use the [guide](https://slashcord.gitbook.io/home/) for more info!

You can use this example to set it up!

```js
const { Client } = require("discord.js");
const { Slashcord } = require("slashcord").default;

// Initiate the client
const client = new Client();

client.on("ready", () => {
  new Slashcord(client);
});

// Get your token at discord.com/developers/applications
client.login("token");
```

# Support

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

**Get your [support](https://discord.gg/36nFHPmRqk) in the discord server!**
