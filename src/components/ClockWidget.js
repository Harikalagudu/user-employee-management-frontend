import React, { useState, useEffect } from 'react';

const ClockWidget = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);

        // Cleanup the interval on component unmount
        return () => clearInterval(timerId);
    }, []);

    return <div className="clock-widget">{time.toLocaleTimeString()}</div>;
};

export default ClockWidget;