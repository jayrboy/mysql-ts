import Express, { Request, Response, NextFunction } from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  softDeleteCustomer,
} from '../controllers/customer.controller';
import auth from '../middlewares/auth.middleware';

const router = Express.Router();

// Middleware เฉพาะเส้นทาง
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Customer Middleware is running!');
  next();
});

// GET: /api/customer
router.post('/customer', createCustomer);

// GET: /api/customer
router.get('/customer', getCustomers);

// GET: /api/customer/:id
router.get('/customer/:id', getCustomerById);

// PUT: /api/customer
router.put('/customer', updateCustomer);

// DELETE: /api/customer/soft-delete/:id
router.delete('/customer/soft-delete/:id', softDeleteCustomer);

// DELETE: /api/customer/:id
router.delete('/customer/:id', deleteCustomer);

export default router;
