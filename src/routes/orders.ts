import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  updateOrderStatus,
  getActiveOrdersByUserId,
  getCompletedOrdersByUserId
} from '../controller/orders';
import authentication from '../middleware/authentication';
const router = Router();

router.route('/').post(authentication, createOrder);

router
  .route('/:orderId')
  .put(authentication, updateOrderStatus)
  .delete(authentication, deleteOrder);

router.route('/active/:userId').get(authentication, getActiveOrdersByUserId);

router
  .route('/completed/:userId')
  .get(authentication, getCompletedOrdersByUserId);

export default router;
