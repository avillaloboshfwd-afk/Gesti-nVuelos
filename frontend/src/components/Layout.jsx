import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => (
  <div className="app-root">
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
