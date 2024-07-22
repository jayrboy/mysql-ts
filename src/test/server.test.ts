import Express, { Application, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import customer from '../routes/customer.router';

const app: Application = Express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// สร้าง stream สำหรับบันทึก log ลงไฟล์
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a',
});

// สร้าง middleware สำหรับเก็บข้อมูล IP และบันทึกลงใน log
const logIpMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // ดึง IP address จาก X-Forwarded-For หากมี
  let ip =
    (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

  // แปลง IPv6 loopback address เป็น IPv4 สำหรับ localhost
  if (ip === '::1') {
    ip = '127.0.0.1';
  }

  // Log IP address
  const logMessage = `IP: ${ip}, Method: ${req.method}, URL: ${req.url}\n`;
  fs.appendFile('ip-requests.log', logMessage, (err) => {
    if (err) {
      console.error('Failed to write log:', err);
    }
  });
  next();
};

// ใช้ Morgan สำหรับการเก็บ log การทำงาน
if (isProduction) {
  // ใน production: บันทึก log ลงไฟล์
  app.use(morgan('combined', { stream: logStream }));
} else {
  // ใน development: แสดง log บน console
  app.use(morgan('dev'));
}

// ใช้ IP logging middleware
app.use(logIpMiddleware);

// ใช้ rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // จำกัดแต่ละ IP ให้ทำ request ได้ 100 ครั้งต่อ windowMs
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// การตั้งค่า CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE,PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Built-in Middleware
app.use(Express.json()); // แปลง JSON body
app.use(Express.urlencoded({ extended: true })); // แปลง URL-encoded body

// Middleware สำหรับ redirect
app.use((req: Request, res: Response, next) => {
  if (req.path === '/index' || req.path === '/home') {
    res.redirect('/');
  } else {
    next();
  }
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send(os.hostname());
});

// TODO: การตั้งค่าเส้นทางด้วย Router
app.use('/api', customer);

// 404 middleware
app.use((req: Request, res: Response) => {
  res.status(404).type('text/plain').send('404 Not Found');
});

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  if (app.get('env') !== 'development') {
    delete err.stack; // ลบ stack trace
  }
  if (err.stack) {
    console.error(err.stack);
    res.status(500).type('text/plain').send('500 Internal Server Error');
  } else {
    next(err);
  }
});

if (isProduction) {
  app.disable('x-powered-by'); // ปิดการเปิดเผย X-Powered-By
  app.set('env', 'production'); // ปิดการเปิดเผยข้อมูล debug หรือ development
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
