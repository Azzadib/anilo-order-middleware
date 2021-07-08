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

const getSelectedProducts = (req, res, next) => {
    try {
        const selected = []
        const notAvailable = []
        const { slctdProds } = req.body
        slctdProds.map((slctd) => {
            products.map((product) => { 
                if (product.id == slctd.product_id) {
                    if (product.quantities <= 0 || product.quantities < slctd.order_qty) notAvailable.push(product.id)
                    selected.push(product)
                }
            })
        })

        req.selected = selected
        req.notAvailable = notAvailable
        next()
    } catch (error) {
        console.log('Get selected products', error)
        return res.status(500).send({ message: "Failed to add product to order"})
    }
}

const getOrderedProducts = (req, res, next) => {
    try {
        const selected = []
        const notAvailable = []
        const { added_products } = req.order
        added_products.map((slctd) => {
            products.map((product) => { 
                if (product.id == slctd.product_id) {
                    if (product.quantities <= 0 || product.quantities < slctd.order_qty) notAvailable.push(product.id)
                    selected.push(product)
                }
            })
        })

        req.selected = selected
        req.notAvailable = notAvailable
        next()
    } catch (error) {
        console.log('Get ordered products', error)
        return res.status(500).send({ message: "Failed to place product to order"})
    }
}

const reduceProductQty = (req, res, next) => {
    try {
        const selected = req.order.added_products
        console.log('slctd', selected)
        const notAvailable = req.notAvailable

        if (notAvailable.length > 0) return res.status(404).send({
            message: "One or more selected products are sold out or their quantity can't fulfill Your order.",
            unv_products: notAvailable 
        })

        selected.map((slctd) => {
            products.map((prod, index) => {
                if (prod.id == slctd.product_id) {
                    products[index] = { ...products[index], quantities: prod.quantities - slctd.order_qty}
                }
            })
        })
        next()

    }  catch (error) {
        console.log(' Reduce prduct qty', error)
        return res.status(500).send({ message: "Failed to place order." })
    }
}

export default {
    getAllProducts,
    getOneProduct,
    getSelectedProducts,
    getOrderedProducts,
    reduceProductQty,
}