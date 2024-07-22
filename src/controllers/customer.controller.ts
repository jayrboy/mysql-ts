import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import connection from '../db/mysql';
import { Customers } from '../models/customers.model';
import { ApiResponse } from '../models/api-response.model';

// ฟังก์ชันสำหรับสร้างผู้ใช้
export const createCustomer = (req: Request, res: Response): void => {
  const { customerName, customerAddress, zipCode, telephone }: Customers =
    req.body;
  const query =
    'INSERT INTO Customers (customerName, customerAddress, zipCode, telephone) VALUES (?, ?, ?, ?)';

  connection.query(
    query,
    [customerName, customerAddress, zipCode, telephone],
    (error: any, results: ResultSetHeader) => {
      if (error) {
        const response: ApiResponse = {
          statusCode: 500,
          message: 'Internal Server Error',
          error: error.message,
        };

        res.status(500).json(response);
        return;
      }

      const response: ApiResponse = {
        statusCode: 201,
        message: 'Customer Created',
        data: `New customerID: ${results.insertId}`,
      };

      res.status(201).json(response);
    }
  );
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้
export const getCustomers = (req: Request, res: Response): void => {
  const query = 'SELECT * FROM Customers WHERE isDelete = 0';

  connection.query(query, (error: any, results: ResultSetHeader) => {
    if (error) {
      const response: ApiResponse = {
        statusCode: 500,
        message: 'Error retrieving customers',
        error: error.message,
      };

      res.status(500).json(response);
      return;
    }

    const response: ApiResponse = {
      statusCode: 200,
      message: 'Success',
      data: results,
    };

    res.status(200).json(response);
  });
};

// ฟังก์ชันสำหรับดึงข้อมูลลูกค้ารายการเดียว
export const getCustomerById = (req: Request, res: Response): void => {
  const customerId = req.params.id || req.query.id;

  // ตรวจสอบว่ามีการระบุ customerId หรือไม่
  if (!customerId) {
    const response: ApiResponse = {
      statusCode: 400,
      message: 'Customer ID is required',
    };
    res.status(400).json(response);
    return;
  }

  // สร้างคิวรี SQL และใช้พารามิเตอร์เพื่อป้องกัน SQL Injection
  const query = 'SELECT * FROM Customers WHERE CustomerID = ? AND isDelete = 0';

  // ทำการคิวรี
  connection.query(query, [customerId], (error: any, results: any) => {
    if (error) {
      const response: ApiResponse = {
        statusCode: 500,
        message: 'Error retrieving customer',
        error: error.message,
      };

      res.status(500).json(response);
      return;
    }

    // ตรวจสอบว่าพบข้อมูลลูกค้าหรือไม่
    if (results.length === 0) {
      const response: ApiResponse = {
        statusCode: 404,
        message: 'Customer not found',
      };

      res.status(404).json(response);
      return;
    }

    // ส่งข้อมูลแถวแรก (แถวเดียว) ที่พบกลับไป
    const customer = results[0];
    const response: ApiResponse = {
      statusCode: 200,
      message: 'Success',
      data: customer,
    };

    res.status(200).json(response);
  });
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลลูกค้า
export const updateCustomer = (req: Request, res: Response): void => {
  const {
    customerID,
    customerName,
    customerAddress,
    zipCode,
    telephone,
    isDelete,
  }: Customers = req.body;

  // ตรวจสอบว่ามีการระบุ CustomerID และข้อมูลที่ต้องการอัปเดตหรือไม่
  if (
    !customerID ||
    !customerName ||
    !customerAddress ||
    !zipCode ||
    !telephone
  ) {
    const response: ApiResponse = {
      statusCode: 400,
      message: 'Error updating customer',
      error:
        'customerID, customerName, customerAddress, zipCode, and telephone are required',
    };

    res.status(400).json(response);
    return;
  }

  // สร้างคิวรี SQL และใช้พารามิเตอร์เพื่อป้องกัน SQL Injection
  const query =
    'UPDATE Customers SET customerName = ?, customerAddress = ?, zipCode = ?, telephone = ?, isDelete = ? WHERE customerID = ?';

  // ทำการคิวรี
  connection.query(
    query,
    [customerName, customerAddress, zipCode, telephone, isDelete, customerID],
    (error: any, results: any) => {
      if (error) {
        const response: ApiResponse = {
          statusCode: 500,
          message: 'Error updating customer',
          error: error.message,
        };

        res.status(500).json(response);
        return;
      }

      const response: ApiResponse = {
        statusCode: 200,
        message: 'Customer updated successfully',
      };

      res.status(200).json(response);
    }
  );
};

// ฟังก์ชันสำหรับลบข้อมูลลูกค้า ถาวร
export const deleteCustomer = (req: Request, res: Response): void => {
  const customerId = req.params.id;

  // ตรวจสอบว่ามีการระบุ CustomerID หรือไม่
  if (!customerId) {
    const response: ApiResponse = {
      statusCode: 400,
      message: 'CustomerID is required',
    };
    res.status(400).json(response);
    return;
  }

  // สร้างคิวรี SQL และใช้พารามิเตอร์เพื่อป้องกัน SQL Injection
  const query = 'DELETE FROM Customers WHERE CustomerID = ?';

  // ทำการคิวรี
  connection.query(query, [customerId]);

  const response: ApiResponse = {
    statusCode: 200,
    message: 'Customer deleted successfully',
  };

  res.status(200).json(response);
};

// ฟังก์ชันสำหรับลบข้อมูลลูกค้า ไม่ลบข้อมูลจริง ๆ จากฐานข้อมูล
export const softDeleteCustomer = (req: Request, res: Response): void => {
  const customerId = req.params.id;

  // ตรวจสอบว่ามีการระบุ CustomerID หรือไม่
  if (!customerId) {
    const response: ApiResponse = {
      statusCode: 400,
      message: 'CustomerID is required',
    };
    res.status(400).json(response);
    return;
  }

  // สร้างคิวรี SQL และใช้พารามิเตอร์เพื่อป้องกัน SQL Injection
  const query = 'UPDATE Customers SET isDelete = 1 WHERE CustomerID = ?';

  // ทำการคิวรี
  connection.query(
    query,
    [customerId],
    (error: any, results: ResultSetHeader) => {
      if (error) {
        const response: ApiResponse = {
          statusCode: 500,
          message: 'Error deleting customer',
          error: error.message,
        };

        res.status(500).json(response);
        return;
      }

      // ตรวจสอบว่ามีการอัปเดตแถวหรือไม่
      if (results.affectedRows === 0) {
        const response: ApiResponse = {
          statusCode: 404,
          message: 'Customer not found',
        };

        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        statusCode: 200,
        message: 'Customer deleted successfully',
      };

      res.status(200).json(response);
    }
  );
};
