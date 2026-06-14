import React, { useRef, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, BookOpen, Bell, LogOut, Search, User } from 'lucide-react';
import './Bottomnav.css';

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

const NavIcon = ({ to, Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
  >
    <Icon size={18} strokeWidth={2.5} />
  </NavLink>
);

export default function TopNav({ isDarkMode, toggleTheme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // ← ADD

  const lastScrollY = useRef(0);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) { setIsNavHidden(false); return; }
      setIsNavHidden(currentScrollY > lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
        setIsFocused(false);
        setSearchResults([]);
        setSearchQuery('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Unread count polling ← ADD
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUnreadCount(data.count || 0);
      } catch (err) {}
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const handleResultClick = (userId) => {
    navigate(`/profile/${userId}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsFocused(false);
    setIsExpanded(false);
  };

  return (
    <>
      <header className={`site-header ${isNavHidden ? 'nav-hidden' : ''}`}>
        {/* Left */}
        <div className="header-left">
          <Link to="/newsroom" className="logo-anchor">
            <h1 className="stuudo-logo">stuudo<span>.</span></h1>
          </Link>
        </div>

        {/* Center */}
        <div className="header-center">
          <nav className="icon-hub">
            <NavIcon to="/newsroom" Icon={Home} />
            <NavIcon to="/marketplace" Icon={ShoppingBag} />
            <NavIcon to="/academy" Icon={BookOpen} />

            {/* Bell with unread badge ← REPLACED */}
            <NavLink
              to="/notifications"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <Bell size={18} strokeWidth={2.5} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: '10px',
                    fontWeight: 700,
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
            </NavLink>
          </nav>

          {/* Search */}
          <div ref={searchRef} className={`header-search-bar ${isExpanded ? 'expanded' : ''}`}>
            <Search className="search-icon" size={18} onClick={() => setIsExpanded(true)} />
            <input
              type="text"
              placeholder="Search for people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { setIsExpanded(true); setIsFocused(true); }}
            />

            {isFocused && searchQuery.length > 0 && (
              <div className="search-results-dropdown">
                {searchLoading ? (
                  <div className="search-no-results">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(user.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={
                          user.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.f_name} ${user.l_name}`)}&background=random`
                        }
                        alt={user.f_name}
                        className="result-avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.f_name} ${user.l_name}`)}&background=random`;
                        }}
                      />
                      <div className="result-info">
                        <span className="result-name">{user.f_name} {user.l_name}</span>
                        <span className="result-meta">
                          {user.course || user.department || 'Student'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">No results for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="header-right">
          <Link to="/profile" className="profile-anchor">
            <img
              src={
                storedUser?.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(`${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`)}&background=random`
              }
              className="user-avatar"
              alt="User"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(`${storedUser?.f_name || ''} ${storedUser?.l_name || ''}`)}&background=random`;
              }}
            />
          </Link>
          <Link to="/" className="logout-btn">
            <LogOut size={20} />
          </Link>
        </div>
      </header>

      <nav className={`mobile-pill-bottom-nav ${isNavHidden ? 'nav-hidden' : ''}`}>
        <div className="mobile-pill-items-wrapper">
          <NavIcon to="/newsroom" Icon={Home} />
          <NavIcon to="/marketplace" Icon={ShoppingBag} />
          <NavIcon to="/academy" Icon={BookOpen} />
          <NavIcon to="/notifications" Icon={Bell} />
          <NavIcon to="/profile" Icon={User} />
        </div>
      </nav>
    </>
  );
}