const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const sql = require('mssql');
const winston = require('winston');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json()); // to parse JSON request bodies
app.use(cors({
  origin: '*' // allow only this origin
}));

// Configure logging
const logsDirectory = path.join(__dirname, 'logs');
const logFilePath = path.join(logsDirectory, 'logs.log');
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: logFilePath })
  ]
});

// MongoDB URI
const uri = "mongodb+srv://Tom:rHiNUmndV0MIzX3t@db0cluster0.scxfepc.mongodb.net/?authMechanism=DEFAULT";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// SQL Server configuration
const sqlConfig = {
  user: 'sa',
  password: 'Cesi_EATpwd!',
  server: 'localhost',
  database: 'CESI_EAT',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    enableIdentityInsert: true
  }
};

// Connect to SQL Server  
const connectSqlServerDB = async () => {
  try {
    await sql.connect(sqlConfig);
    logger.info('Connected to SQL Server database');
  } catch (err) {
    logger.error('Error connecting to the database:', err);
    process.exit(1);
  }
};

connectSqlServerDB();

// Secret key for JWT
const secretKey = "AcRrDXWSJuG13Fuo7RkAcRrDXWdhWXPtA1SJuG1Fuo73Fuo7RkdhWXPtA1QHBwSdhWXPtA1QHBwS";
let blacklistedTokens = [];

// Middleware to handle TokenExpiredError
const handleTokenExpiredError = (err, req, res, next) => {
  if (err.name === 'TokenExpiredError') {
    res.status(403).json({ error: 'Token expired' });
  } else {
    next(err);
  }
};

// Middleware to handle TypeError (undefined _id)
const handleTypeError = (err, req, res, next) => {
  if (err instanceof TypeError && err.message.includes('_id')) {
    res.status(400).json({ error: 'Invalid token' });
  } else {
    next(err);
  }
};

// Middleware to handle ERR_HTTP_HEADERS_SENT error
const handleHttpHeadersSentError = (err, req, res, next) => {
  if (err.code === 'ERR_HTTP_HEADERS_SENT') {
    console.error(err);
    res.status(500).send(err);
  }
  console.log(err);
  next(err);
};

// Middleware to handle general errors
// Middleware to handle general errors
const handleGeneralError = (err, req, res, next) => {
  console.error(err);
  logger.error('An error occurred:', err); // Log the error
  res.status(500).json({ error: 'An error occurred' });
};

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  if (blacklistedTokens.includes(token)) {
    return res.status(403).json({ error: 'Revoked token' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Expired or invalid token' });
    }
    req.user = user;
    next();
  });
};

// Register route
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userId = uuidv4();

    // Check if email is already registered
    const existingUser = await client.db('CESI_EAT').collection('Users').findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Insert user into MongoDB
    const userMongo = {
      ID: userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      deliveryAddress: req.body.deliveryAddress,
      billingAddress: req.body.billingAddress,
      type: req.body.type,
      email: req.body.email
    };
    await client.db('CESI_EAT').collection('Users').insertOne(userMongo);

    // Insert user into SQL Server
    const request = new sql.Request();
    const query = `INSERT INTO Users (ID, Email, Username, Password) VALUES ('${userId}', '${req.body.email}', '${req.body.name}', '${hashedPassword}')`;
    await request.query(query);

    // User registered successfully
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    logger.error('Global error:', error);
    logger.error('Error processing the request', { error });
    res.status(500).json({ error: 'Error processing the request' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const request = new sql.Request();
    const query = `SELECT * FROM Users WHERE Email = '${req.body.email}'`;
    const result = await request.query(query);

    if (!result.recordset.length) {
      return res.status(400).json({ error: 'Email or password incorrect' });
    }

    const user = result.recordset[0];
    if (await bcrypt.compare(req.body.password, user.Password)) {
      const userPayload = {
        _id: user.ID,
        email: user.Email
      };
      const accessToken = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
      const tokenQuery = `UPDATE Users SET Token = '${accessToken}' WHERE ID = '${user.ID}'`;
      await request.query(tokenQuery);

      res.status(200).json({
        success: true,
        accessToken,
        email: user.Email
      });
    } else {
      res.status(401).json({ error: 'Email or password incorrect' });
    }
  } catch (error) {
    logger.error('Error attempting to login:', error);
    res.status(500).json({ error: 'Error occurred while attempting to login' });
  }
});

// Logout route
app.post('/logout', authenticateToken, handleTokenExpiredError, handleTypeError, (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", '');
  blacklistedTokens.push(token);
  res.status(200).json({ message: 'Logout successful' });
});

// Protected route
app.get('/protected', authenticateToken, handleTokenExpiredError, handleTypeError, (req, res) => {
  res.json({ message: 'Access granted to protected resource' });
});

// Profile route
app.get('/profile', authenticateToken, handleTokenExpiredError, handleTypeError, async (req, res) => {
  try {
    const userId = req.user._id;
    const request = new sql.Request();
    const query = `SELECT * FROM Users WHERE ID = '${userId}'`;
    const result = await request.query(query);

    if (!result.recordset.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userSQL = result.recordset[0];

    // Retrieve user from MongoDB
    const usersCollection = client.db('CESI_EAT').collection('Users');
    const userMongo = await usersCollection.findOne({ ID: userId });

    if (!userMongo) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      ID: userSQL.ID,
      email: userSQL.Email,
      username: userSQL.Username,
      firstName: userMongo.firstName,
      lastName: userMongo.lastName,
      deliveryAddress: userMongo.deliveryAddress,
      billingAddress: userMongo.billingAddress
    };

    res.status(200).json({ profile: userProfile });
  } catch (error) {
    logger.error('Error retrieving user profile:', error);
    res.status(500).json({ error: 'Error retrieving user profile' });
  }
});

// Update profile route
app.patch('/profile', authenticateToken, handleTokenExpiredError, handleTypeError, async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, firstName, lastName, deliveryAddress, billingAddress } = req.body;

    // Update user info in MongoDB
    const usersCollection = client.db('CESI_EAT').collection('Users');
    const updateFields = {};

    if (email) {
      updateFields.email = email;
    }

    if (firstName) {
      updateFields.firstName = firstName;
    }

    if (lastName) {
      updateFields.lastName = lastName;
    }

    if (deliveryAddress) {
      updateFields.deliveryAddress = deliveryAddress;
    }

    if (billingAddress) {
      updateFields.billingAddress = billingAddress;
    }

    await usersCollection.updateOne(
      { ID: userId },
      { $set: updateFields }
    );

    // Update user info in SQL Server
    const request = new sql.Request();
    let updateQuery = '';

    if (email) {
      updateQuery += `UPDATE Users SET Email = '${email}' WHERE ID = '${userId}';`;
    }
    await request.query(updateQuery);

    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.log(error)
    logger.error('Error updating user information:', error);
    res.status(500).json({ error: 'Error updating user information' });
  }
});

app.delete('/delete', authenticateToken, handleTokenExpiredError, handleTypeError, async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user from MongoDB
    const usersCollection = client.db('CESI_EAT').collection('Users');
    const deleteResult = await usersCollection.deleteOne({ ID: userId });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user from SQL Server
    const request = new sql.Request();
    const deleteQuery = `DELETE FROM Users WHERE ID = '${userId}'`;
    await request.query(deleteQuery);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Handle 404 errors for non-existent routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(handleHttpHeadersSentError);
app.use(handleGeneralError);

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
