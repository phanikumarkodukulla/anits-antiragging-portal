const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Complaint = require('../models/Complaint');
const ActivityLog = require('../models/ActivityLog');
const SOSAlert = require('../models/SOSAlert');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Show login page
exports.showLogin = (req, res) => {
    res.render('admin/login', {
        title: 'Admin Login',
        error: null
    });
};

// Handle login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin by username
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.render('admin/login', {
                title: 'Admin Login',
                error: 'Invalid username or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.render('admin/login', {
                title: 'Admin Login',
                error: 'Invalid username or password'
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Set session
        req.session.adminId = admin._id;
        req.session.adminName = admin.fullName;
        req.session.adminUsername = admin.username;

        // Log activity
        await ActivityLog.create({
            admin: admin._id,
            action: 'Login',
            details: 'Admin logged in successfully'
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('admin/login', {
            title: 'Admin Login',
            error: 'An error occurred. Please try again.'
        });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        // Log activity before destroying session
        if (req.session.adminId) {
            await ActivityLog.create({
                admin: req.session.adminId,
                action: 'Logout',
                details: 'Admin logged out'
            });
        }

        req.session.destroy();
        res.redirect('/admin/login');
    } catch (error) {
        console.error('Logout error:', error);
        res.redirect('/admin/dashboard');
    }
};

// Dashboard
exports.dashboard = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
        const inReviewComplaints = await Complaint.countDocuments({ status: 'In Review' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

        const recentComplaints = await Complaint.find()
            .sort({ createdAt: -1 })
            .limit(10);

        const recentSOSAlerts = await SOSAlert.find({ status: 'New' })
            .sort({ timestamp: -1 })
            .limit(5);

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            session: req.session,
            stats: {
                total: totalComplaints,
                pending: pendingComplaints,
                inReview: inReviewComplaints,
                resolved: resolvedComplaints
            },
            recentComplaints,
            recentSOSAlerts
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', { title: 'Error', error });
    }
};

// List all complaints
exports.listComplaints = async (req, res) => {
    try {
        const { search, status, severity, sort } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { complaintId: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        if (severity) {
            query.severity = severity;
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'severity') sortOption = { severity: -1 };

        const complaints = await Complaint.find(query)
            .sort(sortOption)
            .populate('handledBy', 'fullName');

        res.render('admin/complaints', {
            title: 'Manage Complaints',
            session: req.session,
            complaints,
            filters: { search, status, severity, sort }
        });
    } catch (error) {
        console.error('List complaints error:', error);
        res.status(500).render('error', { title: 'Error', error });
    }
};

// View single complaint
exports.viewComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaintId: req.params.id })
            .populate('handledBy', 'fullName email');

        if (!complaint) {
            return res.status(404).render('404', { title: 'Complaint Not Found' });
        }

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Viewed Complaint',
            complaintId: complaint.complaintId,
            details: `Viewed complaint: ${complaint.title}`
        });

        res.render('admin/complaint-detail', {
            title: 'Complaint Details',
            session: req.session,
            complaint
        });
    } catch (error) {
        console.error('View complaint error:', error);
        res.status(500).render('error', { title: 'Error', error });
    }
};

// Update complaint
exports.updateComplaint = async (req, res) => {
    try {
        const { status, adminNotes, actionTakenReport, publicRemarks } = req.body;

        const complaint = await Complaint.findOne({ complaintId: req.params.id });

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        const oldStatus = complaint.status;

        complaint.status = status || complaint.status;
        complaint.adminNotes = adminNotes || complaint.adminNotes;
        complaint.actionTakenReport = actionTakenReport || complaint.actionTakenReport;
        complaint.publicRemarks = publicRemarks || complaint.publicRemarks;
        complaint.handledBy = req.session.adminId;
        complaint.updatedAt = new Date();

        await complaint.save();

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Updated Complaint',
            complaintId: complaint.complaintId,
            details: `Status changed from ${oldStatus} to ${status}`
        });

        res.redirect(`/admin/complaints/${complaint.complaintId}`);
    } catch (error) {
        console.error('Update complaint error:', error);
        res.status(500).json({ error: 'Failed to update complaint' });
    }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaintId: req.params.id });

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        // Delete associated files
        if (complaint.evidenceFiles && complaint.evidenceFiles.length > 0) {
            complaint.evidenceFiles.forEach(file => {
                const filePath = path.join(__dirname, '..', file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        // Log activity before deletion
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Deleted Complaint',
            complaintId: complaint.complaintId,
            details: `Deleted complaint: ${complaint.title}`
        });

        await Complaint.deleteOne({ complaintId: req.params.id });

        res.redirect('/admin/complaints');
    } catch (error) {
        console.error('Delete complaint error:', error);
        res.status(500).json({ error: 'Failed to delete complaint' });
    }
};

// Analytics
exports.analytics = async (req, res) => {
    try {
        // Get complaints by status
        const statusData = await Complaint.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get complaints by severity
        const severityData = await Complaint.aggregate([
            { $group: { _id: '$severity', count: { $sum: 1 } } }
        ]);

        // Get monthly trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyData = await Complaint.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Get complaints by location
        const locationData = await Complaint.aggregate([
            { $group: { _id: '$location', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.render('admin/analytics', {
            title: 'Analytics Dashboard',
            session: req.session,
            statusData,
            severityData,
            monthlyData,
            locationData
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).render('error', { title: 'Error', error });
    }
};

// Activity logs
exports.activityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .sort({ timestamp: -1 })
            .limit(100)
            .populate('admin', 'fullName username');

        res.render('admin/activity-logs', {
            title: 'Activity Logs',
            session: req.session,
            logs
        });
    } catch (error) {
        console.error('Activity logs error:', error);
        res.status(500).render('error', { title: 'Error', error });
    }
};

// SOS Alerts
exports.sosAlerts = async (req, res) => {
    try {
        const sosAlerts = await SOSAlert.find()
            .sort({ timestamp: -1 });

        res.render('admin/sos-alerts', {
            title: 'SOS Alerts',
            session: req.session,
            sosAlerts
        });
    } catch (error) {
        console.error('SOS alerts error:', error);
        res.status(500).render('error', { title: 'Error', error });
    }
};

// Update SOS Alert
exports.updateSOSAlert = async (req, res) => {
    try {
        const { status, notes } = req.body;

        await SOSAlert.findByIdAndUpdate(req.params.id, {
            status,
            notes
        });

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Updated SOS Alert',
            details: `Changed SOS alert status to ${status}`
        });

        res.redirect('/admin/sos-alerts');
    } catch (error) {
        console.error('Update SOS alert error:', error);
        res.status(500).json({ error: 'Failed to update alert' });
    }
};

// Resolve SOS Alert
exports.resolveSOSAlert = async (req, res) => {
    try {
        await SOSAlert.findByIdAndUpdate(req.params.id, {
            status: 'Resolved'
        });

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Resolved SOS Alert',
            details: 'Marked SOS alert as resolved'
        });

        res.redirect('/admin/sos-alerts');
    } catch (error) {
        console.error('Resolve SOS alert error:', error);
        res.status(500).json({ error: 'Failed to resolve alert' });
    }
};

// Acknowledge SOS Alert
exports.acknowledgeSOSAlert = async (req, res) => {
    try {
        await SOSAlert.findByIdAndUpdate(req.params.id, {
            status: 'Acknowledged'
        });

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Acknowledged SOS Alert',
            details: 'Acknowledged SOS alert'
        });

        res.redirect('/admin/sos-alerts');
    } catch (error) {
        console.error('Acknowledge SOS alert error:', error);
        res.status(500).json({ error: 'Failed to acknowledge alert' });
    }
};

// Delete SOS Alert
exports.deleteSOSAlert = async (req, res) => {
    try {
        await SOSAlert.findByIdAndDelete(req.params.id);

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Deleted SOS Alert',
            details: 'Deleted SOS alert'
        });

        res.redirect('/admin/sos-alerts');
    } catch (error) {
        console.error('Delete SOS alert error:', error);
        res.status(500).json({ error: 'Failed to delete alert' });
    }
};

// Show profile
exports.showProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId);

        // Get activity statistics
        const complaintsHandled = await Complaint.countDocuments({
            handledBy: req.session.adminId
        });

        // Get actions this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const actionsThisWeek = await ActivityLog.countDocuments({
            admin: req.session.adminId,
            timestamp: { $gte: oneWeekAgo }
        });

        // Get total logins
        const totalLogins = await ActivityLog.countDocuments({
            admin: req.session.adminId,
            action: 'Login'
        });

        // Get actions today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const actionsToday = await ActivityLog.countDocuments({
            admin: req.session.adminId,
            timestamp: { $gte: todayStart }
        });

        // Get recent activity (last 10 actions)
        const recentActivity = await ActivityLog.find({
            admin: req.session.adminId
        })
            .sort({ timestamp: -1 })
            .limit(10);

        res.render('admin/profile', {
            title: 'My Profile',
            admin,
            complaintsHandled,
            actionsThisWeek,
            totalLogins,
            actionsToday,
            recentActivity,
            session: req.session,
            message: req.query.message,
            error: req.query.error,
            success: req.query.message // For compatibility with the view
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).render('error', { title: 'Error', error });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.redirect('/admin/profile?error=Passwords do not match');
        }

        const admin = await Admin.findById(req.session.adminId);

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.redirect('/admin/profile?error=Current password is incorrect');
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Changed Password',
            details: 'Admin changed their password'
        });

        res.redirect('/admin/profile?message=Password changed successfully');
    } catch (error) {
        console.error('Change password error:', error);
        res.redirect('/admin/profile?error=Failed to change password');
    }
};

// Export to CSV
exports.exportCSV = async (req, res) => {
    try {
        const complaints = await Complaint.find().lean();

        const fields = ['complaintId', 'email', 'title', 'location', 'severity', 'status', 'createdAt'];
        const parser = new Parser({ fields });
        const csv = parser.parse(complaints);

        res.header('Content-Type', 'text/csv');
        res.attachment('complaints.csv');
        res.send(csv);

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Exported Data',
            details: 'Exported complaints to CSV'
        });
    } catch (error) {
        console.error('CSV export error:', error);
        res.status(500).send('Failed to export CSV');
    }
};

// Export to Excel
exports.exportExcel = async (req, res) => {
    try {
        const complaints = await Complaint.find().lean();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Complaints');

        worksheet.columns = [
            { header: 'Complaint ID', key: 'complaintId', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Title', key: 'title', width: 40 },
            { header: 'Location', key: 'location', width: 20 },
            { header: 'Severity', key: 'severity', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Date', key: 'createdAt', width: 20 }
        ];

        complaints.forEach(complaint => {
            worksheet.addRow(complaint);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=complaints.xlsx');

        await workbook.xlsx.write(res);
        res.end();

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Exported Data',
            details: 'Exported complaints to Excel'
        });
    } catch (error) {
        console.error('Excel export error:', error);
        res.status(500).send('Failed to export Excel');
    }
};

// Export to PDF
exports.exportPDF = async (req, res) => {
    try {
        const complaints = await Complaint.find().lean();

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=complaints.pdf');

        doc.pipe(res);

        doc.fontSize(20).text('Complaint Report', { align: 'center' });
        doc.moveDown();

        complaints.forEach((complaint, index) => {
            doc.fontSize(12).text(`${index + 1}. Complaint ID: ${complaint.complaintId}`);
            doc.fontSize(10).text(`   Email: ${complaint.email}`);
            doc.text(`   Title: ${complaint.title}`);
            doc.text(`   Status: ${complaint.status}`);
            doc.text(`   Severity: ${complaint.severity}`);
            doc.text(`   Date: ${new Date(complaint.createdAt).toLocaleDateString()}`);
            doc.moveDown();
        });

        doc.end();

        // Log activity
        await ActivityLog.create({
            admin: req.session.adminId,
            action: 'Exported Data',
            details: 'Exported complaints to PDF'
        });
    } catch (error) {
        console.error('PDF export error:', error);
        res.status(500).send('Failed to export PDF');
    }
};
