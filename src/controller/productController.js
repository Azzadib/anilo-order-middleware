//* not used in main transaction. Created only to check available product and product changes after order

import products from "../models/products"

const getAllProducts = (_, res) => {
    try {
        return res.send(products)
    } catch (error) {
        console.log('Get all products', error)
        return res.status(500).send({ mesage: 'Failed to get all products.'})
    }
}

const getOneProduct = (req, res) => {
    try {
        const { id } = req.params
        if (isNaN(id)) return res.status(400).send({ message: "Product id is null or has wrong type." })

        const product = products.filter((p) => p.id == id)[0]
        
        if (product) return res.status(200).send(product)

        return res.status(404).send({ message: "Product not found."})
    } catch (error) {
        console.log('Get product', error)
        return res.status(500).send({ mesage: 'Failed to get product.'})
    }
}

export default {
    getAllProducts,
    getOneProduct
}