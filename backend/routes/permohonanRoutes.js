// routes/permohonanRoutes.js
const express = require('express');
const router = express.Router();
const permohonanController = require('../controllers/permohonanController');
const upload = require('../config/multerConfig'); // Config Multer
const auth = require('../middleware/auth');       // Middleware JWT

// 1. POST (Public) - Upload File 'dokumen' adalah key form-data
router.post('/ajukan', upload.single('dokumen'), permohonanController.createPermohonan);

router.get('/stats', auth, permohonanController.getDashboardStats);

// GET (Public) - Cek status berdasarkan ID
router.get('/:id', permohonanController.getPermohonanById);

// 2. GET (Protected)
router.get('/', auth, permohonanController.getAllPermohonan);

// 3. PUT (Protected)
router.put('/:id', auth, permohonanController.updateStatus);

// 4. DELETE (Protected)
router.delete('/:id', auth, permohonanController.deletePermohonan);

module.exports = router;