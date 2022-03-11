import {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProductsByCategory
} from '../controller/product';
import { Router } from 'express';
import authentication from '../middleware/authentication';
const router = Router();

router
  .route('/')
  .post(authentication, addProduct)
  .get(getProducts)
  .delete(authentication, deleteProduct)
  .put(authentication, updateProduct);

router.route('/category/:categoryName').get(getProductsByCategory);

export default router;
