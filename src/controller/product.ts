import ProductModel from '../models/products';
import { Response, Request } from 'express';
import Product from '../types/Product';

const product = new ProductModel();

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const createdProduct = await product.createProduct(req.body as Product);
    res.status(200).json({
      status: 'success',
      data: createdProduct,
      message: 'created successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'wrong'
    });
    console.error(err as Error);
  }
};

export const getProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await product.getALLProducts();
    res.status(200).json({
      status: 'success',
      data: products,
      message: 'get successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'wrong'
    });
    console.error(err as Error);
  }
};

export const getProductsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category: string = req.params.categoryName;
    const products = await product.getProductsByCategory(category);
    res.status(200).json({
      status: 'success',
      data: products,
      message: 'getProductsByCategory successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'wrong'
    });
    console.error(err as Error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_name } = req.body;
    const item = await product.deleteProduct(product_name as string);
    res.status(200).json({
      status: 'success',
      data: item,
      message: 'product deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'wrong'
    });
    console.error(err as Error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_name, product_category, product_price }: Product = req.body;
    const item = await product.updateProduct({
      product_name,
      product_category,
      product_price
    });
    res.status(200).json({
      status: 'success',
      data: item,
      message: 'product updated successfully'
    });
  } catch (err) {
    res.status(400).json({
      status: 'wrong'
    });
    console.error(err as Error);
  }
};
