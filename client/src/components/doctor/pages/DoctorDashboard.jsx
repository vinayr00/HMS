import React from 'react';
import { Users, Calendar, FileText, Activity, Clock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const DoctorDashboard = ({ setActiveTab, appointments = [], loading = false }) => {
    const { user } = useAuth();
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today || !a.date);
    const waitingCount = appointments.filter(a => a.status === 'checked-in').length;
    const completedCount = appointments.filter(a => a.status === 'completed').length;
    const pendingCount = appointments.filter(a => a.status === 'scheduled' || a.status === 'checked-in').length;

    const upNext = appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled');

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header className="glass-header">
                <h1 style={{ fontSize: '2rem', color: 'var(--doctor-text-main)', marginBottom: '0.5rem' }}>
                    Good Morning, {user?.name || 'Doctor'}
                </h1>
                <p className="text-label" style={{ fontSize: '1.1rem', margin: 0 }}>
                    Here's what's happening in your clinic today. ({user?.department || 'Department'})
                </p>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Appointments</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--doctor-secondary)', color: 'var(--doctor-primary)' }}>
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>{todayAppointments.length}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Today</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Patients Waiting</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f0fdf4', color: 'var(--doctor-success)' }}>
                            <Users size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>{waitingCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Checked In</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Pending Consultations</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#fff7ed', color: 'var(--doctor-warning)' }}>
                            <FileText size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>{pendingCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>In Queue</span>
                    </div>
                </div>

                <div className="detail-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-label">Completed</span>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: '#f8fafc', color: 'var(--doctor-text-muted)' }}>
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--doctor-text-main)' }}>{completedCount}</span>
                        <span className="text-label" style={{ marginLeft: '0.5rem' }}>Done</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Next Up */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Up Next</h3>
                        <button className="action-btn btn-outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} onClick={() => setActiveTab('appointments')}>View Schedule</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {upNext.length > 0 ? (
                            upNext.slice(0, 3).map((app, idx) => (
                                <div key={app.id || idx} className="doctor-card" style={{ margin: 0, borderLeft: app.status === 'checked-in' ? '4px solid var(--doctor-success)' : '4px solid var(--doctor-primary)' }}>
                                    <div className="doctor-card-header">
                                        <span className="text-value" style={{ color: 'var(--doctor-primary)' }}>{app.time}</span>
                                        <span className={`status-badge ${app.status === 'checked-in' ? 'status-active' : 'status-pending'}`}>{app.status}</span>
                                    </div>
                                    <h4 className="text-lg">{app.patientName}</h4>
                                    <p className="text-label">{app.reason || app.details || 'General Consultation'}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--doctor-text-muted)', textAlign: 'center', padding: '1rem' }}>No pending appointments</p>
                        )}
                    </div>
                </div>

                {/* Notifications / Activity */}
                <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="section-title">Activity</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--doctor-success)', flexShrink: 0 }}>
                                <FileText size={16} />
                            </div>
                            <div>
                                <p className="text-value" style={{ fontSize: '0.9rem' }}>Lab Results Received</p>
                                <p className="text-label" style={{ fontSize: '0.8rem' }}>Patient #8821 • 10 mins ago</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--doctor-primary)', flexShrink: 0 }}>
                                <Activity size={16} />
                            </div>
                            <div>
                                <p className="text-value" style={{ fontSize: '0.9rem' }}>Emergency Admit</p>
                                <p className="text-label" style={{ fontSize: '0.8rem' }}>Trauma Center • 25 mins ago</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                                <AlertCircle size={16} />
                            </div>
                            <div>
                                <p className="text-value" style={{ fontSize: '0.9rem' }}>Critical Vitals Alert</p>
                                <p className="text-label" style={{ fontSize: '0.8rem' }}>ICU Bed 4 • 1h ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
