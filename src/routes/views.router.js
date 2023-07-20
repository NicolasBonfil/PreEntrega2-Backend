import { Router } from "express"
import messagesManager from "../dao/dbManagers/messages.js"
import cartsManager from "../dao/dbManagers/carts.js"
import productsModel from "../dao/models/products.js"

const manejadorMensajes = new messagesManager()
const manejadorCarrito = new cartsManager()

const router = Router()

router.get("/", async (req, res) => {
    let messages = await manejadorMensajes.getAllMessages()
    res.render("chat", {messages})
})

router.get("/products", async (req, res) => {
    const {page = 1} = req.query
    const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {limit: 2, page, lean: true})

    const products = docs

    res.render("products", {
        products,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage
    })
})

router.get("/carts/:cid", async (req, res) => {
    const cid = req.params.cid
    const products = await manejadorCarrito.getProducts(cid)
    res.render("carts", {products})
})

export default router
