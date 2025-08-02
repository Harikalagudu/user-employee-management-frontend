// src/pages/LoginPage.js
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { login } from '../services/api';
import RoleSelector from '../components/RoleSelector/RoleSelector';

const MySwal = withReactContent(Swal);

const LoginPage = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('EMPLOYEE');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password || !selectedRole) {
            MySwal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Username, password, and role are required.',
            });
            return;
        }

        MySwal.fire({
            title: 'Logging In...',
            text: 'Please wait while we verify your credentials.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await login(username, password, selectedRole);
            MySwal.close();
            onLoginSuccess(response.data);
        } catch (err) {
            MySwal.close();
            console.error("Login error:", err);

            let errorMessage = 'Please check your credentials and try again.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            MySwal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage,
                customClass: {
                    confirmButton: 'btn btn-danger me-2'
                },
                buttonsStyling: false
            });
        }
    };

    return (
        <div className="form-container">
            <h1>PayFlow Login</h1>
            <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
