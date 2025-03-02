import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { commandsMap } from "../commands";
import { createReadStream, createWriteStream, mkdir, mkdirSync, readFile, writeFile } from "node:fs";
import path from "node:path";
import fs from 'node:fs'

export const handleGenerateImage = async (bot: TelegramBot) => {
    const photosPath = path.join(__dirname, "../../downloads/photos");
    if (!fs.existsSync(photosPath)) {
            fs.mkdirSync(photosPath);
        }
    
    bot.on("message", async (msg) => {
        const userCommand = commandsMap.get(msg.chat.id);
        if (userCommand === "generateimage") {
            if (
                msg.text === "/llama3" ||
                msg.text === "/playlist" ||
                msg.text === "/youtube" ||
                msg.text === "/deepseekqwen" ||
                msg.text === "/generateimage"
            )
                return;
            // console.log(msg)
            const data = {
                prompt: msg.text,
                steps: 8
                // negative_prompt: "",
                // height: 1920 ,
                // width: 1080 ,
                // num_steps: 20 ,

            };

            try {
                console.log(data);
            const res = await axios({
                method: "post",
                url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
                data: JSON.stringify(data),

                headers: {
                    
                    "Authorization": `Bearer ${process.env.CLOUD_FLARE_API_KEY}`,
                },
            });
            
           
            const binaryString = atob(await res.data.result.image);
            // Create byte representation
            const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0));
            writeFile(`src/downloads/photos/${msg.text}.png`,img, (err) => console.log(err))
            fs.realpath(`src/downloads/photos/${msg.text}.png`, async (err,res) => {

                console.log(res)
                console.log(err)
                await bot.sendPhoto(msg.chat.id, createReadStream(res), {caption: `Generated image for: ${msg.text}` }, {contentType:"image/png"});
            })
            } catch (error) {
                console.log(error)
            }
        }
    });
};
