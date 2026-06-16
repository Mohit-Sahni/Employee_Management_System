# 👨‍💼 EmployeeHub-Pro

A modern, secure, and production-ready Employee Management System built with React, Node.js, Express, and MongoDB.

EmployeeHub-Pro streamlines HR operations by providing centralized employee management, attendance tracking, payroll processing, leave management, and advanced analytics through an intuitive enterprise-grade dashboard.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## ✨ Overview

EmployeeHub-Pro is designed to help organizations efficiently manage their workforce through a centralized HR platform.

The system simplifies day-to-day HR activities, improves operational efficiency, and provides actionable insights for better decision-making.

The platform focuses on:

* Employee Data Management
* Attendance Tracking
* Payroll Processing
* Leave Management
* Department Administration
* Performance Analytics
* Role-Based Access Control

---

## 🚀 Key Features

### 👤 Employee Management

* Add New Employees
* View Employee Profiles
* Update Employee Information
* Delete Employee Records
* Upload Profile Photos
* Manage Employee Documents
* Employee Search & Filters

### 🏢 Department Management

* Create Departments
* Edit Department Details
* Delete Departments
* Assign Department Managers
* Allocate Employees to Departments

### 📅 Attendance Management

* Daily Attendance Tracking
* Attendance Calendar
* Monthly Attendance Reports
* Work From Home Tracking
* Attendance Status Management

Attendance Status:

* Present
* Absent
* Leave
* Half Day
* Work From Home

### 💰 Payroll Management

* Salary Management
* Allowance Calculation
* Deduction Management
* Net Salary Calculation
* Payroll Reports
* Download Payslips

### 📝 Leave Management

* Apply for Leave
* Leave Approval Workflow
* Leave History
* Leave Balance Tracking

Leave Types:

* Sick Leave
* Casual Leave
* Earned Leave

### 📊 Dashboard & Analytics

* Total Employees Overview
* Active Employees
* New Hires
* Attendance Rate
* Monthly Payroll Summary
* Department Distribution Analytics
* Employee Growth Charts

### 🔒 Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Role-Based Access Control (RBAC)
* Session Management
* Input Validation & Sanitization
* Secure API Access

### 🛡 User Roles

* Super Admin
* HR Manager
* Employee

Each role has dedicated permissions and access levels.

### 🎨 User Experience

* Modern SaaS Dashboard
* Glassmorphism Design
* Dark & Light Mode
* Responsive Layout
* Interactive Charts
* Toast Notifications
* Loading Skeletons
* Empty States
* Error Handling

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt

### Data Visualization

* Recharts

### File Storage

* Cloudinary

---

## 🏗 System Architecture

Frontend → REST API → Express Server → MongoDB Database

### Application Flow

1. Admin creates employee accounts.
2. Employees securely access the platform.
3. HR managers manage attendance, payroll, and leave requests.
4. Employee data is securely stored in MongoDB.
5. Analytics dashboards provide real-time workforce insights.

---

## 📂 Folder Structure

```text
EmployeeHub-Pro/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       └── utils/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── screenshots/
├── README.md
└── .env.example
```

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Mohit-Sahni/EmployeeHub-Pro.git
```

### Navigate to Project Directory

```bash
cd EmployeeHub-Pro
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Run the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

### Start Frontend Server

```bash
cd frontend
npm start
```

Application URLs:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |
| POST   | `/api/auth/logout`   | Logout user         |

### Employees

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| GET    | `/api/employees`     | Get all employees    |
| GET    | `/api/employees/:id` | Get employee details |
| POST   | `/api/employees`     | Add employee         |
| PUT    | `/api/employees/:id` | Update employee      |
| DELETE | `/api/employees/:id` | Delete employee      |

### Departments

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/api/departments`     | Get all departments |
| POST   | `/api/departments`     | Create department   |
| PUT    | `/api/departments/:id` | Update department   |
| DELETE | `/api/departments/:id` | Delete department   |

### Attendance

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| GET    | `/api/attendance` | Get attendance records |
| POST   | `/api/attendance` | Mark attendance        |

### Payroll

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | `/api/payroll` | Get payroll records |
| POST   | `/api/payroll` | Generate payroll    |

### Leave Management

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/leaves`     | Get leave requests      |
| POST   | `/api/leaves`     | Apply for leave         |
| PUT    | `/api/leaves/:id` | Approve or reject leave |

---

## 📱 Responsive Design

The application is optimized for:

* Mobile Devices
* Tablets
* Laptops
* Desktop Screens

---

## 📸 Screenshots

Create a `screenshots` folder and add project images.

```text
screenshots/
├── login-page.png
├── dashboard.png
├── employee-list.png
├── attendance-page.png
├── payroll-page.png
├── analytics-dashboard.png
└── mobile-view.png
```

---

## 🔮 Future Enhancements

* Biometric Attendance
* Email Notifications
* AI-Powered HR Analytics
* Employee Performance Reviews
* Recruitment Management
* Interview Scheduling
* Multi-Company Support
* Mobile Application

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Mohit Sahni**

GitHub: https://github.com/Mohit-Sahni

If you found this project useful, consider giving it a ⭐ on GitHub.
