import { Router } from "express"

import CartManager from "../dao/dbManagers/carts.js"

const manejadorCarrito = new CartManager()

const router = Router()

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid

    const cart = await manejadorCarrito.getProducts(cid)
    res.send({cart})
})

router.post("/", async (req, res) => {
    const newCart = await manejadorCarrito.createCart()
    res.send(newCart)
})

router.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    const addedProduct = await manejadorCarrito.addProductToCart(cid, pid)
    res.send(addedProduct)
})


router.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    const removedProduct = await manejadorCarrito.removeProductFromCart(cid, pid)
    res.send(removedProduct)
})

router.put("/:cid", async (req, res) => {
    const cid = req.params.cid
    const products = req.body

    const productsToAdd = []

    products.forEach(p => {
        if(!p.product._id || !p.quantity) return res.send({status: "error", error: "Faltan datos"})  
        
        let id = p.product._id
        let quantity = p.quantity
        if(productsToAdd.find(prod => prod.product._id == id)){
            const producto = productsToAdd.find(prod => prod.product._id == id)
            producto.quantity += quantity
        }else{
            productsToAdd.push({quantity, product:{_id:id}})
        }

        //if(!p.product._id || !p.quantity) return res.send({status: "error", error: "Faltan datos"})
    })

    const updatedProducts = await manejadorCarrito.updateCartProducts(cid, productsToAdd)
    res.send(updatedProducts)
})

router.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const {quantity} = req.body

    const updatedQuantity = await manejadorCarrito.updateProductQuantity(cid, pid, quantity)
    res.send(updatedQuantity)
})

router.delete("/:cid", async (req, res) => {
    const cid = req.params.cid

    const removedProducts = await manejadorCarrito.deleteCartProducts(cid)
    res.send(removedProducts)
})

export default router