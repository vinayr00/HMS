import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        employeeId: { type: String, required: true, unique: true, trim: true, uppercase: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            required: true,
            enum: ['doctor', 'receptionist', 'pharmacy', 'staff', 'admin'],
        },
        department: { type: String, trim: true, default: 'General' },
        status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.passwordHash = await bcrypt.hash(this.passwordHash, rounds);
    next();
});

// Compare plain password
userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

// Never return passwordHash in JSON responses
userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.passwordHash;
        return ret;
    },
});

export default mongoose.model('User', userSchema);
