export const verifyUser = async (bot, msg): Promise<boolean> => {
    const userChannelInfo = await bot.getChatMember(
        "@cogno_Aibot",
        msg.from.id
    );
    const { status } = userChannelInfo;
    console.log(userChannelInfo);
    if (
        status == "administrator" ||
        status == "creator" ||
        status == "member"
    ) {
        console.log(
            `user ${userChannelInfo.user.first_name} is allowed to message the bot`
        );
        return true;
    } else {
        console.log(
            `user ${userChannelInfo.user.first_name} is not allowed to message the bot`
        );
        return false;
    }
};
    