import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Create a SweetAlert2 instance that is aware of React components
const MySwal = withReactContent(Swal);

/**
 * The top navigation bar component.
 * It displays a welcome message and a logout button.
 * @param {object} props
 * @param {object} props.user - The currently logged-in user object.
 * @param {function} props.onLogout - The logout function passed down from App.js.
 */
const TopNavBar = ({ user, onLogout }) => {

    /**
     * Shows a confirmation pop-up before logging the user out.
     * If the user confirms, it calls the onLogout function.
     */
    const confirmLogout = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your PayFlow session.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'No, stay logged in',
            // Using Bootstrap's color variables for consistency
            confirmButtonColor: '#007bff', // Primary blue
            cancelButtonColor: '#6c757d',  // Secondary gray
            // Apply Bootstrap classes directly to the buttons inside the alert
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary ms-2' // ml-2 adds margin-left
            },
            buttonsStyling: false // Crucial: tells SweetAlert2 to use our classes, not its own
        }).then((result) => {
            // This code runs after the user clicks a button
            if (result.isConfirmed) {
                // If the user clicked "Yes, log out!", call the actual logout function
                onLogout();
            }
        });
    };

    return (
        <div className="d-flex justify-content-end align-items-center px-4 py-2 bg-light">
            {/* Common: show username for all users */}
            <span className="me-3 fw-semibold">{user?.username || 'User'}</span>

            {/* Only show profile picture if admin */}
            {user?.username === 'admin' && (
                <img
                    src="/admin-profile.jpg"
                    alt="Admin"
                    className="me-3"
                    style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #dc3545',
                    }}
                />
            )}

            {/* Logout button shown for all users */}
            <button onClick={confirmLogout} className="btn btn-danger btn-sm">
                Logout
            </button>
        </div>
    );

};

export default TopNavBar;