# 🩺 DocAppoint Server (Backend API)

This is the robust and production-ready backend server for the **DocAppoint** application. It handles user management, doctor profiles, and real-time appointment bookings utilizing **Express.js** and **MongoDB**.

---

## 🚀 Live Server URL
- **Production API URL:** `https://appoint-server-ten.vercel.app` 
- **Local Server URL:** `http://localhost:5000`

---

## 🛠️ Tech Stack & Architecture
- **Runtime Environment:** Node.js
- **Backend Framework:** Express.js
- **Database:** MongoDB (Native Driver Cluster)
- **Security & Utilities:** CORS, Dotenv, Nodemon

---

## 📋 API Endpoints Specification

### 🩺 Doctor Endpoints
* **`GET /doctors`** - Fetches all available doctor profiles from the database.
* **`GET /doctors/:id`** - Dynamic routing to parse and fetch details of a specific doctor using a 24-character MongoDB `_id`.

### 📅 Appointment Endpoints
* **`POST /appointments`** - Registers a new appointment. Automatically appends a `createdAt` timestamp.
* **`GET /appointments?email=user@example.com`** - Retrieves a filtered list of appointments belonging to a specific user via query parameter.
* **`PUT /appointments/:id`** - Modifies an existing appointment's core data (`patientName`, `patientPhone`, `selectedSlot`) and appends an `updatedAt` timestamp.
* **`DELETE /appointments/:id`** - Securely expunges an appointment record using its unique MongoDB ObjectId.

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory of the server project and configure the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
```

##💻 Installation
```
git clone https://github.com/Swarna-Saha324/PH-Assignment9-server
cd docappoint-server
npm install
```
Run development server:
```
npm run dev
```
Run production server:
```
npm start
```


