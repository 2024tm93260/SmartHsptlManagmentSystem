# Smart Hospital Management System (BIMS) — Detailed Technical Report

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Backend Architecture](#3-backend-architecture)
   - 3.1 [Project Structure](#31-project-structure)
   - 3.2 [Server Setup & Entry Point](#32-server-setup--entry-point)
   - 3.3 [Database Connection](#33-database-connection)
   - 3.4 [Express Application Configuration](#34-express-application-configuration)
   - 3.5 [Utility Classes](#35-utility-classes)
   - 3.6 [Authentication & Middleware Layer](#36-authentication--middleware-layer)
   - 3.7 [Controllers](#37-controllers)
   - 3.8 [API Endpoints (Routes)](#38-api-endpoints-routes)
4. [Admin Panel (Frontend) Architecture](#4-admin-panel-frontend-architecture)
   - 4.1 [Project Structure](#41-project-structure)
   - 4.2 [Application Bootstrap](#42-application-bootstrap)
   - 4.3 [Routing Configuration](#43-routing-configuration)
   - 4.4 [State Management (Redux Toolkit)](#44-state-management-redux-toolkit)
   - 4.5 [API Service Layer](#45-api-service-layer)
   - 4.6 [Authentication Flow in Admin](#46-authentication-flow-in-admin)
   - 4.7 [UI Components](#47-ui-components)
5. [Admin ↔ Backend Interaction](#5-admin--backend-interaction)
   - 5.1 [Authentication Flow (End-to-End)](#51-authentication-flow-end-to-end)
   - 5.2 [Department Management Flow](#52-department-management-flow)
   - 5.3 [Doctor Management Flow](#53-doctor-management-flow)
   - 5.4 [Appointment Management Flow](#54-appointment-management-flow)
   - 5.5 [Profile Management Flow](#55-profile-management-flow)
   - 5.6 [Token Renewal (Interceptor-driven)](#56-token-renewal-interceptor-driven)
6. [Database Schema](#6-database-schema)
   - 6.1 [Admin Schema](#61-admin-schema)
   - 6.2 [Doctor Schema](#62-doctor-schema)
   - 6.3 [Patient Schema](#63-patient-schema)
   - 6.4 [Department Schema](#64-department-schema)
   - 6.5 [Appointment Schema](#65-appointment-schema)
   - 6.6 [Prescription Schema](#66-prescription-schema)
   - 6.7 [Lab Test Schema](#67-lab-test-schema)
   - 6.8 [Entity Relationship Summary](#68-entity-relationship-summary)
7. [Cloudinary Setup & Usage](#7-cloudinary-setup--usage)
   - 7.1 [Configuration](#71-configuration)
   - 7.2 [Upload Utility](#72-upload-utility)
   - 7.3 [Usage in Controllers](#73-usage-in-controllers)
   - 7.4 [Multer Integration (Memory Storage)](#74-multer-integration-memory-storage)
   - 7.5 [Folder Structure on Cloudinary](#75-folder-structure-on-cloudinary)
8. [Deployment Configuration](#8-deployment-configuration)

---

## 1. System Overview

The **Smart Hospital Management System (BIMS)** is a full-stack web application designed to digitize and streamline hospital operations. The system manages three primary user roles — **Admin**, **Doctor**, and **Patient** — each with dedicated frontends and shared backend APIs.

**Key capabilities include:**
- Multi-role registration and authentication (JWT-based)
- Department management (CRUD operations by Admin)
- Doctor profile management with verification documents
- Patient registration with profile pictures
- Appointment booking with real-time slot availability
- Prescription management with medicine details
- Lab test tracking with result parameters
- Auto-cancellation of expired appointments
- Role-based access control via middleware
- File uploads to Cloudinary (documents, profile pictures)
- Password reset flows with OTP verification

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend Runtime** | Node.js (ES Modules) | — |
| **Backend Framework** | Express.js | 5.2.1 |
| **Database** | MongoDB (via Mongoose ODM) | Mongoose 9.3.0 |
| **Authentication** | JSON Web Tokens (JWT) | 9.0.3 |
| **Password Hashing** | bcrypt | 6.0.0 |
| **File Upload** | Multer (memory storage) | 2.1.1 |
| **Cloud Storage** | Cloudinary | 2.9.0 |
| **Frontend Framework** | React | 19.2.4 |
| **State Management** | Redux Toolkit | 2.11.2 |
| **HTTP Client** | Axios | 1.13.6 |
| **CSS Framework** | Tailwind CSS | 4.2.1 |
| **UI Components** | Radix UI + Lucide Icons | — |
| **Routing** | React Router DOM | 7.13.1 |
| **Build Tool** | Vite | 7.3.1 |
| **Deployment** | Vercel (Serverless) | — |

---

## 3. Backend Architecture

### 3.1 Project Structure

```
Backend/
├── package.json
├── vercel.json
├── public/temp/
└── src/
    ├── index.js              # Entry point & server bootstrap
    ├── app.js                # Express app configuration
    ├── db/index.js           # MongoDB connection (cached)
    ├── controllers/
    │   ├── admin.controller.js
    │   ├── appointment.controller.js
    │   ├── department.controller.js
    │   ├── doctor.controller.js
    │   ├── patient.controller.js
    │   ├── prescription.contorller.js
    │   └── labtest.controller.js
    ├── models/
    │   ├── admin.model.js
    │   ├── doctor.model.js
    │   ├── patient.model.js
    │   ├── dept.model.js
    │   ├── appointment.model.js
    │   ├── prescription.model.js
    │   └── labtest.model.js
    ├── middlewares/
    │   ├── adminauth.middleware.js
    │   ├── doctorauth.middleware.js
    │   ├── patientauth.middleware.js
    │   ├── multer.middleware.js
    │   └── verifytempjwt.middleware.js
    ├── routes/
    │   ├── admin.route.js
    │   ├── doctor.route.js
    │   ├── patient.route.js
    │   └── appointment.route.js
    ├── utils/
    │   ├── apiError.js
    │   ├── apiResponse.js
    │   ├── asynchandler.js
    │   └── cloudinary.js
    └── services/
        ├── mail.js
        ├── nodemailer.js
        └── otp.js
```

### 3.2 Server Setup & Entry Point

The server supports **dual deployment** — local development with `app.listen()` and **Vercel serverless** via an exported handler.

```javascript
// Backend/src/index.js
import dotenv from "dotenv";
import connectdb from "./db/index.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Serverless handler export for Vercel
let isConnected = false;
export default async function handler(req, res) {
    if (!isConnected) {
        await connectdb();
        isConnected = true;
    }
    return app(req, res);
}

// Local development server setup
if (process.env.NODE_ENV === "development" || !process.env.VERCEL) {
    const startServer = async () => {
        try {
            await connectdb();
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    };
    startServer();
}
```

### 3.3 Database Connection

Uses a **cached connection pattern** to avoid reconnection in serverless environments:

```javascript
// Backend/src/db/index.js
import mongoose from "mongoose";

const MONGODB_URI = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectdb = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("MongoDB Connected");
    } catch (error) {
        cached.promise = null;
        throw error;
    }
    return cached.conn;
};

export default connectdb;
```

### 3.4 Express Application Configuration

```javascript
// Backend/src/app.js
import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

// CORS: Allows Admin, Doctor, and Patient frontends
const allowedOrigins = [
    process.env.CORS_ORIGIN_DOCTOR,
    process.env.CORS_ORIGIN_PATIENT,
    process.env.CORS_ORIGIN_ADMIN,
];

app.use(cors({
    origin: isDevelopment ? true : function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) callback(null, true);
        else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.use(cookieparser());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));

// Route mounting
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/patient/appointments", appointmentRouter);

// Global error handler
app.use((err, req, res, next) => {
    if (err instanceof apiError) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});
```

**Key configuration points:**
- CORS is configured to accept requests from three separate frontend origins (Admin, Doctor, Patient)
- Cookie parser is enabled for JWT token storage in HTTP-only cookies
- JSON body limit is set to 20KB
- A global error handler catches both custom `apiError` and generic errors

### 3.5 Utility Classes

#### apiError — Custom Error Class

```javascript
// Backend/src/utils/apiError.js
class apiError extends Error {
    constructor(statusCode, message = "Something went wrong", stack = "", errors = []) {
        super(message);
        this.data = null;
        this.statusCode = statusCode;
        this.errors = errors;
        this.message = message;
        this.success = false;

        if (stack) this.stack = stack;
        else Error.captureStackTrace(this, this.constructor);
    }
}
```

#### apiResponse — Standardized Response

```javascript
// Backend/src/utils/apiResponse.js
class apiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
```

All API responses follow a consistent format:
```json
{
    "statusCode": 200,
    "data": { ... },
    "message": "Success message",
    "success": true
}
```

#### asyncHandler — Promise Wrapper

```javascript
// Backend/src/utils/asynchandler.js
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};
```

Wraps every controller function to automatically catch rejected Promises and pass errors to Express error middleware.

### 3.6 Authentication & Middleware Layer

The system uses a **dual-token strategy** — short-lived access tokens (1 day) stored in cookies and long-lived refresh tokens (20 days) for token renewal.

#### Admin Auth Middleware

```javascript
// Backend/src/middlewares/adminauth.middleware.js
const verifyadmin = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accesstoken ||
                  req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new apiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decodedToken?._id)
                             .select("-password -refreshtoken");

    if (!admin) throw new apiError(401, "Invalid Access Token");

    req.admin = admin;
    next();
});
```

#### Doctor Auth Middleware

```javascript
// Backend/src/middlewares/doctorauth.middleware.js
const verifydoctor = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accesstoken ||
                  req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new apiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const doctor = await Doctor.findById(decodedToken?._id)
                               .select("-password -refreshtoken");

    if (!doctor) throw new apiError(401, "Invalid Access Token");

    req.doctor = doctor;
    next();
});
```

#### Patient Auth Middleware

```javascript
// Backend/src/middlewares/patientauth.middleware.js
const verifypatient = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken ||
                  req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new apiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const patient = await Patient.findById(decodedToken?._id)
                                 .select("-password -refreshtoken");

    if (!patient) throw new apiError(401, "Invalid Access Token");

    req.patient = patient;
    next();
});
```

#### Temp JWT Middleware (For Password Reset)

Used during the forgot-password flow where a temporary token is issued after OTP verification:

```javascript
// Backend/src/middlewares/verifytempjwt.middleware.js
const verifyTempjwt = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.tempToken ||
                  req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new apiError(401, "Authorization token missing");

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    let user;
    if (decoded.role === "patient")
        user = await Patient.findById(decoded._id).select("-password -refreshtoken");
    if (decoded.role === "doctor")
        user = await Doctor.findById(decoded._id).select("-password -refreshtoken");
    if (decoded.role === "admin")
        user = await Admin.findById(decoded._id).select("-password -refreshtoken");

    req.user = user;
    next();
});
```

#### Multer Middleware (File Uploads)

```javascript
// Backend/src/middlewares/multer.middleware.js
import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
});
```

Uses **memory storage** (buffers) instead of disk, which pairs directly with the Cloudinary stream upload.

### 3.7 Controllers

#### 3.7.1 Admin Controller

| Function | Purpose |
|----------|---------|
| `registeradmin` | Registers admin with verification docs (Aadhar, Admin ID, profile picture, appointment letter) uploaded to Cloudinary |
| `loginadmin` | Authenticates with username/email + password + admin secret code |
| `logoutadmin` | Clears refresh token from DB and cookies |
| `accesstokenrenewal` | Issues new access/refresh tokens using existing refresh token |
| `updatepassword` | Changes password (requires old password verification) |
| `resetForgottenPassword` | Resets password via temp JWT (after OTP flow) |
| `updateprofile` | Updates admin name, email, or phone number |
| `getprofiledetails` | Fetches current admin's profile |
| `updateprofilepic` | Updates admin profile picture via Cloudinary |
| `getCurrentAdmin` | Returns current authenticated admin data |

**Registration snippet:**
```javascript
const registeradmin = asyncHandler(async (req, res) => {
    const { adminname, adminusername, email, password, phonenumber, adminsecret } = req.body;

    // Validate admin secret against environment variable
    if (adminsecret !== process.env.ADMIN_SECRET) {
        throw new apiError(401, "Invalid admin secret");
    }

    // Upload verification documents to Cloudinary
    const aadhar = await uploadcloudinary(req.files?.aadhar?.[0]?.buffer, "admin/aadhar");
    const adminId = await uploadcloudinary(req.files?.adminId?.[0]?.buffer, "admin/admin-id");
    const profilepicture = await uploadcloudinary(req.files?.profilepicture?.[0]?.buffer, "admin/profile-picture");
    const appointmentletter = await uploadcloudinary(req.files?.appointmentletter?.[0]?.buffer, "admin/appointment-letter");

    const admin = await Admin.create({
        adminname, adminusername, email, password, phonenumber,
        verificationdocs: {
            aadhar: aadhar.secure_url,
            adminId: adminId.secure_url,
            profilepicture: profilepicture.secure_url,
            appointmentletter: appointmentletter.secure_url
        },
        adminsecret,
    });

    const createdAdmin = await Admin.findById(admin._id)
        .select("-password -refreshtoken -adminsecret");

    return res.status(201)
        .json(new apiResponse(201, createdAdmin, "Admin registered successfully"));
});
```

#### 3.7.2 Doctor Controller

| Function | Purpose |
|----------|---------|
| `registerdoctor` | Registers doctor with verification docs (Aadhar, medical degree, license, profile picture) and shift schedule |
| `logindoctor` | Login with email/username + password |
| `logoutdoctor` | Clears cookies and refresh token |
| `accesstokenrenewal` | Renews access token |
| `updatepassword` | Changes password |
| `resetForgottenPassword` | Forgot-password reset via temp JWT |
| `getdoctorprofiledetails` | Public doctor profile (hides sensitive docs) |
| `getdoctorprofiledetailsprivate` | Private profile (for the doctor themselves) |
| `updateprofile` | Updates doctor details including shift schedule |
| `updateprofilepic` | Updates profile picture |
| `updatedocument` | Updates medical degree/license documents |
| `getalldoctorprofiledetails` | Lists all doctors with optional search by name |
| `getdoctorbydept` | Filters doctors by department |
| `getCurrentDoctor` | Returns current authenticated doctor |

**Doctor registration with shift schedule:**
```javascript
const registerdoctor = asyncHandler(async (req, res) => {
    const { doctorname, doctorusername, email, password, phonenumber,
            sex, age, experience, qualification, department,
            specialization, shift } = req.body;

    // Upload docs to Cloudinary
    const aadhar = await uploadcloudinary(req.files?.aadhar?.[0]?.buffer, "doctors/aadhar");
    const medicaldegree = await uploadcloudinary(req.files?.medicaldegree?.[0]?.buffer, "doctors/medical-degree");
    const medicallicense = await uploadcloudinary(req.files?.medicallicense?.[0]?.buffer, "doctors/medical-license");
    const profilepicture = await uploadcloudinary(req.files?.profilepicture?.[0]?.buffer, "doctors/profile-picture");

    // Parse shift schedule from JSON string
    const shiftarray = JSON.parse(shift);

    const doctor = await Doctor.create({
        doctorname, doctorusername, email, password, phonenumber, sex, age,
        verificationdocument: {
            aadhar: aadhar.secure_url,
            medicaldegree: medicaldegree.secure_url,
            medicallicense: medicallicense.secure_url,
            profilepicture: profilepicture.secure_url,
        },
        experience, qualification,
        department: department.toLowerCase(),
        specialization,
        shift: shiftarray
    });

    return res.status(201).json(
        new apiResponse(201, createddoctor, "Doctor registered successfully")
    );
});
```

#### 3.7.3 Patient Controller

| Function | Purpose |
|----------|---------|
| `registerPatient` | Registers patient with optional profile picture |
| `loginPatient` | Login with email/username + password |
| `logoutPatient` | Clears cookies and refresh token |
| `accesstokenrenewal` | Renews access token |
| `updatepassword` | Changes password |
| `resetForgottenPassword` | Forgot-password reset |
| `updateprofile` | Updates patient details |
| `getprofiledetails` | Fetches patient profile |
| `updateprofilepic` | Updates profile picture |
| `getPatient` | Returns current patient data |

#### 3.7.4 Appointment Controller

| Function | Purpose |
|----------|---------|
| `checkavailability` | Calculates available slots for a doctor in a given month/year based on shift schedule |
| `createAppointment` | Books an appointment (generates unique confirmation code) |
| `cancelappointment` | Cancels an appointment (sets 24hr auto-delete) |
| `updateappointment` | Updates appointment date/time/symptoms |
| `getappointment` | Gets single appointment details |
| `getallappointmentforpatient` | Lists all appointments for logged-in patient |
| `getallappointmentfordoctor` | Lists confirmed/completed appointments for logged-in doctor |
| `getallappointmentforadmin` | Lists all appointments (admin access) |
| `gettodayappointment` | Gets today's confirmed appointments for a doctor |
| `verifyappointment` | Doctor verifies appointment using unique code, marks as "Completed" |
| `autoCancelExpiredAppointments` | Automatically cancels past-date confirmed appointments |

**Slot availability algorithm:**
```javascript
const checkavailability = asyncHandler(async (req, res) => {
    const { doctorid, month, year } = req.query;
    const doctor = await Doctor.findById(doctorid);
    const shiftSchedule = doctor.shift;
    const totalDaysInMonth = new Date(finalYear, finalMonth, 0).getDate();

    // Build slot map from shift schedule
    const dateSlotMap = {};
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const localDate = new Date(Date.UTC(finalYear, finalMonth - 1, day));
        const weekday = localDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

        const applicableShifts = shiftSchedule.filter((s) => s.day === weekday);
        if (applicableShifts.length === 0) continue;

        dateSlotMap[dateStr] = { totaltimes: [] };
        for (const shift of applicableShifts) {
            const slotInterval = (shiftEnd - shiftStart) / shift.patientslot;
            for (let i = 0; i < shift.patientslot; i++) {
                const slotTime = new Date(shiftStart.getTime() + i * slotInterval);
                dateSlotMap[dateStr].totaltimes.push(formatTime(slotTime));
            }
        }
    }

    // Remove already booked slots
    const bookedAppointments = await Appointment.find({ ... });
    for (const appt of bookedAppointments) {
        const idx = dateSlotMap[apptDate].totaltimes.indexOf(appt.appointmenttime);
        if (idx !== -1) dateSlotMap[apptDate].totaltimes.splice(idx, 1);
    }

    return res.status(200).json(new apiResponse(200, availabilityArray, "Available slots fetched"));
});
```

#### 3.7.5 Department Controller

| Function | Purpose |
|----------|---------|
| `createDepartment` | Creates a new department (admin only) |
| `updateDepartment` | Updates department name/description (admin only) |
| `getAllDepartments` | Lists all departments |

```javascript
const createDepartment = asyncHandler(async (req, res) => {
    const { deptname, description } = req.body;

    const existingDepartment = await Department.findOne({ deptname });
    if (existingDepartment) {
        throw new apiError(409, "Department with the same name already exists");
    }

    const department = await Department.create({
        deptname: deptname.toLowerCase(),
        description
    });

    return res.status(201).json(new apiResponse(200, department, "Department created successfully"));
});
```

#### 3.7.6 Prescription Controller

| Function | Purpose |
|----------|---------|
| `createprescription` | Creates prescription linked to appointment (doctor only) |
| `getprescription` | Gets single prescription |
| `getallprescriptionsfordoctor` | Lists all prescriptions by logged-in doctor |
| `getallprescriptionsforpatient` | Lists all prescriptions for logged-in patient |
| `getprescriptionbyappointment` | Gets prescription by appointment ID |
| `updateprescription` | Updates prescription details |
| `deleteprescription` | Deletes a prescription |

#### 3.7.7 Lab Test Controller

| Function | Purpose |
|----------|---------|
| `createlabtest` | Creates lab test linked to prescription |
| `getlabtest` | Gets single lab test |
| `getalllabtestsfordoctor` | Lists all lab tests for logged-in doctor |
| `getalllabtestsforpatient` | Lists all lab tests for logged-in patient |
| `getlabtestbyprescription` | Gets lab test by prescription ID |
| `updatelabtest` | Updates lab test details |
| `updatetestresults` | Updates individual test results and parameters |
| `verifylabtest` | Doctor verifies lab test results |
| `deletelabtest` | Deletes a lab test |

### 3.8 API Endpoints (Routes)

#### 3.8.1 Admin Routes — `POST /api/v1/admin/...`

| Method | Endpoint | Middleware | Controller | Purpose |
|--------|----------|-----------|------------|---------|
| POST | `/register` | `upload.fields([aadhar, adminId, profilepicture, appointmentletter])` | `registeradmin` | Register admin with docs |
| POST | `/login` | — | `loginadmin` | Admin login |
| POST | `/logout` | `verifyadmin` | `logoutadmin` | Admin logout |
| PATCH | `/update-profile` | `verifyadmin` | `updateprofile` | Update profile info |
| PATCH | `/update-profilepicture` | `verifyadmin`, `upload.single("profilepicture")` | `updateprofilepic` | Update profile picture |
| GET | `/get-profile` | `verifyadmin` | `getprofiledetails` | Get profile |
| GET | `/get-admin` | `verifyadmin` | `getCurrentAdmin` | Get current admin |
| POST | `/renew-access-token` | — | `accesstokenrenewal` | Refresh access token |
| PATCH | `/update-password` | `verifyadmin` | `updatepassword` | Update password |
| POST | `/update-password/send-otp` | `verifyadmin` | `sendotp` | Send OTP for password update |
| POST | `/update-password/verify-otp` | `verifyadmin` | `verifyotp` | Verify OTP |
| POST | `/forgot-password/send-otp` | — | `sendForgetPasswordOtp` | Send forgot-password OTP |
| POST | `/forgot-password/verify-otp` | `verifyTempjwt` | `verifyForgotPasswordOtp` | Verify forgot-password OTP |
| PATCH | `/forgot-password/update-password` | `verifyTempjwt` | `resetForgottenPassword` | Reset password |
| GET | `/todayappointments` | `verifyadmin` | `gettodayappointment` | Get today's appointments |
| GET | `/appointments` | `verifyadmin` | `getallappointmentforadmin` | Get all appointments |
| GET | `/appointments/:appointmentid` | `verifyadmin` | `getappointment` | Get specific appointment |
| GET | `/doctors` | `verifyadmin` | `getalldoctorprofiledetails` | Get all doctors |
| GET | `/doctors/:doctorid` | `verifyadmin` | `getdoctorprofiledetails` | Get specific doctor |
| GET | `/departments/:deptname/doctors` | `verifyadmin` | `getdoctorbydept` | Get doctors by department |
| POST | `/create-department` | `verifyadmin` | `createDepartment` | Create department |
| GET | `/departments` | `verifyadmin` | `getAllDepartments` | Get all departments |
| PATCH | `/update-department/:id` | `verifyadmin` | `updateDepartment` | Update department |

#### 3.8.2 Doctor Routes — `POST /api/v1/doctor/...`

| Method | Endpoint | Middleware | Controller | Purpose |
|--------|----------|-----------|------------|---------|
| POST | `/register` | `upload.fields([aadhar, medicaldegree, profilepicture, medicallicense])` | `registerdoctor` | Register doctor |
| POST | `/login` | — | `logindoctor` | Doctor login |
| POST | `/logout` | `verifydoctor` | `logoutdoctor` | Doctor logout |
| PATCH | `/update-profile` | `verifydoctor` | `updateprofile` | Update profile |
| PATCH | `/update-profilepicture` | `verifydoctor`, `upload.single("profilepicture")` | `updateprofilepic` | Update profile pic |
| GET | `/profile` | `verifydoctor` | `getdoctorprofiledetailsprivate` | Get doctor profile |
| POST | `/renew-access-token` | — | `accesstokenrenewal` | Refresh token |
| PATCH | `/update-document` | `verifydoctor`, `upload.fields([medicaldegree, medicallicense])` | `updatedocument` | Update documents |
| PATCH | `/update-password` | `verifydoctor` | `updatepassword` | Update password |
| GET | `/todayappointments` | `verifydoctor` | `gettodayappointment` | Today's appointments |
| GET | `/appointments` | `verifydoctor` | `getallappointmentfordoctor` | All doctor appointments |
| POST | `/appointments/verify-appointment` | `verifydoctor` | `verifyappointment` | Verify appointment code |
| GET | `/appointments/:appointmentid` | `verifydoctor` | `getappointment` | Get specific appointment |
| GET | `/get-doctor` | `verifydoctor` | `getCurrentDoctor` | Get current doctor |
| POST | `/prescriptions/:appointmentid` | `verifydoctor` | `createprescription` | Create prescription |
| GET | `/prescriptions` | `verifydoctor` | `getallprescriptionsfordoctor` | All prescriptions |
| GET | `/prescriptions/appointment/:appointmentid` | `verifydoctor` | `getprescriptionbyappointment` | Prescription by appointment |
| GET | `/prescriptions/:prescriptionid` | `verifydoctor` | `getprescription` | Get prescription |
| PATCH | `/prescriptions/:prescriptionid` | `verifydoctor` | `updateprescription` | Update prescription |
| DELETE | `/prescriptions/:prescriptionid` | `verifydoctor` | `deleteprescription` | Delete prescription |
| POST | `/labtests` | `verifydoctor` | `createlabtest` | Create lab test |
| GET | `/labtests` | `verifydoctor` | `getalllabtestsfordoctor` | All lab tests |
| GET | `/labtests/prescription/:prescriptionid` | `verifydoctor` | `getlabtestbyprescription` | Lab test by prescription |
| GET | `/labtests/:labtestid` | `verifydoctor` | `getlabtest` | Get lab test |
| PATCH | `/labtests/:labtestid` | `verifydoctor` | `updatelabtest` | Update lab test |
| PATCH | `/labtests/:labtestid/test-results` | `verifydoctor` | `updatetestresults` | Update test results |
| POST | `/labtests/:labtestid/verify` | `verifydoctor` | `verifylabtest` | Verify lab test |
| DELETE | `/labtests/:labtestid` | `verifydoctor` | `deletelabtest` | Delete lab test |

#### 3.8.3 Patient Routes — `POST /api/v1/patient/...`

| Method | Endpoint | Middleware | Controller | Purpose |
|--------|----------|-----------|------------|---------|
| POST | `/register` | `upload.single("profilepicture")` | `registerPatient` | Register patient |
| POST | `/login` | — | `loginPatient` | Patient login |
| POST | `/logout` | `verifypatient` | `logoutPatient` | Patient logout |
| PATCH | `/update-profile` | `verifypatient` | `updateprofile` | Update profile |
| PATCH | `/update-profilepicture` | `verifypatient`, `upload.single("profilepicture")` | `updateprofilepic` | Update profile pic |
| GET | `/get-profile` | `verifypatient` | `getprofiledetails` | Get profile |
| GET | `/get-patient` | `verifypatient` | `getPatient` | Get current patient |
| POST | `/renew-access-token` | — | `accesstokenrenewal` | Refresh token |
| PATCH | `/update-password` | `verifypatient` | `updatepassword` | Update password |
| GET | `/doctors/:doctorid` | `verifypatient` | `getdoctorprofiledetails` | View doctor profile |
| GET | `/doctors` | `verifypatient` | `getalldoctorprofiledetails` | List all doctors |
| GET | `/departments` | `verifypatient` | `getAllDepartments` | List departments |
| GET | `/departments/:deptname/doctors` | `verifypatient` | `getdoctorbydept` | Doctors by dept |
| GET | `/prescriptions` | `verifypatient` | `getallprescriptionsforpatient` | My prescriptions |
| GET | `/prescriptions/appointment/:appointmentid` | `verifypatient` | `getprescriptionbyappointment` | Prescription by appt |
| GET | `/prescriptions/:prescriptionid` | `verifypatient` | `getprescription` | Get prescription |
| GET | `/labtests` | `verifypatient` | `getalllabtestsforpatient` | My lab tests |
| GET | `/labtests/prescription/:prescriptionid` | `verifypatient` | `getlabtestbyprescription` | Lab test by prescription |
| GET | `/labtests/:labtestid` | `verifypatient` | `getlabtest` | Get lab test |

#### 3.8.4 Appointment Routes — `/api/v1/patient/appointments/...`

| Method | Endpoint | Middleware | Controller | Purpose |
|--------|----------|-----------|------------|---------|
| GET | `/availability` | `verifypatient` | `checkavailability` | Check doctor availability |
| GET | `/` | `verifypatient` | `getallappointmentforpatient` | All patient appointments |
| POST | `/book-appointment/:doctorid` | `verifypatient` | `createAppointment` | Book appointment |
| POST | `/cancelAppointment/:appointmentid` | `verifypatient` | `cancelappointment` | Cancel appointment |
| PATCH | `/updateappointment/:appointmentid` | `verifypatient` | `updateappointment` | Update appointment |
| GET | `/:appointmentid` | `verifypatient` | `getappointment` | Get appointment details |

---

## 4. Admin Panel (Frontend) Architecture

### 4.1 Project Structure

```
Admin/
├── package.json
├── vite.config.js
├── index.html
├── public/
└── src/
    ├── App.jsx              # Root component with auth check
    ├── main.jsx             # Entry point with routing
    ├── index.css            # Global styles (Tailwind)
    ├── services/
    │   ├── api.js           # Axios instance with interceptors
    │   └── adminApi.js      # Redux async thunks for API calls
    ├── store/
    │   ├── store.js         # Redux store configuration
    │   └── slices/
    │       ├── adminSlice.js   # Admin data slice
    │       └── authSlice.js    # Auth state slice
    ├── components/
    │   ├── custom/          # Business logic components
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminDepartmentCard.jsx
    │   │   ├── AdminDoctorCard.jsx
    │   │   ├── AdminHeader.jsx
    │   │   ├── AdminQuickAction.jsx
    │   │   ├── AdminStats.jsx
    │   │   ├── AdminUpcomingAppointments.jsx
    │   │   ├── authLayout.jsx
    │   │   ├── LogoutButton.jsx
    │   │   └── UpdatedepartmentModal.jsx
    │   └── ui/              # Reusable UI primitives (Radix-based)
    │       ├── alert.jsx
    │       ├── avatar.jsx
    │       ├── badge.jsx
    │       ├── button.jsx
    │       ├── card.jsx
    │       ├── dialog.jsx
    │       ├── input.jsx
    │       ├── label.jsx
    │       ├── separator.jsx
    │       └── textarea.jsx
    ├── pages/
    │   ├── AdminLogin.jsx
    │   ├── AdminRegister.jsx
    │   ├── AdminProfile.jsx
    │   ├── AdminAppointmentPage.jsx
    │   ├── AppointmentDetails.jsx
    │   ├── DepartmentList.jsx
    │   ├── DoctorsList.jsx
    │   ├── doctorprofile.jsx
    │   ├── UpdateProfile.jsx
    │   ├── SendOtp.jsx
    │   ├── VerifyOtp.jsx
    │   └── ResetPassword.jsx
    └── lib/
        └── utils.js         # Tailwind classname merge utility
```

### 4.2 Application Bootstrap

```jsx
// Admin/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import store from './store/store.js';
import { Provider } from 'react-redux';
import App from './App.jsx';

const router = createBrowserRouter([ ... ]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
```

The app is wrapped with:
1. **React StrictMode** — for development checks
2. **Redux Provider** — makes the store available globally
3. **RouterProvider** — provides client-side routing

### 4.3 Routing Configuration

```jsx
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/',                    element: <AdminDashboard /> },
            { path: '/login',               element: <AdminLogin /> },
            { path: '/register',            element: <AdminRegister /> },
            { path: '/appointments/:appointmentid',
              element: <AuthLayout authentication={true}><AppointmentDetails /></AuthLayout> },
            { path: '/todayappointments',
              element: <AuthLayout authentication={true}><AdminAppointmentsPage /></AuthLayout> },
            { path: '/appointments',
              element: <AuthLayout authentication={true}><AdminAppointmentsPage /></AuthLayout> },
            { path: '/departments',
              element: <AuthLayout authentication={true}><AdminDepartmentList /></AuthLayout> },
            { path: '/departments/:deptname/doctors',
              element: <AuthLayout authentication={true}><DoctorList /></AuthLayout> },
            { path: '/doctors',
              element: <AuthLayout authentication={true}><DoctorList /></AuthLayout> },
            { path: '/doctors/:doctorid',
              element: <AuthLayout authentication={true}><AdminDoctorProfile /></AuthLayout> },
            { path: '/profile/updateprofile',
              element: <AuthLayout authentication={true}><AdminUpdateProfile /></AuthLayout> },
            { path: '/profile',
              element: <AuthLayout authentication={true}><AdminDoctorProfile /></AuthLayout> },
            { path: '/update-password',     element: <AdminSendOtp /> },
            { path: '/verify-otp',          element: <AdminVerifyOtp /> },
            { path: '/reset-password',      element: <AdminResetPassword /> },
            { path: '/forgot-password',     element: <AdminSendOtp /> },
        ],
    },
]);
```

**`AuthLayout`** is a higher-order component that wraps protected routes. When `authentication={true}`, it checks if the user is authenticated before rendering the child component.

### 4.4 State Management (Redux Toolkit)

The store is split into two slices:

#### Auth Slice — Handles authentication state

```javascript
// Admin/src/store/slices/authSlice.js
const initialState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false,   // Prevents flash before auth check completes
    loading: false,
    error: null,
};
```

Key state transitions:
- `getAdmin.fulfilled` → sets `isAuthenticated = true`, `isInitialized = true`
- `getAdmin.rejected` → sets `isInitialized = true` (app loads, but user is not logged in)
- `adminLogin.fulfilled` → sets `isAuthenticated = true`, stores user
- `adminLogout.fulfilled` → resets all auth state

#### Admin Slice — Handles business data

```javascript
// Admin/src/store/slices/adminSlice.js
const initialState = {
    admin: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    todayAppointments: [],
    allAppointments: [],
    appointmentDetails: null,
    doctors: [],
    doctorDetails: null,
    departments: [],
    updatePasswordOtpVerified: false,
    forgotPasswordOtpVerified: false,
};
```

Uses **global status matchers** for consistent loading/error handling:

```javascript
builder.addMatcher(isPending, (state) => {
    state.loading = true;
    state.error = null;
});
builder.addMatcher(isFulfilled, (state) => {
    state.loading = false;
});
builder.addMatcher(isRejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
});
```

### 4.5 API Service Layer

#### Axios Instance with Token Refresh Interceptor

```javascript
// Admin/src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1/admin",
    withCredentials: true,   // Sends cookies with every request
    timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip if not 401 or already retried
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Queue additional requests while refreshing
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: () => resolve(api(originalRequest)),
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.post("/renew-access-token");
            processQueue(null);
            isRefreshing = false;
            return api(originalRequest);  // Retry original request
        } catch (refreshError) {
            processQueue(refreshError);
            isRefreshing = false;
            return Promise.reject(refreshError);
        }
    }
);

export default api;
```

**Key features:**
- Automatic 401 interception → triggers token renewal
- Request queueing during token refresh (prevents race conditions)
- Retry of original request after successful refresh
- `withCredentials: true` ensures cookies are sent cross-origin

#### Redux Async Thunks

All API calls are encapsulated as Redux Toolkit `createAsyncThunk` actions:

```javascript
// Admin/src/services/adminApi.js
export const adminLogin = createAsyncThunk(
    "admin/login",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/login", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminGetAllAppointments = createAsyncThunk(
    "admin/allAppointments",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/appointments");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const adminCreateDepartment = createAsyncThunk(
    "admin/createDepartment",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post("/create-department", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
```

### 4.6 Authentication Flow in Admin

The root `App.jsx` component dispatches `getAdmin()` on mount to check if the user has a valid session:

```jsx
// Admin/src/App.jsx
const App = () => {
    const dispatch = useDispatch();
    const { isInitialized } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getAdmin());  // Checks cookie-based auth on load
    }, [dispatch]);

    if (!isInitialized) {
        return <div>Loading...</div>;  // Prevents flash
    }

    return (
        <main className="min-h-screen bg-gray-50 p-4">
            <Outlet />
        </main>
    );
};
```

### 4.7 UI Components

The Admin panel uses **Radix UI primitives** wrapped with Tailwind CSS styling via `class-variance-authority`:

- **Button** — Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Card** — Container with header, content, footer, title, description
- **Dialog** — Modal dialog for department updates
- **Input/Label/Textarea** — Form primitives
- **Avatar** — Profile picture display
- **Badge** — Status indicators for appointments
- **Alert** — Notification display
- **Separator** — Visual divider

---

## 5. Admin ↔ Backend Interaction

### 5.1 Authentication Flow (End-to-End)

```
┌──────────────────┐                           ┌──────────────────┐
│   Admin Frontend  │                           │     Backend      │
└────────┬─────────┘                           └────────┬─────────┘
         │                                              │
         │  1. POST /api/v1/admin/login                 │
         │  Body: { adminusername, password, adminsecret}│
         │─────────────────────────────────────────────> │
         │                                              │
         │          Verify password (bcrypt)             │
         │          Verify admin secret (bcrypt)         │
         │          Generate access + refresh tokens     │
         │          Set HTTP-only cookies                │
         │                                              │
         │  Response: { user, accesstoken, refreshtoken }│
         │<─────────────────────────────────────────────│
         │                                              │
         │  2. Redux dispatches adminLogin.fulfilled     │
         │     → authSlice: isAuthenticated = true       │
         │     → adminSlice: admin = user data           │
         │                                              │
         │  3. GET /api/v1/admin/get-admin              │
         │  Cookie: accesstoken=...                      │
         │─────────────────────────────────────────────> │
         │                                              │
         │  verifyadmin middleware:                      │
         │    Extract token from cookie                  │
         │    jwt.verify() → decode _id                  │
         │    Admin.findById() → attach to req.admin     │
         │                                              │
         │  Response: { admin data }                     │
         │<─────────────────────────────────────────────│
```

**Admin Frontend (login dispatch):**
```javascript
// In AdminLogin.jsx page
dispatch(adminLogin({
    adminusername: "johnadmin",
    password: "securePass123",
    adminsecret: "hospital_secret_key",
    email: "admin@hospital.com"
}));
```

**Backend (loginadmin controller):**
```javascript
const loginadmin = asyncHandler(async (req, res) => {
    const { adminusername, email, password, adminsecret } = req.body;

    const existedadmin = await Admin.findOne({
        $or: [{ adminusername }, { email }]
    });

    const ispasswordvalid = await existedadmin.ispasswordcorrect(password);
    const isadminsecretvalid = await existedadmin.isadminsecretcorrect(adminsecret);

    const { accesstoken, refreshtoken } = await generateaccesstokenandrefreshtoken(existedadmin._id);

    return res
        .status(200)
        .cookie("accesstoken", accesstoken, { httpOnly: true, secure: true, ... })
        .cookie("refreshtoken", refreshtoken, { httpOnly: true, secure: true, ... })
        .json(new apiResponse(200, { user: loggedinadmin, accesstoken, refreshtoken }, "Admin logged in"));
});
```

### 5.2 Department Management Flow

```
Admin Frontend                                    Backend
─────────────                                    ───────
│                                                  │
│  dispatch(adminCreateDepartment({                │
│    deptname: "cardiology",                       │
│    description: "Heart specialists"              │
│  }))                                             │
│                                                  │
│  POST /api/v1/admin/create-department            │
│────────────────────────────────────────────────> │
│  Cookie: accesstoken=...                         │
│                                                  │
│  [verifyadmin] → [createDepartment]              │
│  → Check duplicate → Department.create()         │
│                                                  │
│  Response: { _id, deptname, description }        │
│<────────────────────────────────────────────────│
│                                                  │
│  adminSlice: departments.push(newDept)           │
│                                                  │
│  dispatch(adminGetAllDepartments())              │
│  GET /api/v1/admin/departments                   │
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → [getAllDepartments]              │
│  → Department.find()                             │
│                                                  │
│  Response: [ {dept1}, {dept2}, ... ]             │
│<────────────────────────────────────────────────│
│                                                  │
│  adminSlice: departments = payload               │
│                                                  │
│  dispatch(adminUpdateDepartment({                │
│    id: "dept_id",                                │
│    payload: { deptname: "Cardiology Dept" }      │
│  }))                                             │
│  PATCH /api/v1/admin/update-department/:id       │
│────────────────────────────────────────────────> │
│                                                  │
│  Response: { updated department }                │
│<────────────────────────────────────────────────│
```

**Frontend dispatch:**
```javascript
// DepartmentList.jsx
dispatch(adminCreateDepartment({ deptname: "cardiology", description: "Heart and cardiovascular care" }));

// Fetch all departments
dispatch(adminGetAllDepartments());

// Update department
dispatch(adminUpdateDepartment({ id: "665a...", payload: { description: "Updated description" } }));
```

**Backend handler:**
```javascript
const updateDepartment = asyncHandler(async (req, res) => {
    const { deptname, description } = req.body;
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department) throw new apiError(404, "Department not found");

    if (deptname) department.deptname = deptname;
    if (description) department.description = description;
    await department.save();

    return res.status(200).json(new apiResponse(200, department, "Department updated"));
});
```

### 5.3 Doctor Management Flow

```
Admin Frontend                                    Backend
─────────────                                    ───────
│                                                  │
│  dispatch(adminGetAllDoctors())                  │
│  GET /api/v1/admin/doctors                       │
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → [getalldoctorprofiledetails]    │
│  → Doctor.find().select("doctorname              │
│     specialization department qualification       │
│     experience verificationdocument.profilepicture") │
│                                                  │
│  Response: [ {doctor1}, {doctor2}, ... ]         │
│<────────────────────────────────────────────────│
│                                                  │
│  dispatch(adminGetDoctorDetails("doctorid"))     │
│  GET /api/v1/admin/doctors/:doctorid             │
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → [getdoctorprofiledetails]       │
│  → Doctor.findById().select("-password           │
│     -refreshtoken -verificationdocument.aadhar   │
│     -verificationdocument.medicaldegree          │
│     -verificationdocument.medicallicense")       │
│                                                  │
│  Response: { doctor profile }                    │
│<────────────────────────────────────────────────│
│                                                  │
│  dispatch(adminGetDoctorsByDepartment("cardiology"))│
│  GET /api/v1/admin/departments/cardiology/doctors│
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → [getdoctorbydept]               │
│  → Doctor.find({ department: "cardiology" })     │
│                                                  │
│  Response: [ doctors in cardiology ]             │
│<────────────────────────────────────────────────│
```

### 5.4 Appointment Management Flow

```
Admin Frontend                                    Backend
─────────────                                    ───────
│                                                  │
│  dispatch(adminGetAllAppointments())             │
│  GET /api/v1/admin/appointments                  │
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → [getallappointmentforadmin]     │
│  → autoCancelExpiredAppointments()               │
│  → Appointment.find().select("patientdetails     │
│     doctordetails appointmenttime                │
│     appointmentdate status")                     │
│                                                  │
│  Response: [ all appointments ]                  │
│<────────────────────────────────────────────────│
│                                                  │
│  dispatch(getAppointments("appointmentid"))      │
│  GET /api/v1/admin/appointments/:appointmentid   │
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → [getappointment]                │
│  → Appointment.findById()                        │
│                                                  │
│  Response: { full appointment details }          │
│<────────────────────────────────────────────────│
```

**Frontend dispatch:**
```javascript
// AdminAppointmentPage.jsx
useEffect(() => {
    dispatch(adminGetAllAppointments());
}, [dispatch]);

// AppointmentDetails.jsx
useEffect(() => {
    dispatch(getAppointments(appointmentid));
}, [appointmentid]);
```

### 5.5 Profile Management Flow

```
Admin Frontend                                    Backend
─────────────                                    ───────
│                                                  │
│  dispatch(adminGetProfile())                     │
│  GET /api/v1/admin/get-profile                   │
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → Admin.findById(req.admin._id)   │
│    .select("-password -refreshtoken -adminsecret")│
│                                                  │
│  Response: { admin profile data }                │
│<────────────────────────────────────────────────│
│                                                  │
│  dispatch(adminUpdateProfile({                   │
│    adminname: "New Name",                        │
│    phonenumber: "9876543210"                     │
│  }))                                             │
│  PATCH /api/v1/admin/update-profile              │
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → Admin.findByIdAndUpdate()       │
│                                                  │
│  Response: { updated admin }                     │
│<────────────────────────────────────────────────│
│                                                  │
│  dispatch(adminUpdateProfilePic(formData))       │
│  PATCH /api/v1/admin/update-profilepicture       │
│  Content-Type: multipart/form-data               │
│────────────────────────────────────────────────> │
│                                                  │
│  [verifyadmin] → [multer] → [uploadcloudinary]   │
│  → Admin.findByIdAndUpdate({ profilepicture })   │
│                                                  │
│  Response: { updated admin with new pic URL }    │
│<────────────────────────────────────────────────│
```

### 5.6 Token Renewal (Interceptor-driven)

```
Admin Frontend                                    Backend
─────────────                                    ───────
│                                                  │
│  GET /api/v1/admin/appointments                  │
│  Cookie: accesstoken=<expired>                   │
│────────────────────────────────────────────────> │
│                                                  │
│  401 Unauthorized                                │
│<────────────────────────────────────────────────│
│                                                  │
│  [Axios interceptor catches 401]                 │
│  isRefreshing = true                             │
│  Queue any concurrent requests                   │
│                                                  │
│  POST /api/v1/admin/renew-access-token           │
│  Cookie: refreshtoken=<valid>                    │
│────────────────────────────────────────────────> │
│                                                  │
│  [accesstokenrenewal]                            │
│  → jwt.verify(refreshtoken)                      │
│  → Admin.findById() → compare refresh tokens     │
│  → Generate new access + refresh tokens          │
│  → Set new cookies                               │
│                                                  │
│  Response: { new accesstoken, refreshtoken }     │
│<────────────────────────────────────────────────│
│                                                  │
│  isRefreshing = false                            │
│  Process queued requests                         │
│  Retry original request with new cookie          │
│                                                  │
│  GET /api/v1/admin/appointments (retry)          │
│  Cookie: accesstoken=<new_valid>                 │
│────────────────────────────────────────────────> │
│                                                  │
│  200 OK + data                                   │
│<────────────────────────────────────────────────│
```

---

## 6. Database Schema

### 6.1 Admin Schema

```javascript
// Backend/src/models/admin.model.js
const adminDocumentSchema = new Schema({
    aadhar:            { type: String, required: true },
    adminId:           { type: String, required: true },
    profilepicture:    { type: String, required: true },
    appointmentletter: { type: String, required: true },
}, { _id: false });

const adminSchema = new Schema({
    adminname:        { type: String, required: true, trim: true },
    adminusername:    { type: String, required: true, unique: true, trim: true },
    email:            { type: String, required: true, unique: true, trim: true },
    password:         { type: String, maxlength: 15, minlength: 8, required: true, trim: true },
    phonenumber:      { type: Number, required: true, unique: true, trim: true },
    verificationdocs: { type: adminDocumentSchema, required: true },
    adminsecret:      { type: String, required: true, unique: true, trim: true },
    refreshtoken:     { type: String },
}, { timestamps: true });
```

**Pre-save hooks:**
- Password is hashed with bcrypt (salt rounds: 10) before save
- Admin secret is also hashed with bcrypt before save

**Instance methods:**
- `ispasswordcorrect(password)` → bcrypt compare
- `isadminsecretcorrect(adminsecret)` → bcrypt compare
- `generateaccesstoken()` → JWT with `{ _id, email, adminname, adminusername, role: "admin" }`
- `generaterefreshtoken()` → JWT with `{ _id }`

### 6.2 Doctor Schema

```javascript
// Backend/src/models/doctor.model.js
const doctorDocumentSchema = new Schema({
    aadhar:          { type: String, required: true },
    medicaldegree:   { type: String, required: true },
    medicallicense:  { type: String, required: true },
    profilepicture:  { type: String, required: true },
}, { _id: false });

const timeSchema = new Schema({
    day:         { type: String, required: true, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] },
    starttime:   { type: String, required: true, trim: true },
    endtime:     { type: String, required: true, trim: true },
    patientslot: { type: Number, required: true },
}, { _id: false });

const doctorSchema = new Schema({
    doctorname:           { type: String, required: true, trim: true, index: true },
    doctorusername:       { type: String, required: true, unique: true, trim: true, index: true },
    email:                { type: String, required: true, unique: true, trim: true },
    password:             { type: String, maxlength: 15, minlength: 8, required: true, trim: true },
    phonenumber:          { type: Number, required: true, maxlength: 10 },
    sex:                  { type: String, enum: ["Male", "Female", "Others"] },
    age:                  { type: Number, required: true },
    verificationdocument: { type: doctorDocumentSchema, required: true },
    experience:           { type: String, required: true },
    qualification:        { type: String, required: true },
    shift:                { type: [timeSchema], required: true },
    department:           { type: String, required: true },
    specialization:       { type: String, required: true },
    refreshtoken:         { type: String },
}, { timestamps: true });
```

**`shift` (Time Schema)** defines the doctor's weekly availability schedule. Each entry specifies the day of the week, start/end time, and number of patient slots. This is critical for the appointment availability algorithm.

### 6.3 Patient Schema

```javascript
// Backend/src/models/patient.model.js
const patientSchema = new Schema({
    patientname:     { type: String, required: true, trim: true, index: true },
    patientusername: { type: String, required: true, unique: true, trim: true, index: true },
    email:           { type: String, required: true, unique: true, trim: true },
    password:        { type: String, maxlength: 15, minlength: 8, required: true, trim: true },
    phonenumber:     { type: Number, required: true, maxlength: 10 },
    sex:             { type: String, required: true },
    age:             { type: Number, required: true },
    guardianName:    { type: String, trim: true },
    refreshtoken:    { type: String },
    profilepicture:  { type: String },
}, { timestamps: true });
```

### 6.4 Department Schema

```javascript
// Backend/src/models/dept.model.js
const deptSchema = new mongoose.Schema({
    deptname:    { type: String, required: true, index: true },
    description: { type: String, required: true },
}, { timestamps: true });
```

### 6.5 Appointment Schema

```javascript
// Backend/src/models/appointment.model.js
const appointmentSchema = new mongoose.Schema({
    patientdetails:  { type: mongoose.Schema.Types.Mixed, ref: 'Patient', required: true },
    doctordetails:   { type: mongoose.Schema.Types.Mixed, ref: 'Doctor', required: true },
    appointmentdate: { type: Date, required: true },
    appointmenttime: { type: String, required: true },
    symptoms:        { type: String, trim: true },
    medicalhistory:  { type: String },
    uniquecode:      { type: String, required: true, unique: true },
    status:          { type: String, enum: ['Pending','Confirmed','Cancelled','Completed'], default: 'Pending' },
    deleteafter:     { type: Date, default: null, index: { expireAfterSeconds: 0 } },
}, { timestamps: true });
```

**Key design decisions:**
- `patientdetails` and `doctordetails` use `Mixed` type (denormalized) — stores a snapshot of patient/doctor data at booking time
- `uniquecode` — auto-generated confirmation code the doctor uses to verify the patient's arrival
- `deleteafter` — uses MongoDB TTL index to auto-delete cancelled appointments after 24 hours
- Status lifecycle: `Pending → Confirmed → Completed` or `Confirmed → Cancelled`

### 6.6 Prescription Schema

```javascript
// Backend/src/models/prescription.model.js
const medicineSchema = new mongoose.Schema({
    medicinename: { type: String, required: true },
    dosage:       { type: String, required: true },
    frequency:    { type: String, required: true },
    duration:     { type: String, required: true },
});

const prescriptionSchema = new mongoose.Schema({
    appointmentid:  { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    doctordetails:  { type: mongoose.Schema.Types.Mixed, required: true },
    patientdetails: { type: mongoose.Schema.Types.Mixed, required: true },
    diagonosis:     { type: String, required: true },
    medicines:      { type: [medicineSchema], required: true },
    labtest:        { type: mongoose.Schema.Types.ObjectId, ref: "Labtest" },
}, { timestamps: true });
```

### 6.7 Lab Test Schema

```javascript
// Backend/src/models/labtest.model.js
const testResultSchema = new mongoose.Schema({
    test_name:  { type: String, required: true, trim: true },
    parameters: [{
        name:            { type: String, trim: true },
        value:           { type: String, trim: true },
        unit:            { type: String, trim: true },
        reference_range: { type: String, trim: true },
        status:          { type: String, enum: ["Normal","Low","High","Abnormal"], default: "Normal" },
    }],
    result_summary: { type: String, trim: true },
    remarks:        { type: String, trim: true },
    status:         { type: String, enum: ["ordered","processing","completed"], default: "ordered" },
}, { _id: false });

const labTestSchema = new mongoose.Schema({
    prescription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", required: true },
    patient_id:      { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor_id:       { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    tests:           { type: [testResultSchema], required: true },
    overall_status:  { type: String, enum: ["ordered","processing","completed"], default: "ordered" },
    report_date:     { type: Date, default: null },
    attachments:     [{ file_name: { type: String }, file_url: { type: String } }],
    verified_by:     { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
    verified_at:     { type: Date, default: null },
}, { timestamps: true });
```

### 6.8 Entity Relationship Summary

```
┌──────────┐      1:N       ┌──────────────┐       1:1      ┌───────────────┐
│  Patient  │───────────────>│  Appointment │───────────────>│  Prescription │
└──────────┘                └──────────────┘                └───────────────┘
                                   │                               │
                                   │ N:1                           │ 1:1
                                   ▼                               ▼
                            ┌──────────┐                    ┌───────────┐
                            │  Doctor  │                    │  Labtest  │
                            └──────────┘                    └───────────┘
                                   │
                                   │ N:1
                                   ▼
                            ┌────────────┐
                            │ Department │
                            └────────────┘

                            ┌──────────┐
                            │  Admin   │  (manages all entities)
                            └──────────┘
```

**Relationships:**
- **Patient → Appointments** (1:N) — A patient can book many appointments
- **Doctor → Appointments** (1:N) — A doctor handles many appointments
- **Appointment → Prescription** (1:1) — Each completed appointment can have one prescription
- **Prescription → Labtest** (1:1) — A prescription may reference one lab test order
- **Doctor → Department** (N:1) — Many doctors belong to one department (stored as string, not ObjectId reference)
- **Admin** — Has full read access to doctors, appointments, departments; can create/update departments

---

## 7. Cloudinary Setup & Usage

### 7.1 Configuration

Cloudinary is configured using environment variables for secure credential management:

```javascript
// Backend/src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:     true,   // Forces HTTPS URLs
});
```

**Required environment variables:**
```
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 7.2 Upload Utility

The upload function uses **stream-based uploading** directly from memory buffers (no temp files on disk):

```javascript
// Backend/src/utils/cloudinary.js
export const uploadcloudinary = async (buffer, folder = "hms") => {
    if (!buffer) return null;

    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder,                // Organizes files in Cloudinary folders
                    resource_type: "auto", // Detects image/pdf/etc automatically
                    secure: true,          // Returns HTTPS URLs
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(buffer);  // Pipe the buffer into the upload stream
        });

        return result;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw error;
    }
};
```

**How it works:**
1. Multer captures the uploaded file into memory (`req.file.buffer` or `req.files.fieldname[0].buffer`)
2. The buffer is passed directly to `uploadcloudinary()`
3. Cloudinary's `upload_stream` receives the buffer via a Node.js writable stream
4. On success, Cloudinary returns an object containing `secure_url`, `public_id`, etc.
5. The `secure_url` (HTTPS) is stored in the MongoDB document

### 7.3 Usage in Controllers

#### Admin Registration (Multiple Files)

```javascript
// admin.controller.js — registeradmin
const aadhar = await uploadcloudinary(req.files?.aadhar?.[0]?.buffer, "admin/aadhar");
const adminId = await uploadcloudinary(req.files?.adminId?.[0]?.buffer, "admin/admin-id");
const profilepicture = await uploadcloudinary(req.files?.profilepicture?.[0]?.buffer, "admin/profile-picture");
const appointmentletter = await uploadcloudinary(req.files?.appointmentletter?.[0]?.buffer, "admin/appointment-letter");

// Store Cloudinary URLs in MongoDB
const admin = await Admin.create({
    ...otherFields,
    verificationdocs: {
        aadhar: aadhar.secure_url,
        adminId: adminId.secure_url,
        profilepicture: profilepicture.secure_url,
        appointmentletter: appointmentletter.secure_url,
    },
});
```

#### Doctor Registration (Multiple Files)

```javascript
// doctor.controller.js — registerdoctor
const aadhar = await uploadcloudinary(req.files?.aadhar?.[0]?.buffer, "doctors/aadhar");
const medicaldegree = await uploadcloudinary(req.files?.medicaldegree?.[0]?.buffer, "doctors/medical-degree");
const medicallicense = await uploadcloudinary(req.files?.medicallicense?.[0]?.buffer, "doctors/medical-license");
const profilepicture = await uploadcloudinary(req.files?.profilepicture?.[0]?.buffer, "doctors/profile-picture");
```

#### Profile Picture Update (Single File)

```javascript
// admin.controller.js — updateprofilepic
const profilepicturelocalpath = req.file?.buffer;
const profilepicture = await uploadcloudinary(profilepicturelocalpath, "admin/profile-picture");

const updatedadmin = await Admin.findByIdAndUpdate(
    req.admin?._id,
    { $set: { profilepicture: profilepicture.url } },
    { new: true }
).select("-password -refreshtoken -adminsecret");
```

#### Patient Registration (Optional Single File)

```javascript
// patient.controller.js — registerPatient
let profilepicture;
if (req.file) {
    profilepicture = await uploadcloudinary(req.file.buffer, "patients/profile-pictures");
}

const patient = await Patient.create({
    ...otherFields,
    profilepicture: profilepicture?.secure_url || "",
});
```

### 7.4 Multer Integration (Memory Storage)

```javascript
// Backend/src/middlewares/multer.middleware.js
import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),   // Files stored in RAM as Buffer
    limits: { fileSize: 5 * 1024 * 1024 },  // 5MB per file limit
});
```

**Route-level usage:**

```javascript
// Single file upload
router.route("/update-profilepicture").patch(
    verifyadmin,
    upload.single("profilepicture"),     // req.file
    updateprofilepic
);

// Multiple named files
router.route("/register").post(
    upload.fields([
        { name: "aadhar", maxCount: 1 },        // req.files.aadhar[0]
        { name: "adminId", maxCount: 1 },        // req.files.adminId[0]
        { name: "profilepicture", maxCount: 1 }, // req.files.profilepicture[0]
        { name: "appointmentletter", maxCount: 1 } // req.files.appointmentletter[0]
    ]),
    registeradmin
);
```

### 7.5 Folder Structure on Cloudinary

```
hms/                          (default root)
├── admin/
│   ├── aadhar/               Admin Aadhar card scans
│   ├── admin-id/             Admin ID documents
│   ├── profile-picture/      Admin profile photos
│   └── appointment-letter/   Admin appointment letters
├── doctors/
│   ├── aadhar/               Doctor Aadhar card scans
│   ├── medical-degree/       Medical degree certificates
│   ├── medical-license/      Medical license documents
│   └── profile-picture/      Doctor profile photos
└── patients/
    └── profile-pictures/     Patient profile photos
```

---

## 8. Deployment Configuration

Both the Backend and Admin frontend are configured for **Vercel** deployment.

**Backend Vercel config:**
```json
// Backend/vercel.json
{
    // Serverless function configuration
    // Routes all requests to src/index.js handler
}
```

**Admin Vercel config (SPA routing):**
```json
// Admin/vercel.json
{
    // Rewrites all routes to index.html for client-side routing
}
```

**Environment variables required for Backend:**

| Variable | Purpose |
|----------|---------|
| `MONGODB_URL` | MongoDB Atlas connection string |
| `DB_NAME` | Database name |
| `ACCESS_TOKEN_SECRET` | JWT signing secret for access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime (e.g., "1d") |
| `REFRESH_TOKEN_SECRET` | JWT signing secret for refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime (e.g., "20d") |
| `ADMIN_SECRET` | Secret code required for admin registration |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ORIGIN_ADMIN` | Admin frontend URL |
| `CORS_ORIGIN_DOCTOR` | Doctor frontend URL |
| `CORS_ORIGIN_PATIENT` | Patient frontend URL |
| `NODE_ENV` | "development" or "production" |
| `PORT` | Server port (default: 5000) |

---

*Report generated for the Smart Hospital Management System (BIMS) — Backend v1.0.0, Admin Panel v0.0.0*
