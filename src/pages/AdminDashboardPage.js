import React, { useState, useEffect } from 'react';
import { getAdminDashboardStats, createUser } from '../services/api';
import { UserPlus, FileText, Send } from 'lucide-react';
import Modal from '../components/Modal';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [, setError] = useState(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_EMPLOYEE'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getAdminDashboardStats();
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch admin dashboard stats:", err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <h4 className="text-secondary">Loading Dashboard...</h4>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Header and Buttons */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <h2 className="mb-3 mb-sm-0">Admin Dashboard</h2>
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-primary d-flex align-items-center" onClick={() => setIsAddUserOpen(true)}>
                        <UserPlus size={16} className="me-2" /> Add User
                    </button>

                    <button className="btn btn-outline-primary d-flex align-items-center">
                        <FileText size={16} className="me-2" /> Export
                    </button>

                    <button className="btn btn-success d-flex align-items-center">
                        <Send size={16} className="me-2" /> Announce
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                {stats && (
                    <>
                        <Card title="TOTAL HRS" value={stats.totalHr} activeCount={stats.activeHr} inactiveCount={stats.totalHr - stats.activeHr} color="warning" />
                        <Card title="TOTAL MANAGERS" value={stats.totalManagers} activeCount={stats.activeManagers} inactiveCount={stats.totalManagers - stats.activeManagers} color="success" />
                        <Card title="TOTAL EMPLOYEES" value={stats.totalEmployees} activeCount={stats.activeEmployees} inactiveCount={stats.totalEmployees - stats.activeEmployees} color="primary" />
                        <Card title="PENDING ONBOARDINGS" value={stats.pendingOnboardings} subtext="Last 2 days ago" color="danger" />
                    </>
                )}
            </div>

            {/* Recent Logins */}
            <div className="card p-4 mb-4">
                <h4 className="mb-3">Recent Logins</h4>
                <div className="bg-light rounded p-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                            JD
                        </div>
                        <div>
                            <div className="fw-semibold">John Doe</div>
                            <div className="text-muted small">hr@payflow.com</div>
                        </div>
                    </div>
                    <div className="text-muted small">Just now</div>
                </div>
            </div>

            {/* Add User Modal */}
            <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)}>
                <h5>Add New User</h5>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            await createUser(newUser);
                            alert("User created successfully!");
                            setIsAddUserOpen(false);
                            setNewUser({ username: '', email: '', password: '', role: 'ROLE_EMPLOYEE' });
                        } catch (error) {
                            alert("Failed to create user.");
                            console.error(error);
                        }
                    }}
                >
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Username"
                            className="form-control"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            placeholder="Email"
                            className="form-control"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-control"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-select"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="ROLE_HR">HR</option>
                            <option value="ROLE_MANAGER">Manager</option>
                            <option value="ROLE_EMPLOYEE">Employee</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Create User</button>
                </form>
            </Modal>
        </div>
    );
};

const Card = ({ title, value, activeCount, inactiveCount, subtext, color }) => (
    <div className="col-md-6 col-lg-3">
        <div className={`card border-${color}`}>
            <div className="card-body">
                <h6 className="text-uppercase fw-bold text-muted">{title}</h6>
                <h3 className="fw-bold">{value}</h3>
                {activeCount !== undefined && inactiveCount !== undefined ? (
                    <p className="text-muted mb-0">
                        <span className="text-success fw-semibold">Active: {activeCount}</span>{' '}
                        <span className="ms-3 text-danger fw-semibold">Inactive: {inactiveCount}</span>
                    </p>
                ) : (
                    <p className="text-muted">{subtext}</p>
                )}
            </div>
        </div>
    </div>
);

export default AdminDashboardPage;
