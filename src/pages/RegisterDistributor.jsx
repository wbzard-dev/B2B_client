import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterDistributor = () => {
    const [formData, setFormData] = useState({
        distributorName: '',
        name: '',
        email: '',
        password: '',
        companyId: ''
    });
    const { registerDistributor } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerDistributor(formData);
            navigate('/');
        } catch (err) {
            console.error(err);
            const msg = err.msg || (err.errors && err.errors[0]?.msg) || 'Registration Failed. Check your details.';
            setError(msg);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-alt)', padding: '2rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Register Distributor</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join the network and start ordering</p>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="input-group">
                        <label>Distributor/Business Name</label>
                        <input type="text" name="distributorName" value={formData.distributorName} onChange={onChange} required placeholder="My Retail Store" />
                    </div>
                    <div className="input-group">
                        <label>Your Name</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} required placeholder="Jane Doe" />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={onChange} required placeholder="jane@retail.com" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={onChange} required placeholder="******" />
                    </div>
                    <div className="input-group">
                        <label>Company Link ID (Optional for Demo)</label>
                        <input type="text" name="companyId" value={formData.companyId} onChange={onChange} placeholder="Leave empty for auto-assign" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>Register</button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    <Link to="/login" style={{ color: 'var(--text-muted)' }}>Already have an account? Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterDistributor;
