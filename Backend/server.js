const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.KEYFILENAME;
const port = process.env.PORT || 4000; // You can use any port number

const supabase = require('./config/supabaseDB');
const teacherRoutes = require('./routes/teachers-routes');
const leranerRoutes = require('./routes/leraner-routes');
const adminRoutes = require('./routes/admin-routes');

// Connect to Supabase
// (async () => {
//   try {
//     const { data, error } = await supabase;
//     if (error) throw error;
//     console.log('Successfully connected to Supabase');
//   } catch (error) {
//     console.error('Error connecting to Supabase:', error.message);
//   }
// })();



// CORS configuration
app.use(cors({
  origin: [
    'https://34.47.136.4:3000',
    'http://34.47.136.4:3000',
    'http://34.47.136.4',
    'http://edu.onthegoalways.com',  // Add HTTPS version too
    'https://edu.onthegoalways.com',  // Add HTTPS version too
    'http://localhost:5173',
    'http://localhost:3000',
    'https://edu.onthegoalways.com/api', // backend url
    'https://online-learning-portal.onrender.com', // Backend deployed url
    'https://online-learning-portal-ten.vercel.app', // Frontend deployed url
    // process.env.FRONTEND_PRODUCTION_URL,
    // process.env.BACKEND__PRODUCTION_URL,
    // process.env.FRONTEND_LOCALHOST_URL,
    // process.env.BACKEND__LOCALHOST_URL,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false
}));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'backend-api'
  });
});


// Handle preflight requests explicitly - removed due to path-to-regexp issue with '*'
// app.options('*', cors());

app.use(express.json());

// // Routes
// app.use('/api', router);
app.use('/api', teacherRoutes);
app.use('/api', leranerRoutes);
app.use('/api/admin', adminRoutes);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
