import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { resetPassword } from '../services/api';

const MySwal = withReactContent(Swal);

const ResetPasswordPage = ({ onPasswordResetSuccess }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // We no longer need the useState for error/success

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            MySwal.fire({ icon: 'error', title: 'Invalid Password', text: 'Password must be at least 6 characters long.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            MySwal.fire({ icon: 'error', title: 'Mismatch', text: 'Passwords do not match.' });
            return;
        }

        try {
            await resetPassword(newPassword);
            MySwal.fire({
                icon: 'success',
                title: 'Password Reset!',
                text: 'Your password has been changed successfully. You will now be logged out.',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                onPasswordResetSuccess();
            });
        } catch (err) {
            MySwal.fire({ icon: 'error', title: 'Error', text: 'Failed to reset password. Please try again.' });
        }
    };

    return (
        <div className="form-container">
            <h1>Reset Your Password</h1>
            <p>This is your first time logging in. You must reset your password to continue.</p>
            {/* No need for error/success message paragraphs here anymore */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        className="form-control" // Bootstrap class
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control" // Bootstrap class
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
               <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;