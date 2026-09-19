import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/doctor-portal.css';
import DoctorBg from '../../assets/Doctor.jpg';
import DoctorSidebar from '../../components/doctor/layout/DoctorSidebar';
import DoctorDashboard from '../../components/doctor/pages/DoctorDashboard';
import DoctorAppointments from '../../components/doctor/pages/DoctorAppointments';
import DoctorPatients from '../../components/doctor/pages/DoctorPatients';
import DoctorMedicalRecords from '../../components/doctor/pages/DoctorMedicalRecords';
import DoctorProfile from '../../components/doctor/pages/DoctorProfile';
import { appointmentService } from '../../services/appointment.service';

const DoctorPortal = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        try {
            const data = await appointmentService.getAll();
            // Normalize _id to id for component compatibility
            setAppointments((data || []).map(a => ({
                ...a,
                id: a._id || a.id,
                reason: a.details || a.reason || 'Medical Consultation',
                history: a.notes || 'Routine examination',
                vitals: a.vitals || 'BP: 120/80',
                pastVisits: a.pastVisits || [],
            })));
        } catch (err) {
            console.error('Failed to fetch doctor appointments:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DoctorDashboard setActiveTab={setActiveTab} appointments={appointments} loading={loading} />;
            case 'appointments':
                return <DoctorAppointments appointments={appointments} setAppointments={setAppointments} refetchAppointments={fetchAppointments} />;
            case 'patients':
                return <DoctorPatients appointments={appointments} />;
            case 'records':
                return <DoctorMedicalRecords appointments={appointments} />;
            case 'profile':
                return <DoctorProfile />;
            default:
                return <DoctorDashboard setActiveTab={setActiveTab} appointments={appointments} loading={loading} />;
        }
    };

    return (
        <div className="doctor-portal-container" style={{
            backgroundImage: `url(${DoctorBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <DoctorSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />
            <main className="doctor-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default DoctorPortal;
