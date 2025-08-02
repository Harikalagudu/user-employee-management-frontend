import React, { useState } from 'react';
import { createUser } from '../services/api';
import TopNavBar from '../components/TopNavBar'; // <--- CORRECT: IMPORT THE NEW TopNavBar COMPONENT

const AdminDashboard = ({ user, onLogout }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_HR');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await createUser(username, password, role);
            setSuccess(`User '${username}' created successfully!`);
            // Clear form
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user.');
            console.error(err);
        }
    };

    return (
        // The Admin page will have a simpler layout than the HR dashboard for now.
        <div className="app-container">
            {/* CORRECT: Use the <TopNavBar /> component here, not the old <Header /> */}
            <TopNavBar user={user} onLogout={onLogout} />

            <div className="form-container" style={{ marginTop: '2rem' }}>
                <h2>Create New User</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Temporary Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="ROLE_HR">HR</option>
                            <option value="ROLE_MANAGER">Manager</option>
                        </select>
                    </div>
                    <button type="submit" className="btn">Create User</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;