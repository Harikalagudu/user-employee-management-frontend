import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { onboardEmployee } from '../services/api';

const MySwal = withReactContent(Swal);

const OnboardingPage = () => {
    // Defines the complete initial state for the form.
    const getInitialState = () => ({
        name: '',
        email: '',
        department: 'Engineering',
        totalExperience: '',
        pastExperience: '',
        dateJoined: new Date().toISOString().split('T')[0], // Defaults to today's date
        dateOfBirth: '',
        status: 'ON_PROBATION',
        temporaryPassword: '' 
    });

    const [formData, setFormData] = useState(getInitialState());

    // A single handler to update the state for any form field change.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handles the form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Converts age and experience to integers before sending.
            const payload = { ...formData, age: parseInt(formData.age), totalExperience: parseInt(formData.totalExperience) };
            
            // The payload sent here now contains all fields, including the critical 'dateJoined'.
            await onboardEmployee(payload);
            
            MySwal.fire({
                icon: 'success',
                title: 'Onboarding Complete!',
                text: `Employee '${formData.name}' has been successfully onboarded.`,
                customClass: { confirmButton: 'btn btn-success' },
                buttonsStyling: false
            });

            // Reset the form to its initial state for the next entry.
            setFormData(getInitialState());

        } catch (err) {
            MySwal.fire({
                icon: 'error',
                title: 'Onboarding Failed',
                text: err.response?.data || 'Please check all fields and try again.',
                customClass: { confirmButton: 'btn btn-danger' },
                buttonsStyling: false
            });
        }
    };

    return (
        <div>
            <h2>Onboard New Employee</h2>
            <div className="form-container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
                <form onSubmit={handleSubmit}>
                    {/* --- THIS IS THE COMPLETE FORM LAYOUT --- */}
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-md-6">
                            <div className="form-group"><label>Employee Name</label><input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Email</label><input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Department</label><select className="form-control" name="department" value={formData.department} onChange={handleChange}><option value="Engineering">Engineering</option><option value="HR">HR</option><option value="Marketing">Marketing</option><option value="Sales">Sales</option></select></div>
                            <div className="form-group"><label>Status</label><select className="form-control" name="status" value={formData.status} onChange={handleChange}><option value="ON_PROBATION">On Probation</option><option value="ACTIVE">Active</option></select></div>
                        </div>
                        {/* Right Column */}
                        <div className="col-md-6">
                            <div className="form-group"><label>Age</label><input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Total Experience (years)</label><input type="number" className="form-control" name="totalExperience" value={formData.totalExperience} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Date Joined</label><input type="date" className="form-control" name="dateJoined" value={formData.dateJoined} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Date of Birth</label><input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required /></div>
                        </div>
                    </div>
                        <div className="form-group">
                        <label>Temporary Password for Employee Login</label>
                        <input
                            type="password"
                            className="form-control"
                            name="temporaryPassword"
                            value={formData.temporaryPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        <small className="form-text text-muted">
                            The employee will use this password and their email as username to log in for the first time.
                        </small>
                    </div>

                    <div className="form-group"><label>Past Experience (Companies, Roles)</label><textarea className="form-control" name="pastExperience" value={formData.pastExperience} onChange={handleChange} /></div>
                    <button type="submit" className="btn btn-primary btn-block">Complete Onboarding</button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingPage;

