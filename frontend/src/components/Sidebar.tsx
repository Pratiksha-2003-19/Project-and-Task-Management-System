import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut } from 'lucide-react'; // Removed Settings import

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="sidebar" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="brand" style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '40px',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <CheckSquare size={32} />
        TaskFlow
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <SidebarLink to="/projects" icon={<FolderKanban size={20} />} label="Projects" />
        <SidebarLink to="/tasks" icon={<CheckSquare size={20} />} label="Tasks" />
        <SidebarLink to="/team" icon={<Users size={20} />} label="Team" />
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        {/* Settings link completely removed */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            color: 'var(--danger)',
            background: 'none',
            width: '100%',
            textAlign: 'left',
            borderRadius: '8px',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '8px',
      color: isActive ? 'white' : 'var(--text-muted)',
      backgroundColor: isActive ? 'var(--primary)' : 'transparent',
      textDecoration: 'none',
      transition: 'all 0.3s'
    })}
  >
    {icon}
    {label}
  </NavLink>
);

export default Sidebar;