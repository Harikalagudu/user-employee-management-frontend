import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
    getManageableUsers,
    updateUserStatus,
    createUser,
} from '../services/api';
import '../components/Modal.css';
import '../components/Table.css';

const MySwal = withReactContent(Swal);
Modal.setAppElement('#root');

const ManageUsersPage = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_HR',
    });

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    const fetchUsers = useCallback(() => {
        setIsLoading(true);
        getManageableUsers({ page: currentPage, size: pageSize })
            .then((response) => {
                setUsers(response.data.content);
                setTotalPages(response.data.totalPages);
            })
            .catch(() => {
                setError('Failed to load users. Please try again later.');
            })
            .finally(() => setIsLoading(false));
    }, [currentPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleStatusToggle = (user) => {
        const newStatus = !user.enabled;
        const actionText = newStatus ? 'Enable' : 'Disable';

        MySwal.fire({
            title: `Confirm Action`,
            html: `Are you sure you want to <strong>${actionText}</strong> the user "<strong>${user.username}</strong>"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionText} it!`,
            cancelButtonText: 'No, cancel',
            confirmButtonColor: newStatus ? '#28a745' : '#dc3545',
            cancelButtonColor: '#6c757d',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary ms-2',
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                updateUserStatus(user.id, newStatus)
                    .then(() => {
                        MySwal.fire(
                            `${actionText}d!`,
                            `User "${user.username}" has been successfully ${actionText.toLowerCase()}d.`,
                            'success'
                        );
                        fetchUsers();
                    })
                    .catch(() => {
                        MySwal.fire(
                            'Action Failed!',
                            'Could not update the user status.',
                            'error'
                        );
                    });
            }
        });
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewUser({ username: '', email: '', password: '', role: 'ROLE_HR' });
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateUserSubmit = (e) => {
        e.preventDefault();

        createUser(newUser)
            .then(() => {
                closeModal();
                MySwal.fire({
                    icon: 'success',
                    title: 'User Created!',
                    text: `The account for "${newUser.username}" has been successfully created.`,
                    timer: 2500,
                    showConfirmButton: false,
                });
                fetchUsers();
            })
            .catch((err) => {
                let errorMessage =
                    'An unknown error occurred. Please check the details and try again.';
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }

                MySwal.fire({
                    icon: 'error',
                    title: 'Creation Failed',
                    text: errorMessage,
                });
            });
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`btn btn-sm mx-1 ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i + 1}
                </button>
            );
        }
        return pages;
    };

    if (isLoading) return <p>Loading users...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Manage Users</h2>
                {user?.roles?.includes('ROLE_ADMIN') && (
                    <button className="btn btn-primary" onClick={openModal}>
                        + Create New User
                    </button>
                )}
            </div>

            <table className="app-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email || 'N/A'}</td>
                        <td>{user.role.replace('ROLE_', '')}</td>
                        <td>
                <span
                    style={{
                        fontWeight: 'bold',
                        color: user.enabled ? '#28a745' : '#dc3545',
                    }}
                >
                  {user.enabled ? 'Active' : 'Disabled'}
                </span>
                        </td>
                        <td>
                            <button
                                onClick={() => handleStatusToggle(user)}
                                className={`action-button ${user.enabled ? 'btn-disable' : 'btn-enable'}`}
                            >
                                {user.enabled ? 'Disable' : 'Enable'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center my-3 align-items-center flex-wrap">
                    <button
                        className="btn btn-outline-secondary mx-1"
                        onClick={() => setCurrentPage(0)}
                        disabled={currentPage === 0}
                    >
                        « First
                    </button>
                    <button
                        className="btn btn-outline-secondary mx-1"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0}
                    >
                        ‹ Prev
                    </button>
                    {renderPageNumbers()}
                    <button
                        className="btn btn-outline-secondary mx-1"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages - 1}
                    >
                        Next ›
                    </button>
                    <button
                        className="btn btn-outline-secondary mx-1"
                        onClick={() => setCurrentPage(totalPages - 1)}
                        disabled={currentPage === totalPages - 1}
                    >
                        Last »
                    </button>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>Create New User</h2>
                <button onClick={closeModal} className="modal-close-button">×</button>
                <form onSubmit={handleCreateUserSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={newUser.username}
                            onChange={handleNewUserChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={newUser.email}
                            onChange={handleNewUserChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Temporary Password</label>
                        <input
                            type="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleNewUserChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={newUser.role} onChange={handleNewUserChange}>
                            <option value="ROLE_HR">HR</option>
                            <option value="ROLE_MANAGER">Manager</option>
                        </select>
                    </div>
                    <button type="submit" className="btn">
                        Submit Creation
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ManageUsersPage;
