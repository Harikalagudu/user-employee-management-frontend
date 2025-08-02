import React from 'react';
import './Card.css';

const Card = ({ title, value, activeCount, inactiveCount, subtext, isSpecial, color }) => {
    return (
        <div className={`custom-card ${color}`}>
            <h3 className="card-title">{title}</h3>
            <p className="card-value">{value}</p>
            {activeCount !== undefined && inactiveCount !== undefined ? (
                <p className="card-status">
                    <span className="active-count">Active: {activeCount}</span>
                    <span className="inactive-count">Inactive: {inactiveCount}</span>
                </p>
            ) : (
                <p className="card-subtext">{subtext}</p>
            )}
        </div>
    );
};

export default Card;
