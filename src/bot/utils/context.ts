export const ctx = new Map()
const messages = []
export const setCtx = (userId: number, message:string) => {
    messages.push(message)
    ctx.set(userId, messages)
    console.log(ctx)
    return ctx
}

export const getCtx = (userId: number):[] => {
    const messages = ctx.get(userId)
    return messages
}

export const deleteCtx = (userId: number) => {
    ctx.delete(userId)
    return ctx
}