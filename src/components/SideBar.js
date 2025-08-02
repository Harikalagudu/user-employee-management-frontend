import React from 'react';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
    // This check is now the only one we need for the leave section
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user?.roles.includes('ROLE_MANAGER');

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h3>PayFlow</h3>
            </div>
            <ul>
                {/* These links are visible to both HR and Manager */}
                <li><NavLink to="/dashboard/home">Dashboard</NavLink></li>
                <li><NavLink to="/dashboard/employees">Employees</NavLink></li>
                <li><NavLink to="/dashboard/onboard">Onboard New Hire</NavLink></li>
                
                {/* --- THIS IS THE FIX --- */}
                {/* This entire block will now ONLY render if the user is a Manager. */}
                {isManager && (
                    <>
                        <hr style={{borderColor: '#495057'}} />
                        <li><NavLink to="/dashboard/approve-leave">Approve Leaves</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default SideBar;