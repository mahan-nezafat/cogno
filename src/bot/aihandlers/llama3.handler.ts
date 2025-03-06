import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { commandsMap } from "../commands";
import pdf from "pdf-parse";
import {
    createReadStream,
    createWriteStream,
    readFile,
    readFileSync,
    writeFile,
} from "node:fs";
import path, { resolve } from "node:path";
import { rejects } from "node:assert";
import { getCtx, setCtx } from "../utils/context";
import { handleLimit } from "../utils/handle.messagelimit";

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

            const res = await sendData(msg.text, "", msg.chat.id);
            console.log("gg");
            setCtx(msg.chat.id, msg.text);
            // if (res) {
            //     const chunks = handleLimit(res.data.result.response);
            //     for (const chunk of chunks) {
            //         await bot.sendMessage(msg.chat.id, chunk);
            //         await new Promise((resolve) => setTimeout(resolve, 100));
            //     }
            // }
            await bot.sendMessage(msg.chat.id, res.data.result.response);

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
            sendData(buffer, msg.caption, msg.chat.id).then((data) => {
                setCtx(msg.chat.id, data.data.result.response);

                bot.sendMessage(msg.chat.id, data.data.result.response);
            });
        } else if (pdfRegex.test(fileStringData)) {
            console.log("file is pdf");
            const buffer = readFileSync(fileStringData);
            const { info, text } = await pdf(buffer);
            console.log(info, text);
            sendData(text, msg.caption, msg.chat.id).then((data) => {
                setCtx(msg.chat.id, data.data.result.response);

                bot.sendMessage(msg.chat.id, data.data.result.response);
            });
        }
        // console.log(msg, fileStringData);
        // createReadStream(fileStringData)
    });
};

const sendData = async (data, caption, userId) => {
    const messages = getCtx(userId);
    // console.log("gg2")

    messages ? messages.join(" ") : console.log("gg2");
    console.log(messages);
    const dataobj = {
        messages: [
            {
                role: "system",
                content: "You are a friendly and helpful chat bot ",
            },
            {
                role: "user",
                content: `${caption} \n ${messages} \n ${data}`,
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
