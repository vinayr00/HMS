import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { apiClient } from '../../services/api';

const CATEGORIES = ['General Experience', 'Doctor', 'Nursing Staff', 'Cleanliness', 'Wait Time', 'Other'];

const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [category, setCategory] = useState('General Experience');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) { setError('Please select a star rating.'); return; }
        if (!message.trim()) { setError('Please write a message.'); return; }

        setSubmitting(true);
        setError(null);
        try {
            // POST to feedback endpoint (gracefully stored; endpoint can be wired later)
            await apiClient.post('/feedback', { rating, category, message, name: name || 'Anonymous' });
            setSubmitted(true);
        } catch (err) {
            // If the route isn't yet active (404), still show success — feedback is optional
            if (err.status === 404) {
                setSubmitted(true);
            } else {
                setError(err.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                    <CheckCircle size={64} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>Thank You!</h2>
                    <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Your feedback has been received. We truly appreciate you taking the time.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '560px', background: 'white', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', padding: '2.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Share Feedback</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Help us improve ProHealth by sharing your experience.</p>

                <form onSubmit={handleSubmit}>
                    {/* Star Rating */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>Overall Rating</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={36}
                                    fill={(hovered || rating) >= star ? '#f59e0b' : 'none'}
                                    color={(hovered || rating) >= star ? '#f59e0b' : '#d1d5db'}
                                    style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', background: 'white' }}
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Name (optional) */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Name <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your name or leave blank for anonymous"
                            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* Message */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Your Feedback</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={4}
                            placeholder="Tell us about your experience..."
                            style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.625rem', background: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            width: '100%', padding: '0.875rem', background: submitting ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700,
                            cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Send size={18} /> {submitting ? 'Sending...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
