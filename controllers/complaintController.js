const Complaint = require('../models/Complaint');
const { generateComplaintId } = require('../utils/helpers');

// Show complaint submission form
exports.showSubmitForm = (req, res) => {
    res.render('complaint/submit', {
        title: 'Submit Complaint',
        error: null
    });
};

// Handle complaint submission
exports.submitComplaint = async (req, res) => {
    try {
        const {
            studentName,
            email,
            phone,
            title,
            description,
            location,
            severity,
            isAnonymous,
            confirmTruthful
        } = req.body;

        // Validate required fields
        if (!email || !phone || !title || !description || !location) {
            return res.render('complaint/submit', {
                title: 'Submit Complaint',
                error: 'Please fill in all required fields'
            });
        }

        if (!confirmTruthful) {
            return res.render('complaint/submit', {
                title: 'Submit Complaint',
                error: 'You must confirm that your complaint is truthful'
            });
        }

        // Generate unique complaint ID
        const complaintId = generateComplaintId();

        // Process uploaded files
        const evidenceFiles = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                evidenceFiles.push({
                    filename: file.filename,
                    originalName: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size
                });
            });
        }

        // Create complaint
        const complaint = await Complaint.create({
            complaintId,
            studentName: isAnonymous ? 'Anonymous' : (studentName || 'Anonymous'),
            email,
            phone,
            title,
            description,
            location,
            severity: severity || 'Medium',
            isAnonymous: isAnonymous === 'on',
            evidenceFiles
        });

        // Redirect to success page
        res.redirect(`/complaint/success/${complaint.complaintId}`);
    } catch (error) {
        console.error('Submit complaint error:', error);
        res.render('complaint/submit', {
            title: 'Submit Complaint',
            error: 'Failed to submit complaint. Please try again.'
        });
    }
};

// Complaint success page
exports.successPage = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });

        if (!complaint) {
            return res.status(404).render('404', { title: 'Complaint Not Found' });
        }

        res.render('complaint/success', {
            title: 'Complaint Submitted',
            complaint
        });
    } catch (error) {
        console.error('Success page error:', error);
        res.status(500).render('error', { title: 'Error', error });
    }
};

// Show track form
exports.showTrackForm = (req, res) => {
    res.render('complaint/track', {
        title: 'Track Complaint',
        complaint: null,
        error: null
    });
};

// Track complaint
exports.trackComplaint = async (req, res) => {
    try {
        const { complaintId } = req.body;

        if (!complaintId) {
            return res.render('complaint/track', {
                title: 'Track Complaint',
                complaint: null,
                error: 'Please enter a complaint ID'
            });
        }

        const complaint = await Complaint.findOne({ complaintId: complaintId.trim() });

        if (!complaint) {
            return res.render('complaint/track', {
                title: 'Track Complaint',
                complaint: null,
                error: 'Complaint not found. Please check your Complaint ID.'
            });
        }

        // Only show public information (hide admin notes)
        const publicComplaint = {
            complaintId: complaint.complaintId,
            title: complaint.title,
            status: complaint.status,
            severity: complaint.severity,
            createdAt: complaint.createdAt,
            updatedAt: complaint.updatedAt,
            publicRemarks: complaint.publicRemarks,
            actionTakenReport: complaint.actionTakenReport
        };

        res.render('complaint/track', {
            title: 'Track Complaint',
            complaint: publicComplaint,
            error: null
        });
    } catch (error) {
        console.error('Track complaint error:', error);
        res.render('complaint/track', {
            title: 'Track Complaint',
            complaint: null,
            error: 'An error occurred. Please try again.'
        });
    }
};
