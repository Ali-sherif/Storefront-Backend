import orderModel from '../models/orders';
import Order from '../types/order';
import { Response, Request } from 'express';
import jwtDecode from 'jwt-decode';
const order = new orderModel();

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id }: Order = jwtDecode(req.body.token);
    req.body.user_id = user_id;
    const createdOrder = await order.createOrder(req.body as Order);
    if (!createdOrder) {
      res.status(404).json({
        status: 'failed',
        message: 'some thing is wrong'
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: createdOrder,
      message: 'created successfully'
    });
  } catch (err: unknown) {
    console.error(err as Error);
  }
};

export const getActiveOrdersByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id: number = req.params.userId as unknown as number;
    const getOrders = await order.getActiveOrdersByUserId(user_id);
    console.log(getOrders);
    res.status(200).json({
      status: 'success',
      data: getOrders,
      message: 'getActiveOrdersByUserId successfully'
    });
  } catch (err: unknown) {
    console.error(err as Error);
  }
};

export const getCompletedOrdersByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id: number = req.params.userId as unknown as number;
    const getOrders = await order.getCompletedOrdersByUserId(user_id);
    console.log(getOrders);
    res.status(200).json({
      status: 'success',
      data: getOrders,
      message: 'getActiveOrdersByUserId successfully'
    });
  } catch (err: unknown) {
    console.error(err as Error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order_id: number = req.params.orderId as unknown as number;
    const orderUpdated = await order.updateOrderStatus(order_id);
    if (!orderUpdated) {
      res.status(404).json({
        status: 'failed',
        message: 'some thing is wrong'
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: orderUpdated,
      message: 'updated successfully'
    });
  } catch (err) {
    console.error(err as Error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order_id = req.params.orderId as unknown as number;
    const deleteOrder = await order.deleteOrder(order_id);
    if (!deleteOrder) {
      res.status(404).json({
        status: 'failed',
        message: 'some thing is wrong'
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: deleteOrder,
      message: 'deleted successfully'
    });
  } catch (err) {
    console.error(err as Error);
  }
};
