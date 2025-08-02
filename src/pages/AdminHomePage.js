import React, { useState, useEffect } from 'react';
import { getAdminDashboardStats } from '../services/api';
import Card from '../components/Card';
import ClockWidget from '../components/ClockWidget';

const AdminHomePage = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    const adminUser = JSON.parse(localStorage.getItem('user'));
    const adminName = adminUser?.username || 'Admin';

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        getAdminDashboardStats()
            .then(response => {
                setStats(response.data);
            })
            .catch(err => {
                setError('Failed to load dashboard statistics.');
                console.error(err);
            });
    }, []);

    return (
        <div>
            {/* --- 1. Header Section --- */}
            {/* This part remains outside the main card for a clean header effect */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ margin: 0 }}>Welcome, {adminName}!</h1>
                    <p style={{ margin: 0, color: '#6c757d', fontSize: '1.1rem' }}>
                        Here is your system summary for today, {currentDate}.
                    </p>
                </div>
                <ClockWidget />
            </div>

            {/* --- 2. Main Content Section with Alignment --- */}
            {/* We will wrap the main content in a div with the 'form-container' class. */}
            {/* This is the key to fixing the alignment. */}
            <div className="form-container">
                <h2 style={{marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '1rem'}}>System Statistics</h2>

                {error && <p className="error-message">{error}</p>}
                {!stats && !error && <p>Loading statistics...</p>}

                {stats && (
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        flexWrap: 'wrap',
                        marginTop: '1.5rem'
                    }}>
                        <Card title="Total Active Users" value={stats.totalActiveUsers} />
                        <Card title="Total HRs" value={stats.totalHrs} />
                        <Card title="Total Managers" value={stats.totalManagers} />
                        <Card title="Disabled Users" value={stats.disabledUsers} />
                    </div>
                )}
            </div>
            
            {/* Optional Panels can be added here as more 'form-container' divs */}
            <div className="form-container" style={{marginTop: '2rem'}}>
                <h2 style={{marginTop: 0}}>Tips & Notes</h2>
                <p>From this dashboard, you can create and manage credentials for all HR and Manager users.</p>
                <p>Remember to use strong, temporary passwords when creating new users and advise them to reset their passwords upon first login.</p>
            </div>
        </div>
    );
};

export default AdminHomePage;