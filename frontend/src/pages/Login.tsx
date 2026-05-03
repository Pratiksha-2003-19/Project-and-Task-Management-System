import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/auth/authenticate', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location.href = '/';
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="glass-morphism auth-card" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <LogIn size={48} color="var(--primary)" style={{ marginBottom: '10px' }} />
        <h2 style={{ fontSize: '2rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)' }}>Login to manage your team tasks</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@company.com" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}
        
        <button type="submit" className="btn-primary" style={{ marginTop: '10px', height: '48px' }}>
          Login
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
