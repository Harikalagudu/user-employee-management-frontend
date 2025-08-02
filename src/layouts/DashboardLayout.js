import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import SideBar from '../components/SideBar';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <SideBar />
            <main className="dashboard-main-content">
                <TopNavBar user={user} onLogout={handleLogout} />
                <div className="dashboard-page-content">
                    <Outlet /> {/* Renders the matched child route */}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;