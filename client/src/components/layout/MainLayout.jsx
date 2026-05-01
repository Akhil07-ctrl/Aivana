import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// A layout wrapper that includes Navbar and Footer around child routes
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col pt-[88px]">
      {/* pt-[88px] accounts for the fixed navbar height so content doesn't hide behind it */}
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
