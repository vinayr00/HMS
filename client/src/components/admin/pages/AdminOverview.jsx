import React from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Users, UserPlus, Activity, Calendar, DollarSign, FileText, Server, AlertCircle } from 'lucide-react';

const KPICard = ({ label, value, subtext, icon: Icon, color, bg }) => (
    <div className="detail-card" style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.3s ease',
        cursor: 'default',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-label" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#000080' }}>{label}</span>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: bg, color: color }}>
                <Icon size={22} />
            </div>
        </div>
        <div>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#000080', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>{value}</span>
            {subtext && <span className="text-label" style={{ marginTop: '0.5rem', display: 'block', fontSize: '0.85rem', color: '#000080' }}>{subtext}</span>}
        </div>
    </div>
);

const AdminOverview = () => {
    const { users = [], patients = [], appointments = [], invoices = [] } = useAdmin();

    const totalUsers = users.length;
    const doctorCount = users.filter(u => (u.role || '').toUpperCase() === 'DOCTOR').length;
    const patientCount = patients.length;
    const staffCount = users.filter(u => ['STAFF', 'PHARMACY', 'RECEPTIONIST'].includes((u.role || '').toUpperCase())).length;
    const appointmentCount = appointments.length;

    const paidInvoices = invoices.filter(i => (i.status || '').toLowerCase() === 'paid');
    const totalRevenue = paidInvoices.reduce((sum, inv) => {
        const amt = inv.total || (inv.items?.reduce((s, it) => s + (it.amount || 0), 0)) || 0;
        return sum + amt;
    }, 0);

    const pendingInvoices = invoices.filter(i => {
        const st = (i.status || '').toLowerCase();
        return st === 'pending' || st === 'unpaid';
    });
    const pendingAmount = pendingInvoices.reduce((sum, inv) => {
        const amt = inv.total || (inv.items?.reduce((s, it) => s + (it.amount || 0), 0)) || 0;
        return sum + amt;
    }, 0);

    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#000080', marginBottom: '0.5rem' }}>System Dashboard</h1>
                <p className="text-label" style={{ fontSize: '1.1rem', color: '#000080' }}>Executive overview of live hospital operations.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                <KPICard
                    label="Total Users"
                    value={totalUsers}
                    icon={Users}
                    color="#2563eb"
                    bg="#eff6ff"
                    subtext="Registered system accounts"
                />
                <KPICard
                    label="Doctors"
                    value={doctorCount}
                    icon={UserPlus}
                    color="#0891b2"
                    bg="#ecfeff"
                    subtext="Active practitioners"
                />
                <KPICard
                    label="Patients"
                    value={patientCount}
                    icon={Users}
                    color="#059669"
                    bg="#ecfdf5"
                    subtext="Live patient records"
                />
                <KPICard
                    label="Active Staff"
                    value={staffCount}
                    icon={Activity}
                    color="#7c3aed"
                    bg="#f5f3ff"
                    subtext="Front desk, pharmacy & ward staff"
                />
                <KPICard
                    label="Appointments"
                    value={appointmentCount}
                    icon={Calendar}
                    color="#db2777"
                    bg="#fdf2f8"
                    subtext="Scheduled & in-progress"
                />
                <KPICard
                    label="Total Revenue"
                    value={`$${totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    color="#059669"
                    bg="#f0fdf4"
                    subtext={`${paidInvoices.length} paid invoices`}
                />
                <KPICard
                    label="Pending Invoices"
                    value={pendingInvoices.length}
                    icon={FileText}
                    color="#d97706"
                    bg="#fffbeb"
                    subtext={`$${pendingAmount.toFixed(2)} outstanding`}
                />
                <KPICard
                    label="Database Status"
                    value="Active"
                    icon={Server}
                    color="#2563eb"
                    bg="#eff6ff"
                    subtext="MongoDB Atlas Connected"
                />
            </div>
        </div>
    );
};

export default AdminOverview;
