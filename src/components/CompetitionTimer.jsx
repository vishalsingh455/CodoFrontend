import { useState, useEffect } from 'react';

const CompetitionTimer = ({ startTime, endTime, className = "" }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [status, setStatus] = useState('loading'); // loading, upcoming, running, ended

    useEffect(() => {
        // Validate inputs
        if (!startTime || !endTime) {
            setTimeLeft('INVALID');
            setStatus('ended');
            return;
        }

        const updateTimer = () => {
            try {
                const now = new Date().getTime();
                const start = new Date(startTime).getTime();
                const end = new Date(endTime).getTime();

                // Check if dates are valid
                if (isNaN(start) || isNaN(end)) {
                    console.error('Invalid date format:', { startTime, endTime });
                    setTimeLeft('INVALID');
                    setStatus('ended');
                    return;
                }

                // Debug logging (remove after fixing)
                console.log('Timer Debug:', {
                    now: new Date(now).toISOString(),
                    start: new Date(start).toISOString(),
                    end: new Date(end).toISOString(),
                    startTime,
                    endTime,
                    comparison: { nowVsStart: now >= start, nowVsEnd: now <= end }
                });

                if (now < start) {
                    // Competition hasn't started yet
                    const timeUntilStart = start - now;
                    const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000);

                    if (days > 0) {
                        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
                    } else if (hours > 0) {
                        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                    } else {
                        setTimeLeft(`${minutes}m ${seconds}s`);
                    }
                    setStatus('upcoming');
                } else if (now >= start && now <= end) {
                    // Competition is running
                    const timeRemaining = end - now;
                    if (timeRemaining <= 0) {
                        setTimeLeft('ENDED');
                        setStatus('ended');
                        return;
                    }

                    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                    setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                    setStatus('running');
                } else {
                    // Competition has ended
                    setTimeLeft('ENDED');
                    setStatus('ended');
                }
            } catch (error) {
                console.error('Timer error:', error);
                setTimeLeft('ERROR');
                setStatus('ended');
            }
        };

        // Update immediately
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startTime, endTime]);

    const getStatusConfig = () => {
        switch (status) {
            case 'upcoming':
                return {
                    bgColor: 'bg-blue-900/30',
                    borderColor: 'border-blue-700',
                    textColor: 'text-blue-400',
                    icon: '⏰'
                };
            case 'running':
                return {
                    bgColor: 'bg-green-900/30',
                    borderColor: 'border-green-700',
                    textColor: 'text-green-400',
                    icon: '⏱️'
                };
            case 'ended':
                return {
                    bgColor: 'bg-red-900/30',
                    borderColor: 'border-red-700',
                    textColor: 'text-red-400',
                    icon: '🏁'
                };
            default:
                return {
                    bgColor: 'bg-gray-900/30',
                    borderColor: 'border-gray-700',
                    textColor: 'text-gray-400',
                    icon: '⏳'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}>
            <span className="text-lg">{config.icon}</span>
            <div className="flex flex-col">
                <span className={`text-xs font-medium uppercase tracking-wide ${config.textColor}`}>
                    {status === 'upcoming' && 'Starts In'}
                    {status === 'running' && 'Time Left'}
                    {status === 'ended' && 'Competition'}
                </span>
                <span className={`text-sm font-mono font-bold ${config.textColor}`}>
                    {timeLeft}
                </span>
            </div>
        </div>
    );
};

export default CompetitionTimer;
