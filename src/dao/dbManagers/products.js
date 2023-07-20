import productsModel from "../models/products.js";

export default class Products{
    constructor(){
        console.log("Estamos trabajando con bd mongo");
    }

    getProducts = async () => {
        let products = await productsModel.find().lean()
        return products
    }

    getProductById = async (id) => {
        const products = await this.getProducts()

        if(!(products.find(p => p._id == id))) return ({status: "error", error: "No existe un producto con ese id"})
        return(products.find(p => p._id == id))
    }

    addProduct = async product => {
        const products = await this.getProducts()

        if(!product.title || !product.description || !product.price || !product.code || !product.category){
            return({status: "error", error: "Faltan datos"})
        }

        if(product.stock === 0) product.status = false

        const productoAgregado = products.find(p => p.code == product.code)
        if(productoAgregado){
            return ({status: "error", error: "El producto ya esta registrado"})
        }

        let result = await productsModel.create(product)

        return ({status: "success", payload: result})
    }

    updateProduct = async (pid, datosActualizados) => {
        const product = await productsModel.findOne({_id: pid})

        const keys = Object.keys(datosActualizados)
        const values = Object.values(datosActualizados)

        if(!(product)){
            return ({status: "error", error: "No existe un producto con ese id"})
        }

        if(keys.includes("id")){
            const indice = keys.indexOf("id")
            keys.splice(indice, 1)
            values.splice(indice, 1)
        }

        if(keys.includes("code")){
            const indice = keys.indexOf("code")
        
            const productoAgregado = await productsModel.findOne({code: values[indice]})

            if(productoAgregado){
                return ({status: "error", error: "Ya hay un producto con ese codigo"})
            }
        }

        for(let i = 0; i < keys.length; i++){
            let llave = keys[i]
            let valor = values[i]
            product[llave] = valor
            await productsModel.updateOne({_id: pid}, product);
        }

        return ({status: "success", payload: product})
    }

    deleteProduct = async (pid) => {
        const product = await productsModel.findOne({_id: pid})
        
        if(!(product)){
            return ({status: "error", error: "No existe un producto con ese id"})
        }
        
        await productsModel.deleteOne({_id: pid})
    
        return({status: "Ok", message: "Producto eliminado"})
    }
}