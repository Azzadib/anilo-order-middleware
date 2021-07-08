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

const findOrderById = (req, res, next) => {
    try {
        const { orderid } = req.params
        if (isNaN(orderid)) return res.status(400).send({ message: "Order ID is null or has wrong type." })
        const { order_user_name, order_user_email, order_user_phone } = req.body

        if (!order_user_name) return res.status(400).send({ message: "Name can't be blank." })
        const nameFormat = /^[a-zA-Z]+([ a-zA-Z]+){2}$/
        if (!order_user_name.match(nameFormat)) return res.status(400).send({ message: "Name should be at least 2 characters of alphabet." })

        if (!order_user_email) return res.status(400).send({ message: "Email can't be blank" })
        const emailFormat = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        if (!order_user_email.match(emailFormat)) return res.status(400).send({ message: "Email format is not valid." })

        if (!order_user_phone) return res.status(400).send({ message: "Phone number can't be blank." })
        if (!order_user_phone.match("[+][0-9]{10}")) return res.status(400).send({ message: "Phone number format is not valid." })


        const order = orders.filter((o) => o.order_id == orderid)[0]
        if (order.order_status !== 'cart') return res.status(400).send({ message: "Order already placed or cancelled." })
        if (!order) return res.status(404).send({ message: "Order not found." })

        req.order = order
        next()
    } catch (error) {
        console.log('Get order', error)
        return res.status(500).send({ mesage: 'Failed to get order.' })
    }
}

const createOrder = (req, res) => {
    try {
        const selected = req.selected
        const notAvailable = req.notAvailable
        const { slctdProds, user_id } = req.body

        if (!user_id) return res.status(400).send({ message: "User id shouldn't be empty." })
        if (notAvailable.length > 0) return res.status(404).send({
            message: "One or more selected products are sold out or their quantity can't fulfill Your order.",
            unv_products: notAvailable
        })

        let order_price = 0
        slctdProds.map((slctd) => {
            if (slctd.order_qty <= 0) return res.status(400).send({ message: `product with id ${slctd.id} should ordered 1 or more.` })
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
            added_products: slctdProds
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

const placeOrder = (req, res) => {
    try {
        const { orderid } = req.params
        const { order_user_name, order_user_email, order_user_phone, order_user_address } = req.body

        const index = orders.findIndex((order) => order.order_id == orderid)
        const order_created_at = new Date()

        orders[index] = {
            ...orders[index],
            order_status: "waiting payment",
            order_created_at,
            order_pyt_number: '123' + order_user_phone.toString().split('+')[1],
            order_user_name,
            order_user_address,
            order_user_email,
            order_user_phone
        }

        const result = orders[index]

        return res.status(201).send(result)
    } catch (error) {
        console.log('Place order', error)
        return res.status(500).send({ message: "Failed to lace order." })
    }
}

const addPaymentImg = (req, res) => {
    try {
        const { orderid } = req.params
        const { images } = req.dataUploaded

        const index = orders.findIndex((order) => order.order_id == orderid)

        orders[index] = {
            ...orders[index],
            order_status: 'paid',
            order_pyt_proof: images[0].fileName
        }

        const result = orders[index]

        if (result) return res.status(201).send({ message: "Image uploaded successfully." })

        return res.status(500).send({ message: "Failed to upload image." })
    } catch (error) {
        console.log('Place order', error)
        return res.status(500).send({ message: "Failed to upload image." })
    }
}

const updateOrder = (req, res) => {
    try {
        const { orderid } = req.params
        const { order_status, shipment_status, shipping_id } = req.body

        const index = orders.findIndex((order) => order.order_id == orderid)

        orders[index] = {
            ...orders[index],
            order_status,
            shipment_status,
            shipping_id
        }

        const result = orders[index]

        if (result) return res.status(201).send({ message: "Order updated successfully." })

        return res.status(500).send({ message: "Failed to update order." })
    } catch (error) {
        console.log('Update order', error)
        return res.status(500).send({ message: "Failed to update order." })
    }
}

export default {
    addPaymentImg,
    createOrder,
    findOrderById,
    getAllOrder,
    placeOrder,
    updateOrder,
}