import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
    },
    { _id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        patientName: { type: String, required: true },
        appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
        items: { type: [invoiceItemSchema], required: true },
        total: { type: Number, required: true, default: 0 },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Unpaid', 'Refunded'],
            default: 'Pending',
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        date: { type: String, required: true }, // YYYY-MM-DD
    },
    { timestamps: true }
);

invoiceSchema.pre('save', function (next) {
    this.total = this.items.reduce((sum, item) => sum + item.amount, 0);
    next();
});

export default mongoose.model('Invoice', invoiceSchema);
