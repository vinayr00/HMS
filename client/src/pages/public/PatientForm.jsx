import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import hospitalVideo from '../../utils/hospital.mp4';
import { publicService } from '../../services/public.service';

const PatientForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const preselectedDoctor = location.state?.doctor || null;

    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        contact: '',
        email: '',
        symptoms: '',
        department: preselectedDoctor?.department || '',
        doctorId: preselectedDoctor?._id || preselectedDoctor?.id || '',
        appointmentDate: '',
        appointmentTime: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Load doctor list for dropdown
    useEffect(() => {
        publicService.getDoctors()
            .then(setDoctors)
            .catch(() => setDoctors([]));
    }, []);

    // Auto-fill department when doctor is selected
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
        setSubmitting(true);
        setSubmitError(null);
        try {
            await publicService.bookAppointment({
                name: formData.name,
                age: parseInt(formData.age, 10),
                gender: formData.gender,
                contact: formData.contact,
                email: formData.email || undefined,
                symptoms: formData.symptoms,
                doctorId: formData.doctorId,
                department: formData.department,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
            });
            setSubmitted(true);
            setTimeout(() => navigate('/patient'), 3000);
        } catch (err) {
            setSubmitError(err.message || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Generate time slot options (08:00 – 17:30, every 30 min)
    const timeSlots = [];
    for (let h = 8; h < 18; h++) {
        for (const m of ['00', '30']) {
            timeSlots.push(`${String(h).padStart(2, '0')}:${m}`);
        }
    }

    // Min date = today
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="booking-wrapper">
            {/* Background Video */}
            <video
                src={hospitalVideo}
                autoPlay
                loop
                muted
                playsInline
                className="booking-video-bg"
            />

            {/* Overlay */}
            <div className="booking-overlay"></div>

            {/* Content Container */}
            <div className="booking-content">
                {submitted ? (
                    <div className="booking-card success">
                        <h2 style={{ color: '#059669' }}>Booking Confirmed!</h2>
                        <p style={{ color: '#065f46', fontSize: '1.1rem' }}>
                            Your appointment has been created. You will be contacted shortly.
                        </p>
                        <p style={{ marginTop: '1rem', fontWeight: 600, color: '#047857' }}>Redirecting...</p>
                    </div>
                ) : (
                    <div className="booking-card">
                        <button
                            onClick={() => navigate('/patient')}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                color: '#64748b', marginBottom: '1.5rem',
                                fontSize: '0.9rem', padding: 0, fontWeight: 500,
                            }}
                            onMouseOver={e => e.currentTarget.style.color = '#0284c7'}
                            onMouseOut={e => e.currentTarget.style.color = '#64748b'}
                        >
                            <ArrowLeft size={16} />
                            Back to Portal
                        </button>

                        <div style={{ marginBottom: '2rem' }}>
                            <h2 className="text-xl font-bold text-brand-primary">Book Consultation</h2>
                            <p className="text-muted mt-2">Fill in your details to secure an appointment.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Patient Info */}
                            <div className="grid grid-cols-2">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input required type="text" name="name" value={formData.name}
                                        onChange={handleChange} className="form-input" placeholder="John Doe" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Age *</label>
                                    <input required type="number" name="age" min="0" max="150"
                                        value={formData.age} onChange={handleChange}
                                        className="form-input" placeholder="Age" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2">
                                <div className="form-group">
                                    <label className="form-label">Gender *</label>
                                    <select required name="gender" value={formData.gender}
                                        onChange={handleChange} className="form-select">
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone *</label>
                                    <input required type="tel" name="contact" value={formData.contact}
                                        onChange={handleChange} className="form-input" placeholder="+91 9999999999" />
                                </div>
                            </div>

                            {/* Doctor + Date + Time */}
                            <div className="form-group">
                                <label className="form-label">Select Doctor *</label>
                                <select required name="doctorId" value={formData.doctorId}
                                    onChange={handleChange} className="form-select">
                                    <option value="">-- Choose a Doctor --</option>
                                    {doctors.map(doc => (
                                        <option key={doc._id || doc.id} value={doc._id || doc.id}>
                                            Dr. {doc.name} — {doc.department}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2">
                                <div className="form-group">
                                    <label className="form-label">
                                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                        Appointment Date *
                                    </label>
                                    <input required type="date" name="appointmentDate"
                                        min={today} value={formData.appointmentDate}
                                        onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                        Preferred Time *
                                    </label>
                                    <select required name="appointmentTime" value={formData.appointmentTime}
                                        onChange={handleChange} className="form-select">
                                        <option value="">-- Select Time --</option>
                                        {timeSlots.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Reason for Visit *</label>
                                <textarea required name="symptoms" value={formData.symptoms}
                                    onChange={handleChange} rows="3" className="form-textarea"
                                    placeholder="Briefly describe your symptoms..." />
                            </div>

                            {submitError && (
                                <div style={{
                                    color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem',
                                    padding: '0.5rem', background: '#fef2f2',
                                    borderRadius: '6px', border: '1px solid #fecaca',
                                }}>
                                    {submitError}
                                </div>
                            )}

                            <Button type="submit" className="w-full mt-4"
                                style={{ width: '100%' }} disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Confirm Booking'}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientForm;
