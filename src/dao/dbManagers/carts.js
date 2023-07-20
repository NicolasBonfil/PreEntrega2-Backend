import cartsModel from "../models/carts.js"

export default class Carts{
    constructor(){
        console.log("Estamos trabajando con bd mongo");
    }

    getCarts = async () => {
        let carts = await cartsModel.find().lean()
        return carts
    }

    createCart = async () => {
        const carts = await this.getCarts()

        const products = []

        const cart = {
            products
        }

        let result = await cartsModel.create(cart)

        return ({status: "success", payload: result})
    }

    getProducts = async (cid) => {
        if(!cid) return ({status: "error", error: "Faltan datos"})
        
        const cart = await cartsModel.findOne({_id: cid})
        if(!cart) return ({status: "error", error: "Carrito inexistente"})

        const carrito = await cartsModel.findOne({_id: cid}).populate("productsInCart.product")

        const pepe = [{quantity: 1, product: {title: "Nico"}}, {quantity: 1, product: {title: "Mariana"}}]
        return (carrito.productsInCart)
    }

    addProductToCart = async (cid, pid) => {
        if(!cid || !pid) return ({status: "error", error: "Faltan datos"})
        
        const cart = await cartsModel.findOne({_id: cid})

        if(!cart) return ({status: "error", error: "Carrito inexistente"})

        const productIndex = cart.productsInCart.findIndex((p) => p.product._id == pid);

        if(productIndex == -1){
            let quantity = 1
            cart.productsInCart.push({quantity, product: {_id: pid}})
        }else{
            cart.productsInCart[productIndex].quantity = parseInt(cart.productsInCart[productIndex].quantity)+1;
        }

        await cartsModel.updateOne({_id: cart.id }, cart);
        return ({status: "success", payload: cart})
    }

    removeProductFromCart = async (cid, pid) => {
        if(!cid || !pid) return ({status: "error", error: "Faltan datos"})
        
        const cart = await cartsModel.findOne({_id: cid})

        if(!cart) return ({status: "error", error: "Carrito inexistente"})

        const productIndex = cart.productsInCart.findIndex((p) => p.product._id == pid);

        if(productIndex == -1) return ({status: "error", error: "Producto no encontrado"})
        
        cart.productsInCart.splice(productIndex, 1)
        await cartsModel.updateOne({_id: cart.id }, cart);
        return ({status: "success", payload: cart})
    }

    updateCartProducts = async (cid, products) => {
        if(!cid || !products) return ({status: "error", error: "Faltan datos"})

        const cart = await cartsModel.findOne({_id: cid})

        if(!cart) return ({status: "error", error: "Carrito inexistente"})

        cart.productsInCart = products

        await cartsModel.updateOne({_id: cart.id }, cart);
        return ({status: "success", payload: cart})
    }

    updateProductQuantity = async (cid, pid, selectedQuantity) => {
        if(!cid || !pid || !selectedQuantity) return ({status: "error", error: "Faltan datos"})

        const cart = await cartsModel.findOne({_id: cid})

        if(!cart) return ({status: "error", error: "Carrito inexistente"})

        const productIndex = cart.productsInCart.findIndex((p) => p.product._id == pid);

        if(productIndex == -1) return ({status: "error", error: "Producto no encontrado"})

        cart.productsInCart[productIndex].quantity = selectedQuantity

        await cartsModel.updateOne({_id: cart.id }, cart);
        return ({status: "success", payload: cart})
    }

    deleteCartProducts = async (cid) => {
        if(!cid) return ({status: "error", error: "Faltan datos"})

        const cart = await cartsModel.findOne({_id: cid})

        if(!cart) return ({status: "error", error: "Carrito inexistente"})

        cart.productsInCart = []

        await cartsModel.updateOne({_id: cart.id }, cart);
        return ({status: "success", payload: cart})
    }
}

