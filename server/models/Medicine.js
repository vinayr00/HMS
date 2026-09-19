import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        stock: { type: Number, required: true, min: 0, default: 0 },
        reorderLevel: { type: Number, required: true, default: 50 },
        expiry: { type: String, required: true }, // ISO date string YYYY-MM-DD
        price: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

medicineSchema.index({ stock: 1 }); // For low-stock queries
medicineSchema.index({ name: 'text' }); // For text search

export default mongoose.model('Medicine', medicineSchema);
