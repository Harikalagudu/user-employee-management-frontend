import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSideBar = () => {
    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                {/* CHANGE HERE */}
                <h3>PayFlow</h3>
            </div>
            <ul>
                <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/admin/manage-users">Manage Users</NavLink></li>
            </ul>
        </nav>
    );
};

export default AdminSideBar;