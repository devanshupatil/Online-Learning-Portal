const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000; // You can use any port number

const teacherRoutes = require('./routes/teachers-routes');
const leranerRoutes = require('./routes/leraner-routes');

app.use(cors({
  origin: [
    'http://localhost:5173',  // Your Vite dev server
    'http://localhost:3000',  // Your backend (if needed) 
    'http://localhost:8080',  // Your Vite dev server
    'http://backend:3000',  // Your backend (if needed) 

  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false
}));

// Handle preflight requests explicitly - removed due to path-to-regexp issue with '*'
// app.options('*', cors());

app.use(express.json());

// // Routes
app.use('/api', teacherRoutes);
app.use('/api', leranerRoutes);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
