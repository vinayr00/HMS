import React, { useState, useEffect } from 'react';
import { UserPlus, Save, X, Calendar, Clock } from 'lucide-react';
import { appointmentService } from '../../../services/appointment.service';
import { publicService } from '../../../services/public.service';

const ReceptionRegistration = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        gender: '',
        phone: '',
        email: '',
        symptoms: '',
        department: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [createdToken, setCreatedToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        publicService.getDoctors()
            .then(list => setDoctors(list))
            .catch(err => console.error('Failed to load doctors:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'doctorId') {
            const selectedDoc = doctors.find(d => (d._id || d.id) === value);
            setFormData(prev => ({
                ...prev,
                doctorId: value,
                department: selectedDoc?.department || prev.department,
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const selectedDoc = doctors.find(d => (d._id || d.id) === formData.doctorId);

        try {
            // Create patient + appointment together via appointmentService.create
            // The backend will create the patient and link the appointment
            const appointment = await appointmentService.create({
                patientData: {
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    age: parseInt(formData.age, 10),
                    gender: formData.gender,
                    contact: formData.phone || formData.email,
                    symptoms: formData.symptoms,
                },
                doctor: formData.doctorId,
                doctorName: selectedDoc?.name || '',
                date: formData.appointmentDate,
                time: formData.appointmentTime,
                department: formData.department,
                details: formData.symptoms,
                contact: formData.phone || formData.email,
            });

            // Generate a queue token from the appointment ID (last 4 chars)
            const token = appointment?._id
                ? `Q-${appointment._id.toString().slice(-4).toUpperCase()}`
                : null;

            setCreatedToken(token);
            setSubmitted(true);
            setFormData({
                firstName: '', lastName: '', age: '', gender: '',
                phone: '', email: '', symptoms: '', department: '',
                doctorId: '', appointmentDate: '', appointmentTime: '',
            });
            setTimeout(() => { setSubmitted(false); setCreatedToken(null); }, 6000);
        } catch (err) {
            setErrorMessage(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Generate time slot options (08:00 – 17:30, every 30 min)
    const timeSlots = [];
    for (let h = 8; h < 18; h++) {
        for (const m of ['00', '30']) {
            timeSlots.push(`${String(h).padStart(2, '0')}:${m}`);
        }
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div className="detail-card" style={{ maxWidth: '800px', width: '100%' }}>
                <div className="detail-header" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <UserPlus size={32} color="var(--reception-primary)" />
                        New Patient Registration
                    </h1>
                    <p className="text-label" style={{ marginTop: '0.5rem' }}>
                        Register a new patient and create their appointment in one step.
                    </p>
                </div>

                {errorMessage && (
                    <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', color: '#ef4444', marginBottom: '1.5rem' }}>
                        {errorMessage}
                    </div>
                )}

                {submitted ? (
                    <div style={{ padding: '2rem', background: '#f0fdf4', border: '1px solid var(--reception-success)', borderRadius: '8px', textAlign: 'center', color: 'var(--reception-text-main)', marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--reception-success)', marginBottom: '0.5rem' }}>Registration Successful!</h3>
                        <p>Patient and appointment have been saved to the database.</p>
                        {createdToken && (
                            <p style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--reception-primary)', letterSpacing: '0.1em' }}>
                                Queue Token: {createdToken}
                            </p>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3 className="section-title">Personal Information</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">First Name *</label>
                                <input type="text" name="firstName" className="form-input" required
                                    value={formData.firstName} onChange={handleChange} placeholder="e.g. John" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name *</label>
                                <input type="text" name="lastName" className="form-input" required
                                    value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age *</label>
                                <input type="number" name="age" className="form-input" required
                                    min="0" max="150" value={formData.age} onChange={handleChange} placeholder="e.g. 30" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender *</label>
                                <select name="gender" className="form-select" required
                                    value={formData.gender} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input type="tel" name="phone" className="form-input" required
                                    value={formData.phone} onChange={handleChange} placeholder="e.g. +91 9999999999" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email (Optional)</label>
                                <input type="email" name="email" className="form-input"
                                    value={formData.email} onChange={handleChange} placeholder="e.g. john@example.com" />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label className="form-label">Symptoms / Reason for Visit *</label>
                            <textarea name="symptoms" className="form-input" rows={3} required
                                value={formData.symptoms} onChange={handleChange}
                                placeholder="Brief description of symptoms..." style={{ resize: 'vertical' }} />
                        </div>

                        <h3 className="section-title" style={{ marginTop: '2rem' }}>Appointment Details</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Assign Doctor *</label>
                                <select name="doctorId" className="form-select" required
                                    value={formData.doctorId} onChange={handleChange}>
                                    <option value="">-- Select Doctor --</option>
                                    {doctors.map(doc => (
                                        <option key={doc._id || doc.id} value={doc._id || doc.id}>
                                            Dr. {doc.name} — {doc.department}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <input type="text" name="department" className="form-input"
                                    value={formData.department} onChange={handleChange}
                                    placeholder="Auto-filled from doctor" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    Appointment Date *
                                </label>
                                <input type="date" name="appointmentDate" className="form-input" required
                                    min={today} value={formData.appointmentDate} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                    Appointment Time *
                                </label>
                                <select name="appointmentTime" className="form-select" required
                                    value={formData.appointmentTime} onChange={handleChange}>
                                    <option value="">-- Select Time --</option>
                                    {timeSlots.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                            <button type="button" className="action-btn btn-outline"
                                onClick={() => setFormData({
                                    firstName: '', lastName: '', age: '', gender: '',
                                    phone: '', email: '', symptoms: '', department: '',
                                    doctorId: '', appointmentDate: '', appointmentTime: '',
                                })}>
                                <X size={20} /> Clear Form
                            </button>
                            <button type="submit" className="action-btn btn-primary"
                                style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
                                disabled={loading}>
                                <Save size={20} /> {loading ? 'Registering...' : 'Register & Book Appointment'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReceptionRegistration;
