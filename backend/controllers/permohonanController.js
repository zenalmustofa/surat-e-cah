// controllers/permohonanController.js
const Permohonan = require('../models/Permohonan');

// 1. Create Permohonan (Public)
exports.createPermohonan = async (req, res) => {
    try {
        // Cek jika file diupload
        if (!req.file) {
            return res.status(400).json({ msg: 'Mohon upload dokumen pendukung' });
        }

        const { nik, nama_pemohon, jenis_surat, tujuan_surat } = req.body;

        const newPermohonan = new Permohonan({
            nik,
            nama_pemohon,
            jenis_surat,
            tujuan_surat,
            dokumen_pendukung: req.file.filename // Simpan nama file dari Multer
        });

        const permohonan = await newPermohonan.save();
        res.json(permohonan);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 2. Read All (Admin Only)
exports.getAllPermohonan = async (req, res) => {
    try {
        const permohonan = await Permohonan.find().sort({ tgl_pengajuan: -1 });
        res.json(permohonan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 3. Update Status (Admin Only)
exports.updateStatus = async (req, res) => {
    try {
        let permohonan = await Permohonan.findById(req.params.id);
        if (!permohonan) return res.status(404).json({ msg: 'Data tidak ditemukan' });

        // UPDATE: Simpan status DAN catatan (jika ada)
        permohonan.status = req.body.status;
        
        // Jika ada catatan dikirim, simpan. Jika tidak, biarkan kosong.
        if (req.body.catatan) {
            permohonan.catatan = req.body.catatan;
        }

        await permohonan.save();
        res.json(permohonan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 4. Delete (Admin Only)
exports.deletePermohonan = async (req, res) => {
    try {
        const permohonan = await Permohonan.findById(req.params.id);
        if (!permohonan) return res.status(404).json({ msg: 'Data tidak ditemukan' });

        await permohonan.deleteOne();
        res.json({ msg: 'Permohonan dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ... fungsi create, getAll, updateStatus, delete sudah ada di atas ...

// 5. Get Detail by ID (Public - Untuk Cek Status)
exports.getPermohonanById = async (req, res) => {
    try {
        const permohonan = await Permohonan.findById(req.params.id);
        if (!permohonan) {
            return res.status(404).json({ msg: 'Permohonan tidak ditemukan' });
        }
        res.json(permohonan);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Permohonan tidak ditemukan' });
        }
        res.status(500).send('Server Error');
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const total = await Permohonan.countDocuments();
        const diajukan = await Permohonan.countDocuments({ status: 'Diajukan' });
        const diproses = await Permohonan.countDocuments({ status: 'Diproses' });
        const siap = await Permohonan.countDocuments({ status: 'Siap Diambil' });
        const selesai = await Permohonan.countDocuments({ status: 'Selesai' });
        const ditolak = await Permohonan.countDocuments({ status: 'Ditolak' });

        res.json({
            total, diajukan, diproses, siap, selesai, ditolak
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};