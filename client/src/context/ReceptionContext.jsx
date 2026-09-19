import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointment.service';
import { invoiceService } from '../services/invoice.service';

const ReceptionContext = createContext();

export const useReception = () => useContext(ReceptionContext);

export const ReceptionProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Queue is still managed client-side (visual only, no dedicated queue model)
    const [queue, setQueue] = useState({ doctors: {} });

    const showNotification = (message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
    };

    // ─── Data Fetching ────────────────────────────────────────────────────────
    const fetchAppointments = useCallback(async () => {
        try {
            const data = await appointmentService.getAll();
            setAppointments(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    const fetchInvoices = useCallback(async () => {
        try {
            const data = await invoiceService.getAll();
            setInvoices(data);
        } catch (err) {
            console.error('Failed to fetch invoices:', err.message);
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchAppointments(), fetchInvoices()])
            .finally(() => setLoading(false));
    }, [fetchAppointments, fetchInvoices]);

    // Populate queue from live appointments
    useEffect(() => {
        if (appointments.length > 0) {
            setQueue(prev => {
                const nextDoctors = { ...prev.doctors };
                appointments.forEach(app => {
                    const docName = app.doctorName || 'Doctor';
                    if (!nextDoctors[docName]) {
                        nextDoctors[docName] = {
                            status: app.status === 'in-consultation' ? 'BUSY' : 'AVAILABLE',
                            department: app.department || 'General Practice',
                            current: app.status === 'in-consultation' ? { token: `D-${Math.floor(Math.random()*899+100)}`, name: app.patientName, time: app.time } : null,
                            waiting: []
                        };
                    }
                    if (app.status === 'checked-in' && !nextDoctors[docName].waiting.some(w => w.name === app.patientName)) {
                        nextDoctors[docName].waiting.push({
                            token: `T-${Math.floor(Math.random()*899+100)}`,
                            name: app.patientName,
                            time: app.time
                        });
                    }
                });
                return { doctors: nextDoctors };
            });
        }
    }, [appointments]);

    // ─── Appointment Actions ──────────────────────────────────────────────────
    const checkInPatient = async (appointmentId) => {
        try {
            const updated = await appointmentService.updateStatus(appointmentId, 'checked-in');
            setAppointments(prev => prev.map(a => a._id === appointmentId ? updated : a));

            // Update in-memory queue for display
            setQueue(prev => {
                const appointment = appointments.find(a => a._id === appointmentId);
                if (!appointment) return prev;
                const docName = appointment.doctorName;
                const docState = prev.doctors[docName] || { status: 'AVAILABLE', current: null, waiting: [] };
                const newToken = `${docName.charAt(4)}-${100 + Math.floor(Math.random() * 900)}`;
                return {
                    ...prev,
                    doctors: {
                        ...prev.doctors,
                        [docName]: {
                            ...docState,
                            waiting: [...docState.waiting, {
                                token: newToken,
                                name: appointment.patientName,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }]
                        }
                    }
                };
            });

            showNotification(`Checked in patient`);
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    const rescheduleAppointment = async (appointmentId, newTime) => {
        // For rescheduling, update status back to scheduled and set new time
        // Full reschedule requires a PATCH to the appointment — use updateStatus as base
        try {
            const updated = await appointmentService.updateStatus(appointmentId, 'scheduled');
            setAppointments(prev => prev.map(a =>
                a._id === appointmentId ? { ...updated, time: newTime } : a
            ));
            showNotification('Appointment rescheduled');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const updated = await appointmentService.updateStatus(appointmentId, 'cancelled');
            setAppointments(prev => prev.map(a => a._id === appointmentId ? updated : a));
            showNotification('Appointment cancelled');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    // ─── Invoice Actions ──────────────────────────────────────────────────────
    const markInvoiceAsPaid = async (invoiceId) => {
        try {
            const updated = await invoiceService.markPaid(invoiceId);
            setInvoices(prev => prev.map(inv => inv._id === invoiceId ? updated : inv));
            showNotification(`Invoice marked as PAID`);
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    const updateInvoiceItem = (invoiceId, itemIndex, field, value) => {
        // Local-only update for editing line items before save
        setInvoices(prev => prev.map(inv => {
            if (inv._id === invoiceId || inv.id === invoiceId) {
                const newItems = [...inv.items];
                newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
                return { ...inv, items: newItems };
            }
            return inv;
        }));
    };

    // ─── Queue Logic (client-side display only) ───────────────────────────────
    const callNext = (doctorName) => {
        setQueue(prev => {
            const docState = prev.doctors[doctorName];
            if (!docState || docState.waiting.length === 0) return prev;
            const nextPatient = docState.waiting[0];
            return {
                ...prev,
                doctors: {
                    ...prev.doctors,
                    [doctorName]: {
                        ...docState,
                        status: 'BUSY',
                        current: nextPatient,
                        waiting: docState.waiting.slice(1)
                    }
                }
            };
        });
        showNotification(`Called next patient for ${doctorName}`);
    };

    const markCompleted = (doctorName) => {
        setQueue(prev => {
            const docState = prev.doctors[doctorName];
            if (!docState || !docState.current) return prev;
            return {
                ...prev,
                doctors: {
                    ...prev.doctors,
                    [doctorName]: { ...docState, status: 'AVAILABLE', current: null }
                }
            };
        });
        showNotification(`Consultation completed for ${doctorName}`);
    };

    return (
        <ReceptionContext.Provider value={{
            appointments, queue, invoices, notifications, loading, error,
            checkInPatient, rescheduleAppointment, cancelAppointment,
            updateInvoiceItem, markInvoiceAsPaid, callNext, markCompleted,
            refetchAppointments: fetchAppointments,
        }}>
            {children}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', animation: 'slideIn 0.3s ease'
                    }}>
                        {n.message}
                    </div>
                ))}
            </div>
        </ReceptionContext.Provider>
    );
};
