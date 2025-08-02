import React from 'react';
import { NavLink } from 'react-router-dom';

const EmployeeSideBar = () => {
    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h3>PayFlow</h3>
            </div>
            <ul>
                {/* --- Simplified Navigation --- */}
                {/* An employee doesn't have a complex dashboard, so we can link directly to leave management */}
                <li><NavLink to="/employee/leave">Leave Management</NavLink></li>
            </ul>
        </nav>
    );
};

export default EmployeeSideBar;