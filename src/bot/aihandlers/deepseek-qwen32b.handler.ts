import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { commandsMap } from "../commands";
import { handleLimit } from "../utils/handle.messagelimit";
import { getCtx, setCtx } from "../utils/context";

export const handleDeepseekQwen = async (bot: TelegramBot) => {
    bot.on("message", async (msg) => {
        const userCommand = commandsMap.get(msg.chat.id);
        if (userCommand === "deepseekqwen") {
            if (
                msg.text === "/llama3" ||
                msg.text === "/generateimage" ||
                msg.text === "/deepseekqwen"
            )
                return;
            // console.log(msg)
            setCtx(msg.chat.id, msg.text, true);

            const res = await sendData(msg.text, "", msg.chat.id);

            const { response, usage } = res.data.result;
            console.log(response)
            setCtx(msg.chat.id, response, false);
            
            const chunks = handleLimit(response)
            for(const chunk of chunks) {

                await bot.sendMessage(msg.chat.id, chunk);
                await new Promise(resolve => setTimeout(resolve,100))
            }
           
        }
    });
};


const sendData = async (data, caption, userId) => {
    const messages = getCtx(userId);
   

    messages.join("\n");
    
    const dataobj = {
        messages: [
            {
                role: "system",
                content: "You are a friendly and helpful chat bot ",
            },
            {
                role: "user",
                content: `${caption} \n ${JSON.stringify(messages)} \n ${data}`,
            },
        ],
        repetition_penalty: 1,
        max_tokens: 10000,
    };

    const res = await axios({
        method: "post",
        url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ID}/ai/run/@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`,
        data: JSON.stringify(dataobj),

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.CLOUD_FLARE_API_KEY}`,
        },
    });
    return res;
};