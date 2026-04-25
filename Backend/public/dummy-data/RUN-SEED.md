# Running the Seed Script

## Prerequisites
1. ✅ MongoDB is running
2. ✅ `.env` file exists in Backend directory with:
   - `MONGODB_URL`
   - `DB_NAME`

## How to Run

### From Backend Directory:
```bash
cd Backend
node public/dummy-data/seed.js
```

### With Clear Flag (Clears existing data first):
```bash
node public/dummy-data/seed.js --clear
```

## Expected Output

```
==================================================
🏥 Hospital Management System - Data Seeder
==================================================

ℹ️  Connecting to MongoDB...
✅ Connected to MongoDB
==================================================
📥 Seeding Data
==================================================

ℹ️  Loading departments...
✅ Inserted 3 departments
ℹ️  Loading doctors...
✅ Inserted 3 doctors
ℹ️  Loading patients...
✅ Inserted 10 patients
ℹ️  Loading appointments...
✅ Inserted 10 appointments
ℹ️  Loading prescriptions...
✅ Inserted 10 prescriptions

==================================================
📊 Verification Summary
==================================================

✅ departments: 3 records
✅ doctors: 3 records
✅ patients: 10 records
✅ appointments: 10 records
✅ prescriptions: 10 records

✅ Seeding Complete
ℹ️  You can now use the application with dummy data
⚠️  Remember: Update passwords and image URLs before production!
ℹ️  Disconnected from MongoDB
```

## Troubleshooting

### Error: Cannot find module
- Make sure you're running from the Backend directory
- Check that all import paths are correct

### Error: MONGODB_URL not found
- Ensure .env file exists in Backend directory
- Verify MONGODB_URL and DB_NAME are set

### Error: Connection refused
- Make sure MongoDB is running
- Check MONGODB_URL is correct

### Error: Validation error
- Check that passwords meet requirements (min 8 chars)
- Verify phone numbers are 10 digits
- Ensure email addresses are unique

## Next Steps

After seeding:
1. Verify data in MongoDB Compass
2. Start the backend: `npm run dev`
3. Test with dummy credentials
4. Update passwords and images for production
