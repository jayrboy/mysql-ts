import mysql from 'mysql2';

// สร้างการเชื่อมต่อฐานข้อมูล
const connection = mysql.createConnection({
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DB || 'order_db',
});

// ทำการเชื่อมต่อฐานข้อมูล
connection.connect((err) => {
  if (err) {
    console.error('Error: Connection lost: The server closed the connection.');
    return;
  }
  console.log('Connected to MySQL Workbench');
});

export default connection;
