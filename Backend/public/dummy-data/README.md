# Dummy Data for Smart Hospital Management System

This directory contains JSON files with dummy data for demo and testing purposes.

## 📁 Files Overview

### 1. **departments.json** (3 departments)
- **Cardiology** - Heart and cardiovascular diseases
- **Neurology** - Nervous system and brain disorders
- **Orthopedics** - Bones, joints, and muscles

### 2. **doctors.json** (3 doctors with different specialties)
| Doctor | Specialization | Department | Experience |
|--------|---|---|---|
| Dr. Rajesh Kumar | Interventional Cardiology | Cardiology | 15 years |
| Dr. Priya Sharma | Clinical Neurology | Neurology | 12 years |
| Dr. Vikram Patel | Joint Replacement Surgery | Orthopedics | 20 years |

**Credentials for Demo:**
- Username formats: dr_[firstname]_[specialization_short]
- Passwords: Varies (customize before DB push)

### 3. **patients.json** (10 patients)
- **Pat_001-002:** Cardiology patients (Hypertension, Atrial Fibrillation)
- **Pat_003-005:** Neurology patients (Migraines, Vertigo, Epilepsy)
- **Pat_006-010:** Orthopedic patients (Osteoarthritis, ACL Tear, Lumbar Stenosis, Frozen Shoulder, Hip Replacement)

**Credentials for Demo:**
- Username format: [firstname]_[lastname]_001
- Passwords: PatientPass### (customize before DB push)

### 4. **appointments.json** (10 appointments)
- Each appointment links a patient to a doctor
- Dates: May 10-19, 2026
- Status options: Pending, Confirmed, Completed
- Each appointment includes symptoms and medical history

### 5. **prescriptions.json** (10 prescriptions)
- One prescription per appointment
- Each prescription includes diagnosis and multiple medicines
- Medicine details: name, dosage, frequency, duration

## 🚀 How to Use

### Option 1: Import via MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. For each collection:
   - Create a new collection (departments, doctors, patients, appointments, prescriptions)
   - Use "Add Data" → "Import File" → Select JSON file
   - Choose "Insert one or more documents"

### Option 2: Import via MongoDB CLI
```bash
mongoimport --uri "mongodb://[username]:[password]@[host]:[port]/[database]" \
  --collection departments \
  --file departments.json \
  --jsonArray

mongoimport --uri "mongodb://[username]:[password]@[host]:[port]/[database]" \
  --collection doctors \
  --file doctors.json \
  --jsonArray

# Repeat for patients, appointments, prescriptions
```

### Option 3: Create a Seeding Script
You can use Node.js to import the data programmatically:

```javascript
// seed.js
const mongoose = require("mongoose");
const fs = require("fs");

const Department = require("./models/dept.model");
const Doctor = require("./models/doctor.model");
const Patient = require("./models/patient.model");
const Appointment = require("./models/appointment.model");
const Prescription = require("./models/prescription.model");

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Load JSON files
    const departments = JSON.parse(fs.readFileSync("./dummy-data/departments.json"));
    const doctors = JSON.parse(fs.readFileSync("./dummy-data/doctors.json"));
    const patients = JSON.parse(fs.readFileSync("./dummy-data/patients.json"));
    const appointments = JSON.parse(fs.readFileSync("./dummy-data/appointments.json"));
    const prescriptions = JSON.parse(fs.readFileSync("./dummy-data/prescriptions.json"));

    // Insert data
    await Department.insertMany(departments);
    console.log("✅ Departments inserted");
    
    await Doctor.insertMany(doctors);
    console.log("✅ Doctors inserted");
    
    await Patient.insertMany(patients);
    console.log("✅ Patients inserted");
    
    await Appointment.insertMany(appointments);
    console.log("✅ Appointments inserted");
    
    await Prescription.insertMany(prescriptions);
    console.log("✅ Prescriptions inserted");

    console.log("✅ All data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
```

Run with: `node seed.js`

## ⚠️ Important Before DB Push

### 1. **Change Passwords**
All passwords are set to generic values for demo. Update them:
- Doctors: Change from `SecurePass123`, `NeuroPass456`, `OrthoPass789`
- Patients: Change from `PatientPass###`

### 2. **Update Cloudinary URLs**
All image URLs are placeholders. Replace with actual URLs or upload media:
```json
"profilepicture": "https://res.cloudinary.com/demo/image/fetch/profile_rajesh.jpg"
```

### 3. **Verify Email Addresses**
- Ensure email addresses follow your validation rules
- Update to real/test email addresses if needed

### 4. **Update Phone Numbers**
- Verify phone number format (currently Indian format: 10 digits)
- Update as per your region

### 5. **Review Appointment Dates**
- Current dates: May 10-19, 2026
- Update to appropriate dates before pushing to production

### 6. **Unique Codes**
- Appointment codes follow format: `APT-###-2026`
- Ensure codes are unique before import

## 📊 Data Relationships

```
Doctors (3)
├── Rajesh Kumar (Cardiology)
├── Priya Sharma (Neurology)
└── Vikram Patel (Orthopedics)

Patients (10)
├── Cardiology Patients (2): Amit Singh, Neha Gupta
├── Neurology Patients (3): Rahul Mishra, Anjali Patel, Suresh Kumar
└── Orthopedic Patients (5): Deepak Verma, Sneha Roy, Manoj Yadav, Ritika Bhat, Vikram Singh

Appointments (1:1 with Patients)
└── Links patient → doctor

Prescriptions (1:1 with Appointments)
└── Links appointment → medicines
```

## 🔄 Data Flow

1. **Doctor registers** with department and specialization
2. **Patient registers** with health profile
3. **Appointment is booked** - Patient selects doctor and date
4. **Appointment is confirmed** by doctor
5. **Prescription is created** after appointment completion

## 📝 Customization Tips

### Add More Patients
1. Copy a patient object from `patients.json`
2. Change `_id` to `pat_###`
3. Update all fields (name, email, username, etc.)
4. Set `assignedDoctor` to appropriate doctor ID
5. Add disease matching the doctor's specialization

### Add More Appointments
1. Copy an appointment object
2. Change `_id` to `apt_###`
3. Link to patient and doctor
4. Set appropriate `appointmentdate` and `appointmenttime`
5. Fill in symptoms and medical history

### Add More Prescriptions
1. Copy a prescription object
2. Change `_id` to `presc_###`
3. Link to appointment ID
4. Update diagnosis and medicines
5. Adjust dosage/frequency per requirements

## ✅ Verification Checklist Before Import

- [ ] All passwords are updated to secure values
- [ ] All Cloudinary URLs are valid (or images uploaded)
- [ ] Email addresses are verified and unique
- [ ] Phone numbers are in correct format
- [ ] Appointment dates are realistic
- [ ] Unique codes (especially appointment codes) are unique
- [ ] Doctor-Patient-Department relationships are correct
- [ ] No duplicate IDs across documents
- [ ] Medical history matches diseases
- [ ] Medicines are appropriate for diagnosis

## 🐛 Troubleshooting

### Duplicate Key Error
**Solution:** Ensure `_id` values are unique. Remove `_id` field to let MongoDB generate them.

### Validation Error
**Solution:** Check field types match schema (e.g., `phonenumber` should be Number, not String)

### Reference Error
**Solution:** Ensure doctor/patient IDs in appointments exist in respective collections

## 📞 Support

For issues or questions about the data structure:
1. Check the model files in `/Backend/src/models/`
2. Refer to this README
3. Review example objects in each JSON file

---

**Last Updated:** April 25, 2026
**Status:** Ready for Demo/Testing
