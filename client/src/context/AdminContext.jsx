import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin.service';
import { patientService } from '../services/patient.service';
import { appointmentService } from '../services/appointment.service';
import { invoiceService } from '../services/invoice.service';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    const fetchLogs = useCallback(async () => {
        try {
            const { logs: logData } = await adminService.getLogs({ limit: 100 });
            setLogs(logData);
        } catch (err) {
            console.error('Failed to fetch logs:', err.message);
        }
    }, []);

    const fetchInvoices = useCallback(async () => {
        try {
            const data = await adminService.getInvoices();
            setInvoices(data);
        } catch (err) {
            console.error('Failed to fetch invoices:', err.message);
        }
    }, []);

    const fetchPatients = useCallback(async () => {
        try {
            const data = await patientService.getAll();
            setPatients(data || []);
        } catch (err) {
            console.error('Failed to fetch patients:', err.message);
        }
    }, []);

    const fetchAppointments = useCallback(async () => {
        try {
            const data = await appointmentService.getAll();
            setAppointments(data || []);
        } catch (err) {
            console.error('Failed to fetch appointments:', err.message);
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchUsers(), fetchLogs(), fetchInvoices(), fetchPatients(), fetchAppointments()])
            .finally(() => setLoading(false));
    }, [fetchUsers, fetchLogs, fetchInvoices, fetchPatients, fetchAppointments]);

    // ─── User Management ──────────────────────────────────────────────────────
    const checkEmailUnique = (email, excludeId) => {
        return !users.some(u => u.email === email && u._id !== excludeId);
    };

    const addUser = async (userData) => {
        try {
            const newUser = await adminService.createUser(userData);
            setUsers(prev => [newUser, ...prev]);
            await fetchLogs(); // Refresh logs to show the new CREATE_USER entry
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updateUser = async (id, data) => {
        try {
            const updated = await adminService.updateUser(id, data);
            setUsers(prev => prev.map(u => u._id === id ? updated : u));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const deleteUser = async (id) => {
        try {
            await adminService.deleteUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            console.error('Failed to delete user:', err.message);
        }
    };

    const toggleUserStatus = async (id) => {
        try {
            const updated = await adminService.toggleStatus(id);
            setUsers(prev => prev.map(u => u._id === id ? updated : u));
            await fetchLogs();
        } catch (err) {
            console.error('Failed to toggle user status:', err.message);
        }
    };

    const resetPassword = async (id) => {
        // Password reset requires a dedicated endpoint — placeholder for now
        // A full implementation would send a reset email or set a temp password
        console.warn('resetPassword: not yet implemented on backend');
    };

    // ─── Finance ──────────────────────────────────────────────────────────────
    const markInvoicePaid = async (id) => {
        try {
            const updated = await invoiceService.markPaid(id);
            setInvoices(prev => prev.map(inv => (inv._id === id || inv.id === id) ? updated : inv));
            await fetchLogs();
        } catch (err) {
            console.error('Failed to mark invoice paid:', err.message);
        }
    };

    const refundInvoice = async (id) => {
        try {
            const updated = await adminService.refundInvoice(id);
            setInvoices(prev => prev.map(inv => (inv._id === id || inv.id === id) ? updated : inv));
            await fetchLogs();
        } catch (err) {
            console.error('Failed to refund invoice:', err.message);
        }
    };

    return (
        <AdminContext.Provider value={{
            users, logs, invoices, patients, appointments, loading, error,
            checkEmailUnique, addUser, updateUser, deleteUser,
            toggleUserStatus, resetPassword,
            markInvoicePaid, refundInvoice,
            refetchLogs: fetchLogs,
            refetchInvoices: fetchInvoices,
            refetchUsers: fetchUsers,
        }}>
            {children}
        </AdminContext.Provider>
    );
};
