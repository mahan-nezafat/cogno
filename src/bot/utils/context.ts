import fs from "node:fs";
// import { contextFile } from "../..";

export const ctx = new Map();
const messages = [];
export const setCtx = (userId: number, message: string, isUser: boolean) => {
    const obj = {
        from: isUser ? "user" : "system",
        message: message,
    };
    messages.push(obj);
    
    ctx.set(userId, messages);
    console.log(ctx);
    
    return ctx;
};

export const getCtx = (userId: number): [] => {
    const messages = ctx.get(userId);
    return messages;
};

export const deleteCtx = (userId: number) => {
    ctx.delete(userId);
    return ctx;
};
