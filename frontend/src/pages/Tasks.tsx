import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, CheckSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', description: '', status: 'TODO', priority: 'MEDIUM',
    projectId: '', assignedUserId: '', dueDate: new Date().toISOString().split('T')[0]
  });

  let user = { id: 0, role: 'MEMBER' };
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) user = JSON.parse(savedUser);
  } catch (e) {
    console.error("Error parsing user data", e);
  }
  const token = localStorage.getItem('token');
  const isAdmin = (user.role === 'ADMIN' || user.role === 'Admin' || user.role?.toString().toUpperCase() === 'ADMIN');

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get('/api/v1/tasks', { headers }),
        axios.get('/api/v1/projects', { headers }),
        axios.get('/api/v1/users', { headers })
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/tasks', {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        project: { id: Number(newTask.projectId) },
        assignedUser: { id: Number(newTask.assignedUserId || user.id) }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewTask({
        title: '', description: '', status: 'TODO', priority: 'MEDIUM',
        projectId: '', assignedUserId: '', dueDate: new Date().toISOString().split('T')[0]
      });
      fetchData();
      alert('Task assigned successfully!');
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Ensure all fields are filled.');
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`/api/v1/tasks/${id}/status?status=${status}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchData();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        alert('You are not assigned to this task. Only the assigned team member can change task status.');
      } else {
        alert('Failed to update task status.');
      }
    }
  };

  // Check if current user can change task status
  const canEditStatus = (task: any) => {
    // Only the assigned team member can change task status
    // Admin cannot change task status
    return Number(user.id) === task.assignedUser?.id;
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Create and assign tasks to your team members.</p>
        </div>
        {/* Only Admin can create/assign tasks */}
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Assign New Task
          </button>
        )}
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {Array.isArray(tasks) ? tasks.map((task: any) => {
          const canEdit = canEditStatus(task);
          const isOverdue = task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
          const isCompleted = task.status === 'COMPLETED';

          return (
            <div key={task.id} className="glass-morphism" style={{
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: isOverdue ? '4px solid #ef4444' : 'none',
              opacity: isCompleted ? 0.7 : 1
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    marginBottom: '5px',
                    color: isOverdue ? '#ef4444' : 'inherit'
                  }}>
                    {task.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Assigned to: <span style={{ color: 'var(--primary)' }}>{task.assignedUser?.name || 'Unassigned'}</span> • {task.project?.name}
                    {task.assignedUser?.id === user.id && <span style={{ marginLeft: '10px', fontSize: '0.7rem', color: '#10b981' }}>(You)</span>}
                  </p>
                  {task.description && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Status display/selector */}
                    {canEdit && !isCompleted ? (
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.2)',
                          color: task.status === 'COMPLETED' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? '#f59e0b' : 'var(--text-muted)',
                          border: `1px solid ${task.status === 'COMPLETED' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? '#f59e0b' : 'var(--border)'}`,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    ) : (
                      <span style={{
                        fontSize: '0.8rem',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${task.status === 'COMPLETED' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? '#f59e0b' : 'var(--border)'}`,
                        color: task.status === 'COMPLETED' ? 'var(--success)' : task.status === 'IN_PROGRESS' ? '#f59e0b' : 'var(--text-muted)',
                        background: 'rgba(0,0,0,0.2)'
                      }}>
                        {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status === 'COMPLETED' ? 'Completed' : 'To Do'}
                      </span>
                    )}

                    <span style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: task.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : task.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: task.priority === 'HIGH' ? '#ef4444' : task.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'
                    }}>
                      {task.priority} Priority
                    </span>

                    {isOverdue && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        fontWeight: 'bold'
                      }}>
                        Overdue
                      </span>
                    )}

                    {isCompleted && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        fontWeight: 'bold'
                      }}>
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: isOverdue ? '#ef4444' : 'var(--text-muted)' }}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                {!canEdit && task.assignedUser?.id !== user.id && task.status !== 'COMPLETED' && (
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic'
                  }}>
                    Only assigned member can update status
                  </span>
                )}
              </div>
            </div>
          );
        }) : <div style={{ color: 'var(--text-muted)' }}>No tasks found or an error occurred.</div>}
      </div>

      {/* Create Task Modal - Only visible to Admin */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 1000, padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="glass-morphism"
              style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative' }}
            >
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none' }}>
                <X size={24} color="white" />
              </button>
              <h2 style={{ marginBottom: '30px' }}>Assign New Task</h2>
              <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                  type="text" placeholder="Task Title" required value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <textarea
                  placeholder="Task Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  style={{
                    background: 'var(--bg-dark)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                />
                <select
                  required value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  style={{ background: 'var(--bg-dark)', color: 'white', padding: '12px', borderRadius: '8px' }}
                >
                  <option value="">Select Project</option>
                  {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select
                  required value={newTask.assignedUserId}
                  onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
                  style={{ background: 'var(--bg-dark)', color: 'white', padding: '12px', borderRadius: '8px' }}
                >
                  <option value="">Assign To...</option>
                  {users.map((u: any) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    style={{ flex: 1, background: 'var(--bg-dark)', color: 'white', padding: '12px', borderRadius: '8px' }}
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                  </select>
                  <input
                    type="date"
                    style={{ flex: 1 }}
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ height: '48px' }}>Assign Task</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tasks;