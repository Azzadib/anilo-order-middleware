import orders from '../models/orders'

//* used int as orderid to make it easy on checking and testing
let ordId = 0

const getAllOrder = (_, res) => {
    try {
        return res.send(orders)
    } catch (error) {
        console.log('Get all orders', error)
        return res.status(500).send({ mesage: 'Failed to get all orders.' })
    }
}

const createOrder = (req, res) => {
    try {
        const selected = req.selected
        const notAvailable = req.notAvailable
        const { slctdProds, user_id } = req.body

        if (!user_id) return res.status(400).send({ message: "User id shouldn't be empty."})
        if (notAvailable.length > 0) return res.status(404).send({
            message: "One or more selected products are sold out or their quantity can't fulfill Your order.",
            unv_products: notAvailable 
        })
        
        let order_price = 0
        slctdProds.map((slctd) => {
            if (slctd.order_qty <= 0) return res.status(400).send({ message: `product with id ${slctd.id} should ordered 1 or more.`})
            selected.map((prod) => {
                if (prod.id == slctd.product_id) order_price += prod.price * slctd.order_qty
            })
        })

        ordId++

        const order_id = ordId

        const newOrd = {
            order_id,
            order_user_id: user_id,
            order_price,
            order_status: 'cart',
            products: slctdProds
        }

        orders.push(newOrd)

        const success = orders.filter((o) => o.order_id == order_id).length > 0

        if (success) return res.status(201).send({ message: "Product added successfully." })
        return res.status(500).send({ message: "Failed to add prodct" })
    } catch (error) {
        console.log('Create order', error)
        return res.status(500).send({ message: "Failed to add prodct" })
    }
}

export default {
    getAllOrder,
    createOrder,
}