import React, { useState } from 'react';
import api from '../utils/api';

const CekStatusPage = () => {
    const [trackId, setTrackId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCek = async (e) => {
        e.preventDefault();
        setError(''); setResult(null); setLoading(true);
        if (!trackId) return;

        try {
            const res = await api.get(`/permohonan/${trackId}`);
            setResult(res.data);
        } catch (err) {
            setError('❌ Data tidak ditemukan. Periksa kembali Kode Lacak Anda.');
        } finally {
            setLoading(false);
        }
    };

    // Helper untuk Badge
    const getStatusBadge = (status) => {
        const styles = {
            'Selesai': { bg: '#d4edda', color: '#155724', icon: '✅' },
            'Siap Diambil': { bg: '#cce5ff', color: '#004085', icon: '📬' },
            'Diproses': { bg: '#fff3cd', color: '#856404', icon: '⚙️' },
            'Ditolak': { bg: '#f8d7da', color: '#721c24', icon: '❌' },
            'Diajukan': { bg: '#e2e3e5', color: '#383d41', icon: '📝' },
        };
        const s = styles[status] || styles['Diajukan'];
        return (
            <div style={{ background: s.bg, color: s.color, padding: '20px', borderRadius: '10px', textAlign: 'center', marginTop: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{s.icon}</div>
                <h2 style={{ margin: 0 }}>{status.toUpperCase()}</h2>
            </div>
        );
    };

    return (
        <div className="page-wrapper-small animate-fade-in">
            <div className="card" style={{ textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary-red)', marginBottom: '20px' }}>🔍 Lacak Surat</h2>
                <form onSubmit={handleCek} className="search-box">
                    <input className="form-input" type="text" placeholder="Tempel Kode Lacak..." value={trackId} onChange={(e) => setTrackId(e.target.value)} />
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? '...' : 'CEK'}</button>
                </form>

                {error && <div style={{ marginTop: '20px', color: 'red', background: '#ffecec', padding: '10px', borderRadius: '8px' }}>{error}</div>}
            </div>

            {result && (
                <div className="card animate-fade-in" style={{ marginTop: '20px', borderTop: '5px solid #28a745' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontSize: '14px', color: '#666', marginBottom: '10px', gap: '10px' }}>
                        <span>📅 {new Date(result.tgl_pengajuan).toLocaleDateString('id-ID')}</span>
                        <span>ID: ...{result._id.slice(-6)}</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{result.nama_pemohon}</h3>
                    <p style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>{result.jenis_surat}</p>
                    <p style={{ fontStyle: 'italic', color: '#666', fontSize: '14px' }}>"{result.tujuan_surat}"</p>

                    {getStatusBadge(result.status)}

                    {/* --- AREA PESAN / CATATAN --- */}
                    <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #ccc' }}>
                        
                        <strong style={{ display: 'block', marginBottom: '5px' }}>Pesan / Instruksi:</strong>
                        
                        {/* LOGIKA TAMPILAN CATATAN */}
                        
                        {/* 1. Jika DITOLAK */}
                        {result.status === 'Ditolak' && (
                            <span style={{ color: 'red' }}>
                                {result.catatan || "Mohon hubungi kantor desa untuk info lebih lanjut."}
                            </span>
                        )}

                        {/* 2. Jika SIAP DIAMBIL */}
                        {result.status === 'Siap Diambil' && (
                            <span style={{ color: '#004085' }}>
                                {result.catatan ? result.catatan : "Silakan diambil di kantor desa (Bawa KTP Asli)."}
                            </span>
                        )}

                        {/* 3. Jika SELESAI */}
                        {result.status === 'Selesai' && (
                            <span style={{ color: '#155724' }}>
                                Surat telah diambil / Proses selesai. Terima kasih.
                            </span>
                        )}

                         {/* 4. Jika DIPROSES */}
                         {result.status === 'Diproses' && (
                            <span style={{ color: '#856404' }}>
                                Sedang dalam pengerjaan oleh staf desa.
                            </span>
                        )}

                         {/* 5. Jika DIAJUKAN */}
                         {result.status === 'Diajukan' && (
                            <span style={{ color: '#383d41' }}>
                                Menunggu antrian untuk diperiksa.
                            </span>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default CekStatusPage;