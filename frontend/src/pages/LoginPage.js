import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            alert('Username atau Password salah!');
        } finally {
            setLoading(false);
        }
    };

   return (
        // Gunakan flexbox container untuk menengahkan vertikal & horizontal
        <div className="animate-fade-in" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            
            {/* Card akan menyesuaikan lebar max 400px, tapi di HP jadi 100% */}
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🇮🇩</div>
                <h2 style={{ color: 'var(--primary-red)' }}>Login Admin</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>Sistem Pelayanan Desa</p>
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input className="form-input" type="text" name="username" placeholder="Username" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <input className="form-input" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Masuk...' : 'MASUK DASHBOARD'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default LoginPage;