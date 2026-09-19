import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/task.service';
import { useAuth } from '../hooks/useAuth';

const StaffContext = createContext();

export const useStaff = () => useContext(StaffContext);

// Schedule remains client-side — no schedule model on backend yet
const INITIAL_SCHEDULE = [
    { id: 1, date: new Date().toISOString().split('T')[0], shift: 'Morning', start: '8:00 AM', end: '2:00 PM', status: 'Confirmed', available: true },
    { id: 2, date: new Date(Date.now() + 86400000).toISOString().split('T')[0], shift: 'Morning', start: '8:00 AM', end: '2:00 PM', status: 'Confirmed', available: true },
    { id: 3, date: new Date(Date.now() + 172800000).toISOString().split('T')[0], shift: 'Night', start: '10:00 PM', end: '6:00 AM', status: 'Confirmed', available: true },
];

export const StaffProvider = ({ children }) => {
    const { user } = useAuth();
    const [staffData, setStaffData] = useState({
        id: user?.employeeId || 'STF001',
        name: user?.name || 'Staff Member',
        role: 'Nurse / Staff',
        email: user?.email || '',
        phone: '+1 (555) 123-9999',
        department: user?.department || 'General Ward',
        shift: {
            status: 'ON',
            startTime: Date.now() - 3600000,
            endTime: Date.now() + 14400000
        }
    });

    useEffect(() => {
        if (user) {
            setStaffData(prev => ({
                ...prev,
                id: user.employeeId || prev.id,
                name: user.name || prev.name,
                email: user.email || prev.email,
                department: user.department || prev.department,
            }));
        }
    }, [user]);

    const [tasks, setTasks] = useState([]);
    const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Combined staff object for consumers
    const staff = { ...staffData, tasks, schedule };

    const showNotification = (message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
    };

    const fetchTasks = useCallback(async () => {
        try {
            const data = await taskService.getMine();
            // Normalize MongoDB _id to id for UI compatibility
            setTasks(data.map(t => ({ ...t, id: t._id })));
        } catch (err) {
            console.error('Failed to fetch tasks:', err.message);
        }
    }, []);

    useEffect(() => {
        fetchTasks().finally(() => setLoading(false));
    }, [fetchTasks]);

    // Auto-off shift logic
    useEffect(() => {
        const checkShift = () => {
            if (staffData.shift.status === 'ON' && Date.now() >= staffData.shift.endTime) {
                setStaffData(prev => ({ ...prev, shift: { ...prev.shift, status: 'OFF' } }));
                setTasks(prev => prev.map(t => t.status === 'ACTIVE' ? { ...t, status: 'PAUSED' } : t));
                showNotification('Shift has ended. Active tasks paused.');
            }
        };
        const interval = setInterval(checkShift, 60000);
        return () => clearInterval(interval);
    }, [staffData.shift]);

    // ─── Task Actions ─────────────────────────────────────────────────────────
    const startTask = async (taskId) => {
        try {
            const updated = await taskService.updateStatus(taskId, 'ACTIVE');
            // Server auto-pauses other active tasks, so refetch
            await fetchTasks();
            showNotification('Task started. Other active tasks paused.');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    const pauseTask = async (taskId) => {
        try {
            await taskService.updateStatus(taskId, 'PAUSED');
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'PAUSED' } : t));
            showNotification('Task paused.');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    const completeTask = async (taskId) => {
        try {
            await taskService.updateStatus(taskId, 'COMPLETED');
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: 'COMPLETED' } : t));
            showNotification('Task completed successfully.');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    // ─── Schedule Actions (local until server schedule model is added) ─────────
    const requestSwap = (shiftId, reason) => {
        setSchedule(prev => prev.map(s =>
            s.id === shiftId ? { ...s, swapRequested: true, swapReason: reason } : s
        ));
        showNotification('Shift swap requested');
    };

    const toggleAvailability = (shiftId) => {
        setSchedule(prev => prev.map(s =>
            s.id === shiftId ? { ...s, available: !s.available } : s
        ));
        showNotification('Availability updated');
    };

    // ─── Profile Actions ──────────────────────────────────────────────────────
    const updateProfile = (data) => {
        setStaffData(prev => ({ ...prev, ...data }));
        showNotification('Profile updated successfully.');
    };

    const updateShiftStatus = (status) => {
        setStaffData(prev => ({
            ...prev,
            shift: {
                ...prev.shift,
                status,
                endTime: status === 'ON' ? Date.now() + 28800000 : prev.shift.endTime
            }
        }));
    };

    return (
        <StaffContext.Provider value={{
            staff, tasks, schedule, notifications, loading,
            startTask, pauseTask, completeTask,
            requestSwap, toggleAvailability,
            updateProfile, updateShiftStatus,
        }}>
            {children}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', borderLeft: '4px solid #1d4ed8',
                        fontSize: '0.9rem', fontWeight: 500
                    }}>
                        {n.message}
                    </div>
                ))}
            </div>
            <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
        </StaffContext.Provider>
    );
};
