import React, { useState, useEffect } from 'react';
import { Calendar, UserCheck, Users, Activity, CheckCircle, AlertTriangle, X, FileText, Bell, ChevronRight, User } from 'lucide-react';
import { useReception } from '../../../context/ReceptionContext';
import { useAuth } from '../../../hooks/useAuth';
import { publicService } from '../../../services/public.service';

const ReceptionDashboard = ({ setActiveTab }) => {
    const { appointments = [], invoices = [] } = useReception();
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [dismissedItems, setDismissedItems] = useState([]);
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [notificationSuccess, setNotificationSuccess] = useState(false);

    useEffect(() => {
        publicService.getDoctors()
            .then(d => {
                if (Array.isArray(d)) setDoctors(d);
            })
            .catch(err => console.error('Failed to load public doctors:', err));
    }, []);

    // Compute live metrics
    const scheduledAppointments = appointments.length;
    const checkedInCount = appointments.filter(a => a.status === 'checked-in').length;
    const inQueueCount = appointments.filter(a => a.status === 'checked-in' || a.status === 'in-consultation').length;
    const availableDoctorsCount = doctors.length || 2;

    // Generate real urgent items
    const urgentQueueItems = appointments
        .filter(a => a.status === 'checked-in')
        .map(a => ({
            id: `queue-${a._id || a.id}`,
            type: 'checkin',
            title: `${a.patientName} waiting for ${a.doctorName}`,
            details: `Scheduled for ${a.time} • ${a.type || 'Consultation'}`,
            actionLabel: 'View in Queue',
            action: () => setActiveTab('queue')
        }));

    const urgentBillingItems = invoices
        .filter(inv => ['Pending', 'Unpaid'].includes(inv.status))
        .map(inv => ({
            id: `inv-${inv._id || inv.id}`,
            type: 'billing',
            title: `Unpaid Invoice: ${inv.patientName || (typeof inv.patient === 'string' ? inv.patient : inv.patient?.name) || 'Patient'}`,
            details: `Amount: $${(inv.total || inv.items?.reduce((s, it) => s + (it.amount || 0), 0) || 0).toFixed(2)} • Due for collection`,
            actionLabel: 'Go to Billing',
            action: () => setActiveTab('billing')
        }));

    const allUrgentItems = [...urgentQueueItems, ...urgentBillingItems].filter(
        item => !dismissedItems.includes(item.id)
    );

    // Dynamic queue summary by department
    const departments = ['Cardiology', 'General Practice', 'Pediatrics', 'Orthopedics'];
    const departmentCounts = departments.map(dept => {
        const count = appointments.filter(a =>
            (a.department || 'General Practice') === dept &&
            (a.status === 'checked-in' || a.status === 'in-consultation')
        ).length;
        return { dept, count };
    });

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', position: 'relative' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--reception-text-main)', marginBottom: '0.5rem' }}>Front Desk Overview</h1>
                <p className="text-label" style={{ fontSize: '1.1rem' }}>Welcome back, {user?.name || 'Receptionist'}. Here represents current clinic status.</p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Today's Appointments</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--reception-secondary)', color: 'var(--reception-primary)' }}>
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>{scheduledAppointments}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Total in DB</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Patients Checked In</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f0fdf4', color: 'var(--reception-success)' }}>
                            <UserCheck size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>{checkedInCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Arrived</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Patients Waiting</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#fff7ed', color: 'var(--reception-warning)' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>{inQueueCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>In Queue</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Available Doctors</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f8fafc', color: 'var(--reception-text-muted)' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--reception-text-main)' }}>{availableDoctorsCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Active Physicians</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Immediate Actions */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Urgent Actions</h3>
                        {notificationSuccess && (
                            <span style={{ color: 'var(--reception-success)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                                <CheckCircle size={14} /> Action handled successfully
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {allUrgentItems.length > 0 ? allUrgentItems.map(item => (
                            <div
                                key={item.id}
                                className="reception-card"
                                style={{
                                    margin: 0,
                                    borderLeft: `4px solid ${item.type === 'checkin' ? 'var(--reception-warning)' : '#3b82f6'}`,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: item.type === 'checkin' ? '#fffbeb' : 'white'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: item.type === 'checkin' ? '#fef3c7' : '#dbeafe',
                                        color: item.type === 'checkin' ? '#d97706' : '#2563eb',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {item.type === 'checkin' ? <Bell size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="text-lg" style={{ fontSize: '1rem' }}>{item.title}</h4>
                                        <p className="text-label">{item.details}</p>
                                    </div>
                                </div>
                                <button
                                    className={`action-btn ${item.type === 'checkin' ? 'btn-outline' : 'btn-primary'}`}
                                    style={{ fontSize: '0.875rem' }}
                                    onClick={item.action}
                                >
                                    {item.actionLabel}
                                </button>
                            </div>
                        )) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--reception-text-muted)', border: '1px dashed var(--reception-border)', borderRadius: '8px' }}>
                                <CheckCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                <p>All urgent matters resolved. Great job!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Queue Summary */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Queue Status</h3>
                        <button className="action-btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }} onClick={() => setActiveTab('queue')}>View All</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {departmentCounts.map(d => (
                            <div key={d.dept} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--reception-border)' }}>
                                <span className="text-value">{d.dept}</span>
                                <span className={`text-value ${d.count > 0 ? 'text-orange' : ''}`} style={{ color: d.count > 0 ? 'var(--reception-warning)' : 'var(--reception-text-muted)' }}>
                                    {d.count > 0 ? `${d.count} Waiting` : 'Empty'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionDashboard;
