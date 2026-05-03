import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Mail, ShieldAlert, ShieldCheck, Folder } from 'lucide-react';
import { motion } from 'framer-motion';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, projectsRes] = await Promise.all([
        axios.get('/api/v1/users', { headers }),
        axios.get('/api/v1/projects', { headers })
      ]);
      setUsers(usersRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading Team...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Team & Projects</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of all team members and active projects.</p>
      </header>

      <section style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Users color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem' }}>Team Members</h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {Array.isArray(users) && users.length > 0 ? users.map((u: any) => (
            <motion.div whileHover={{ y: -5 }} key={u.id} className="glass-morphism" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '1.2rem', fontWeight: 'bold', color: 'white'
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{u.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Mail size={14} />
                    {u.email}
                  </div>
                </div>
              </div>
              <div style={{ 
                alignSelf: 'flex-start',
                padding: '5px 12px', 
                borderRadius: '20px', 
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: u.role === 'ADMIN' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: u.role === 'ADMIN' ? '#f59e0b' : '#10b981'
              }}>
                {u.role === 'ADMIN' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                {u.role === 'ADMIN' ? 'Administrator' : 'Member'}
              </div>
            </motion.div>
          )) : <p style={{ color: 'var(--text-muted)' }}>No team members found.</p>}
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Folder color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem' }}>Project Directory</h2>
        </div>
        <div className="glass-morphism" style={{ padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '15px' }}>Project Name</th>
                <th style={{ padding: '15px' }}>Description</th>
                <th style={{ padding: '15px' }}>Team Size</th>
                <th style={{ padding: '15px' }}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(projects) && projects.length > 0 ? projects.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '15px', fontWeight: '500' }}>{p.name}</td>
                  <td style={{ padding: '15px', color: 'var(--text-muted)' }}>
                    {p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={16} color="var(--text-muted)" />
                      {p.teamMembers?.length || 0} members
                    </div>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      color: 'var(--primary)', 
                      padding: '4px 10px', 
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}>
                      {p.owner?.name || 'Unknown'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </motion.div>
  );
};

export default Team;
