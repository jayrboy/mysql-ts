# MySQL Workbench - Query

# Create Database

```sql
CREATE DATABASE mydatabase;
```

## Create Table

```sql
USE mydatabase;

CREATE TABLE customers (
    customerId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customerName varchar(40),
    customerAddress varchar(200),
    zipCode varchar(50),
    email varchar(100) UNIQUE,
    telephone varchar(50),
    isDelete TINYINT(1) DEFAULT 0,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4;
```

### Add Column in Table

```sql
USE mydatabase;

ALTER TABLE customers
ADD COLUMN isDelete TINYINT(1) DEFAULT 0,
ADD COLUMN createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updateDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

# Changed AUTO_INCREMENT

```sql
USE order_db;

ALTER TABLE Customers AUTO_INCREMENT = 5;
```
