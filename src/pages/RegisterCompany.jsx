import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterCompany = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        name: '',
        email: '',
        password: ''
    });
    const { registerCompany } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerCompany(formData);
            navigate('/');
        } catch (err) {
            setError('Registration Failed. Email or Company might already exist.');
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-alt)', padding: '2rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Register Company</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Start managing your supply chain today</p>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Company Name</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={onChange} required placeholder="Acme Inc." />
                    </div>
                    <div className="input-group">
                        <label>Admin Name</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} required placeholder="John Doe" />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={onChange} required placeholder="admin@acme.com" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={onChange} required placeholder="Create a strong password" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }}>Create Account</button>
                    </div>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <Link to="/login" style={{ color: 'var(--text-muted)' }}>Already have an account? Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterCompany;
