import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getMyLeaveBalances, getMyLeaveRequests, submitLeaveRequest } from '../services/api';
import Card from '../components/Card';
import ClockWidget from '../components/ClockWidget';
import '../components/Table.css';
import '../components/Modal.css';

const MySwal = withReactContent(Swal);
Modal.setAppElement('#root');

const LeaveManagementPage = () => {
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        leaveTypeId: '', startDate: '', endDate: '', reason: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const username = user?.username || 'Employee';

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [balancesRes, requestsRes] = await Promise.all([getMyLeaveBalances(), getMyLeaveRequests()]);
            setBalances(balancesRes.data);
            setRequests(requestsRes.data);
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load your leave data. Please try logging in again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewRequest({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
    };

    const handleRequestChange = (e) => {
        const { name, value } = e.target;
        setNewRequest(prev => ({ ...prev, [name]: value }));
    };

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        if (!newRequest.leaveTypeId || !newRequest.startDate || !newRequest.endDate) {
            MySwal.fire('Error', 'Please fill all required fields.', 'error');
            return;
        }
        submitLeaveRequest(newRequest)
            .then(() => {
                closeModal();
                MySwal.fire('Success!', 'Your leave request has been submitted.', 'success');
                fetchData();
            })
            .catch(err => MySwal.fire('Submission Failed', err.response?.data || 'An error occurred.', 'error'));
    };

    if (isLoading) return <p>Loading leave data...</p>;

    return (
        <div>
            {/* --- Welcome Header --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0 }}>PayFlow Employee Dashboard</h1>
                    <p style={{ margin: 0, color: '#6c757d', fontSize: '1.1rem' }}>
                        Welcome, {username}! Manage your leave here.
                    </p>
                </div>
                <ClockWidget />
            </div>

            {/* --- LEAVE BALANCES SECTION --- */}
            <div className="form-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>My Leave Balances</h2>
                    <button className="btn btn-primary btn-header" onClick={openModal}>+ Apply for Leave</button>
                </div>
                <hr />
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                    {balances.length > 0 ? balances.map(b => (
                        <Card key={b.id} title={b.leaveTypeName} value={`${b.remainingDays} Days`} />
                    )) : <p>No leave balances found. Please contact your manager.</p>}
                </div>
            </div>
            
            {/* --- LEAVE HISTORY SECTION --- */}
            <div className="form-container" style={{marginTop: '2rem'}}>
                <h2 style={{marginTop: 0}}>My Leave History</h2>
                <table className="app-table">
                    <thead><tr><th>Leave Type</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Reason</th></tr></thead>
                    <tbody>
                        {requests.length > 0 ? requests.map(r => (
                            <tr key={r.id}>
                                <td>{r.leaveTypeName}</td>
                                <td>{new Date(r.startDate).toLocaleDateString()}</td>
                                <td>{new Date(r.endDate).toLocaleDateString()}</td>
                                <td><span style={{fontWeight: 'bold', color: r.status === 'APPROVED' ? 'green' : (r.status === 'DENIED' ? 'red' : 'orange')}}>{r.status}</span></td>
                                <td>{r.reason}</td>
                            </tr>
                        )) : <tr><td colSpan="5">You have not submitted any leave requests.</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* --- APPLY FOR LEAVE MODAL --- */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
                <h2>Apply for Leave</h2>
                <button onClick={closeModal} className="modal-close-button">×</button>
                <form onSubmit={handleRequestSubmit}>
                    <div className="form-group">
                        <label>Leave Type</label>
                        <select name="leaveTypeId" className="form-control" onChange={handleRequestChange} required>
                            <option value="">-- Select Leave Type --</option>
                            {balances.map(b => <option key={b.id} value={b.leaveTypeId}>{b.leaveTypeName}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label>Start Date</label><input type="date" className="form-control" name="startDate" onChange={handleRequestChange} required /></div>
                    <div className="form-group"><label>End Date</label><input type="date" className="form-control" name="endDate" onChange={handleRequestChange} required /></div>
                    <div className="form-group"><label>Reason (Optional)</label><textarea className="form-control" name="reason" onChange={handleRequestChange}></textarea></div>
                    <button type="submit" className="btn btn-primary">Submit Request</button>
                </form>
            </Modal>
        </div>
    );
};

export default LeaveManagementPage;
