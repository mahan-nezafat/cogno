import TelegramBot from "node-telegram-bot-api";

export const commandsMap = new Map();
export const messagesMap = new Map();
console.log(commandsMap, messagesMap)
export const setListOfCommands = (bot: TelegramBot) => {
    try {
        bot.setMyCommands([
            { command: "start", description: "start the bot" },
            { command: "about", description: "about the bot" },
            { command: "help", description: "how to use the bot" },
           
            { command: "llama3", description: "chat with llama3" },
            { command: "deepseekqwen", description: "deepseek qwen 2.5 32b" },
            { command: "generateimage", description: "generate image with stable diffusion" },

        ]);
    } catch (error) {
        console.log(error);
    }
};

// bot -> botontext check command -> get chatid -> send message to with chatid

export const handleBotCommands = async (bot: TelegramBot) => {
    //TODO change the language of the bot based on user when they start it for the first time.
    // starting the bot and greeting user
    bot.onText(/\/start/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            commandsMap.delete(chatId);
            const respose =
                msg.from.language_code === "en"
                    ? `hello ${msg.chat.first_name} the bot has started.`
                    : `سلام ${msg.chat.first_name} ربات استارت شد.`;
            await bot.sendMessage(chatId, respose);
        } catch (error) {
            console.log(error);
        }
    });
    bot.onText(/\/about/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            const respose =
                msg.from.language_code === "en"
                    ? `welcome to social media bot here you can download your favorite content`
                    : ` سلام به ربات سوشیال مدیا خوش آمدید.
    اینجا محتوای مورد نظر خودتون رو میتونید دانلود کنید.`;
            await bot.sendMessage(chatId, respose);
        } catch (error) {
            console.log(error);
        }
    });
    bot.onText(/\/help/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            const respose =
                msg.from.language_code === "en"
                    ? `choose your social media from the commands and send the link url of the content`
                    : `سوشیال مدیا مورد نظر خودتون رو انتخاب و لینک محتوا را ارسال کنید`;
            await bot.sendMessage(chatId, respose);
        } catch (error) {
            console.log(error);
        }
    });
    bot.onText(/\/llama3/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            if (commandsMap.get(chatId) === "llama3") return
            commandsMap.delete(chatId);
            commandsMap.set(chatId, "llama3");
            console.log(commandsMap);

            const respose =
                msg.from.language_code === "en"
                    ? `type a prompt to talk with llama3`
                    : `یک پرامپت بنویسید تا با لاما صحبت کنید`;
            await bot.sendMessage(chatId, respose);
        } catch (error) {
            console.log(error);
        }
    });
    bot.onText(/\/deepseekqwen/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            if (commandsMap.get(chatId) === "deepseekqwen") return
            commandsMap.delete(chatId);
            commandsMap.set(chatId, "deepseekqwen");
            console.log(commandsMap);

            const respose =
                msg.from.language_code === "en"
                    ? `type a prompt to talk with deepseek-qwen`
                    : `یک پرامپت بنویسید تا با دیپ سیک صحبت کنید`;
            await bot.sendMessage(chatId, respose);
        } catch (error) {
            console.log(error);
        }
    });
    bot.onText(/\/generateimage/, async (msg) => {
        try {
            const chatId = msg.chat.id;
            if (commandsMap.get(chatId) === "generateimage") return
            commandsMap.delete(chatId);
            commandsMap.set(chatId, "generateimage");
            console.log(commandsMap);

            const respose =
                msg.from.language_code === "en"
                    ? `choose from these models`
                    : `یکی از مدل ها را انتخاب کنید`;
            await bot.sendMessage(chatId, respose, {
                parse_mode: "MarkdownV2",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "flux-1",
                                    callback_data: "flux",
                                },
                                {
                                    text: "stable diffusion",
                                    callback_data: "stable_diffusion",
                                },
                            ],
                        ],
                    },
            }).then((data) => messagesMap.set(chatId, data.message_id))
        } catch (error) {
            console.log(error);
        }
    });
};

// export const selectFormat = async (bot: TelegramBot) => {};
