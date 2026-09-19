import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { medicineService } from '../services/medicine.service';
import { prescriptionService } from '../services/prescription.service';
import { useAuth } from '../hooks/useAuth';

const PharmacyContext = createContext();

export const usePharmacy = () => useContext(PharmacyContext);

export const PharmacyProvider = ({ children }) => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [recentDispenses, setRecentDispenses] = useState([]);
    const [orders, setOrders] = useState([]); // Orders remain client-side (no orders model on server)
    const [pharmacistProfile, setPharmacistProfile] = useState({
        name: user?.name || 'Pharmacist',
        id: user?.employeeId || 'PHA',
        email: user?.email || '',
        phone: '+1 (555) 000-8888',
        shift: 'Morning (8AM - 4PM)'
    });

    useEffect(() => {
        if (user) {
            setPharmacistProfile(prev => ({
                ...prev,
                name: user.name || prev.name,
                id: user.employeeId || prev.id,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    const stats = {
        pendingCount: prescriptions.filter(p => p.status === 'pending').length,
        lowStockCount: inventory.filter(i => i.stock <= i.reorderLevel).length,
        totalCount: inventory.length,
    };
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const showNotification = (msg) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, msg }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
    };

    const fetchInventory = useCallback(async () => {
        try {
            const data = await medicineService.getAll();
            setInventory(data);
        } catch (err) {
            console.error('Failed to fetch medicines:', err.message);
        }
    }, []);

    const fetchPrescriptions = useCallback(async () => {
        try {
            const data = await prescriptionService.getAll();
            setPrescriptions(data);
        } catch (err) {
            console.error('Failed to fetch prescriptions:', err.message);
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchInventory(), fetchPrescriptions()])
            .finally(() => setLoading(false));
    }, [fetchInventory, fetchPrescriptions]);

    // ─── Inventory Actions ────────────────────────────────────────────────────
    const addMedicine = async (medicine) => {
        try {
            const newMed = await medicineService.create(medicine);
            setInventory(prev => [...prev, newMed]);
            showNotification('New medicine added to inventory.');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    const updateInventoryItem = async (id, updates) => {
        try {
            const updated = await medicineService.update(id, updates);
            setInventory(prev => prev.map(item => item._id === id ? updated : item));
            showNotification('Inventory updated successfully.');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    const removeMedicine = async (id) => {
        try {
            await medicineService.remove(id);
            setInventory(prev => prev.filter(item => item._id !== id));
            showNotification('Medicine removed from inventory.');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    // ─── Prescription Actions ─────────────────────────────────────────────────
    const dispensePrescription = async (prescriptionId) => {
        try {
            const dispensed = await prescriptionService.dispense(prescriptionId);
            setPrescriptions(prev => prev.map(p => p._id === prescriptionId ? dispensed : p));
            // Refresh inventory since server decremented stock
            await fetchInventory();
            setRecentDispenses(prev => [
                {
                    id: Date.now(),
                    medicine: dispensed.items.map(i => i.medicineName).join(', '),
                    patient: dispensed.patientName,
                    qty: dispensed.items.reduce((s, i) => s + i.qty, 0),
                    date: new Date().toLocaleString(),
                    status: 'Completed'
                },
                ...prev
            ]);
            showNotification('Prescription dispensed successfully.');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    const rejectPrescription = async (id, reason) => {
        try {
            const rejected = await prescriptionService.reject(id, reason);
            setPrescriptions(prev => prev.map(p => p._id === id ? rejected : p));
            showNotification(`Prescription rejected.`);
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };

    // ─── Orders (local simulation — no orders API yet) ────────────────────────
    const createOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...orderData
        };
        setOrders(prev => [newOrder, ...prev]);
        showNotification('Purchase order created.');
    };

    const receiveOrder = async (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        // Update stock in DB for each item
        for (const orderItem of order.items) {
            const med = inventory.find(i => i._id === orderItem.medicineId || i.name === orderItem.name);
            if (med) {
                await updateInventoryItem(med._id, { stock: med.stock + parseInt(orderItem.qty) });
            }
        }
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Received' } : o));
        showNotification(`Order ${orderId} received. Inventory updated.`);
    };

    const updateProfile = (data) => {
        setPharmacistProfile(prev => ({ ...prev, ...data }));
        showNotification('Profile updated successfully.');
    };

    return (
        <PharmacyContext.Provider value={{
            inventory, prescriptions, recentDispenses, orders, pharmacistProfile,
            notifications, loading, stats,
            addMedicine, updateInventoryItem, removeMedicine,
            dispensePrescription, rejectPrescription,
            createOrder, receiveOrder, updateProfile,
        }}>
            {children}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                    <div key={n.id} style={{
                        background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        {n.msg}
                    </div>
                ))}
            </div>
        </PharmacyContext.Provider>
    );
};
