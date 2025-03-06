import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { commandsMap } from "../commands";
import { handleLimit } from "../utils/handle.messagelimit";

export const handleDeepseekQwen = async (bot: TelegramBot) => {
    bot.on("message", async (msg) => {
        const userCommand = commandsMap.get(msg.chat.id);
        if (userCommand === "deepseekqwen") {
            if (
                msg.text === "/llama3" ||
                msg.text === "/playlist" ||
                msg.text === "/youtube" ||
                msg.text === "/deepseekqwen"
            )
                return;
            // console.log(msg)
            const data = {
                messages: [
                    {
                        role: "system",
                        content: "You are a friendly and helpful chat bot ",
                    },
                    {
                        role: "user",
                        content: msg.text,
                    },
                ],
                max_tokens: 10000,
            };

            console.log(data);
            const res = await axios({
                method: "post",
                url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ID}/ai/run/@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`,
                data: JSON.stringify(data),

                headers: {
                    // Content-Type: "application/json",
                    Authorization: `Bearer ${process.env.CLOUD_FLARE_API_KEY}`,
                },
            });
            const { response, usage } = res.data.result;
            // const [think, result] = response.split("</think>");
            // console.log(response)
            const chunks = handleLimit(response)
            for(const chunk of chunks) {

                await bot.sendMessage(msg.chat.id, chunk);
                await new Promise(resolve => setTimeout(resolve,100))
            }
            // bot.sendMessage(msg.chat.id, );
        }
    });
};
