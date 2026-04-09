import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, BookOpen, User } from 'lucide-react';
import './Bottomnav.css';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/newsroom" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <Home size={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/marketplace" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <ShoppingBag size={22} />
        <span>Market</span>
      </NavLink>
      <NavLink to="/academy" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <BookOpen size={22} />
        <span>Academic</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}