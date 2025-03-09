import express, { Express, Request, Response, NextFunction } from "express";
import axios from "axios";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs, { createWriteStream, writeFileSync } from "node:fs";
import { AppDataSource } from "./data-source";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { handleBotCommands, setListOfCommands } from "./bot/commands";
import { handleBotErrors } from "./bot/errors/errors.handle";
import { handleLlama3 } from "./bot/aihandlers/llama3.handler";
import { handleDeepseekQwen } from "./bot/aihandlers/deepseek-qwen32b.handler";
import { handleGenerateImage } from "./bot/aihandlers/generate-image.handler";
import path from "node:path";
// import { Client } from "@gradio/client";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Bot initialization

const token = process.env.BOT_TOKEN;
if (!token) {
    console.log("BOT_TOKEN must be provided!");
}
export const contextPath = path.join(__dirname, "context");
const downloadPath = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
}
if (!fs.existsSync(contextPath)) {
    fs.mkdirSync(contextPath);
}

const bot = new TelegramBot(token, {
    baseApiUrl: process.env.BASE_URL,
    polling: true,
});

// After bot initialization
setListOfCommands(bot);
handleBotCommands(bot);
handleBotErrors(bot);
handleLlama3(bot);
handleDeepseekQwen(bot);
handleGenerateImage(bot);
export default app;
