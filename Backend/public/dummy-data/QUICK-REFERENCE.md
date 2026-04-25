# Quick Reference - Dummy Data Guide

## 📋 Data Summary

```
Total Records:
├── Departments: 3
├── Doctors: 3 (1 per department)
├── Patients: 10 (with diseases matching doctors)
├── Appointments: 10 (1 per patient)
└── Prescriptions: 10 (1 per appointment)
```

## 👨‍⚕️ Doctors at a Glance

| ID | Name | Department | Specialization | Experience |
|----|------|-----------|---|---|
| doc_001 | Dr. Rajesh Kumar | Cardiology | Interventional Cardiology | 15 yrs |
| doc_002 | Dr. Priya Sharma | Neurology | Clinical Neurology | 12 yrs |
| doc_003 | Dr. Vikram Patel | Orthopedics | Joint Replacement Surgery | 20 yrs |

## 👥 Patients Distribution

**Cardiology (2 patients):**
- pat_001: Amit Singh - Hypertension with Chest Pain
- pat_002: Neha Gupta - Atrial Fibrillation

**Neurology (3 patients):**
- pat_003: Rahul Mishra - Severe Headaches and Migraines
- pat_004: Anjali Patel - Dizziness and Balance Issues
- pat_005: Suresh Kumar - Epilepsy

**Orthopedics (5 patients):**
- pat_006: Deepak Verma - Osteoarthritis of Knee
- pat_007: Sneha Roy - ACL Tear - Left Knee
- pat_008: Manoj Yadav - Lumbar Spine Stenosis
- pat_009: Ritika Bhat - Frozen Shoulder
- pat_010: Vikram Singh - Hip Replacement - Right Side

## 📝 Fields to Edit Before DB Push

### Doctors (doctors.json)
```json
{
  "password": "⚠️ CHANGE THIS - Currently: SecurePass123",
  "verificationdocument": {
    "aadhar": "⚠️ UPDATE - Use real Cloudinary URL",
    "medicaldegree": "⚠️ UPDATE - Use real Cloudinary URL",
    "medicallicense": "⚠️ UPDATE - Use real Cloudinary URL",
    "profilepicture": "⚠️ UPDATE - Use real Cloudinary URL"
  },
  "email": "✓ Ready - Update if needed",
  "phonenumber": "✓ Ready - Update if needed"
}
```

### Patients (patients.json)
```json
{
  "password": "⚠️ CHANGE THIS - Currently: PatientPass###",
  "profilepicture": "⚠️ UPDATE - Use real Cloudinary URL or remove",
  "email": "✓ Ready - Update if needed",
  "phonenumber": "✓ Ready - Update if needed"
}
```

### Appointments (appointments.json)
```json
{
  "appointmentdate": "✓ Ready - Update to current/future dates if needed",
  "appointmenttime": "✓ Ready",
  "uniquecode": "✓ Ready - But verify uniqueness"
}
```

### Prescriptions (prescriptions.json)
```json
{
  "medicines": [
    {
      "medicinename": "✓ Ready",
      "dosage": "✓ Ready",
      "frequency": "✓ Ready",
      "duration": "✓ Ready"
    }
  ]
}
```

## 🔐 Password Security Recommendations

Change all default passwords before import:

**Current Doctor Passwords:**
- Dr. Rajesh Kumar: SecurePass123
- Dr. Priya Sharma: NeuroPass456
- Dr. Vikram Patel: OrthoPass789

**Current Patient Passwords:**
- All follow pattern: PatientPass###

**Suggested Strong Passwords Format:**
```
Dr[Name][SpecializationCode][YearCode]@2026
Patient[Name][DOB_Last2Digits][Phonelast4]
```

## 🖼️ Cloudinary Image URLs Template

Replace all placeholder Cloudinary URLs with actual URLs:

**Current Format:**
```
https://res.cloudinary.com/demo/image/fetch/[filename]
```

**To Update:**
```
https://res.cloudinary.com/[YOUR_CLOUD_NAME]/image/upload/[PATH]/[FILENAME]
```

## 📅 Appointment Date Examples

**Current Dates:** May 10-19, 2026

**To Update to Current:** Change year and month to today's date
```json
"appointmentdate": "2026-05-10"  →  "2026-04-25" (or current date)
```

## ✅ Pre-Import Checklist

### Phase 1: Security Updates
- [ ] Update all doctor passwords
- [ ] Update all patient passwords
- [ ] Review email addresses are correct
- [ ] Update cloudinary URLs or remove if not ready

### Phase 2: Data Validation
- [ ] Verify phone numbers follow your format
- [ ] Check all email addresses are unique
- [ ] Confirm appointment dates are valid
- [ ] Review all unique codes are indeed unique

### Phase 3: Medical Data
- [ ] Verify doctor-specialization matches department
- [ ] Check patient diseases match assigned doctor's department
- [ ] Review medicines are appropriate for diagnosis
- [ ] Validate dosages and frequencies are realistic

### Phase 4: Relationships
- [ ] All doctor IDs in appointments exist
- [ ] All patient IDs in appointments exist
- [ ] All appointment IDs in prescriptions exist
- [ ] No missing or broken references

## 🔄 Quick Edit Locations

### Edit Passwords Globally
```bash
# Search and replace in all files:
SecurePass123 → [New_Doctor_Password]
PatientPass → [New_Patient_Password]
```

### Edit Cloudinary URLs
Files affected: doctors.json, patients.json
Fields: `profilepicture`, `verificationdocument.aadhar`, etc.

### Edit Appointment Dates
File: appointments.json
Field: `appointmentdate` (Format: YYYY-MM-DD)

### Edit Medicines
File: prescriptions.json
Section: `medicines` array in each prescription

## 📊 Statistics

**By Specialization:**
- Cardiology: 3 records (1 doc, 2 patients, 2 appointments)
- Neurology: 4 records (1 doc, 3 patients, 3 appointments)
- Orthopedics: 6 records (1 doc, 5 patients, 5 appointments)

**Appointment Status Distribution:**
- Confirmed: 5 appointments
- Pending: 3 appointments
- Completed: 2 appointments

**Patient Age Range:** 28-72 years
**Doctor Experience:** 12-20 years

## 💾 File Sizes (Approximate)

- departments.json: < 1 KB
- doctors.json: ~5 KB
- patients.json: ~6 KB
- appointments.json: ~8 KB
- prescriptions.json: ~12 KB

**Total:** ~32 KB (very manageable)

## 🚀 Import Priority

**Recommended Import Order:**
1. departments.json (no dependencies)
2. doctors.json (requires departments)
3. patients.json (no dependencies)
4. appointments.json (requires doctors & patients)
5. prescriptions.json (requires appointments)

## 📞 Common Edits Needed

### Change All Passwords
1. Open each file in VS Code
2. Use Find & Replace (Ctrl+H)
3. Replace old password → new password
4. Save each file

### Update Dates
1. Open appointments.json
2. Find: "2026-05-" → Replace with current date
3. Update times if needed

### Update Images
1. Upload images to Cloudinary
2. Copy public URLs
3. Replace placeholder URLs in doctors.json and patients.json

### Add More Data
Copy-paste existing objects and:
1. Change `_id` to next sequential number
2. Update all personal information
3. Link to appropriate doctor
4. Set disease matching doctor's specialization

---

**Quick Navigation:**
- [Main README](./README.md) - Full documentation
- [departments.json](./departments.json) - 3 departments
- [doctors.json](./doctors.json) - 3 doctors
- [patients.json](./patients.json) - 10 patients
- [appointments.json](./appointments.json) - 10 appointments
- [prescriptions.json](./prescriptions.json) - 10 prescriptions
