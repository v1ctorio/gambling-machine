import Slack, {} from "@slack/bolt";
const { App, subtype } = Slack;

import { config } from "dotenv";
import { Sequelize } from "sequelize";
import { Models } from "./db/db.js";
config();

const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN,SLACK_CLIENT_SECRET } = process.env;


const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "db.sqlite",
});
const { Ludopath } = await Models(sequelize);

const GAMBLE_LOG_CHANNEL = "C085E1BFC8G";

const slack = new App({
	token: SLACK_BOT_TOKEN,
	appToken: SLACK_APP_TOKEN,
	socketMode: true, //TODO dont use socket mode
	signingSecret: SLACK_SIGNING_SECRET,
	port: 6777,
	clientSecret: SLACK_CLIENT_SECRET,
});

export interface Ludopath {
	Id: string; // Airtable record ID and slack ID
	balance: number;
	timesWon: number;
	timesLost: number;
	timestampLastWorked: number;
	timestampLastLuigi: number;
}


async function getLudopath(ctx: Slack.Context, body: Slack.SlashCommand): Promise<Ludopath> {
	let ludopath = await Ludopath.findByPk(ctx.userId);
	if (!ludopath) {
		let chnnel = body.channel_id;
		slack.client.chat.postMessage({
			channel: chnnel,
			text: `This is your first time in the casino, <@${ctx.userId}> - you find four 20 bills in your pocket. You buy chips with them. Now you have 100 chips. Time to gamble`,
		})

		await sleep(1000);

		ludopath = await Ludopath.create({
			Id: ctx.userId,
			balance: 100,
			timesWon: 0,
			timesLost: 0,
			timestampLastWorked: 0,
			timestampLastLuigi: 0,
		});
	}
	return ludopath;

}






slack.command("/gamble", async ({ ack, body, client,respond,context }) => {
	let args = body.text.split(" ");
	if (args[0] == "roulette") {
	const l = await getLudopath(context, body);
	ack();
	let [bet, _amount] = body.text.split(" ");
	
	let numeric = parseInt(bet);
	if (isNaN(numeric) || numeric < 0 || numeric > 36 || (bet != "red" && bet != "black")) {
		respond("Please enter a number between 0 and 36, red or black");
		return;
	}
	
	let amount = parseInt(_amount);
	respond(`You bet ${bet} chips in the roullete`);
	}

});




slack.message(async ({ message, client }) => {



})







function slackLog(content:string) {
	
	slack.client.chat.postMessage({
		channel: GAMBLE_LOG_CHANNEL,
		text: new String(content).substring(0, 1000)
	})

	
}

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
await slack.start();
