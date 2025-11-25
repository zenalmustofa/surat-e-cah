import React, { useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AjukanPage = () => {
    const [formData, setFormData] = useState({
        nik: '',
        nama_pemohon: '',
        jenis_surat: 'Surat Pengantar SKCK',
        tujuan_surat: '',
    });
    const [file, setFile] = useState(null);
    const [successId, setSuccessId] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        data.append('nik', formData.nik);
        data.append('nama_pemohon', formData.nama_pemohon);
        data.append('jenis_surat', formData.jenis_surat);
        data.append('tujuan_surat', formData.tujuan_surat);
        data.append('dokumen', file);

        try {
            const res = await api.post('/permohonan/ajukan', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessId(res.data._id);
            // Reset form
            setFormData({ nik: '', nama_pemohon: '', jenis_surat: 'Surat Pengantar SKCK', tujuan_surat: '' });
            setFile(null);
        } catch (err) {
            console.error(err);
            alert('❌ Gagal mengajukan. Pastikan semua data terisi dan file (JPG/PDF) diupload.');
        } finally {
            setLoading(false);
        }
    };

    // --- TAMPILAN SUKSES ---
    if (successId) {
        return (
            <div className="page-wrapper animate-fade-in">
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '50px' }}>🎉</div>
                    <h2 style={{ color: '#28a745', marginBottom: '10px' }}>Permohonan Berhasil!</h2>
                    <p style={{ color: '#666' }}>Silakan simpan Kode Lacak di bawah ini:</p>
                    
                    <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '2px dashed #007bff', margin: '20px 0', overflowWrap: 'break-word' }}>
                        <strong style={{ fontSize: '1.2rem', color: '#007bff' }}>{successId}</strong>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to="/cek-status" className="btn btn-primary btn-block">🔍 Cek Status</Link>
                        <button onClick={() => setSuccessId(null)} className="btn btn-secondary btn-block">Ajukan Lagi</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- TAMPILAN FORM ---
    return (
        <div className="page-wrapper animate-fade-in">
            <div className="card">
                <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px', color: 'var(--primary-red)' }}>📄 Form Pengajuan Surat</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>NIK</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            name="nik" 
                            placeholder="Contoh: 3515xxxxxxxx" 
                            onChange={handleChange} 
                            value={formData.nik} 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input 
                            className="form-input" 
                            type="text" 
                            name="nama_pemohon" 
                            placeholder="Nama Sesuai KTP" 
                            onChange={handleChange} 
                            value={formData.nama_pemohon} 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Jenis Surat</label>
                        <select className="form-select" name="jenis_surat" onChange={handleChange} value={formData.jenis_surat}>
                            <option value="Surat Pengantar SKCK">Surat Pengantar SKCK</option>
                            <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
                            <option value="Surat Keterangan Usaha">Surat Keterangan Usaha</option>
                            <option value="Surat Keterangan Tidak Mampu">Surat Keterangan Tidak Mampu</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Keperluan / Tujuan</label>
                        <textarea 
                            className="form-textarea" 
                            name="tujuan_surat" 
                            rows="3" 
                            placeholder="Jelaskan keperluan pembuatan surat..." 
                            onChange={handleChange} 
                            value={formData.tujuan_surat} 
                            required 
                        />
                    </div>
                    
                    <div className="form-group" style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
                        <label style={{ fontWeight: 'bold', color: '#856404' }}>📁 Upload KTP/KK (Wajib)</label>
                        <input type="file" onChange={handleFileChange} required style={{ marginTop: '10px', width: '100%' }} />
                        <small style={{ display: 'block', marginTop: '5px', color: '#856404' }}>*Format: JPG/PNG/PDF. Maks 5MB.</small>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Mengirim...' : '🚀 KIRIM PERMOHONAN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AjukanPage;