# 🛡️ Anti-Ragging Portal

A comprehensive web-based complaint management system for colleges to prevent and manage ragging incidents. Built with Node.js, Express, MongoDB Atlas, and Bootstrap 5.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Default Admin Credentials](#-default-admin-credentials)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎓 Student Portal (No Login Required)

- **Submit Complaints Anonymously** - Report ragging incidents without fear
- **Track Complaint Status** - Check complaint progress using Complaint ID
- **File Evidence Upload** - Attach images, videos, audio, or PDFs
- **Emergency SOS Button** - One-click alert to administrators
- **Educational Resources** - Learn about anti-ragging rules, rights, and penalties

### 👨‍💼 Admin Portal (Secure Login)

- **Dashboard Overview** - Real-time statistics and analytics
- **Complaint Management** - View, filter, search, and manage complaints
- **Status Updates** - Change complaint status (Pending → In Review → Resolved)
- **Evidence Review** - View all uploaded files and documents
- **Action Reports** - Add detailed action taken reports
- **SOS Alert Management** - Handle emergency alerts
- **Activity Logging** - Track all admin actions
- **Data Export** - Export complaints to CSV, Excel, or PDF
- **Admin Profile** - Change password and manage profile
- **Analytics Dashboard** - Visual charts and trends

### 🔐 Security Features

- **Bcrypt Password Hashing** - Secure admin password storage
- **Session Management** - Express sessions for authentication
- **File Upload Validation** - Secure file handling with Multer
- **Anonymous Reporting** - Protect student identity
- **No Google Auth Required** - Simple, self-contained authentication

---

## 🛠 Tech Stack

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| **Node.js**       | Server-side JavaScript runtime |
| **Express.js**    | Web application framework      |
| **MongoDB Atlas** | Cloud database                 |
| **Mongoose**      | MongoDB object modeling        |
| **EJS**           | Templating engine              |
| **Bootstrap 5**   | Frontend UI framework          |
| **FontAwesome**   | Icon library                   |
| **Bcryptjs**      | Password hashing               |
| **Multer**        | File upload handling           |
| **ExcelJS**       | Excel file generation          |
| **PDFKit**        | PDF generation                 |
| **Nodemailer**    | Email notifications            |

---

## 📁 Project Structure

```
AARW/
├── config/
│   ├── database.js          # MongoDB connection
│   └── seedAdmin.js         # Admin seeding script
├── controllers/
│   ├── adminController.js   # Admin logic
│   ├── complaintController.js
│   └── sosController.js     # SOS alert logic
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # Multer configuration
├── models/
│   ├── Admin.js             # Admin schema
│   ├── Complaint.js         # Complaint schema
│   ├── ActivityLog.js       # Activity log schema
│   └── SOSAlert.js          # SOS alert schema
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   └── js/
│       ├── main.js
│       └── sos.js
├── routes/
│   ├── home.js              # Public routes
│   ├── admin.js             # Admin routes
│   ├── complaint.js         # Complaint routes
│   └── sos.js               # SOS routes
├── uploads/                 # File uploads directory
├── utils/
│   └── helpers.js           # Utility functions
├── views/
│   ├── admin/               # Admin views
│   ├── complaint/           # Complaint views
│   ├── static/              # Static pages
│   ├── home.ejs
│   ├── 404.ejs
│   └── error.ejs
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js                # Main entry point
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** (free tier available)
- **Git** (optional)

### Step 1: Clone or Download the Project

```powershell
# If using Git
git clone <repository-url>
cd AARW

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```powershell
npm install
```

This will install all required packages:

- express
- mongoose
- ejs
- bcryptjs
- multer
- express-session
- dotenv
- json2csv
- exceljs
- pdfkit
- nodemailer

### Step 3: Configure Environment Variables

The `.env` file is already created with your MongoDB connection string. Review and update if needed:

```env
PORT=3000
SESSION_SECRET=your-secret-key-change-this-in-production-12345
MONGODB_URI=mongodb+srv://phanikumar_265:5m0NfC9ifeQ8K8R5@cluster265.hm1jheb.mongodb.net/antiRaggingPortal?retryWrites=true&w=majority&appName=Cluster265

# Optional: Email Configuration for SOS Alerts
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
ALERT_EMAIL=admin@college.edu
```

**Important Security Notes:**

- Change `SESSION_SECRET` to a strong random string in production
- Keep `.env` file secure and never commit it to public repositories

### Step 4: Seed Admin Accounts

Create 5 default admin accounts in the database:

```powershell
npm run seed
```

You should see output like:

```
✓ Created admin: admin1 (Dr. Rajesh Kumar)
✓ Created admin: admin2 (Prof. Priya Sharma)
✓ Created admin: admin3 (Dr. Anil Verma)
✓ Created admin: dean (Dean Student Welfare)
✓ Created admin: warden (Chief Warden)
```

### Step 5: Start the Server

**Production Mode:**

```powershell
npm start
```

**Development Mode (with auto-restart):**

```powershell
npm run dev
```

You should see:

```
🚀 Server is running on http://localhost:3000
📊 Environment: development
MongoDB Connected: cluster265.hm1jheb.mongodb.net
```

### Step 6: Access the Portal

Open your browser and navigate to:

```
http://localhost:3000
```

---

## ⚙️ Configuration

### MongoDB Atlas Setup

Your MongoDB connection is already configured. If you need to modify it:

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Navigate to your cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Update `MONGODB_URI` in `.env` file

### Email Configuration (Optional)

For SOS alert email notifications:

1. **Gmail Setup:**

   - Enable 2-Factor Authentication
   - Generate an App Password
   - Update `.env`:
     ```env
     EMAIL_SERVICE=gmail
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-16-digit-app-password
     ALERT_EMAIL=admin@college.edu
     ```

2. **Other Email Services:**
   - Supported: Outlook, Yahoo, SendGrid, etc.
   - Update `EMAIL_SERVICE` accordingly

---

## 📖 Usage

### For Students

1. **Submit a Complaint:**

   - Go to homepage
   - Click "Submit Complaint"
   - Fill in the form (name optional for anonymity)
   - Upload evidence files (optional)
   - Submit and save your Complaint ID

2. **Track Complaint:**

   - Click "Track Complaint"
   - Enter your Complaint ID
   - View status and updates

3. **Emergency SOS:**
   - Click the red SOS button (bottom-right)
   - Confirm to send emergency alert
   - Alert sent to all administrators

### For Administrators

1. **Login:**

   - Go to Admin Login
   - Use credentials (see below)

2. **Dashboard:**

   - View statistics
   - Check recent complaints
   - Monitor SOS alerts

3. **Manage Complaints:**

   - View all complaints
   - Filter by status, severity
   - Update status
   - Add action reports
   - Download evidence

4. **Export Data:**

   - Export to CSV
   - Export to Excel
   - Export to PDF

5. **Change Password:**
   - Go to Profile
   - Enter current and new password
   - Save changes

---

## 🔑 Default Admin Credentials

| Username | Password      | Name                 |
| -------- | ------------- | -------------------- |
| `admin1` | `Admin@123`   | Dr. Rajesh Kumar     |
| `admin2` | `Admin@456`   | Prof. Priya Sharma   |
| `admin3` | `Admin@789`   | Dr. Anil Verma       |
| `dean`   | `Dean@2024`   | Dean Student Welfare |
| `warden` | `Warden@2024` | Chief Warden         |

**⚠️ IMPORTANT:** Change these passwords immediately after first login in production!

---

## 🔌 API Endpoints

### Public Routes

- `GET /` - Home page
- `GET /complaint/submit` - Complaint submission form
- `POST /complaint/submit` - Submit complaint
- `GET /complaint/track` - Track complaint form
- `POST /complaint/track` - Get complaint status
- `POST /sos/alert` - Trigger SOS alert

### Admin Routes (Authentication Required)

- `GET /admin/login` - Admin login page
- `POST /admin/login` - Authenticate admin
- `GET /admin/logout` - Logout admin
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/complaints` - List all complaints
- `GET /admin/complaints/:id` - View complaint details
- `POST /admin/complaints/:id/update` - Update complaint
- `POST /admin/complaints/:id/delete` - Delete complaint
- `GET /admin/analytics` - Analytics dashboard
- `GET /admin/sos-alerts` - View SOS alerts
- `GET /admin/activity-logs` - View activity logs
- `GET /admin/export/csv` - Export to CSV
- `GET /admin/export/excel` - Export to Excel
- `GET /admin/export/pdf` - Export to PDF

---

## 🎨 Customization

### Update College Information

1. **Edit Static Pages:**

   - `views/static/penalties.ejs`
   - `views/static/rules.ejs` (create similar to penalties)
   - `views/static/committee.ejs`
   - `views/static/contact.ejs`

2. **Update Contact Numbers:**

   - Find and replace `1800-XXX-XXXX` with actual helpline
   - Find and replace `+91-XXXX-XXXXXX` with actual security number

3. **Customize Colors:**
   - Edit `public/css/style.css`
   - Modify CSS variables in `:root` section

### Add More Admin Accounts

```powershell
# Option 1: Re-run seed script with updated data in config/seedAdmin.js
npm run seed

# Option 2: Add manually via MongoDB Atlas interface
```

---

## 🔍 Troubleshooting

### Common Issues

**1. "Cannot connect to MongoDB"**

```
Solution: Check your internet connection and MongoDB Atlas credentials
Verify the IP whitelist in MongoDB Atlas (0.0.0.0/0 for any IP)
```

**2. "Port 3000 is already in use"**

```powershell
# Change port in .env file
PORT=5000

# Or kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**3. "Session secret not found"**

```
Solution: Ensure .env file exists and contains SESSION_SECRET
```

**4. "File upload failed"**

```
Solution: Ensure uploads/ directory exists and has write permissions
Check file size (max 50MB) and file type
```

**5. "Admin login fails"**

```
Solution: Re-run seed script
npm run seed
```

---

## 📊 Database Schema

### Complaint Schema

```javascript
{
  complaintId: String (unique),
  studentName: String (default: 'Anonymous'),
  email: String (required),
  phone: String (required),
  title: String (required),
  description: String (required),
  location: String (required),
  severity: String (Low/Medium/High),
  isAnonymous: Boolean,
  evidenceFiles: Array,
  status: String (Pending/In Review/Resolved),
  adminNotes: String,
  actionTakenReport: String,
  publicRemarks: String,
  handledBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Support

For support, email: support@college.edu

---

## 🙏 Acknowledgments

- UGC Guidelines on Anti-Ragging
- Supreme Court Directives
- Bootstrap Team
- FontAwesome
- MongoDB Atlas
- Node.js Community

---

## 📝 Changelog

### Version 1.0.0 (Initial Release)

- ✅ Complete admin and student portals
- ✅ Complaint submission and tracking
- ✅ SOS emergency alerts
- ✅ Data export (CSV, Excel, PDF)
- ✅ Activity logging
- ✅ Anonymous reporting
- ✅ File upload support
- ✅ Analytics dashboard
- ✅ Mobile responsive design

---

## 🚀 Future Enhancements

- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Advanced analytics with charts
- [ ] Email notifications for complaint updates
- [ ] Mobile app version
- [ ] Integration with college ERP systems
- [ ] Automated report generation
- [ ] AI-based complaint categorization

---

## ⚡ Quick Start Commands

```powershell
# Install dependencies
npm install

# Seed admin accounts
npm run seed

# Start server (production)
npm start

# Start server (development with auto-restart)
npm run dev

# Access application
http://localhost:3000
```

---

**Made with ❤️ for a Ragging-Free Campus**

**Remember: Your Safety is Our Priority! 🛡️**
#   a n i t s - a n t i r a g g i n g - p o r t a l  
 