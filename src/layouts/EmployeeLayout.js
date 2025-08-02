import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import EmployeeSideBar from '../components/EmployeeSideBar'; // Using the new, simpler sidebar
import TopNavBar from '../components/TopNavBar';
import './DashboardLayout.css'; // We can reuse the same CSS as the other dashboards

const EmployeeLayout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        // You can import and use your SweetAlert2 logout function here if you move it to a shared file
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <EmployeeSideBar />
            <main className="dashboard-main-content">
                <TopNavBar user={user} onLogout={handleLogout} />
                <div className="dashboard-page-content">
                    <Outlet /> {/* Renders the matched employee page (e.g., LeaveManagementPage) */}
                </div>
            </main>
        </div>
    );
};

export default EmployeeLayout;