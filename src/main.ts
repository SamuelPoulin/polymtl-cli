import config from "./config";

import { Client, GatewayIntentBits } from "discord.js";
import { Browser, BrowserContext, chromium } from "playwright";
import { compareGrades, fetchNewGrades } from "./grades";

let browser: Browser;
let discordClient: Client;

const init = async () => {
  browser = await chromium.launch();
  discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

  await discordClient.login(config.discordToken);
};

const main = async () => {
  try {
    await init();

    startFetching();
  } catch (e) {
    console.error(e);
  }
};

const startFetching = async () => {
  await fetchGrades();

  setTimeout(async () => {
    startFetching();
  }, parseInt(config.fetchInterval));
};

const fetchGrades = async () => {
  const context = await browser.newContext();

  await fetchNewGrades(context);
  const changed = await compareGrades();

  if (changed) {
    const channel = await discordClient.channels.fetch(config.discordChannel);

    if (channel?.isTextBased()) {
      channel.send({
        content: "@everyone New grades have been posted!",
        files: ["output/grades-new.pdf"],
      });
    }
  }

  context.close();
};

main();
