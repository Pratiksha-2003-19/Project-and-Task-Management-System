import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Folder, X, Edit, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState<any>(null);

  let user = { id: 0, role: 'MEMBER' };
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) user = JSON.parse(savedUser);
  } catch (e) {
    console.error("Error parsing user data", e);
  }
  const token = localStorage.getItem('token');
  const isAdmin = (user.role === 'ADMIN' || user.role === 'Admin' || user.role?.toString().toUpperCase() === 'ADMIN');

  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [editSelectedMembers, setEditSelectedMembers] = useState<number[]>([]);

  const fetchProjectsAndUsers = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [projectsRes, usersRes] = await Promise.all([
        axios.get('/api/v1/projects', { headers }),
        axios.get('/api/v1/users', { headers })
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndUsers();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/projects', {
        ...newProject,
        owner: { id: Number(user.id) },
        teamMembers: selectedMembers.map(id => ({ id }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      setSelectedMembers([]);
      fetchProjectsAndUsers();
      alert('Project created successfully!');
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Failed to create project. Ensure you have ADMIN role.');
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      await axios.put(`/api/v1/projects/${editingProject.id}`, {
        name: editingProject.name,
        description: editingProject.description,
        teamMembers: editSelectedMembers.map(id => ({ id }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditModal(false);
      setEditingProject(null);
      setEditSelectedMembers([]);
      fetchProjectsAndUsers();
      alert('Project updated successfully!');
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project.');
    }
  };

  const handleMarkAsCompleted = async (projectId: number) => {
    if (!window.confirm('Mark this project as completed?')) return;

    try {
      await axios.patch(`/api/v1/projects/${projectId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjectsAndUsers();
      alert('Project marked as completed!');
    } catch (err) {
      console.error('Error marking project as completed:', err);
      alert('Failed to mark project as completed.');
    }
  };

  const toggleMember = (id: number) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const toggleEditMember = (id: number) => {
    setEditSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const openEditModal = (project: any) => {
    setEditingProject({
      id: project.id,
      name: project.name,
      description: project.description
    });
    setEditSelectedMembers(project.teamMembers?.map((m: any) => m.id) || []);
    setShowEditModal(true);
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading Projects...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track your team's project progress.</p>
        </div>
        {isAdmin && (
          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <Plus size={20} />
            New Project
          </button>
        )}
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {Array.isArray(projects) ? projects.map((project: any) => (
          <div key={project.id} className="glass-morphism" style={{ padding: '30px', position: 'relative' }}>
            {project.completed && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#10b981',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                COMPLETED
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                <Folder size={24} />
              </div>
              {isAdmin && !project.completed && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEditModal(project)}
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                    title="Edit Project"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleMarkAsCompleted(project.id)}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#10b981'
                    }}
                    title="Mark as Completed"
                  >
                    <CheckCircle size={16} />
                  </button>
                </div>
              )}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{project.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>{project.description}</p>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Team ({project.teamMembers?.length || 0})</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {project.teamMembers?.map((member: any) => (
                  <span key={member.id} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--bg-dark)' }}>
                    {member.name}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Owner: {project.owner?.name || 'Admin'}</span>
              {project.completed && (
                <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✓ Completed</span>
              )}
            </div>
          </div>
        )) : <div style={{ color: 'var(--text-muted)' }}>No projects found or an error occurred.</div>}
      </div>

      {/* Create Project Modal */}
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
              style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
              <h2 style={{ marginBottom: '30px' }}>Create New Project</h2>
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label>Project Name</label>
                  <input
                    type="text" required value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="e.g. Website Redesign"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label>Description</label>
                  <textarea
                    style={{
                      background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'white',
                      padding: '12px', borderRadius: '8px', minHeight: '100px', outline: 'none'
                    }}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Briefly describe the project goals..."
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label>Assign Team Members</label>
                  <div style={{
                    background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '8px',
                    padding: '12px', maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px'
                  }}>
                    {users.map((u: any) => (
                      <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(u.id)}
                          onChange={() => toggleMember(u.id)}
                        />
                        {u.name} ({u.role})
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ height: '48px', marginTop: '10px' }}>Create Project</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && editingProject && (
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
              style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <button
                onClick={() => setShowEditModal(false)}
                style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
              <h2 style={{ marginBottom: '30px' }}>Edit Project</h2>
              <form onSubmit={handleEditProject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label>Project Name</label>
                  <input
                    type="text" required
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    placeholder="e.g. Website Redesign"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label>Description</label>
                  <textarea
                    style={{
                      background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'white',
                      padding: '12px', borderRadius: '8px', minHeight: '100px', outline: 'none'
                    }}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Briefly describe the project goals..."
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label>Assign Team Members</label>
                  <div style={{
                    background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '8px',
                    padding: '12px', maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px'
                  }}>
                    {users.map((u: any) => (
                      <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={editSelectedMembers.includes(u.id)}
                          onChange={() => toggleEditMember(u.id)}
                        />
                        {u.name} ({u.role})
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ height: '48px', marginTop: '10px' }}>Update Project</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;