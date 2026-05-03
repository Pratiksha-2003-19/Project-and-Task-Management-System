import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/auth/register', { name, email, password, role });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location.href = '/';
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="glass-morphism auth-card" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <UserPlus size={48} color="var(--primary)" style={{ marginBottom: '10px' }} />
        <h2 style={{ fontSize: '2rem' }}>Create Account</h2>
        <p style={{ color: 'var(--text-muted)' }}>Join your team today</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ 
              background: 'var(--bg-dark)', 
              border: '1px solid var(--border)', 
              color: 'white', 
              padding: '12px', 
              borderRadius: '8px' 
            }}
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        
        {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}
        
        <button type="submit" className="btn-primary" style={{ marginTop: '10px', height: '48px' }}>
          Sign Up
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
      </p>
    </div>
  );
};

export default Signup;
