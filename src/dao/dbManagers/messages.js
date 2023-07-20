import messagesModel from "../models/messages.js";

export default class Messages{
    constructor(){
        console.log("Estamos trabajando con bd mongo");
    }

    getAllMessages = async () => {
        let messages = await messagesModel.find().lean()
        return messages
    }

    saveMessages = async (user, message) => {
        if(!user || !message) return ({status: "error", error: "Faltan datos"})
        let result = await messagesModel.create({user, message})
        return result
    }
}