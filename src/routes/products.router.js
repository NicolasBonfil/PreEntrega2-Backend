import { Router } from "express"

import ProductManager from "../dao/dbManagers/products.js"
import productsModel from "../dao/models/products.js"

const router = Router()

const manejadorProductos = new ProductManager()

router.get("/", async (req, res) => {
    const {limit = 10} = req.query
    const {page = 1} = req.query

    let filtro = {};

    if(req.query.status == "true"){
        filtro = {status: true}
    }else if(req.query.status == "false"){
        filtro = {status: false}
    }else if(req.query.category){
        filtro = {category: req.query.category}
    }

    const {totalPages, docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate(filtro, {limit, page, lean: true})
    
    let products = docs

    if(req.query.sort == "asc"){
        products = await productsModel.find().sort({price: 1})
    }else if(req.query.sort == "desc"){
        products = await productsModel.find().sort({price: -1})
    }

    let prevLink
    hasPrevPage? prevLink = prevLink = `http://localhost:8080/products?page=${prevPage}` : null
    
    let nextLink
    hasNextPage? nextLink = nextLink = `http://localhost:8080/products?page=${nextPage}` : null

    res.send({status: "success", payload: products, totalPages, page, hasPrevPage, hasNextPage, nextPage, prevPage, prevLink, nextLink})
})

router.post("/", async (req, res) => {
    const {title, description, price, code, stock, category, thumbnail} = req.body

    let product = {
        title,
        description,
        price,
        code,
        stock,
        category,
        thumbnail
    }

    const newProduct = await manejadorProductos.addProduct(product)

    res.send(newProduct)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const product = await manejadorProductos.getProductById(id)

    res.send(product)
})

router.put("/:id", async (req, res) => {
    const id = req.params.id
    const datosActualizados = req.body

    const productoActualizado = await manejadorProductos.updateProduct(id, datosActualizados)

    res.send(productoActualizado)
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id

    const productoEliminado = await manejadorProductos.deleteProduct(id)

    res.send(productoEliminado)
})

export default router