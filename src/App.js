import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'bootstrap/dist/css/bootstrap.min.css';

// --- Import ALL Layouts and Pages ---
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardLayout from './layouts/DashboardLayout';
import EmployeeLayout from './layouts/EmployeeLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageUsersPage from './pages/ManageUsersPage';
import DashboardHomePage from './pages/DashboardHomePage';
import EmployeeListPage from './pages/EmployeeListPage';
import OnboardingPage from './pages/OnboardingPage';
import LeaveManagementPage from './pages/LeaveManagementPage';
import LeaveApprovalPage from './pages/LeaveApprovalPage';
// EmployeeDashboardPage import removed as the file was deleted
// You might need to create MyLeaveRequestsPage.jsx for "Leaves Info"
// import MyLeaveRequestsPage from './pages/MyLeaveRequestsPage';

import './App.css';

const MySwal = withReactContent(Swal);

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { return <Navigate to="/login" />; }
    const hasRole = user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) { return <Navigate to="/login" />; }
    if (user.firstTimeLogin) { return <Navigate to="/reset-password" />; }
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) { setUser(JSON.parse(storedUser)); }
    }, []);

    const handleLoginSuccess = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        if (userData.firstTimeLogin) { navigate('/reset-password'); return; }

        if (userData.roles.includes('ROLE_ADMIN')) {
            navigate('/admin/dashboard');
        } else if (userData.roles.includes('ROLE_HR') || userData.roles.includes('ROLE_MANAGER')) {
            navigate('/dashboard/home');
        } else if (userData.roles.includes('ROLE_EMPLOYEE')) {
            // Redirect employee to their leave page or another default if dashboard is removed
            navigate('/employee/leave');
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        MySwal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    };

    return (
        <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/reset-password" element={<ResetPasswordPage onPasswordResetSuccess={handleLogout} />} />

            {/* --- ADMIN DASHBOARD ROUTES --- */}
            <Route
                path="/admin"
                element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminLayout user={user} onLogout={handleLogout} /></ProtectedRoute>}
            >
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="manage-users" element={<ManageUsersPage />} />
                <Route index element={<Navigate to="dashboard" />} />
            </Route>

            {/* --- UNIFIED HR & MANAGER DASHBOARD ROUTES --- */}
            <Route
                path="/dashboard"
                element={<ProtectedRoute allowedRoles={['ROLE_HR', 'ROLE_MANAGER']}><DashboardLayout user={user} onLogout={handleLogout} /></ProtectedRoute>}
            >
                <Route path="home" element={<DashboardHomePage />} />
                <Route path="employees" element={<EmployeeListPage />} />
                <Route path="onboard" element={<OnboardingPage />} />
                <Route path="leave" element={<ProtectedRoute allowedRoles={['ROLE_MANAGER']}><LeaveManagementPage /></ProtectedRoute>} />
                <Route path="approve-leave" element={<ProtectedRoute allowedRoles={['ROLE_MANAGER']}><LeaveApprovalPage /></ProtectedRoute>} />
                <Route index element={<Navigate to="home" />} />
            </Route>

            {/* --- EMPLOYEE ROUTES --- */}
            <Route
                path="/employee"
                element={
                    <ProtectedRoute allowedRoles={['ROLE_EMPLOYEE']}>
                        <EmployeeLayout user={user} onLogout={handleLogout} />
                    </ProtectedRoute>
                }
            >
                <Route path="leave" element={<LeaveManagementPage />} />
                <Route path="my-requests" element={<div>Leaves Info Page (Placeholder)</div>} />
                <Route index element={<Navigate to="leave" />} />
            </Route>

            {/* --- DEFAULT CATCH-ALL ROUTE --- */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
