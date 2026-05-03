import { Bell, Search, User, LogOut } from 'lucide-react'; // Added LogOut
import { useState } from 'react';

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  let user = { name: 'User', role: 'MEMBER' };
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) user = JSON.parse(savedUser);
  } catch (e) {
    console.error("Error parsing user data", e);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0 30px 0',
      marginBottom: '20px'
    }}>
      <div className="search-bar" style={{ position: 'relative', width: '400px' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        <input
          type="text"
          placeholder="Search projects or tasks..."
          style={{ width: '100%', paddingLeft: '40px' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button style={{ background: 'var(--bg-card)', padding: '10px', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <Bell size={20} />
        </button>

        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={20} color="white" />
            </div>
          </div>

          {/* User Dropdown Menu - No Settings option */}
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '10px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              minWidth: '200px',
              zIndex: 1000,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontWeight: '600' }}>{user.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email || user.role}</p>
              </div>
              {/* Profile link only - NO Settings */}
              <NavLink
                to="/profile"
                style={{
                  display: 'block',
                  padding: '12px',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px',
                  textAlign: 'left',
                  color: 'var(--danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;