// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// 1. Init Environment
dotenv.config();

// 2. Connect Database
connectDB();

// 3. Init Express
const app = express();

// 4. Middleware Global
app.use(cors()); // Agar Frontend React bisa akses
app.use(express.json({ extended: false })); // Parsing JSON body

// 5. Static Folder (Agar file upload bisa diakses publik lewat URL)
// Contoh akses: http://localhost:5000/uploads/namafile.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Routes Definition
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/permohonan', require('./routes/permohonanRoutes'));

// 7. Default Route
app.get('/', (req, res) => res.send('API Surat Desa Running...'));

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));