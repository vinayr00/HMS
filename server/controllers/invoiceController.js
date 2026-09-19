import Invoice from '../models/Invoice.js';
import { writeLog } from '../utils/auditLogger.js';

export const getAll = async (_req, res) => {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).populate('patient', 'name');
    res.json({ invoices });
};

export const create = async (req, res) => {
    const { patient, patientName, appointment, items } = req.body;
    if (!patient || !items?.length) {
        return res.status(400).json({ error: 'patient and items are required' });
    }

    const total = items.reduce((s, i) => s + (i.amount || 0), 0);
    const date = new Date().toISOString().split('T')[0];

    const invoice = await Invoice.create({
        patient, patientName, appointment: appointment || null,
        items, total, date, createdBy: req.user.id,
    });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'CREATE_INVOICE', entity: 'Invoice', entityId: invoice._id.toString(),
    });

    res.status(201).json({ invoice });
};

export const markPaid = async (req, res) => {
    const invoice = await Invoice.findByIdAndUpdate(
        req.params.id,
        { status: 'Paid' },
        { new: true }
    );
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'MARK_INVOICE_PAID', entity: 'Invoice', entityId: invoice._id.toString(),
    });

    res.json({ invoice });
};

export const refund = async (req, res) => {
    const invoice = await Invoice.findByIdAndUpdate(
        req.params.id,
        { status: 'Refunded' },
        { new: true }
    );
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    await writeLog({
        actor: req.user.id, actorName: req.user.name,
        action: 'REFUND_INVOICE', entity: 'Invoice', entityId: invoice._id.toString(), status: 'Warning',
    });

    res.json({ invoice });
};
