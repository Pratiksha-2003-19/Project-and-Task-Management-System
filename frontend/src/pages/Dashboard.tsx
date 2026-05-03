import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, Clock, ListTodo, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/v1/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getOverdueTasksCount = () => {
    if (!Array.isArray(tasks)) return 0;
    const today = new Date(new Date().setHours(0,0,0,0));
    return tasks.filter((t: any) => t.status !== 'COMPLETED' && new Date(t.dueDate) < today).length;
  };

  const stats = [
    { label: 'Total Tasks', value: Array.isArray(tasks) ? tasks.length : 0, icon: <ListTodo color="#6366f1" />, bg: 'rgba(99, 102, 241, 0.1)' },
    { label: 'Completed', value: Array.isArray(tasks) ? tasks.filter((t: any) => t.status === 'COMPLETED').length : 0, icon: <CheckCircle2 color="#10b981" />, bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'In Progress', value: Array.isArray(tasks) ? tasks.filter((t: any) => t.status === 'IN_PROGRESS').length : 0, icon: <Clock color="#f59e0b" />, bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Overdue', value: getOverdueTasksCount(), icon: <AlertCircle color="#ef4444" />, bg: 'rgba(239, 68, 68, 0.1)' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Welcome back, Team!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your projects today.</p>
      </header>

      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-morphism" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: stat.bg }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-tasks glass-morphism" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Recent Tasks</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '15px' }}>Task Name</th>
              <th style={{ padding: '15px' }}>Project</th>
              <th style={{ padding: '15px' }}>Priority</th>
              <th style={{ padding: '15px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tasks) && tasks.length > 0 ? tasks.slice(0, 5).map((task: any) => {
              const isOverdue = task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
              return (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '15px', fontWeight: '500', color: isOverdue ? '#ef4444' : 'inherit' }}>
                  {task.title}
                  {isOverdue && (
                    <span style={{ 
                      marginLeft: '10px',
                      fontSize: '0.7rem', 
                      padding: '2px 6px', 
                      borderRadius: '10px', 
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      Overdue
                    </span>
                  )}
                </td>
                <td style={{ padding: '15px' }}>{task.project?.name || 'General'}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    backgroundColor: task.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                    color: task.priority === 'HIGH' ? 'var(--danger)' : 'var(--primary)'
                  }}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    border: `1px solid ${task.status === 'COMPLETED' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? '#f59e0b' : 'var(--border)'}`,
                    color: task.status === 'COMPLETED' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? '#f59e0b' : 'var(--text-muted)',
                    fontSize: '0.8rem'
                  }}>
                    {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status === 'COMPLETED' ? 'Completed' : 'To Do'}
                  </span>
                </td>
              </tr>
            )}) : (
              <tr>
                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tasks found. Create one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Dashboard;
