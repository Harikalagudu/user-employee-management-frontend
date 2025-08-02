import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getPendingLeaveRequests, updateLeaveRequestStatus } from '../services/api'; // Now both are used
import '../components/Table.css';

// We use MySwal to get the Bootstrap styling
const MySwal = withReactContent(Swal);

const LeaveApprovalPage = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingRequests = () => {
        setIsLoading(true);
        setError(null);
        getPendingLeaveRequests()
            .then(res => {
                setPendingRequests(res.data);
            })
            .catch(err => {
                console.error("API Error:", err);
                let detailedError = "Could not load pending requests.";
                if (err.response) {
                    detailedError = `Error ${err.response.status}: ${err.response.data}`;
                }
                setError(detailedError);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => { fetchPendingRequests(); }, []);

    // --- THIS IS THE FULLY IMPLEMENTED FUNCTION ---
    const handleAction = (request, newStatus) => {
        const actionText = newStatus === 'APPROVED' ? 'Approve' : 'Deny';

        MySwal.fire({
            title: `Confirm Action`,
            html: `Are you sure you want to <strong>${actionText.toLowerCase()}</strong> the leave request for <strong>${request.employeeName}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionText}`,
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: `btn btn-${newStatus === 'APPROVED' ? 'success' : 'danger'}`,
                cancelButton: 'btn btn-secondary ms-3'
            },
            buttonsStyling: false
        }).then(result => {
            if (result.isConfirmed) {
                // If confirmed, call the API to update the status
                updateLeaveRequestStatus(request.id, newStatus)
                    .then(() => {
                        MySwal.fire(
                            `${actionText}d!`,
                            `The request has been ${newStatus.toLowerCase()}d.`,
                            'success'
                        );
                        // Refresh the list of pending requests to remove the one we just actioned
                        fetchPendingRequests();
                    })
                    .catch(err => {
                        MySwal.fire(
                            'Action Failed!',
                            err.response?.data || 'An unexpected error occurred.',
                            'error'
                        );
                    });
            }
        });
    };
    
    // --- RENDER LOGIC ---
    if (isLoading) {
        return <p>Loading pending requests...</p>;
    }

    if (error) {
        return (
            <div>
                <h2>Approve Leave Requests</h2>
                <div className="error-message">
                    <h4>Failed to Load Data</h4>
                    <pre>{error}</pre>
                    <button className="btn btn-primary btn-sm" onClick={fetchPendingRequests}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2>Approve Leave Requests</h2>
            <p>Review and act upon pending leave requests from all employees.</p>
            <table className="app-table">
                <thead><tr><th>Employee Name</th><th>Leave Type</th><th>Dates</th><th>Reason</th><th>Actions</th></tr></thead>
                <tbody>
                    {pendingRequests.length > 0 ? pendingRequests.map(req => (
                        <tr key={req.id}>
                            <td>{req.employeeName}</td>
                            <td>{req.leaveTypeName}</td>
                            <td>{`${new Date(req.startDate).toLocaleDateString()}  to  ${new Date(req.endDate).toLocaleDateString()}`}</td>
                            <td>{req.reason}</td>
                            <td>
                                {/* Buttons now correctly call the handleAction function */}
                                <button className="btn btn-success btn-sm" onClick={() => handleAction(req, 'APPROVED')}>Approve</button>
                                <button className="btn btn-danger btn-sm ms-3" onClick={() => handleAction(req, 'DENIED')}>Deny</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="5">There are no pending leave requests at this time.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveApprovalPage;