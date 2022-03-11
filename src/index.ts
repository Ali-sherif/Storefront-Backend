import config from './config';
import db from './database/index';
import express from 'express';
import usersRouter from './routes/users';
import productsRouter from './routes/products';
import orderRouter from './routes/orders';

const app = express();

//parse incoming request
app.use(express.json());
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/orders', orderRouter);

app.get('/', (_req, res): void => {
  res.json({
    message: 'from main endpoint'
  });
});

app.listen(config.port, () =>
  console.log(`server is running on port${config.port}`)
);

export default app;
