import { Router } from 'express'
import indexController from '../controller/indexController'

const router = Router()

router.get('/', indexController.orderController.getAllOrder)

//* add product to order
router.post('/', indexController.productController.getSelectedProducts, indexController.orderController.createOrder)

//* Place order
router.post('/:orderid',
    indexController.orderController.findOrderById, indexController.productController.getOrderedProducts,
    indexController.productController.reduceProductQty, indexController.orderController.placeOrder)

//* Upload payment proof
router.post('/payment/:orderid', indexController.uploadController.uploadPayment, indexController.orderController.addPaymentImg)

//* Download payment proof
router.get('/download/:orderid', indexController.downloadCntroller.download)

//* Update order
router.put('/update/:orderid', indexController.orderController.updateOrder)

export default router