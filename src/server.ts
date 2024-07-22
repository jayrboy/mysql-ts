import 'dotenv/config';
import Express, { Application } from 'express';
import os from 'os';
import morgan from 'morgan';

import cors from './middlewares/cors.middleware';
import errorHandler from './middlewares/errorHandler.middleware';
import auth from './middlewares/auth.middleware';

import authorization from './routes/auth.routuer';
import customer from './routes/customer.router';

const app: Application = Express();
const port = process.env.PORT || 3000;

// ใช้ middleware
app.use(morgan('dev'));
app.use(cors);

// Built-in middleware สำหรับแปลง JSON body และ URL-encoded body
app.use(Express.json({ limit: '10mb' }));
app.use(Express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send(os.hostname());
});

// ตั้งค่าเส้นทางด้วย Router
app.use('/api', authorization);
app.use('/api', auth, customer);

// 404 middleware
app.use((req, res) => {
  res.status(404).type('text/plain').send('404 Not Found');
});

// Error-handling middleware สำหรับจัดการข้อผิดพลาด
app.use(errorHandler);

// เริ่มต้น server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
