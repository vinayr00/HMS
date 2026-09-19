import React, { useState, useEffect } from 'react';
import { Search, FileText, Download, CheckCircle, Clock } from 'lucide-react';
import { useReception } from '../../../context/ReceptionContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReceptionBilling = () => {
    const { invoices, updateInvoiceItem, markInvoiceAsPaid } = useReception();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Sync selected invoice with context changes
    useEffect(() => {
        if (selectedInvoice) {
            const updated = invoices.find(inv => (inv._id || inv.id) === (selectedInvoice._id || selectedInvoice.id));
            if (updated) setSelectedInvoice(updated);
        } else if (invoices.length > 0 && !selectedInvoice) {
            setSelectedInvoice(invoices[0]);
        }
    }, [invoices, selectedInvoice]);

    const filteredInvoices = invoices.filter(inv => {
        const patientName = inv.patientName || (typeof inv.patient === 'string' ? inv.patient : inv.patient?.name) || '';
        const invId = inv._id || inv.id || '';
        return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invId.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const calculateTotal = (items = []) => {
        return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const handleMarkAsPaid = () => {
        if (selectedInvoice && (selectedInvoice.status === 'Pending' || selectedInvoice.status === 'Unpaid')) {
            if (window.confirm('Confirm payment received for this invoice?')) {
                markInvoiceAsPaid(selectedInvoice._id || selectedInvoice.id);
            }
        }
    };

    const handleDownloadPDF = () => {
        if (!selectedInvoice) return;

        const doc = new jsPDF();
        const invoiceNum = selectedInvoice._id ? selectedInvoice._id.slice(-6).toUpperCase() : selectedInvoice.id;
        const patientName = selectedInvoice.patientName || (typeof selectedInvoice.patient === 'string' ? selectedInvoice.patient : selectedInvoice.patient?.name) || 'Patient';

        // Header
        doc.setFontSize(22);
        doc.setTextColor(2, 132, 199); // Medical Blue
        doc.text('HMS Hospital', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('123 Health Avenue, Med City', 14, 26);
        doc.text('Phone: +1 555-0123', 14, 30);

        // Invoice Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Invoice #: ${invoiceNum}`, 140, 20);
        doc.text(`Date: ${selectedInvoice.date}`, 140, 26);
        doc.text(`Status: ${(selectedInvoice.status || 'Pending').toUpperCase()}`, 140, 32);

        // Patient Info
        doc.setLineWidth(0.5);
        doc.line(14, 35, 196, 35);
        doc.setFontSize(12);
        doc.text(`Bill To: ${patientName}`, 14, 45);

        // Items Table
        const tableColumn = ["Description", "Amount ($)"];
        const tableRows = [];

        (selectedInvoice.items || []).forEach(item => {
            const itemData = [
                item.description,
                (parseFloat(item.amount) || 0).toFixed(2)
            ];
            tableRows.push(itemData);
        });

        // Add Total Row
        tableRows.push(['', '']);
        tableRows.push(['Total Amount', `$${calculateTotal(selectedInvoice.items).toFixed(2)}`]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: 'grid',
            headStyles: { fillColor: [2, 132, 199] },
            columnStyles: {
                0: { cellWidth: 130 },
                1: { cellWidth: 40, halign: 'right' }
            }
        });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('This is a system-generated invoice. Thank you for your business.', 14, doc.lastAutoTable.finalY + 10);

        doc.save(`Invoice_${invoiceNum}.pdf`);
    };

    return (
        <div className="split-view-container">
            {/* Left Panel: Invoice List */}
            <div className="list-panel">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--reception-border)' }}>
                    <h2 className="text-lg" style={{ marginBottom: '1rem' }}>Invoices</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--reception-text-muted)' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '2.5rem', width: '100%' }}
                            placeholder="Search by name or invoice ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    {filteredInvoices.map(inv => {
                        const invId = inv._id || inv.id;
                        const isSelected = selectedInvoice && (selectedInvoice._id || selectedInvoice.id) === invId;
                        const patientName = inv.patientName || (typeof inv.patient === 'string' ? inv.patient : inv.patient?.name) || 'Patient';
                        const total = inv.total || calculateTotal(inv.items);

                        return (
                            <div
                                key={invId}
                                className={`reception-card ${isSelected ? 'active' : ''}`}
                                onClick={() => setSelectedInvoice(inv)}
                            >
                                <div className="reception-card-header">
                                    <span className="text-value">{inv._id ? inv._id.slice(-6).toUpperCase() : inv.id}</span>
                                    <span className={`status-badge ${inv.status === 'Paid' ? 'status-checked-in' : inv.status === 'Pending' ? 'status-waiting' : 'status-cancelled'}`}>
                                        {inv.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <h4 style={{ fontWeight: 600 }}>{patientName}</h4>
                                    <span className="text-value" style={{ fontWeight: 700 }}>${total.toFixed(2)}</span>
                                </div>
                                <p className="text-label" style={{ marginTop: '0.25rem' }}>{inv.date}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Panel: Invoice Detail */}
            <div className="detail-panel">
                {selectedInvoice ? (
                    <div className="detail-card">
                        <div className="detail-header" style={{ borderBottom: '1px solid var(--reception-border)', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                                    Invoice #{selectedInvoice._id ? selectedInvoice._id.slice(-6).toUpperCase() : selectedInvoice.id}
                                </h2>
                                <p className="text-label" style={{ fontSize: '1.1rem' }}>
                                    Billed to: <span className="text-value">
                                        {selectedInvoice.patientName || (typeof selectedInvoice.patient === 'string' ? selectedInvoice.patient : selectedInvoice.patient?.name) || 'Patient'}
                                    </span>
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className={`status-badge ${selectedInvoice.status === 'Paid' ? 'status-checked-in' : selectedInvoice.status === 'Pending' ? 'status-waiting' : 'status-cancelled'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                    {selectedInvoice.status}
                                </span>
                                <p className="text-label" style={{ marginTop: '0.5rem' }}>Date: {selectedInvoice.date}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <h3 className="section-title">Billable Items</h3>
                            <div style={{ border: '1px solid var(--reception-border)', borderRadius: '8px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'var(--reception-secondary)' }}>
                                        <tr>
                                            <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--reception-text-muted)', fontWeight: 600 }}>Description</th>
                                            <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--reception-text-muted)', fontWeight: 600 }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedInvoice.items.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid var(--reception-border)' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    {selectedInvoice.status === 'Paid' ? (
                                                        <span style={{ color: 'var(--reception-text-main)' }}>{item.description}</span>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            value={item.description}
                                                            onChange={(e) => updateInvoiceItem(selectedInvoice._id || selectedInvoice.id, index, 'description', e.target.value)}
                                                            style={{ width: '100%', border: 'none', background: 'transparent', padding: 0, fontWeight: 500 }}
                                                        />
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    {selectedInvoice.status === 'Paid' ? (
                                                        <span style={{ fontWeight: 500 }}>${(parseFloat(item.amount) || 0).toFixed(2)}</span>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            className="form-input"
                                                            value={item.amount}
                                                            onChange={(e) => updateInvoiceItem(selectedInvoice._id || selectedInvoice.id, index, 'amount', e.target.value)}
                                                            style={{ width: '80px', textAlign: 'right', border: 'none', background: 'transparent', padding: 0, fontWeight: 500 }}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr style={{ background: '#f8fafc' }}>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>Total</td>
                                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, fontSize: '1.25rem' }}>${calculateTotal(selectedInvoice.items).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {selectedInvoice.status !== 'Paid' && (
                                <p className="text-label" style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>* Click description or amount to edit details.</p>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="action-btn btn-outline" onClick={handleDownloadPDF}>
                                <Download size={18} /> Download PDF
                            </button>
                            {selectedInvoice.status !== 'Paid' && (
                                <button className="action-btn btn-primary" onClick={handleMarkAsPaid}>
                                    <CheckCircle size={18} /> Mark as Paid
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--reception-text-muted)' }}>
                        Select an invoice to view details
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceptionBilling;
