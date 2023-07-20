import { Router } from "express"
import express from "express"
import socketServer from "../apps.js"
import __dirname from "../utils.js"

import messagesManager from "../dao/dbManagers/messages.js"

const app = express()

app.use(express.static(__dirname + "/public"))

const manejadorMensajes = new messagesManager()

const router = Router()

router.post("/", async (req, res) => {
    const {user, message} = req.body

    const newMessage = await manejadorMensajes.saveMessages(user, message)

    socketServer.emit("newMessage", newMessage)

    res.send(({status: "success", payload: newMessage}))
})

export default router