import { Outlet } from 'react-router-dom';
import BottomNav from '../../components/Bottomnav/Bottomnav.jsx';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Outlet />
      <BottomNav />
    </div>
  );
}