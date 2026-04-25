/**
 * Seed Script for Hospital Management System
 * 
 * Usage:
 * - Make sure MongoDB is running
 * - Update .env with MONGODB_URI
 * - Run: node public/dummy-data/seed.js
 * 
 * To clear data:
 * - Run: node public/dummy-data/seed.js --clear
 */

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { Department } from "../../src/models/dept.model.js";
import { Doctor } from "../../src/models/doctor.model.js";
import { Patient } from "../../src/models/patient.model.js";
import { Appointment } from "../../src/models/appointment.model.js";
import { Prescription } from "../../src/models/prescription.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from Backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const DUMMY_DATA_DIR = __dirname;

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`${colors.blue}${"=".repeat(50)}\n${msg}\n${"=".repeat(50)}${colors.reset}`),
};

/**
 * Load JSON file
 */
function loadJSON(filename) {
  try {
    const filePath = path.join(DUMMY_DATA_DIR, filename);
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to load ${filename}: ${error.message}`);
  }
}

/**
 * Clear all collections
 */
async function clearCollections() {
  log.header("🧹 Clearing Existing Data");
  
  try {
    const collections = [
      { name: "Department", model: Department },
      { name: "Doctor", model: Doctor },
      { name: "Patient", model: Patient },
      { name: "Appointment", model: Appointment },
      { name: "Prescription", model: Prescription },
    ];

    for (const collection of collections) {
      const count = await collection.model.countDocuments();
      if (count > 0) {
        await collection.model.deleteMany({});
        log.success(`Deleted ${count} ${collection.name} records`);
      }
    }
  } catch (error) {
    log.error(`Error clearing collections: ${error.message}`);
    throw error;
  }
}

/**
 * Seed departments
 */
async function seedDepartments() {
  log.info("Loading departments...");
  const departments = loadJSON("departments.json");
  
  try {
    const result = await Department.insertMany(departments);
    log.success(`Inserted ${result.length} departments`);
    return result;
  } catch (error) {
    log.error(`Department insertion error: ${error.message}`);
    if (error.code === 11000) {
      log.warn("Some departments already exist - attempting one-by-one");
      const results = [];
      for (const dept of departments) {
        try {
          const result = await Department.create(dept);
          results.push(result);
        } catch (e) {
          if (e.code !== 11000) {
            throw e;
          }
        }
      }
      log.success(`Inserted ${results.length} departments`);
      return results;
    }
    throw error;
  }
}

/**
 * Seed doctors
 */
async function seedDoctors() {
  log.info("Loading doctors...");
  const doctors = loadJSON("doctors.json");
  
  // Remove refreshtoken if it exists (will be set during login)
  const doctorsToInsert = doctors.map(doc => {
    const docCopy = { ...doc };
    delete docCopy.refreshtoken;
    return docCopy;
  });
  
  try {
    const result = await Doctor.insertMany(doctorsToInsert);
    log.success(`Inserted ${result.length} doctors`);
    return result;
  } catch (error) {
    log.error(`Doctor insertion error: ${error.message}`);
    if (error.code === 11000) {
      log.warn("Some doctors already exist - attempting one-by-one");
      const results = [];
      for (const doc of doctorsToInsert) {
        try {
          const result = await Doctor.create(doc);
          results.push(result);
        } catch (e) {
          if (e.code !== 11000) {
            log.error(`Failed to insert doctor: ${e.message}`);
            throw e;
          }
        }
      }
      log.success(`Inserted ${results.length} doctors`);
      return results;
    }
    throw error;
  }
}

/**
 * Seed patients
 */
async function seedPatients() {
  log.info("Loading patients...");
  const patients = loadJSON("patients.json");
  
  // Remove custom fields and refreshtoken if they exist
  const patientsToInsert = patients.map(patient => {
    const patCopy = { ...patient };
    delete patCopy.refreshtoken;
    delete patCopy.disease;
    delete patCopy.assignedDoctor;
    delete patCopy.medicalHistory;
    return patCopy;
  });

  try {
    const result = await Patient.insertMany(patientsToInsert);
    log.success(`Inserted ${result.length} patients`);
    return result;
  } catch (error) {
    log.error(`Patient insertion error: ${error.message}`);
    if (error.code === 11000) {
      log.warn("Some patients already exist - attempting one-by-one");
      const results = [];
      for (const patient of patientsToInsert) {
        try {
          const result = await Patient.create(patient);
          results.push(result);
        } catch (e) {
          if (e.code !== 11000) {
            log.error(`Failed to insert patient: ${e.message}`);
            throw e;
          }
        }
      }
      log.success(`Inserted ${results.length} patients`);
      return results;
    }
    throw error;
  }
}

/**
 * Seed appointments
 */
async function seedAppointments() {
  log.info("Loading appointments...");
  const appointments = loadJSON("appointments.json");
  
  try {
    const result = await Appointment.insertMany(appointments);
    log.success(`Inserted ${result.length} appointments`);
    return result;
  } catch (error) {
    log.error(`Appointment insertion error: ${error.message}`);
    if (error.code === 11000) {
      log.warn("Some appointments already exist - attempting one-by-one");
      const results = [];
      for (const apt of appointments) {
        try {
          const result = await Appointment.create(apt);
          results.push(result);
        } catch (e) {
          if (e.code !== 11000) {
            log.error(`Failed to insert appointment: ${e.message}`);
            throw e;
          }
        }
      }
      log.success(`Inserted ${results.length} appointments`);
      return results;
    }
    throw error;
  }
}

/**
 * Seed prescriptions
 */
async function seedPrescriptions(appointments) {
  log.info("Loading prescriptions...");
  const prescriptions = loadJSON("prescriptions.json");
  
  // Link prescriptions to appointments by index
  const prescriptionsToInsert = prescriptions.map((presc, index) => {
    const prescCopy = { ...presc };
    // Link to corresponding appointment if it exists
    if (appointments && appointments[index]) {
      prescCopy.appointmentid = appointments[index]._id;
    }
    return prescCopy;
  });
  
  try {
    const result = await Prescription.insertMany(prescriptionsToInsert);
    log.success(`Inserted ${result.length} prescriptions`);
    return result;
  } catch (error) {
    log.error(`Prescription insertion error: ${error.message}`);
    if (error.code === 11000) {
      log.warn("Some prescriptions already exist - attempting one-by-one");
      const results = [];
      for (const presc of prescriptionsToInsert) {
        try {
          const result = await Prescription.create(presc);
          results.push(result);
        } catch (e) {
          if (e.code !== 11000) {
            log.error(`Failed to insert prescription: ${e.message}`);
            throw e;
          }
        }
      }
      log.success(`Inserted ${results.length} prescriptions`);
      return results;
    }
    throw error;
  }
}

/**
 * Verify seeded data
 */
async function verifySeed() {
  log.header("📊 Verification Summary");
  
  try {
    const stats = {
      departments: await Department.countDocuments(),
      doctors: await Doctor.countDocuments(),
      patients: await Patient.countDocuments(),
      appointments: await Appointment.countDocuments(),
      prescriptions: await Prescription.countDocuments(),
    };

    let allGood = true;
    for (const [collection, count] of Object.entries(stats)) {
      if (count === 0) {
        log.warn(`${collection}: 0 records`);
        allGood = false;
      } else {
        log.success(`${collection}: ${count} records`);
      }
    }

    if (allGood) {
      log.success("✨ All data seeded successfully!");
    }

    return stats;
  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    throw error;
  }
}

/**
 * Main seed function
 */
async function main() {
  log.header("🏥 Hospital Management System - Data Seeder");

  const shouldClear = process.argv.includes("--clear");

  try {
    // Construct MongoDB URI from environment variables
    const MONGODB_URI = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;
    
    if (!MONGODB_URI || !process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL and DB_NAME not found in .env file");
    }

    // Connect to MongoDB
    log.info(`Connecting to MongoDB...`);
    
    await mongoose.connect(MONGODB_URI);
    log.success("Connected to MongoDB");

    // Clear if flag is set
    if (shouldClear) {
      await clearCollections();
    }

    // Seed data in order
    log.header("📥 Seeding Data");
    
    await seedDepartments();
    await seedDoctors();
    await seedPatients();
    const appointments = await seedAppointments();
    await seedPrescriptions(appointments);

    // Verify
    await verifySeed();

    log.header("✅ Seeding Complete");
    log.info("You can now use the application with dummy data");
    log.warn("Remember: Update passwords and image URLs before production!");

  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    log.info("Disconnected from MongoDB");
  }
}

// Run main function
main();
