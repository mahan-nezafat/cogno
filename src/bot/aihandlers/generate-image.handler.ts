import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { commandsMap, messagesMap } from "../commands";
import {
    createReadStream,
    createWriteStream,
    mkdir,
    mkdirSync,
    readFile,
    writeFile,
} from "node:fs";
import path from "node:path";
import fs from "node:fs";

export const handleGenerateImage = async (bot: TelegramBot) => {
    const photosPath = path.join(__dirname, "../../downloads/photos");
    if (!fs.existsSync(photosPath)) {
        fs.mkdirSync(photosPath);
    }
    let chatId: number;
    let message: string;
    let model: string;

    bot.on("callback_query", async (query) => {
        model = query.data;
        chatId = query.message.chat.id;
        await bot.deleteMessage(chatId, messagesMap.get(chatId));
        messagesMap.clear();

        await bot.sendMessage(chatId, "type your prompt");
        console.log("callback");
    });
    bot.on("message", async (msg) => {
        const userCommand = commandsMap.get(msg.chat.id);
        console.log(userCommand);
        if(userCommand !== "generateimage") return
        if (userCommand === "generateimage") {
            if (msg.text === "/start" ||
                msg.text === "/about" ||
                msg.text === "/llama3" ||
                msg.text === "/generateimage" ||
                msg.text === "/deepseekqwen"
            )
                return;

            message = msg.text;
            let fileName = message.trim().replace(/[\\\/:*?"<>|]/g, "_");

            try {
                if (model === "flux") {
                    console.log("choosed flux");

                    const data = {
                        prompt: message,
                        steps: 8,
                    };
                    console.log(data);
                    const res = await axios({
                        method: "post",
                        url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
                        data: JSON.stringify(data),

                        headers: {
                            Authorization: `Bearer ${process.env.CLOUD_FLARE_API_KEY}`,
                        },
                    });

                    const binaryString = atob(await res.data.result.image);
                    // Create byte representation
                    const img = Uint8Array.from(binaryString, (m) =>
                        m.codePointAt(0)
                    );
                    writeFile(
                        `src/downloads/photos/${fileName.slice(0, 20)}.png`,
                        img,
                        (err) => console.log(err)
                    );
                    fs.realpath(
                        `src/downloads/photos/${fileName.slice(0, 20)}.png`,
                        async (err, res) => {
                            console.log(res);
                            console.log(err);
                            await bot.sendPhoto(
                                chatId,
                                createReadStream(res),
                                { caption: `Generated image for: ${message}` },
                                { contentType: "image/png" }
                            );
                        }
                    );
                } else if (model === "stable_diffusion") {
                    console.log("choosed stable_diffusion");

                    const data = {
                        prompt: message,
                        negative_prompt: "",
                        height: 1920,
                        width: 1080,
                        num_steps: 20,
                    };
                    const res = await axios({
                        method: "post",
                        url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ID}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
                        data: JSON.stringify(data),

                        headers: {
                            Authorization: `Bearer ${process.env.CLOUD_FLARE_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                        responseType: "arraybuffer",
                    });

                    // Create byte representation

                    console.log(res.data);
                    writeFile(
                        `src/downloads/photos/${fileName.slice(0, 20)}.png`,
                        res.data,
                        (err) => console.log(err)
                    );
                    fs.realpath(
                        `src/downloads/photos/${fileName.slice(0, 20)}.png`,
                        async (err, res) => {
                            console.log(res);
                            console.log(err);
                            await bot.sendPhoto(
                                chatId,
                                createReadStream(res),
                                { caption: `Generated image for: ${message}` },
                                { contentType: "image/jpg" }
                            );
                        }
                    );
                }
            } catch (error) {
                console.log(error);
            }
        }
    });
};
