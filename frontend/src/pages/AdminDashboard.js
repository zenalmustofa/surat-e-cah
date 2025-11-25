import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'; // Import Library Excel

const AdminDashboard = () => {
    const [listPermohonan, setListPermohonan] = useState([]);
    const [stats, setStats] = useState({ total: 0, diajukan: 0, diproses: 0, siap: 0, selesai: 0, ditolak: 0 });
    const navigate = useNavigate();

    // --- FETCH DATA & STATS ---
    const fetchStats = useCallback(async () => {
        try {
            const resStats = await api.get('/permohonan/stats');
            setStats(resStats.data);
        } catch (err) { console.error("Gagal update statistik"); }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resData = await api.get('/permohonan');
                setListPermohonan(resData.data);
                fetchStats(); 
            } catch (err) { navigate('/login'); }
        };
        fetchData();
    }, [navigate, fetchStats]);

    // --- FITUR BARU: EXPORT KE EXCEL ---
    const handleExportExcel = () => {
        // 1. Format Data agar rapi di Excel
        const dataToExport = listPermohonan.map((item, index) => ({
            "No": index + 1,
            "Tanggal Masuk": new Date(item.tgl_pengajuan).toLocaleDateString('id-ID'),
            "NIK": item.nik,
            "Nama Pemohon": item.nama_pemohon,
            "Jenis Surat": item.jenis_surat,
            "Keperluan": item.tujuan_surat,
            "Status": item.status,
            "Catatan Admin": item.catatan || '-'
        }));

        // 2. Buat Worksheet (Lembar Kerja)
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        // 3. Atur Lebar Kolom (Opsional, biar rapi)
        const wscols = [
            {wch: 5},  // No
            {wch: 15}, // Tanggal
            {wch: 20}, // NIK
            {wch: 25}, // Nama
            {wch: 30}, // Jenis Surat
            {wch: 40}, // Keperluan
            {wch: 15}, // Status
            {wch: 30}  // Catatan
        ];
        worksheet['!cols'] = wscols;

        // 4. Buat Workbook & Download
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Surat");
        
        // Nama file pakai tanggal hari ini
        const today = new Date().toISOString().slice(0,10);
        XLSX.writeFile(workbook, `Rekap_Surat_Desa_${today}.xlsx`);
    };

    // --- FUNGSI CETAK PDF (Sama seperti sebelumnya) ---
    const handlePrint = (item) => {
        const doc = new jsPDF();
        doc.setFontSize(16); doc.setFont("times", "bold");
        doc.text("PEMERINTAH DESA PADANGAN", 105, 20, null, null, "center");
        doc.text("KABUPATEN KEDIRI", 105, 28, null, null, "center");
        doc.setFontSize(12); doc.setFont("times", "normal");
        doc.text("Jl. Raya Pamenang No. 123, Telp (0341) 123456", 105, 36, null, null, "center");
        doc.line(20, 40, 190, 40);

        doc.setFontSize(14); doc.setFont("times", "bold");
        doc.text("SURAT PENGANTAR", 105, 55, null, null, "center");
        doc.setFontSize(11); doc.setFont("times", "normal");
        doc.text(`Nomor: 470 / ${item._id.slice(-4)} / DS / 2025`, 105, 62, null, null, "center");

        doc.text("Yang bertanda tangan di bawah ini Kepala Desa Padangan, menerangkan bahwa:", 20, 80);
        doc.text(`Nama       : ${item.nama_pemohon}`, 30, 95);
        doc.text(`NIK        : ${item.nik}`, 30, 105);
        doc.text(`Keperluan  : ${item.tujuan_surat}`, 30, 115);
        
        const splitText = doc.splitTextToSize(`Adalah benar-benar warga Desa Padangan yang mengajukan permohonan untuk pembuatan: ${item.jenis_surat}.`, 170);
        doc.text(splitText, 20, 135);
        doc.text("Demikian surat pengantar ini dibuat untuk dapat dipergunakan sebagaimana mestinya.", 20, 160);

        const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.text(`Malang, ${today}`, 140, 190);
        doc.text("Kepala Desa,", 140, 200);
        doc.text("( Bpk. Kepala Desa )", 140, 230);
        doc.save(`Surat_${item.nama_pemohon}.pdf`);
    };

    // --- LOGIKA UPDATE & HAPUS ---
    const handleStatusChange = async (id, newStatus) => {
        let catatan = '';
        if (newStatus === 'Ditolak') {
            catatan = window.prompt('Alasan penolakan (Wajib):', 'Berkas kurang lengkap');
            if (!catatan) return;
        } else if (newStatus === 'Siap Diambil') {
            catatan = window.prompt('Pesan Tambahan (Opsional):', 'Silakan diambil di kantor desa.');
            if (catatan === null) return;
        }

        try {
            await api.put(`/permohonan/${id}`, { status: newStatus, catatan });
            const updatedList = listPermohonan.map(item => item._id === id ? { ...item, status: newStatus, catatan } : item);
            setListPermohonan(updatedList);
            fetchStats();
            alert('✅ Status diperbarui!');
        } catch (err) { alert('Gagal update'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus data ini?')) {
            try {
                await api.delete(`/permohonan/${id}`);
                setListPermohonan(listPermohonan.filter(item => item._id !== id));
                fetchStats();
            } catch (err) { alert('Gagal hapus'); }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="animate-fade-in">
            {/* Header Dashboard */}
            <div className="card" style={{ marginBottom: '20px', padding: '20px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                        <h2 style={{ color: 'var(--text-dark)', margin: 0 }}>📊 Dashboard Admin</h2>
                        <p style={{ color: '#666', margin: 0 }}>Selamat datang, Admin Desa.</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* TOMBOL EXPORT EXCEL */}
                        <button onClick={handleExportExcel} className="btn" style={{ background: '#217346', color: 'white', padding: '10px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            📊 Download Excel
                        </button>

                        <button onClick={handleLogout} className="btn btn-secondary" style={{ background: '#ffecec', color: 'red', fontSize: '14px', padding: '10px 20px' }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* --- DASHBOARD ANALITIK (Seragam & Elegan) --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <StatCard title="Total Masuk" value={stats.total} icon="📥" />
                <StatCard title="Perlu Diproses" value={(stats.diajukan || 0) + (stats.diproses || 0)} icon="⚙️" />
                <StatCard title="Siap Diambil" value={stats.siap} icon="📬" />
                <StatCard title="Selesai" value={stats.selesai} icon="✅" />
            </div>

            {/* Tabel Data */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: 'var(--primary-red)' }}>Daftar Permohonan Terbaru</h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee', color: '#666', textAlign: 'left' }}>
                                <th style={{ padding: '15px' }}>Tgl</th>
                                <th style={{ padding: '15px' }}>Pemohon</th>
                                <th style={{ padding: '15px' }}>Keperluan</th>
                                <th style={{ padding: '15px' }}>Status</th>
                                <th style={{ padding: '15px' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listPermohonan.map((item) => (
                                <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px' }}>{new Date(item.tgl_pengajuan).toLocaleDateString('id-ID')}</td>
                                    <td style={{ padding: '15px' }}>
                                        <strong>{item.nama_pemohon}</strong><br/>
                                        <small style={{ color: '#888' }}>{item.nik}</small>
                                    </td>
                                    <td style={{ padding: '15px' }}>{item.tujuan_surat}</td>
                                    <td style={{ padding: '15px' }}>
                                        <select 
                                            className="form-select"
                                            value={item.status} 
                                            onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                            style={{ padding: '5px', fontSize: '13px', width: 'auto' }}
                                        >
                                            <option value="Diajukan">Diajukan</option>
                                            <option value="Diproses">Diproses</option>
                                            <option value="Siap Diambil">Siap Diambil</option>
                                            <option value="Selesai">Selesai</option>
                                            <option value="Ditolak">❌ Tolak</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                        <a href={`http://localhost:5000/uploads/${item.dokumen_pendukung}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '20px' }} title="Lihat KTP">📁</a>
                                        {item.status !== 'Ditolak' && (
                                            <button onClick={() => handlePrint(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }} title="Cetak Surat">🖨️</button>
                                        )}
                                        <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }} title="Hapus">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {listPermohonan.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Belum ada data masuk.</div>}
                </div>
            </div>
        </div>
    );
};

// Komponen Kartu Statistik Versi "Clean Professional"
const StatCard = ({ title, value, icon }) => (
    <div style={{ 
        background: '#FFFFFF', 
        borderRadius: '12px', 
        padding: '24px', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', 
        border: '1px solid #E5E7EB',
        borderLeft: '5px solid #9A1B28', /* Aksen Merah di Kiri */
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        transition: 'transform 0.2s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {title}
            </p>
            <h3 style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: '800', color: '#1F2937' }}>
                {value || 0}
            </h3>
        </div>
        
        {/* Icon Wrapper: Abu-abu Sangat Muda, Icon Merah Gelap */}
        <div style={{ 
            width: '48px', height: '48px', 
            background: '#F3F4F6', 
            color: '#9A1B28', 
            borderRadius: '10px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '1.5rem' 
        }}>
            {icon}
        </div>
    </div>
);

export default AdminDashboard;