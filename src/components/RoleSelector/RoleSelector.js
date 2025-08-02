// src/components/RoleSelector/RoleSelector.js
import React from 'react';
import './RoleSelector.css'; // Make sure this path is correct

const RoleSelector = ({ selectedRole, onSelectRole }) => {
    // These values MUST match the backend Enum Role values (e.g., "ADMIN", "HR")
    // The labels are for display in the UI.
    const roles = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'HR', label: 'HR' },
        { value: 'MANAGER', label: 'Manager' },
        { value: 'EMPLOYEE', label: 'Employee' }
    ];

    return (
        <div className="role-selector-container">
            {roles.map((role) => (
                <button
                    key={role.value}
                    className={`role-button ${selectedRole === role.value ? 'selected' : ''}`}
                    onClick={() => onSelectRole(role.value)}
                >
                    {role.label}
                </button>
            ))}
        </div>
    );
};

export default RoleSelector;