import express from "express"
import __dirname from "./utils.js"
import { Server } from "socket.io"

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import messagesRouter from "./routes/messages.router.js"
import viewRouter from "./routes/views.router.js"
import handlebars from "express-handlebars"

import mongoose from "mongoose"

const app = express()
const PORT = 8080

mongoose.set("strictQuery", false)

const connection = mongoose.connect("mongodb+srv://bonfilnico:12345@pruebacoder.q69nl8a.mongodb.net/?retryWrites=true&w=majority", {dbName: "ecommerce"})

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/messages", messagesRouter)
app.use("/", viewRouter)

const httpserver = app.listen(8080, () => console.log("Server arriba"))
const socketServer = new Server(httpserver)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente");
})

export default socketServer

