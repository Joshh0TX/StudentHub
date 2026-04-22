import { Outlet } from 'react-router-dom';
import TopNav from '../../components/Bottomnav/Bottomnav'; // Updated name
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <TopNav />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}