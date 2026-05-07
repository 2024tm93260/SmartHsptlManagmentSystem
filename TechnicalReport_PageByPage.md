# Smart Hospital Management System (BIMS)

## Technical Report — Page-by-Page UI Documentation

---

### Prepared for: MTech Semester 4 Project Submission

### System: BIMS (Bharat Integrated Medical System)

### Date: May 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Role-Based Access Control (RBAC)](#4-role-based-access-control-rbac)
5. [Admin Portal — Page-by-Page Details](#5-admin-portal)
6. [Doctor Portal — Page-by-Page Details](#6-doctor-portal)
7. [Patient Portal — Page-by-Page Details](#7-patient-portal)
8. [Authentication & Security Flow](#8-authentication--security-flow)
9. [Database Schema Design](#9-database-schema-design)
10. [Deployment Architecture](#10-deployment-architecture)

---

## 1. System Overview

The **Smart Hospital Management System (BIMS)** is a full-stack web application designed to digitize and streamline hospital operations. The system implements a Role-Based Access Control (RBAC) architecture serving three primary user roles — **Admin**, **Doctor**, and **Patient** — each with a dedicated frontend portal and shared backend API services.

### Key Capabilities

| Capability | Description |
|-----------|-------------|
| Multi-Role Authentication | JWT-based auth with access/refresh token rotation |
| Department Management | CRUD operations managed by Admin |
| Doctor Profile Management | Complete profiles with verification documents |
| Appointment Booking | Calendar-based slot selection with real-time availability |
| Prescription Management | Digital prescriptions with medicine details |
| Lab Test Tracking | Test results with parameter-level values and reference ranges |
| OTP-Based Password Recovery | Secure 6-digit OTP with 2-minute TTL |
| File Upload & Storage | Cloudinary-based document and image storage |
| Auto-Expiry | Automatic cancellation of expired appointments via TTL |

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend Runtime | Node.js (ES Modules) | Server-side JavaScript execution |
| Backend Framework | Express.js 5.x | REST API framework |
| Database | MongoDB (Mongoose 9.x) | Document-oriented data storage |
| Authentication | JSON Web Tokens (JWT) | Stateless token-based auth |
| Password Security | bcrypt 6.x | Password hashing with salt rounds |
| File Upload | Multer 2.x (memory storage) | Multipart form handling |
| Cloud Storage | Cloudinary 2.x | Image and document hosting |
| Frontend Framework | React 19.x | Component-based UI |
| State Management | Redux Toolkit | Centralized state with async thunks |
| HTTP Client | Axios | API communication with interceptors |
| CSS Framework | Tailwind CSS 4.x | Utility-first styling |
| UI Components | Radix UI + Lucide Icons | Accessible component primitives |
| Routing | React Router DOM 7.x | Client-side navigation |
| Build Tool | Vite 7.x | Fast development and bundling |
| Deployment | Vercel (Serverless) | Production hosting |

---

## 3. System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                               │
├──────────────────┬──────────────────┬──────────────────────────── ┤
│   Admin Portal   │  Doctor Portal   │      Patient Portal         │
│   (React SPA)    │  (React SPA)     │      (React SPA)            │
│   Port: 5173     │  Port: 5174      │      Port: 5175             │
└────────┬─────────┴────────┬─────────┴────────────┬───────────────┘
         │                  │                       │
         │          HTTPS (Axios + Cookies)         │
         │                  │                       │
┌────────▼──────────────────▼───────────────────────▼───────────────┐
│                      BACKEND API LAYER                             │
│                Express.js (Port: 5000)                             │
├───────────────────────────────────────────────────────────────────┤
│  Routes:  /api/v1/admin  |  /api/v1/doctor  |  /api/v1/patient   │
├───────────────────────────────────────────────────────────────────┤
│  Middleware: CORS | Cookie Parser | Auth (JWT) | Multer           │
├───────────────────────────────────────────────────────────────────┤
│  Controllers: Admin | Doctor | Patient | Appointment | Dept | Rx  │
└────────────────────────────────┬──────────────────────────────────┘
                                 │
         ┌───────────────────────┼────────────────────────┐
         │                       │                        │
┌────────▼────────┐   ┌─────────▼─────────┐   ┌─────────▼─────────┐
│    MongoDB       │   │    Cloudinary      │   │   SMTP (Gmail)    │
│  (Atlas Cloud)   │   │  (File Storage)    │   │  (Email Service)  │
└──────────────────┘   └───────────────────┘   └───────────────────┘
```

### Frontend Architecture (Per Portal)

```
┌─────────────────────────────────────────────┐
│              React Application               │
├─────────────────────────────────────────────┤
│  Pages (Route-level components)              │
├─────────────────────────────────────────────┤
│  Custom Components (Cards, Modals, Forms)    │
├─────────────────────────────────────────────┤
│  UI Library (Radix UI + Tailwind CSS)        │
├─────────────────────────────────────────────┤
│  Redux Store (Slices + Async Thunks)         │
├─────────────────────────────────────────────┤
│  API Service Layer (Axios + Interceptors)    │
└─────────────────────────────────────────────┘
```

---

## 4. Role-Based Access Control (RBAC)

### Role Comparison Matrix

| Feature | Admin | Doctor | Patient |
|---------|:-----:|:------:|:-------:|
| Register/Login | ✓ | ✓ | ✓ |
| 2FA (Admin Secret) | ✓ | ✗ | ✗ |
| Manage Departments | ✓ | ✗ | ✗ |
| View All Doctors | ✓ | ✗ | ✓ |
| View All Appointments | ✓ | Own Only | Own Only |
| Verify Appointments | ✗ | ✓ | ✗ |
| Create Prescriptions | ✗ | ✓ | ✗ |
| Book Appointments | ✗ | ✗ | ✓ |
| Cancel/Update Appointments | ✗ | ✗ | ✓ |
| View Prescriptions | ✗ | Own Created | Own Received |
| View Lab Tests | ✗ | ✗ | ✓ |
| Upload Verification Docs | ✓ | ✓ | ✗ |
| Password Reset (OTP) | ✓ | ✓ | ✓ |
| Profile Management | ✓ | ✓ | ✓ |

### Middleware-Based Access Enforcement

Each API route is guarded by role-specific JWT verification middleware:

| Middleware | Protects | Validates |
|-----------|----------|-----------|
| `verifyadmin` | `/api/v1/admin/*` | Admin JWT with role claim |
| `verifydoctor` | `/api/v1/doctor/*` | Doctor JWT with role claim |
| `verifypatient` | `/api/v1/patient/*` | Patient JWT with role claim |
| `verifyTempjwt` | Password reset routes | Temporary JWT (10-min expiry) |

---

## 5. Admin Portal

### Portal URL: `http://localhost:5173`

### Route Map

| Route | Page | Access |
|-------|------|--------|
| `/login` | Admin Login | Public |
| `/register` | Admin Registration | Public |
| `/` | Dashboard (Redirect) | Protected |
| `/appointments` | All Appointments | Protected |
| `/todayappointments` | Today's Appointments | Protected |
| `/appointments/:id` | Appointment Details | Protected |
| `/departments` | Department List | Protected |
| `/departments/:name/doctors` | Doctors by Department | Protected |
| `/doctors` | All Doctors | Protected |
| `/doctors/:id` | Doctor Profile | Protected |
| `/profile` | Admin Profile | Protected |
| `/profile/updateprofile` | Update Profile | Protected |

---

### Page 1: Admin Login

**Purpose:** Secure authentication entry point for hospital administrators.

**Layout:** Full-screen gradient background with a vertically centered login card (max-width 448px). A back navigation button is positioned at the top-left corner.

**Visual Elements:**
- Shield icon with "Admin Panel" branding and "Secure Login" subtitle
- Clean white card with shadow elevation

**Form Fields:**

| Field | Type | Validation | Icon |
|-------|------|-----------|------|
| Username / Email | Text | Required | Mail |
| Password | Password | Required | Lock |
| Admin Secret Key | Password | Required | Shield |

**User Interactions:**
- Enter credentials and admin secret key (2FA)
- Submit triggers JWT token generation
- Success redirects to Admin Dashboard
- Failure shows inline error alert

**Security Features:**
- Admin Secret Key provides additional two-factor authentication
- Password field is masked
- All actions are monitored (footer notice)

> **[Screenshot Placeholder: Admin Login Page]**

---

### Page 2: Admin Registration

**Purpose:** Self-registration for new administrators with document verification.

**Layout:** Full-page gradient with a large centered registration card. Two-column responsive form grid.

**Form Fields (Personal Information):**

| Field | Type | Validation |
|-------|------|-----------|
| Full Name | Text | Required |
| Username | Text | Required, unique |
| Email | Email | Required, unique |
| Phone Number | Tel | Required |
| Password | Password | Required, 8-15 chars |
| Admin Secret Key | Password | Required, must match server secret |

**Document Upload Section:**

| Document | Format | Required |
|----------|--------|----------|
| Aadhar Card | Image/PDF | Yes |
| Admin ID Card | Image/PDF | Yes |
| Profile Picture | Image | Yes |
| Appointment Letter | Image/PDF | Yes |

**User Interactions:**
- Fill all personal information fields
- Upload four required verification documents
- Submit sends multipart form data to backend
- Documents are uploaded to Cloudinary cloud storage
- Success redirects to Login page

> **[Screenshot Placeholder: Admin Registration Page]**

---

### Page 3: Admin Profile

**Purpose:** View personal profile information and administrative credentials.

**Layout:** Centered card (max-width 896px) with profile header section and information grid.

**Sections:**

1. **Profile Header**
   - Circular profile picture (128×128px) with Shield badge overlay
   - Full name as heading
   - Username badge and email display

2. **Information Grid (2 columns)**
   - Phone Number with Phone icon
   - Joined Date (formatted)
   - Role: "Hospital Administrator"
   - Department Access: "BIMS Administration"

3. **Action Buttons**
   - "Edit Profile" — navigates to profile editor
   - "Change Password" — initiates OTP-based password change

> **[Screenshot Placeholder: Admin Profile Page]**

---

### Page 4: All Appointments / Today's Appointments

**Purpose:** View and manage all hospital appointments or filter by today's date.

**Layout:** Full-page gradient with a single card containing a vertical scrollable list.

**Page Header:**
- Calendar icon with page title
- Total appointment count in description

**Per-Appointment Row:**

| Element | Description |
|---------|-------------|
| Avatar | Patient initials in colored circle |
| Patient Name | Bold primary text |
| Status Badge | Color-coded (Pending/Confirmed/Cancelled/Completed) |
| Time | Clock icon with appointment time |
| Action | "View Details" button with arrow |

**Status Color Coding:**

| Status | Color | Icon |
|--------|-------|------|
| Pending | Yellow/Amber | Clock |
| Confirmed | Green | CheckCircle |
| Cancelled | Red | XCircle |
| Completed | Blue | CheckCircle2 |

> **[Screenshot Placeholder: Admin Appointments List]**

---

### Page 5: Appointment Details

**Purpose:** View complete information about a specific appointment.

**Layout:** Centered card (max-width 896px) with multiple sections separated by horizontal dividers.

**Sections:**

1. **Header** — Status badge (color-coded) + Back button
2. **Doctor Information** — Doctor name and department (2-column grid)
3. **Schedule** — Appointment date (long format) and time
4. **Medical Details** — Symptoms and medical history in muted text boxes

> **[Screenshot Placeholder: Appointment Details Page]**

---

### Page 6: Department List

**Purpose:** View and manage all hospital departments.

**Layout:** Centered page with header section and responsive card grid (2-4 columns).

**Page Header:**
- "Departments" accent badge
- "Hospital Departments" heading
- Total department count

**Department Card:**
- Department name as card title
- Brief description
- Click navigates to department's doctor list

**Empty State:** Building icon with "No departments found" message

> **[Screenshot Placeholder: Department List Page]**

---

### Page 7: Doctors List

**Purpose:** Browse all registered doctors with search and department filtering.

**Layout:** Gradient page with search bar, result count row, and responsive doctor card grid.

**Features:**

| Feature | Description |
|---------|-------------|
| Search Bar | Real-time name-based filtering with clear button |
| Department Filter | Auto-applied when navigating from department page |
| Result Count | Shows "X doctors found" with Filter icon |
| Card Grid | Responsive auto-fill layout |

**Doctor Card Elements:**
- Profile picture
- Doctor name and department badge
- Specialization
- Click navigates to full doctor profile

> **[Screenshot Placeholder: Doctors List with Search]**

---

### Page 8: Doctor Profile (Admin View)

**Purpose:** View complete doctor profile including credentials and schedule.

**Layout:** Header banner with gradient background + 3-column grid below (1/3 sidebar + 2/3 main).

**Header Banner:**
- Large circular profile photo (128px)
- Doctor name, department badge, specialization badge
- Username and email

**Left Sidebar:**

| Card | Content |
|------|---------|
| Professional Stats | Years of experience (large number), Qualification text |
| Documents | Clickable links: Aadhar, Medical Degree, Medical License |

**Right Main Area:**

| Card | Content |
|------|---------|
| Personal Information | Phone, Age, Sex (2-column grid) |
| Shift Schedule | Weekly availability table |

> **[Screenshot Placeholder: Doctor Profile - Admin View]**

---

### Page 9: Update Profile

**Purpose:** Edit admin personal information and profile picture.

**Layout:** 3-column grid (1/3 left for picture, 2/3 right for form).

**Left Column — Profile Picture:**
- Current picture preview (circular, 128px)
- File input for new picture
- "Upload Picture" button (appears when file selected)

**Right Column — Information Form:**

| Field | Editable |
|-------|----------|
| Full Name | Yes |
| Email | Yes |
| Phone Number | Yes |

- "Save Changes" submit button with loading state

> **[Screenshot Placeholder: Admin Update Profile]**

---

### Page 10: Send OTP

**Purpose:** Initiate password recovery or password change via email OTP.

**Layout:** Centered card (max-width 448px) on gradient background.

**Two Modes:**

| Mode | Trigger | Email Field |
|------|---------|-------------|
| Forgot Password | Not logged in | Manual email input |
| Update Password | Logged in | Auto-filled (read-only) |

**Elements:**
- Shield badge with "Password Recovery" or "Update Password" title
- Instructional subtitle
- Email input (conditional)
- "Send OTP" button with spinner

> **[Screenshot Placeholder: Send OTP Page]**

---

### Page 11: Verify OTP

**Purpose:** Enter and verify the 6-digit OTP received via email.

**Layout:** Centered card (max-width 448px).

**Elements:**
- "OTP Verification" title with Shield badge
- Recipient email display (Mail icon)
- Orange notice: "OTP valid for 2 minutes"
- Large centered OTP input field (6 digits, wide character spacing)
- Live countdown timer (2:00 → 0:00)
- "Verify OTP" submit button
- "Resend OTP" button (enabled only after timer expires)

> **[Screenshot Placeholder: OTP Verification Page]**

---

### Page 12: Reset Password

**Purpose:** Set a new password after OTP verification.

**Layout:** Centered card (max-width 448px).

**Form Fields:**

| Mode | Fields Shown |
|------|-------------|
| Update (logged in) | Old Password + New Password + Confirm Password |
| Reset (forgot) | New Password + Confirm Password |

- All fields have Lock icons
- Submit button with spinner
- Success redirects to Profile (update) or Login (reset)

> **[Screenshot Placeholder: Reset Password Page]**

---

## 6. Doctor Portal

### Portal URL: `http://localhost:5174`

### Route Map

| Route | Page | Access |
|-------|------|--------|
| `/login` | Doctor Login | Public |
| `/register` | Doctor Registration | Public |
| `/` | Dashboard | Protected |
| `/appointments` | All Appointments | Protected |
| `/todayappointments` | Today's Appointments | Protected |
| `/appointments/:id` | Appointment Details | Protected |
| `/prescriptions` | All Prescriptions | Protected |
| `/prescriptions/:id` | Prescription Details | Protected |
| `/prescription/:appointmentid/createprescription` | Create Prescription | Protected |
| `/profile` | Doctor Profile | Protected |
| `/profile/updateprofile` | Update Profile | Protected |
| `/profile/updatepassword` | Password Change Flow | Protected |

---

### Page 1: Doctor Login

**Purpose:** Authentication for medical professionals.

**Layout:** Centered card (max-width 448px) on gradient background with Stethoscope branding.

**Form Fields:**

| Field | Type | Validation | Icon |
|-------|------|-----------|------|
| Email Address | Email | Required | Mail |
| Password | Password | Required | Lock |

**Additional Elements:**
- "Forgot Password?" link (right-aligned)
- "Login" submit button with spinner
- Link to registration page

> **[Screenshot Placeholder: Doctor Login Page]**

---

### Page 2: Doctor Registration

**Purpose:** Comprehensive registration for new doctors joining the hospital network.

**Layout:** Full-page gradient with a large multi-section registration card.

**Section 1 — Personal & Professional Information (2-column grid):**

| Field | Type | Validation |
|-------|------|-----------|
| Full Name | Text | Required |
| Username | Text | Required, alphanumeric + underscore |
| Email | Email | Required |
| Phone Number | Tel | Required |
| Password | Password | Required |
| Age | Number | Required |
| Sex | Dropdown (Male/Female/Others) | Required |
| Department | Dropdown (13 departments) | Required |
| Specialization | Text | Optional |
| Experience | Number (years) | Required |
| Qualification | Text | Required |

**Available Departments:**
General Medicine, Cardiology, Neurology, Orthopedics, Pediatrics, Dermatology, Gynecology, Ophthalmology, ENT, Psychiatry, Gastroenterology, Urology, Pulmonology

**Section 2 — Document Upload:**

| Document | Format | Required |
|----------|--------|----------|
| Aadhar Card | Image/PDF | Yes |
| Medical License | Image/PDF | Yes |
| Medical Degree Certificate | Image/PDF | Yes |
| Profile Picture | Image | Yes |

**Section 3 — Shift Management (Embedded Component):**

| Element | Description |
|---------|-------------|
| Day Selector | Dropdown (Monday–Sunday) |
| Start Time | Time picker |
| End Time | Time picker |
| Patient Slots | Number input |
| Add Button | Adds shift to schedule |
| Schedule List | Shows all added shifts with delete option |

> **[Screenshot Placeholder: Doctor Registration Page]**

---

### Page 3: Doctor Dashboard

**Purpose:** Central hub showing today's workload and quick navigation.

**Layout:** Full-page gradient with header bar, statistics row, and 2/3 + 1/3 column split.

**Components:**

| Component | Position | Content |
|-----------|----------|---------|
| Dashboard Header | Top | Personalized greeting, profile picture, navigation |
| Stats Overview | Below header | 3 statistic cards (total/today/pending appointments) |
| Today's Appointments | Left (2/3) | Scrollable list of today's scheduled patients |
| Quick Actions | Right top (1/3) | Shortcut buttons to key pages |
| Upcoming Schedule | Right bottom (1/3) | Preview of next few upcoming slots |

> **[Screenshot Placeholder: Doctor Dashboard]**

---

### Page 4: Doctor Profile

**Purpose:** View complete professional profile with credentials and availability.

**Layout:** Accent-gradient header banner + 3-column grid (1/3 + 2/3).

**Header Banner:**
- Profile photo (128px, circular)
- Name, username badge, department badge, specialization badge
- Email address

**Left Sidebar Cards:**

| Card | Content |
|------|---------|
| Professional Stats | Experience (large number), Qualification |
| Documents | Clickable links: Aadhar, Medical Degree, Medical License |

**Right Main Area Cards:**

| Card | Content |
|------|---------|
| Personal Information | Phone, Age, Sex |
| Shift Schedule | Weekly availability display |
| Actions | "Edit Profile" and "Change Password" buttons |

> **[Screenshot Placeholder: Doctor Profile Page]**

---

### Page 5: All Appointments

**Purpose:** View all appointments assigned to the doctor.

**Layout:** Single card with vertical scrollable appointment list.

**Per-Appointment Row:**

| Element | Description |
|---------|-------------|
| Avatar | Patient initials (colored circle) |
| Patient Name | Primary text |
| Status Badge | Color-coded status |
| Time | Appointment time with Clock icon |
| View Details | Ghost button → appointment detail |
| View Prescription | Ghost button → linked prescription |

> **[Screenshot Placeholder: Doctor Appointments List]**

---

### Page 6: Appointment Details (Doctor)

**Purpose:** View appointment details and verify/complete appointments.

**Layout:** Centered card (max-width 896px) with sections and action area.

**Sections:**
1. Status badge (color-coded) + Back button
2. Doctor Information (name, department)
3. Schedule (date, time)
4. Medical Details (symptoms, medical history)

**Doctor-Specific Actions:**

| Action | Condition | Description |
|--------|-----------|-------------|
| Verify Appointment | Appointment is today | Opens modal for patient code entry |
| Create Prescription | Status is "Completed" | Navigates to prescription form |

**Verification Modal:**
- Input field for patient's unique verification code
- "Confirm Verify" button
- Error message display

> **[Screenshot Placeholder: Appointment Details with Verify Action]**

---

### Page 7: All Prescriptions

**Purpose:** View all prescriptions created by this doctor.

**Layout:** Centered header with responsive 3-column card grid.

**Page Header:**
- "My Prescriptions" badge
- Total prescription count

**Prescription Card:**

| Element | Description |
|---------|-------------|
| Icon | Pill icon |
| Date | Creation date badge |
| Doctor | Issuing doctor name |
| Diagnosis | Preview text |
| Count | Number of medicines |
| Action | "View Details" button |

> **[Screenshot Placeholder: Prescriptions List]**

---

### Page 8: Create Prescription

**Purpose:** Create a new digital prescription for a completed appointment.

**Layout:** Centered card (max-width 896px) with multiple form sections.

**Guard:** If appointment status is not "Completed", shows a destructive alert and blocks access.

**Section 1 — Diagnosis:**
- Multi-line textarea for clinical diagnosis

**Section 2 — Medicines (Dynamic List):**

| Per-Medicine Fields | Type |
|-------------------|------|
| Medicine Name | Text input |
| Dosage | Text input (e.g., "500mg") |
| Frequency | Text input (e.g., "Twice daily") |
| Duration | Text input (e.g., "7 days") |

- "Add Medicine" button to add more entries
- Red "Remove" button per entry
- Minimum 1 medicine required

**Section 3 — Lab Test:**
- Optional text input for recommended lab test name

**Submit:** "Create Prescription" full-width button

> **[Screenshot Placeholder: Create Prescription Form]**

---

### Page 9: Prescription Details

**Purpose:** View complete prescription with edit and delete capabilities.

**Layout:** Centered card (max-width 896px) with sectioned layout.

**Sections:**
1. **Header** — Creation date badge, Back button
2. **Doctor Information** — Doctor name, department
3. **Diagnosis** — Highlighted text box
4. **Medicines List** — Numbered cards, each showing name, dosage, frequency, duration

**Doctor-Only Actions:**

| Action | Description |
|--------|-------------|
| Edit | Opens update modal with editable fields |
| Delete | Confirmation dialog → removes prescription |

> **[Screenshot Placeholder: Prescription Details]**

---

### Page 10: Update Profile (Doctor)

**Purpose:** Edit doctor profile including documents and shift schedule.

**Layout:** 3-column grid (1/3 sidebar + 2/3 main area).

**Left Sidebar:**

| Card | Content |
|------|---------|
| Profile Picture | Preview + file upload + "Upload" button |
| Documents | Medical Degree and License file inputs + "Update" button |

**Right Main Area:**

| Section | Fields |
|---------|--------|
| Personal Info | Name, Email, Phone, Age, Sex, Experience, Qualification, Specialization, Department |
| Shift Management | Full embedded shift editor (add/remove/edit shifts) |

- "Save Changes" submit button

> **[Screenshot Placeholder: Doctor Update Profile]**

---

### Page 11-13: OTP Flow (Send → Verify → Reset)

The Doctor portal uses the same OTP-based password management flow as the Admin portal:

1. **Send OTP** — Email input (or auto-filled), sends 6-digit OTP
2. **Verify OTP** — 6-digit input with 2-minute countdown timer
3. **Reset Password** — New password + confirmation

> **[Screenshot Placeholder: Doctor OTP Flow]**

---

### Page 14: Shift Management (Embedded Component)

**Purpose:** Define weekly availability schedule with patient slot capacity.

**Layout:** Two sections within a card — input form and current schedule list.

**Add New Schedule Form:**

| Field | Type | Description |
|-------|------|-------------|
| Day | Dropdown | Monday through Sunday |
| Start Time | Time picker | Shift start time |
| End Time | Time picker | Shift end time |
| Patient Slots | Number | Maximum patients per shift |

**Current Schedule Display:**
- Each shift shown as a row with Calendar icon
- Day name, time range, patient slots badge
- Red trash icon to remove individual shifts

> **[Screenshot Placeholder: Shift Management Component]**

---

## 7. Patient Portal

### Portal URL: `http://localhost:5175`

### Route Map

| Route | Page | Access |
|-------|------|--------|
| `/` | Home Page | Public |
| `/login` | Patient Login | Public |
| `/register` | Patient Registration | Public |
| `/departments` | Department List | Protected |
| `/departments/:name/doctors` | Doctors by Department | Protected |
| `/doctors` | All Doctors | Protected |
| `/doctors/:id` | Doctor Profile | Protected |
| `/appointments/book-appointment/:doctorid` | Book Appointment | Protected |
| `/appointments` | All Appointments | Protected |
| `/appointments/:id` | Appointment Details | Protected |
| `/appointments/updateAppointment/:id` | Update Appointment | Protected |
| `/prescriptions` | All Prescriptions | Protected |
| `/prescriptions/:id` | Prescription Details | Protected |
| `/labtests` | All Lab Tests | Protected |
| `/labtests/:id` | Lab Test Details | Protected |
| `/profile` | Patient Profile | Protected |
| `/profile/updateprofile` | Update Profile | Protected |
| `/profile/updatepassword` | Password Change Flow | Protected |

---

### Page 1: Home Page

**Purpose:** Hospital landing page with branding, services overview, and contact information.

**Layout:** Three stacked full-width sections — Hero, Reviews, FAQs.

**Hero Section (2-column layout):**

| Left Column | Right Column |
|-------------|--------------|
| Animated "24/7 Emergency Services" badge | Hospital facility photograph |
| "Welcome to BIMS Hospital" heading | Decorative gradient blur elements |
| Description paragraph | |
| Contact cards (address, phone) | |
| Statistics: 50+ Doctors, 15K+ Patients, 20+ Departments | |

**Reviews Section:**
- Patient testimonial cards with ratings

**FAQs Section:**
- Collapsible accordion with common questions and answers

**Navigation:**
- Global Navbar visible on all pages (Home, Departments, Doctors, Appointments, Profile)

> **[Screenshot Placeholder: Patient Home Page]**

---

### Page 2: Patient Login

**Purpose:** Secure patient authentication with a professional medical design.

**Layout:** Full-page gradient with dot-grid pattern. 2-column layout on desktop (left: branding, right: form).

**Left Branding Panel (Desktop Only):**
- BIMS logo + "Medical Center" subtitle
- "Welcome Back to Your Health Portal" heading
- Three feature cards: Secure Access, 24/7 Availability, Comprehensive Care

**Right Login Card:**

| Field | Type | Features |
|-------|------|----------|
| Email Address | Email | Mail icon, validation |
| Password | Password | Eye/EyeOff visibility toggle |

**Additional Elements:**
- "Forgot Password?" link
- "Login" primary button with arrow icon
- "Register" link for new patients

> **[Screenshot Placeholder: Patient Login Page]**

---

### Page 3: Patient Registration

**Purpose:** New patient account creation with optional profile picture.

**Layout:** Gradient page with centered registration card. Profile picture upload at top, 2-column form grid below.

**Profile Picture Section:**
- Circular preview area (124px)
- Upload button overlay
- Real-time image preview

**Form Fields:**

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Full Name | Text | Min 2 chars | Yes |
| Username | Text | Alphanumeric + underscore | Yes |
| Email | Email | Pattern validation | Yes |
| Phone Number | Tel | Numeric pattern | Yes |
| Password | Password | Min 8 chars | Yes |
| Age | Number | 1-120 range | Yes |
| Gender | Dropdown (Male/Female/Other) | — | Yes |
| Guardian Name | Text | — | No (recommended for <18) |

> **[Screenshot Placeholder: Patient Registration Page]**

---

### Page 4: Patient Profile

**Purpose:** View personal health profile information.

**Layout:** Centered card (max-width 896px) with profile header and info grid.

**Profile Header:**
- Circular profile picture (128px) with User badge
- Full name heading
- Username badge, email with Mail icon

**Information Grid (2 columns):**

| Field | Icon |
|-------|------|
| Phone Number | Phone |
| Age | Calendar |
| Sex/Gender | User |
| Guardian Name | Users (if present) |

**Action Buttons:**
- "Edit Profile" (primary button)
- "Change Password" (outline button)

> **[Screenshot Placeholder: Patient Profile Page]**

---

### Page 5: Department List

**Purpose:** Browse all hospital departments to find relevant doctors.

**Layout:** Centered header section + responsive 4-column card grid.

**Elements:**
- "Medical Departments" badge
- "Our Departments" heading with total count
- Department cards with name and description
- Click navigates to department's doctor list

> **[Screenshot Placeholder: Department List - Patient View]**

---

### Page 6: Doctors List

**Purpose:** Browse and search doctors by name or department.

**Layout:** Gradient page with search functionality and responsive card grid.

**Features:**
- Department filter (when accessed from department page)
- Name search bar with real-time filtering
- Result count display
- Doctor cards showing profile picture, name, department, specialization

> **[Screenshot Placeholder: Doctors List - Patient View]**

---

### Page 7: Doctor Profile (Patient View)

**Purpose:** View doctor information and book appointments.

**Layout:** Gradient page with header banner, quick stats row, and detailed sections.

**Header Banner:**
- Large profile photo with green "Available" badge
- Doctor name, department + specialization badges

**Quick Stats Row (3 boxes):**

| Stat | Icon | Display |
|------|------|---------|
| Experience | Briefcase | "X Years" |
| Qualification | Award | Degree text |
| Specialist | GraduationCap | "Expert" |

**Professional Details (2-column grid):**
- Department, Specialization, Experience, Qualification

**Contact Information:**
- Email (clickable mailto link)
- Phone (clickable tel link)

**Call-to-Action:**
- "Book Appointment" full-width primary button at bottom

> **[Screenshot Placeholder: Doctor Profile - Patient View]**

---

### Page 8: Book Appointment

**Purpose:** Schedule a new appointment with date/time slot selection.

**Layout:** Gradient page with 2-column grid (left: calendar, right: form).

**Left Column — Date Selection:**
- Interactive calendar component (`react-calendar`)
- Past dates are disabled (greyed out)
- Dates without available slots are disabled
- Selected date shows confirmation alert
- Month navigation arrows

**Right Column — Appointment Form:**

| Section | Content |
|---------|---------|
| Symptoms | Textarea (required) — describe current symptoms |
| Medical History | Textarea (optional) — relevant past conditions |
| Available Slots | Grid of clickable time buttons (shown after date selection) |
| Submit | "Book Appointment" button (enabled when date + slot selected) |

**Slot Display:**
- Time buttons arranged in a grid
- Unselected: outline style
- Selected: filled primary style
- Unavailable: hidden/disabled

> **[Screenshot Placeholder: Book Appointment Page]**

---

### Page 9: All Appointments

**Purpose:** View all booked appointments with status tracking.

**Layout:** Centered header + responsive 3-column card grid.

**Page Header:**
- "My Appointments" badge
- Total appointment count

**Appointment Card:**

| Element | Description |
|---------|-------------|
| Date | Appointment date (formatted) |
| Time | Appointment time |
| Doctor | Doctor name |
| Status Badge | Color-coded (Pending/Confirmed/Cancelled/Completed) |
| Click | Navigates to full details |

**Empty State:**
- Calendar icon
- "No appointments found" message
- "Browse Doctors" navigation button

> **[Screenshot Placeholder: Patient Appointments List]**

---

### Page 10: Appointment Details (Patient)

**Purpose:** View appointment information with options to reschedule or cancel.

**Layout:** Centered card (max-width 896px) with multiple sections.

**Sections:**
1. **Status** — Color-coded badge in header
2. **Doctor Information** — Doctor name, department
3. **Schedule** — Date (long format), time
4. **Medical Information** — Symptoms, medical history

**Patient Actions:**

| Action | Button Style | Condition |
|--------|-------------|-----------|
| Update Appointment | Primary | Not Cancelled/Completed |
| Cancel Appointment | Destructive (Red) | Not Cancelled/Completed |

**Cancel Confirmation:**
- Modal dialog with warning message
- "Confirm Cancel" destructive button
- "Go Back" ghost button

> **[Screenshot Placeholder: Patient Appointment Details]**

---

### Page 11: Update Appointment (Reschedule)

**Purpose:** Reschedule an existing appointment to a new date/time.

**Layout:** Identical 2-column layout as Book Appointment page.

**Differences from Booking:**
- Symptoms and Medical History are pre-populated with existing values
- Calendar shows same doctor's availability
- Submit updates the existing appointment instead of creating new

> **[Screenshot Placeholder: Update Appointment Page]**

---

### Page 12: All Prescriptions

**Purpose:** View all prescriptions received from doctors.

**Layout:** Centered header + 3-column responsive card grid.

**Prescription Card:**

| Element | Description |
|---------|-------------|
| Icon | Pill icon |
| Date | Prescription creation date |
| Doctor | Prescribing doctor name |
| Diagnosis | Preview text (truncated) |
| Medicine Count | Number badge |
| Action | "View Details" button |

> **[Screenshot Placeholder: Patient Prescriptions List]**

---

### Page 13: Prescription Details (Patient — Read Only)

**Purpose:** View complete prescription information.

**Layout:** Centered card (max-width 896px), read-only view.

**Sections:**
1. **Header** — Date badge (no edit/delete actions for patients)
2. **Doctor Information** — Doctor name, department
3. **Diagnosis** — Highlighted text box (primary/5 background)
4. **Medications** — Numbered medicine cards

**Per-Medicine Card:**

| Field | Display |
|-------|---------|
| Medicine Name | Bold heading |
| Dosage | e.g., "500mg" |
| Frequency | e.g., "Twice daily" |
| Duration | e.g., "7 days" |

> **[Screenshot Placeholder: Prescription Details - Patient View]**

---

### Page 14: All Lab Tests

**Purpose:** View all lab tests ordered by doctors.

**Layout:** Centered header + 3-column responsive card grid.

**Lab Test Card:**

| Element | Description |
|---------|-------------|
| Icon | Flask/Conical icon |
| Status Badge | Ordered (Yellow) / Processing (Blue) / Completed (Green) |
| Test Count | Number of individual tests |
| Report Date | Date if available |
| Verified | Green badge if verified |
| Action | "View Details" button |

> **[Screenshot Placeholder: Lab Tests List]**

---

### Page 15: Lab Test Details

**Purpose:** View detailed lab test results with parameter-level analysis.

**Layout:** Centered card (max-width 896px) with header and test result sections.

**Header:**
- Overall status badge (color-coded)
- Report date box
- Verification status (green checkmark if verified)

**Per-Test Result Card:**
- Test name + individual status badge
- Scrollable parameters table:

| Column | Description |
|--------|-------------|
| Parameter | Test parameter name |
| Value | Measured value |
| Unit | Measurement unit |
| Reference Range | Normal range |
| Status | Normal (green) / High (red) / Low (yellow) badge |

> **[Screenshot Placeholder: Lab Test Details with Parameters]**

---

### Page 16: Update Profile (Patient)

**Purpose:** Edit personal profile information and profile picture.

**Layout:** Centered card (max-width 896px) with picture section and form grid.

**Profile Picture Section:**
- Current picture preview (128px, circular)
- File input with "Upload" button

**Form Fields:**

| Field | Editable |
|-------|----------|
| Full Name | Yes |
| Username | No (disabled) |
| Email | Yes |
| Phone Number | Yes |
| Age | Yes |
| Sex/Gender | Yes |
| Guardian Name | Yes |

- "Save Changes" submit button

> **[Screenshot Placeholder: Patient Update Profile]**

---

### Pages 17-19: OTP Password Flow

Same 3-step flow as Admin and Doctor portals:

1. **Send OTP** — Enter email → receive 6-digit code
2. **Verify OTP** — Enter code within 2-minute window
3. **Reset Password** — Set new password

> **[Screenshot Placeholder: Patient OTP Flow]**

---

## 8. Authentication & Security Flow

### JWT Token Lifecycle

```
┌──────────────┐     Login      ┌──────────────┐
│   Client     │ ──────────────►│   Server     │
│              │                 │              │
│              │◄────────────── │              │
│              │  Access Token   │              │
│              │  (1 day expiry) │              │
│              │  Refresh Token  │              │
│              │  (20 day expiry)│              │
└──────┬───────┘                └──────────────┘
       │
       │  API Request (Access Token in Cookie)
       │
       ▼  If 401 (Expired)
┌──────────────┐                ┌──────────────┐
│   Axios      │  Refresh Call  │   Server     │
│  Interceptor │ ──────────────►│ /renew-token │
│              │◄────────────── │              │
│              │  New Tokens    │              │
│              │                │              │
│  Retry       │                │              │
│  Original    │                │              │
│  Request     │                │              │
└──────────────┘                └──────────────┘
```

### Cookie Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| httpOnly | true | Prevents XSS access to tokens |
| secure | true (production) | HTTPS-only transmission |
| sameSite | "None" (production) / "Lax" (dev) | Cross-origin request handling |
| path | "/" | Available on all routes |
| maxAge (access) | 1 day | Short-lived access |
| maxAge (refresh) | 20 days | Long-lived refresh capability |

### Password Reset OTP Flow

```
Step 1: Request OTP
  User → [Email] → Server generates:
    - 6-digit OTP (stored in memory, 2-min TTL)
    - Temporary JWT (10-min expiry with user ID + role)

Step 2: Verify OTP
  User → [OTP + Temp JWT] → Server validates:
    - Temp JWT is valid and not expired
    - OTP matches stored value
    - Clears OTP from memory

Step 3: Reset Password
  User → [New Password + Temp JWT] → Server:
    - Verifies Temp JWT
    - Hashes new password (bcrypt)
    - Updates user record
```

---

## 9. Database Schema Design

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────────┐         ┌──────────────┐
│   Admin     │         │   Department     │         │   Doctor     │
├─────────────┤         ├─────────────────┤         ├──────────────┤
│ _id         │         │ _id             │◄────────│ department   │
│ adminname   │         │ deptname        │         │ _id          │
│ adminuser   │         │ description     │         │ doctorname   │
│ email       │         └─────────────────┘         │ email        │
│ password    │                                      │ shift[]      │
│ adminsecret │                                      │ documents{}  │
│ documents{} │                                      └──────┬───────┘
│ refreshtoken│                                             │
└─────────────┘                                             │
                                                            │ treats
                                                            ▼
┌──────────────┐        ┌─────────────────┐         ┌──────────────┐
│   Patient    │        │  Appointment     │         │ Prescription │
├──────────────┤        ├─────────────────┤         ├──────────────┤
│ _id          │◄──────►│ patientdetails  │         │ _id          │
│ patientname  │        │ doctordetails   │◄───────►│ appointmentId│
│ email        │        │ date/time       │         │ diagnosis    │
│ password     │        │ symptoms        │         │ medicines[]  │
│ age/sex      │        │ status          │         │ doctor       │
│ profilepic   │        │ uniquecode      │         │ patient      │
│ refreshtoken │        │ deleteafter(TTL)│         └──────┬───────┘
└──────────────┘        └─────────────────┘                │
                                                           │ orders
                                                           ▼
                                                    ┌──────────────┐
                                                    │   Lab Test   │
                                                    ├──────────────┤
                                                    │ _id          │
                                                    │ prescriptionId│
                                                    │ tests[]      │
                                                    │ status       │
                                                    │ reportDate   │
                                                    │ verified     │
                                                    └──────────────┘
```

### Schema Summary Table

| Model | Key Fields | Unique Constraints | Special Features |
|-------|-----------|-------------------|-----------------|
| Admin | adminname, email, password, adminsecret, verificationdocs | email, adminusername | 2FA with adminsecret, 4 verification documents |
| Doctor | doctorname, email, shift[], verificationdocument | email, doctorusername | Weekly shift scheduling, 4 documents |
| Patient | patientname, email, age, sex, guardianName | email, patientusername | Optional profile picture, guardian info |
| Department | deptname, description | deptname | Lookup table for doctor departments |
| Appointment | patientdetails, doctordetails, date, time, status, uniquecode | uniquecode | TTL auto-delete, status enum, verification code |
| Prescription | appointmentId, diagnosis, medicines[], doctor, patient | — | Dynamic medicine array, linked to appointment |
| Lab Test | prescriptionId, tests[], status, reportDate, verified | — | Nested test parameters with reference ranges |

---

## 10. Deployment Architecture

### Production Deployment (Vercel)

| Component | Platform | URL Pattern |
|-----------|----------|-------------|
| Backend API | Vercel Serverless Functions | `api.bims.vercel.app` |
| Admin Portal | Vercel Static | `admin.bims.vercel.app` |
| Doctor Portal | Vercel Static | `doctor.bims.vercel.app` |
| Patient Portal | Vercel Static | `patient.bims.vercel.app` |
| Database | MongoDB Atlas | Cloud-hosted cluster |
| File Storage | Cloudinary | CDN-backed media storage |

### Environment Variables Required

| Variable | Purpose |
|----------|---------|
| MONGODB_URL | MongoDB Atlas connection string |
| DB_NAME | Database name |
| ACCESS_TOKEN_SECRET | JWT signing key (access tokens) |
| REFRESH_TOKEN_SECRET | JWT signing key (refresh tokens) |
| ADMIN_SECRET | Admin registration verification |
| CLOUDINARY_CLOUD_NAME | Cloudinary account name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| SENDER_EMAIL | Gmail SMTP sender address |
| APP_PASSWORD | Gmail App Password for SMTP |
| CORS_ORIGIN_ADMIN | Admin frontend URL |
| CORS_ORIGIN_DOCTOR | Doctor frontend URL |
| CORS_ORIGIN_PATIENT | Patient frontend URL |
| NODE_ENV | "development" or "production" |

---

## Appendix A: Cross-Cutting UI Design Patterns

| Pattern | Implementation |
|---------|---------------|
| Color Scheme per Role | Admin: Purple/Indigo gradient, Doctor: Teal/Green gradient, Patient: Blue/Cyan gradient |
| Page Background | Role-specific gradient (`admin-page-gradient`, `doctor-page-gradient`, `patient-page-gradient`) |
| Cards | White cards with 0-border and xl-shadow elevation |
| Status Badges | Yellow (Pending), Green (Confirmed/Completed), Red (Cancelled), Blue (Processing) |
| Form Validation | Inline red error messages below fields with AlertCircle icon |
| Loading States | Loader2 spinning icon with descriptive text |
| Empty States | Large muted icon + text message + action button |
| Navigation | Ghost "Back" button (top-left) on all sub-pages |
| Responsive Design | Mobile-first, single column on small screens, multi-column grid on desktop |
| Icon Library | Lucide React (consistent stroke-style icons) |

---

## Appendix B: API Endpoints Summary

### Admin Endpoints (`/api/v1/admin`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /register | Admin registration | Public |
| POST | /login | Admin login (2FA) | Public |
| POST | /logout | Logout | Admin |
| POST | /renew-access-token | Token refresh | Public (refresh cookie) |
| GET | /get-admin | Auth check | Admin |
| GET | /get-profile | Full profile | Admin |
| PATCH | /update-profile | Update info | Admin |
| PATCH | /update-profilepicture | Update photo | Admin |
| PATCH | /update-password | Change password | Admin |
| POST | /forgot-password/send-otp | Request reset OTP | Public |
| POST | /forgot-password/verify-otp | Verify reset OTP | TempJWT |
| PATCH | /forgot-password/update-password | Reset password | TempJWT |
| GET | /todayappointments | Today's list | Admin |
| GET | /appointments | All appointments | Admin |
| GET | /doctors | All doctors | Admin |
| GET | /departments | All departments | Admin |
| POST | /departments | Create department | Admin |
| PATCH | /departments/:id | Update department | Admin |

### Doctor Endpoints (`/api/v1/doctor`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /register | Doctor registration | Public |
| POST | /login | Doctor login | Public |
| POST | /logout | Logout | Doctor |
| POST | /renew-access-token | Token refresh | Public |
| GET | /get-doctor | Auth check | Doctor |
| GET | /profile | Full profile | Doctor |
| PATCH | /update-profile | Update info | Doctor |
| PATCH | /update-profilepicture | Update photo | Doctor |
| PATCH | /update-document | Update docs | Doctor |
| PATCH | /update-password | Change password | Doctor |
| POST | /forgot-password/send-otp | Request reset OTP | Public |
| POST | /forgot-password/verify-otp | Verify reset OTP | TempJWT |
| PATCH | /forgot-password/update-password | Reset password | TempJWT |
| GET | /todayappointments | Today's list | Doctor |
| GET | /appointments | All appointments | Doctor |
| GET | /prescriptions | All prescriptions | Doctor |
| POST | /prescriptions/:appointmentid | Create prescription | Doctor |
| PATCH | /prescriptions/:id | Update prescription | Doctor |
| DELETE | /prescriptions/:id | Delete prescription | Doctor |

### Patient Endpoints (`/api/v1/patient`)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /register | Patient registration | Public |
| POST | /login | Patient login | Public |
| POST | /logout | Logout | Patient |
| POST | /renew-access-token | Token refresh | Public |
| GET | /get-patient | Auth check | Patient |
| GET | /get-profile | Full profile | Patient |
| PATCH | /update-profile | Update info | Patient |
| PATCH | /update-profilepicture | Update photo | Patient |
| PATCH | /update-password | Change password | Patient |
| POST | /forgot-password/send-otp | Request reset OTP | Public |
| POST | /forgot-password/verify-otp | Verify reset OTP | TempJWT |
| PATCH | /forgot-password/update-password | Reset password | TempJWT |
| GET | /doctors | All doctors | Patient |
| GET | /doctors/:id | Doctor profile | Patient |
| GET | /departments | All departments | Patient |
| GET | /departments/:name/doctors | Doctors by dept | Patient |
| GET | /appointments | My appointments | Patient |
| POST | /appointments/book-appointment/:doctorid | Book appointment | Patient |
| PATCH | /appointments/updateappointment/:id | Reschedule | Patient |
| PATCH | /appointments/cancelAppointment/:id | Cancel | Patient |
| GET | /appointments/availability | Slot availability | Patient |
| GET | /prescriptions | My prescriptions | Patient |
| GET | /prescriptions/:id | Prescription detail | Patient |
| GET | /labtests | My lab tests | Patient |
| GET | /labtests/:id | Lab test detail | Patient |

---

*End of Technical Report*
