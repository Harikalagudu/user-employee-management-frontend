import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSideBar from '../components/AdminSideBar'; // Using a specific sidebar
import TopNavBar from '../components/TopNavBar';
import './DashboardLayout.css'; // We can reuse the same CSS

const AdminLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <AdminSideBar />
            <main className="dashboard-main-content">
                <TopNavBar user={user} onLogout={handleLogout} />
                <div className="dashboard-page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
export default AdminLayout;