import express from 'express'
import config from '../config/config'
import cors from 'cors'

import routes from './routes/indexRoute'

const app = express()

app.listen(config.port, () =>
    console.log('Server started on port %s.', config.port)
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/order/test', (_, res) => {
    res.status(200).send({ message: 'This is response check for order transaction.' })
})

app.use('/api/product', routes.productRoutes)
app.use('/api/order', routes.orderRoutes)

export default app