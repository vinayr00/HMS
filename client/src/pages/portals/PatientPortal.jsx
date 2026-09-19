import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Phone, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import HomeBg from '../../assets/Home.png';

const PatientPortal = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/v1/users/public/doctors')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setDoctors(data.data);
                }
            })
            .catch(err => console.error('Failed to fetch public doctors:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleConsult = (doctor) => {
        navigate('/patient/form', { state: { doctor } });
    };

    return (
        <div style={{
            paddingBottom: '4rem',
            backgroundImage: `url(${HomeBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            backgroundAttachment: 'fixed'
        }}>
            {/* Hospital Info Header */}
            <section style={{ backgroundColor: 'transparent', padding: '3rem 0' }}>
                <div className="container">
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.18)'
                    }}>
                        <h1 style={{ color: '#1e3a8a', marginBottom: '1.5rem', fontWeight: 800 }}>ProHealth Hospital Services</h1>
                        <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <Clock size={24} color="#2563eb" />
                                <div>
                                    <h3 style={{ color: '#1d4ed8', margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Working Hours</h3>
                                    <p style={{ color: '#1e40af', margin: 0, fontWeight: 500 }}>Open 24/7 for Emergency</p>
                                    <p style={{ color: '#1e40af', margin: 0, fontWeight: 500 }}>OPD: 8:00 AM - 8:00 PM</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <Phone size={24} color="#2563eb" />
                                <div>
                                    <h3 style={{ color: '#1d4ed8', margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Emergency Contact</h3>
                                    <p style={{ color: '#1e40af', margin: 0, fontWeight: 500 }}>+1 (800) 123-4567</p>
                                    <p style={{ color: '#1e40af', margin: 0, fontWeight: 500 }}>ambulance@prohealth.com</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <MapPin size={24} color="#2563eb" />
                                <div>
                                    <h3 style={{ color: '#1d4ed8', margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Location</h3>
                                    <p style={{ color: '#1e40af', margin: 0, fontWeight: 500 }}>123 Health Avenue,</p>
                                    <p style={{ color: '#1e40af', margin: 0, fontWeight: 500 }}>Medical District, NY</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doctor Cards */}
            <section className="container" style={{ marginTop: '3rem' }}>
                <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem', display: 'inline-block', color: '#38bdf8', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    Find a Specialist
                </h2>

                <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
                    {loading ? (
                        <div style={{ color: 'white', gridColumn: 'span 3', textAlign: 'center', padding: '2rem' }}>
                            Loading medical specialists...
                        </div>
                    ) : doctors.length > 0 ? (
                        doctors.map(doctor => (
                            <div key={doctor._id || doctor.id} style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                overflow: 'hidden',
                                transition: 'transform 0.2s',
                                cursor: 'default'
                            }}>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <span style={{
                                            backgroundColor: '#eff6ff',
                                            color: '#1d4ed8',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: 500
                                        }}>
                                            {doctor.department || 'Medicine'}
                                        </span>
                                    </div>
                                    <h3 style={{ marginBottom: '0.25rem', fontSize: '1.25rem' }}>{doctor.name}</h3>
                                    <p style={{ color: '#64748b', marginBottom: '1rem', fontWeight: 500 }}>{doctor.specialization || doctor.department}</p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#059669', fontSize: '0.9rem' }}>
                                        <Clock size={16} />
                                        <span>Available: {doctor.availability || 'Today, 9:00 AM - 5:00 PM'}</span>
                                    </div>

                                    <Button
                                        onClick={() => handleConsult(doctor)}
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        Book Consultation <ArrowRight size={18} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: 'white', gridColumn: 'span 3', textAlign: 'center', padding: '2rem' }}>
                            No specialists currently available. Please check back shortly.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PatientPortal;
