const mongoose = require('mongoose');

const PermohonanSchema = new mongoose.Schema({
    nik: { type: String, required: true },
    nama_pemohon: { type: String, required: true },
    jenis_surat: { type: String, required: true },
    tujuan_surat: { type: String, required: true },
    dokumen_pendukung: { type: String, required: true },
    
    // UPDATE 1: Tambah 'Ditolak' ke pilihan status
    status: {
        type: String,
        enum: ['Diajukan', 'Diproses', 'Siap Diambil', 'Selesai', 'Ditolak'], 
        default: 'Diajukan'
    },
    
    // UPDATE 2: Tambah kolom catatan (boleh kosong)
    catatan: { 
        type: String, 
        default: '' 
    },
    
    tgl_pengajuan: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Permohonan', PermohonanSchema);