import { Router } from 'express'
import indexController from '../controller/indexController'

const router = Router()

router.get('/', indexController.orderController.getAllOrder)
router.post('/', indexController.productController.getSelectedProducts, indexController.orderController.createOrder)

export default router