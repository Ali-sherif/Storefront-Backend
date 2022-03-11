import ProductsModel from '../products';
import Product from '../../types/Product';
import db from '../../database/index';

const productsModel = new ProductsModel();

describe('ProductModel Tests', () => {
  describe('test if methods exists', () => {
    it('should have an addProduct method', (): void => {
      expect(productsModel.createProduct).toBeDefined();
    });

    it('should have an deleteProduct method', (): void => {
      expect(productsModel.deleteProduct).toBeDefined();
    });

    it('should have an getALLProducts method', (): void => {
      expect(productsModel.getALLProducts).toBeDefined();
    });

    it('should have an updateProduct method', (): void => {
      expect(productsModel.updateProduct).toBeDefined();
    });

    it('should have an getProductsByCategory method', (): void => {
      expect(productsModel.getProductsByCategory).toBeDefined();
    });
  });

  describe('test if methods work correct', () => {
    const product = {
      product_name: 'laptop',
      product_category: 'electronics',
      product_price: '2000'
    } as Product;
    beforeAll(async (): Promise<void> => {
      const createProduct = await productsModel.createProduct(product);
      product.product_id = createProduct?.product_id;
    });
    afterAll(async (): Promise<void> => {
      const connection = await db.connect();
      const sql = 'DELETE FROM products;';
      await connection.query(sql);
      connection.release();
    });
    it('addProduct method should return a new product', async (): Promise<void> => {
      const createProduct = await productsModel.createProduct({
        product_name: 'mobile',
        product_category: 'electronics',
        product_price: '1000'
      } as Product);
      expect(createProduct?.product_name).toEqual('mobile');
      expect(createProduct?.product_category).toEqual('electronics');
      expect(createProduct?.product_price).toEqual('1000');
    });

    it('getAllProduct method should return the all product', async (): Promise<void> => {
      const products = await productsModel.getALLProducts();
      expect(products?.length).toEqual(3);
    });

    it('getProductsByCategory method should return the all products with specific category', async (): Promise<void> => {
      const products = await productsModel.getProductsByCategory('electronics');
      expect(products?.length).toEqual(3);
    });

    it('updateProduct method should return null if product not exist', async (): Promise<void> => {
      const product = await productsModel.updateProduct({
        product_name: 'mobile',
        product_category: 'electronics',
        product_price: '2000'
      } as Product);
      expect(product).not.toBeNull();
    });

    it('deleteProduct method should return user with specific id ', async (): Promise<void> => {
      const product = await productsModel.deleteProduct('mobile');
      expect(product).toBeFalsy();
    });
  });
});
