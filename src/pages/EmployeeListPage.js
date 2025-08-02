import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getEmployees, updateEmployee } from '../services/api'; // getEmployees is used here
import '../components/Table.css';
import '../components/Modal.css';

const MySwal = withReactContent(Swal);
Modal.setAppElement('#root');

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState([]); // setEmployees is used in fetchEmployees
    const [isLoading, setIsLoading] = useState(true); // setIsLoading is used in fetchEmployees
    const [error, setError] = useState(''); // setError is used in fetchEmployees

    // State for the Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // Initialize with a structured empty object to prevent "uncontrolled input" warnings
    const [selectedEmployee, setSelectedEmployee] = useState({
        id: null, name: '', email: '', department: '', status: '',
        dateJoined: '', dateOfBirth: '', age: '', totalExperience: ''
    });

    const fetchEmployees = () => {
        setIsLoading(true);
        getEmployees({ page: 0, size: 20 }) // Using getEmployees
            .then(response => {
                setEmployees(response.data.content); // Using setEmployees
            })
            .catch(err => {
                setError('Failed to load employees.'); // Using setError
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false); // Using setIsLoading
            });
    };

    useEffect(() => { fetchEmployees(); }, []);

    // --- Modal Handler Functions ---
    const openEditModal = (employee) => { // openEditModal is used in the Edit button's onClick
        const formattedEmployee = {
            ...employee,
            dateJoined: employee.dateJoined ? new Date(employee.dateJoined).toISOString().split('T')[0] : '',
            dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : ''
        };
        setSelectedEmployee(formattedEmployee);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setSelectedEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!selectedEmployee) return;

        const payload = {
            ...selectedEmployee,
            // Ensure these fields are in your Employee model if you include them
            // age: parseInt(selectedEmployee.age),
            // totalExperience: parseInt(selectedEmployee.totalExperience)
        };

        updateEmployee(selectedEmployee.id, payload)
            .then(() => {
                closeEditModal();
                MySwal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Employee details have been saved successfully.',
                    customClass: { confirmButton: 'btn btn-success' },
                    buttonsStyling: false
                });
                fetchEmployees(); // Refresh the table
            })
            .catch(err => {
                MySwal.fire({
                    icon: 'error',
                    title: 'Update Failed!',
                    text: err.response?.data || 'Could not update employee details.',
                    customClass: { confirmButton: 'btn btn-danger' },
                    buttonsStyling: false
                });
            });
    };

    if (isLoading) return <p>Loading employees...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h2>Employee Management</h2>
            {/* The table that uses the 'employees' state variable */}
            <table className="app-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.department || 'N/A'}</td>
                            <td>{emp.status || 'N/A'}</td>
                            <td>
                                <button
                                    onClick={() => openEditModal(emp)} // Using openEditModal
                                    className="action-button"
                                    style={{ backgroundColor: '#ffc107', color: 'black' }}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- Edit Employee Modal --- */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal} className="modal-content" overlayClassName="modal-overlay">
                <h2>Edit Employee: {selectedEmployee.name}</h2>
                <button onClick={closeEditModal} className="modal-close-button">×</button>
                <form onSubmit={handleEditSubmit}>
                    <div className="form-group"><label>Name</label><input type="text" className="form-control" name="name" value={selectedEmployee.name} onChange={handleEditChange} required /></div>
                    <div className="form-group"><label>Email</label><input type="email" className="form-control" name="email" value={selectedEmployee.email} onChange={handleEditChange} required /></div>
                    <div className="form-group"><label>Department</label><select className="form-control" name="department" value={selectedEmployee.department} onChange={handleEditChange}><option value="Engineering">Engineering</option><option value="HR">HR</option><option value="Marketing">Marketing</option><option value="Sales">Sales</option></select></div>
                    <div className="form-group"><label>Status</label><select className="form-control" name="status" value={selectedEmployee.status} onChange={handleEditChange}><option value="ON_PROBATION">On Probation</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div>
                    <div className="form-group"><label>Date Joined</label><input type="date" className="form-control" name="dateJoined" value={selectedEmployee.dateJoined} onChange={handleEditChange} /></div>
                    <div className="form-group"><label>Date of Birth</label><input type="date" className="form-control" name="dateOfBirth" value={selectedEmployee.dateOfBirth} onChange={handleEditChange} /></div>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
            </Modal>
        </div>
    );
};

export default EmployeeListPage;