import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { commandsMap } from "../commands";
import pdf from 'pdf-parse'
import {
    createReadStream,
    createWriteStream,
    readFile,
    readFileSync,
    writeFile,
} from "node:fs";
import path, { resolve } from "node:path";
import { rejects } from "node:assert";

export const handleLlama3 = async (bot: TelegramBot) => {
    const dlpath = path.join(__dirname, "../../downloads/");
    bot.on("text", async (msg) => {
        const userCommand = commandsMap.get(msg.chat.id);
        if (userCommand === "llama3") {
            if (
                msg.text === "/llama3" ||
                msg.text === "/playlist" ||
                msg.text === "/youtube"
            )
                return;
            // console.log(msg)

            const res = await sendData(msg.text, "");
            // console.log(res.data.result.response);
            bot.sendMessage(msg.chat.id, res.data.result.response);
        }
    });
    bot.on("document", async (msg) => {
        const txtRegex = /\.txt$/;
        const pdfRegex = /\.pdf$/;
        const fileStringData = await bot.downloadFile(
            msg.document.file_id,
            dlpath
        );
        if (txtRegex.test(fileStringData)) {
            let buffer = readFileSync(fileStringData);
            sendData(buffer, msg.caption).then((data) => {
                bot.sendMessage(msg.chat.id, data.data.result.response);
            });
        }else if(pdfRegex.test(fileStringData)) {
            console.log('file is pdf')
            const buffer = readFileSync(fileStringData)
            const {info, text} = await pdf(buffer)
            console.log(info, text)
            sendData(text, msg.caption).then((data) => {
                bot.sendMessage(msg.chat.id, data.data.result.response);
            });
        }
        // console.log(msg, fileStringData);
        // createReadStream(fileStringData)
    });
};

const sendData = async (data, caption) => {
    
    const dataobj = {
        messages: [
            {
                role: "system",
                content: "You are a friendly and helpful chat bot ",
            },
            {
                role: "user",
                content: `${caption} \n ${data}`,
            },
        ],
        max_tokens: 10000,
    };

    const res = await axios({
        method: "post",
        url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`,
        data: JSON.stringify(dataobj),

        headers: {
            " Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CLOUD_FLARE_API_KEY}`,
        },
    });
    return res;
};
