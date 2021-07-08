import { Router } from 'express'
import indexController from '../controller/indexController'

const router = Router()

router.get('/', indexController.productController.getAllProducts)
router.get('/:id', indexController.productController.getOneProduct)

export default router