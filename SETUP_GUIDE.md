# 🚀 Quick Setup Guide - Anti-Ragging Portal

## ⚡ Fast Setup (5 Minutes)

Follow these steps to get your portal running quickly:

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/
2. Install the LTS (Long Term Support) version
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Install Dependencies

Open PowerShell in the project folder:

```powershell
cd "C:\Users\user\OneDrive\Desktop\AARW"
npm install
```

Wait for all packages to download and install (takes 2-3 minutes).

### Step 3: Seed Admin Accounts

Create default admin accounts in the database:

```powershell
npm run seed
```

You should see:

```
✓ Created admin: admin1 (Dr. Rajesh Kumar)
✓ Created admin: admin2 (Prof. Priya Sharma)
✓ Created admin: admin3 (Dr. Anil Verma)
✓ Created admin: dean (Dean Student Welfare)
✓ Created admin: warden (Chief Warden)
```

### Step 4: Start the Server

```powershell
npm start
```

You should see:

```
🚀 Server is running on http://localhost:3000
📊 Environment: development
MongoDB Connected: cluster265.hm1jheb.mongodb.net
```

### Step 5: Access the Portal

Open your web browser and go to:

```
http://localhost:3000
```

---

## 🔐 Login Credentials

### Admin Login

Navigate to: `http://localhost:3000/admin/login`

| Username | Password    | Role                 |
| -------- | ----------- | -------------------- |
| admin1   | Admin@123   | Dr. Rajesh Kumar     |
| admin2   | Admin@456   | Prof. Priya Sharma   |
| admin3   | Admin@789   | Dr. Anil Verma       |
| dean     | Dean@2024   | Dean Student Welfare |
| warden   | Warden@2024 | Chief Warden         |

**⚠️ SECURITY:** Change these passwords immediately after first login!

---

## 📱 Testing the Portal

### Test 1: Submit a Complaint (Student Side)

1. Go to homepage
2. Click "Submit Complaint"
3. Fill the form:
   - Email: test@student.com
   - Phone: 1234567890
   - Title: Test Complaint
   - Description: This is a test complaint
   - Location: Test Location
   - Severity: Medium
4. Check "I confirm this is truthful"
5. Submit
6. **Save the Complaint ID** shown on success page

### Test 2: Track Complaint

1. Go to homepage
2. Click "Track Complaint"
3. Enter the Complaint ID from Test 1
4. View status

### Test 3: Admin Dashboard

1. Go to Admin Login
2. Login with: `admin1` / `Admin@123`
3. View dashboard
4. Click "All Complaints"
5. Find your test complaint
6. Click "View" to see details
7. Update status to "In Review"
8. Add action report
9. Save

### Test 4: SOS Alert

1. Go to any public page
2. Click the red SOS button (bottom-right)
3. Confirm alert
4. Check admin dashboard for SOS alerts

---

## 🛠 Troubleshooting

### Problem: "Cannot find module"

**Solution:**

```powershell
npm install
```

### Problem: "Port 3000 already in use"

**Solution:** Change port in `.env` file:

```env
PORT=5000
```

### Problem: "Cannot connect to MongoDB"

**Solution:**

1. Check internet connection
2. Verify MongoDB Atlas credentials in `.env`
3. Ensure IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0)

### Problem: "Admin login fails"

**Solution:**

```powershell
npm run seed
```

### Problem: "File upload not working"

**Solution:**

1. Check if `uploads` folder exists
2. Ensure folder has write permissions

---

## 📊 File Structure Overview

```
AARW/
├── config/           # Database & configuration
├── controllers/      # Business logic
├── middleware/       # Auth & file upload
├── models/          # MongoDB schemas
├── public/          # CSS, JS, images
├── routes/          # URL routes
├── uploads/         # Uploaded files
├── utils/           # Helper functions
├── views/           # EJS templates
├── .env            # Environment variables
├── package.json    # Dependencies
├── server.js       # Main entry point
└── README.md       # Documentation
```

---

## 🔧 Common Commands

```powershell
# Install dependencies
npm install

# Seed admin accounts
npm run seed

# Start server (production)
npm start

# Start with auto-restart (development)
npm run dev

# Check Node version
node --version

# Check npm version
npm --version
```

---

## 🌐 URLs Reference

| Page                 | URL                                    |
| -------------------- | -------------------------------------- |
| **Home Page**        | http://localhost:3000                  |
| **Submit Complaint** | http://localhost:3000/complaint/submit |
| **Track Complaint**  | http://localhost:3000/complaint/track  |
| **Admin Login**      | http://localhost:3000/admin/login      |
| **Admin Dashboard**  | http://localhost:3000/admin/dashboard  |
| **Rules**            | http://localhost:3000/rules            |
| **Penalties**        | http://localhost:3000/penalties        |
| **Student Rights**   | http://localhost:3000/rights           |
| **Committee**        | http://localhost:3000/committee        |
| **Contact**          | http://localhost:3000/contact          |

---

## 📧 Email Configuration (Optional)

To enable SOS email alerts, edit `.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
ALERT_EMAIL=admin@college.edu
```

### Gmail Setup:

1. Enable 2-Factor Authentication
2. Generate App Password
3. Use app password in `.env`

---

## 🔒 Security Checklist

Before going live:

- [ ] Change SESSION_SECRET in `.env`
- [ ] Change all admin passwords
- [ ] Update email credentials
- [ ] Update contact numbers
- [ ] Update college information
- [ ] Test all features
- [ ] Enable HTTPS (in production)
- [ ] Set up regular backups
- [ ] Configure firewall rules
- [ ] Update MongoDB access rules

---

## 📈 Performance Tips

1. **Use PM2 for production:**

   ```powershell
   npm install -g pm2
   pm2 start server.js --name "anti-ragging"
   pm2 save
   ```

2. **Enable compression:**
   Already configured in Express

3. **Regular database cleanup:**
   Archive old complaints periodically

4. **Monitor logs:**
   Check server logs regularly

---

## 🆘 Support

If you encounter issues:

1. Check this guide first
2. Review README.md for detailed info
3. Check server console for errors
4. Verify all dependencies are installed
5. Ensure MongoDB connection is working

---

## ✅ Deployment Checklist

Before deploying to production server:

- [ ] Tested all features locally
- [ ] Updated all credentials
- [ ] Changed default passwords
- [ ] Updated contact information
- [ ] Configured email service
- [ ] Set up MongoDB Atlas properly
- [ ] Configured firewall
- [ ] Set up SSL certificate
- [ ] Tested on different devices
- [ ] Prepared backup strategy

---

## 🎓 Feature Overview

### For Students:

✅ Anonymous complaint submission
✅ Track complaint status
✅ Upload evidence files
✅ Emergency SOS button
✅ Educational resources

### For Admins:

✅ Secure login system
✅ Complete dashboard
✅ Complaint management
✅ Status updates
✅ Analytics & reports
✅ Data export (CSV/Excel/PDF)
✅ Activity logging
✅ SOS alert management
✅ Profile management

---

## 📱 Mobile Responsive

The portal is fully responsive and works on:

- ✅ Desktop computers
- ✅ Laptops
- ✅ Tablets
- ✅ Smartphones

---

## 🔄 Updates & Maintenance

### Regular Tasks:

- Weekly: Check complaints and SOS alerts
- Monthly: Review analytics
- Quarterly: Update security patches
- Annually: Review and update policies

### Backup Strategy:

1. MongoDB Atlas automatic backups
2. Export complaints monthly
3. Save activity logs
4. Keep uploaded files backed up

---

**Made with ❤️ for a Safer Campus**

For detailed documentation, see README.md
