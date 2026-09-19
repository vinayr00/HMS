/**
 * HMS Database Seeder
 * Populates MongoDB Atlas with full live interconnected relational documents.
 * Run: node server/seed.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Medicine from './models/Medicine.js';
import Task from './models/Task.js';
import Patient from './models/Patient.js';
import Appointment from './models/Appointment.js';
import Prescription from './models/Prescription.js';
import Invoice from './models/Invoice.js';
import AuditLog from './models/AuditLog.js';

const USERS = [
    // Doctor
    { name: 'Dr. Sarah Jenkins', employeeId: 'DOC001', email: 'dr.jenkins@prohealth.com', passwordHash: 'doc@123', role: 'doctor', department: 'Cardiology' },
    { name: 'Dr. Marcus Smith', employeeId: 'DOC002', email: 'dr.smith@prohealth.com', passwordHash: 'doc@123', role: 'doctor', department: 'General Medicine' },

    // Receptionist
    { name: 'Receptionist Jane', employeeId: 'REC001', email: 'jane@prohealth.com', passwordHash: 'rec@123', role: 'receptionist', department: 'Front Desk' },
    { name: 'Receptionist David', employeeId: 'REC002', email: 'david@prohealth.com', passwordHash: 'rec@123', role: 'receptionist', department: 'Admissions Desk' },

    // Pharmacy
    { name: 'Pharmacist Bob', employeeId: 'PHA001', email: 'bob@prohealth.com', passwordHash: 'pha@123', role: 'pharmacy', department: 'Main Pharmacy' },
    { name: 'Pharmacist Lisa', employeeId: 'PHA002', email: 'lisa@prohealth.com', passwordHash: 'pha@123', role: 'pharmacy', department: 'Dispensary' },

    // Staff
    { name: 'Staff Member Mike', employeeId: 'STF001', email: 'mike@prohealth.com', passwordHash: 'stf@123', role: 'staff', department: 'General Ward' },
    { name: 'Staff Member Emma', employeeId: 'STF002', email: 'emma@prohealth.com', passwordHash: 'stf@123', role: 'staff', department: 'Emergency Ward' },

    // Admin
    { name: 'Admin Alice', employeeId: 'ADM001', email: 'alice@prohealth.com', passwordHash: 'admin@123', role: 'admin', department: 'Administration' },
    { name: 'Admin Robert', employeeId: 'ADM002', email: 'robert@prohealth.com', passwordHash: 'admin@123', role: 'admin', department: 'IT & Operations' },
];

const MEDICINES = [
    { name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 120, reorderLevel: 50, expiry: '2026-12-01', price: 15.00 },
    { name: 'Paracetamol 500mg', category: 'Pain Relief', stock: 45, reorderLevel: 50, expiry: '2027-06-15', price: 5.00 },
    { name: 'Metformin 850mg', category: 'Diabetes', stock: 200, reorderLevel: 60, expiry: '2026-10-20', price: 12.50 },
    { name: 'Atorvastatin 20mg', category: 'Cardiology', stock: 10, reorderLevel: 30, expiry: '2026-08-30', price: 25.00 },
    { name: 'Omeprazole 20mg', category: 'Gastro', stock: 80, reorderLevel: 40, expiry: '2027-02-10', price: 8.00 },
    { name: 'Amlodipine 5mg', category: 'Cardiology', stock: 60, reorderLevel: 30, expiry: '2027-03-15', price: 18.00 },
    { name: 'Lisinopril 10mg', category: 'Cardiology', stock: 75, reorderLevel: 30, expiry: '2027-01-20', price: 22.00 },
    { name: 'Sumatriptan 50mg', category: 'Neurology', stock: 30, reorderLevel: 20, expiry: '2026-11-10', price: 35.00 },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB Atlas for seeding...\n');

        // Clear existing collections
        await Promise.all([
            User.deleteMany({}),
            Medicine.deleteMany({}),
            Task.deleteMany({}),
            Patient.deleteMany({}),
            Appointment.deleteMany({}),
            Prescription.deleteMany({}),
            Invoice.deleteMany({}),
            AuditLog.deleteMany({}),
        ]);
        console.log('🗑️  Cleared all existing collections');

        // 1. Seed Users
        const createdUsers = await User.create(USERS);
        console.log(`✅ Created ${createdUsers.length} users`);

        const drJenkins = createdUsers.find(u => u.employeeId === 'DOC001');
        const drSmith = createdUsers.find(u => u.employeeId === 'DOC002');
        const recJane = createdUsers.find(u => u.employeeId === 'REC001');
        const recDavid = createdUsers.find(u => u.employeeId === 'REC002');
        const phaBob = createdUsers.find(u => u.employeeId === 'PHA001');
        const phaLisa = createdUsers.find(u => u.employeeId === 'PHA002');
        const staffMike = createdUsers.find(u => u.employeeId === 'STF001');
        const staffEmma = createdUsers.find(u => u.employeeId === 'STF002');
        const adminAlice = createdUsers.find(u => u.employeeId === 'ADM001');

        // 2. Seed Medicines
        const createdMeds = await Medicine.create(MEDICINES);
        console.log(`✅ Created ${createdMeds.length} medicines`);

        const medSuma = createdMeds.find(m => m.name.includes('Sumatriptan'));
        const medPara = createdMeds.find(m => m.name.includes('Paracetamol'));
        const medAmlo = createdMeds.find(m => m.name.includes('Amlodipine'));
        const medAtor = createdMeds.find(m => m.name.includes('Atorvastatin'));
        const medAmox = createdMeds.find(m => m.name.includes('Amoxicillin'));

        // 3. Seed Patients
        const PATIENTS = [
            {
                name: 'Sarah Johnson',
                age: 28,
                gender: 'Female',
                contact: '+1 (555) 010-1122',
                symptoms: 'Severe migraine and sensitivity to light',
                department: 'Cardiology',
                doctor: drJenkins.name,
                assignedDoctor: drJenkins._id,
                registeredBy: recJane._id,
                status: 'registered',
            },
            {
                name: 'Michael Chen',
                age: 45,
                gender: 'Male',
                contact: '+1 (555) 010-3344',
                symptoms: 'Follow-up for hypertension and dizziness',
                department: 'General Medicine',
                doctor: drSmith.name,
                assignedDoctor: drSmith._id,
                registeredBy: recJane._id,
                status: 'registered',
            },
            {
                name: 'Emma Davis',
                age: 32,
                gender: 'Female',
                contact: '+1 (555) 010-5566',
                symptoms: 'Annual physical examination and routine blood tests',
                department: 'Cardiology',
                doctor: drJenkins.name,
                assignedDoctor: drJenkins._id,
                registeredBy: recDavid._id,
                status: 'registered',
            },
            {
                name: 'James Wilson',
                age: 60,
                gender: 'Male',
                contact: '+1 (555) 010-7788',
                symptoms: 'Joint pain in left knee during movement',
                department: 'General Medicine',
                doctor: drSmith.name,
                assignedDoctor: drSmith._id,
                registeredBy: recDavid._id,
                status: 'registered',
            },
            {
                name: 'Robert Taylor',
                age: 52,
                gender: 'Male',
                contact: '+1 (555) 010-9900',
                symptoms: 'Mild chest tightness and short-term fatigue',
                department: 'Cardiology',
                doctor: drJenkins.name,
                assignedDoctor: drJenkins._id,
                registeredBy: recJane._id,
                status: 'pending',
            },
        ];
        const createdPatients = await Patient.create(PATIENTS);
        console.log(`✅ Created ${createdPatients.length} patients`);

        const pSarah = createdPatients.find(p => p.name === 'Sarah Johnson');
        const pMichael = createdPatients.find(p => p.name === 'Michael Chen');
        const pEmma = createdPatients.find(p => p.name === 'Emma Davis');
        const pJames = createdPatients.find(p => p.name === 'James Wilson');
        const pRobert = createdPatients.find(p => p.name === 'Robert Taylor');

        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

        // 4. Seed Appointments
        const APPOINTMENTS = [
            {
                patient: pSarah._id,
                patientName: pSarah.name,
                doctor: drJenkins._id,
                doctorName: drJenkins.name,
                date: today,
                time: '09:00 AM',
                type: 'New Visit',
                status: 'checked-in',
                department: 'Cardiology',
                details: 'Severe migraine and light sensitivity',
                contact: pSarah.contact,
                notes: 'Patient checked in at front desk. Vitals: BP 120/80.',
                createdBy: recJane._id,
            },
            {
                patient: pMichael._id,
                patientName: pMichael.name,
                doctor: drSmith._id,
                doctorName: drSmith.name,
                date: today,
                time: '09:30 AM',
                type: 'Follow-up',
                status: 'in-consultation',
                department: 'General Medicine',
                details: 'Hypertension routine checkup',
                contact: pMichael.contact,
                notes: 'Currently in consultation room 2.',
                createdBy: recJane._id,
            },
            {
                patient: pEmma._id,
                patientName: pEmma.name,
                doctor: drJenkins._id,
                doctorName: drJenkins.name,
                date: today,
                time: '10:00 AM',
                type: 'New Visit',
                status: 'scheduled',
                department: 'Cardiology',
                details: 'Routine checkup & heart rate analysis',
                contact: pEmma.contact,
                notes: '',
                createdBy: recDavid._id,
            },
            {
                patient: pJames._id,
                patientName: pJames.name,
                doctor: drSmith._id,
                doctorName: drSmith.name,
                date: today,
                time: '10:45 AM',
                type: 'Follow-up',
                status: 'completed',
                department: 'General Medicine',
                details: 'Joint pain in left knee',
                contact: pJames.contact,
                notes: 'Examination completed. Advised rest, compression, and prescribed mild analgesic.',
                completedAt: new Date(),
                createdBy: recDavid._id,
            },
            {
                patient: pRobert._id,
                patientName: pRobert.name,
                doctor: drJenkins._id,
                doctorName: drJenkins.name,
                date: today,
                time: '11:30 AM',
                type: 'Emergency',
                status: 'scheduled',
                department: 'Cardiology',
                details: 'Chest tightness examination',
                contact: pRobert.contact,
                notes: 'Priority consultation',
                createdBy: recJane._id,
            },
            {
                patient: pSarah._id,
                patientName: pSarah.name,
                doctor: drJenkins._id,
                doctorName: drJenkins.name,
                date: tomorrow,
                time: '02:00 PM',
                type: 'Follow-up',
                status: 'scheduled',
                department: 'Cardiology',
                details: 'Follow-up consultation after initial treatment',
                contact: pSarah.contact,
                notes: '',
                createdBy: recJane._id,
            },
            {
                patient: pMichael._id,
                patientName: pMichael.name,
                doctor: drSmith._id,
                doctorName: drSmith.name,
                date: tomorrow,
                time: '03:30 PM',
                type: 'Follow-up',
                status: 'scheduled',
                department: 'General Medicine',
                details: 'BP dosage review',
                contact: pMichael.contact,
                notes: '',
                createdBy: recDavid._id,
            },
        ];
        const createdAppointments = await Appointment.create(APPOINTMENTS);
        console.log(`✅ Created ${createdAppointments.length} appointments`);

        // 5. Seed Prescriptions
        const PRESCRIPTIONS = [
            {
                appointment: createdAppointments[0]._id,
                patient: pSarah._id,
                patientName: pSarah.name,
                doctor: drJenkins._id,
                doctorName: drJenkins.name,
                items: [
                    { medicine: medSuma._id, medicineName: medSuma.name, dosage: '50mg', freq: 'Once daily as needed', duration: '5 days', qty: 2 },
                    { medicine: medPara._id, medicineName: medPara.name, dosage: '500mg', freq: 'Twice daily', duration: '5 days', qty: 10 },
                ],
                status: 'pending',
            },
            {
                appointment: createdAppointments[1]._id,
                patient: pMichael._id,
                patientName: pMichael.name,
                doctor: drSmith._id,
                doctorName: drSmith.name,
                items: [
                    { medicine: medAmlo._id, medicineName: medAmlo.name, dosage: '5mg', freq: 'Once daily in morning', duration: '30 days', qty: 30 },
                    { medicine: medAtor._id, medicineName: medAtor.name, dosage: '20mg', freq: 'Once daily at night', duration: '30 days', qty: 30 },
                ],
                status: 'pending',
            },
            {
                appointment: createdAppointments[3]._id,
                patient: pJames._id,
                patientName: pJames.name,
                doctor: drSmith._id,
                doctorName: drSmith.name,
                items: [
                    { medicine: medPara._id, medicineName: medPara.name, dosage: '500mg', freq: 'Every 8 hours', duration: '7 days', qty: 14 },
                ],
                status: 'dispensed',
                dispensedBy: phaBob._id,
                dispensedAt: new Date(),
            },
            {
                patient: pEmma._id,
                patientName: pEmma.name,
                doctor: drJenkins._id,
                doctorName: drJenkins.name,
                items: [
                    { medicine: medAmox._id, medicineName: medAmox.name, dosage: '500mg', freq: 'Three times daily', duration: '7 days', qty: 21 },
                ],
                status: 'dispensed',
                dispensedBy: phaLisa._id,
                dispensedAt: new Date(),
            },
        ];
        const createdPrescriptions = await Prescription.create(PRESCRIPTIONS);
        console.log(`✅ Created ${createdPrescriptions.length} prescriptions`);

        // 6. Seed Invoices
        const INVOICES = [
            {
                patient: pSarah._id,
                patientName: pSarah.name,
                appointment: createdAppointments[0]._id,
                items: [
                    { description: 'Cardiology Specialist Consultation', amount: 150 },
                    { description: '12-Lead ECG Diagnostic', amount: 100 },
                ],
                total: 250,
                status: 'Pending',
                createdBy: recJane._id,
                date: today,
            },
            {
                patient: pMichael._id,
                patientName: pMichael.name,
                appointment: createdAppointments[1]._id,
                items: [
                    { description: 'General Physician Consultation', amount: 90 },
                    { description: 'Blood Pressure & Vitals Assessment', amount: 40 },
                ],
                total: 130,
                status: 'Paid',
                createdBy: recJane._id,
                date: today,
            },
            {
                patient: pJames._id,
                patientName: pJames.name,
                appointment: createdAppointments[3]._id,
                items: [
                    { description: 'Orthopedic Knee Examination', amount: 120 },
                    { description: 'Prescription Medication Dispense', amount: 25 },
                ],
                total: 145,
                status: 'Paid',
                createdBy: recDavid._id,
                date: today,
            },
            {
                patient: pRobert._id,
                patientName: pRobert.name,
                appointment: createdAppointments[4]._id,
                items: [
                    { description: 'Emergency Cardiac Triage', amount: 220 },
                ],
                total: 220,
                status: 'Unpaid',
                createdBy: recJane._id,
                date: today,
            },
        ];
        const createdInvoices = await Invoice.create(INVOICES);
        console.log(`✅ Created ${createdInvoices.length} invoices`);

        // 7. Seed Tasks
        const TASKS = [
            // Tasks for Mike (STF001)
            { title: 'Prepare Consultation Room 1', type: 'Room Prep', priority: 'High', status: 'COMPLETED', details: 'Sanitize desk, check diagnostic monitors, restock gloves.', assignedTo: staffMike._id },
            { title: 'Assist Dr. Jenkins in Cardiology OPD', type: 'Assistance', priority: 'High', status: 'ACTIVE', details: 'Patient triage and ECG sensor setup.', assignedTo: staffMike._id },
            { title: 'Archive Physical Records for Morning Shift', type: 'Admin', priority: 'Low', status: 'PENDING', details: 'File discharge summaries in the central archive.', assignedTo: staffMike._id },

            // Tasks for Emma (STF002)
            { title: 'Restock Emergency Ward 2 Supplies', type: 'Maintenance', priority: 'High', status: 'ACTIVE', details: 'Check saline drips, sterile syringes, and IV kits.', assignedTo: staffEmma._id },
            { title: 'Sanitize Ultrasound Equipment Room B', type: 'Room Prep', priority: 'Medium', status: 'PENDING', details: 'Full sterile wipe down after morning scans.', assignedTo: staffEmma._id },
            { title: 'Escort Post-Op Patient to Ward 4', type: 'Assistance', priority: 'Medium', status: 'PENDING', details: 'Safely transfer patient from recovery to room 402.', assignedTo: staffEmma._id },
        ];
        const createdTasks = await Task.create(TASKS);
        console.log(`✅ Created ${createdTasks.length} staff tasks`);

        // 8. Seed Audit Logs
        const LOGS = [
            { actor: adminAlice._id, actorName: 'Admin Alice', action: 'SYSTEM_INITIALIZATION', entity: 'System', status: 'Success', timestamp: new Date(Date.now() - 3600000 * 3) },
            { actor: recJane._id, actorName: 'Receptionist Jane', action: 'CREATE_PATIENT', entity: 'Patient', entityId: pSarah._id.toString(), status: 'Success', timestamp: new Date(Date.now() - 3600000 * 2) },
            { actor: recJane._id, actorName: 'Receptionist Jane', action: 'CREATE_APPOINTMENT', entity: 'Appointment', entityId: createdAppointments[0]._id.toString(), status: 'Success', timestamp: new Date(Date.now() - 3600000) },
            { actor: drJenkins._id, actorName: 'Dr. Sarah Jenkins', action: 'LOGIN', entity: 'System', status: 'Success', timestamp: new Date(Date.now() - 1800000) },
            { actor: phaBob._id, actorName: 'Pharmacist Bob', action: 'DISPENSE_PRESCRIPTION', entity: 'Prescription', entityId: createdPrescriptions[2]._id.toString(), status: 'Success', timestamp: new Date(Date.now() - 900000) },
        ];
        const createdLogs = await AuditLog.create(LOGS);
        console.log(`✅ Created ${createdLogs.length} audit logs`);

        console.log('\n🎉 MongoDB Atlas Seeded Successfully!');
        console.log('   Role          | Employee ID | Password  | Name');
        console.log('   ------------------------------------------------------------');
        console.log('   Doctor        | DOC001      | doc@123   | Dr. Sarah Jenkins');
        console.log('   Doctor        | DOC002      | doc@123   | Dr. Marcus Smith');
        console.log('   Receptionist  | REC001      | rec@123   | Receptionist Jane');
        console.log('   Receptionist  | REC002      | rec@123   | Receptionist David');
        console.log('   Pharmacy      | PHA001      | pha@123   | Pharmacist Bob');
        console.log('   Pharmacy      | PHA002      | pha@123   | Pharmacist Lisa');
        console.log('   Staff         | STF001      | stf@123   | Staff Member Mike');
        console.log('   Staff         | STF002      | stf@123   | Staff Member Emma');
        console.log('   Admin         | ADM001      | admin@123 | Admin Alice');
        console.log('   Admin         | ADM002      | admin@123 | Admin Robert');
    } catch (err) {
        console.error('❌ Seed failed:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seed();
