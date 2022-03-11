import { Router } from 'express';
import {
  createUser,
  logIn,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById
} from '../controller/users';
import authentication from '../middleware/authentication';
const router = Router();

router
  .route('/')
  .post(createUser)
  .get(authentication, getAllUsers)
  .put(authentication, updateUser)
  .delete(authentication, deleteUser);
router.route('/:id').get(authentication, getUserById);
router.route('/login').post(logIn);
export default router;
