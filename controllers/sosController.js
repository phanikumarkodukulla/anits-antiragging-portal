const SOSAlert = require('../models/SOSAlert');
const { generateSOSAlertId } = require('../utils/helpers');
const nodemailer = require('nodemailer');

// Trigger SOS alert
exports.triggerAlert = async (req, res) => {
    try {
        const { location } = req.body;

        // Generate alert ID
        const alertId = generateSOSAlertId();

        // Get IP address and user agent
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        // Create SOS alert
        const alert = await SOSAlert.create({
            alertId,
            location: location || 'Location unavailable',
            ipAddress,
            userAgent
        });

        // Send email notification (optional - configure email in .env)
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    service: process.env.EMAIL_SERVICE || 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.ALERT_EMAIL || 'admin@college.edu',
                    subject: '🚨 URGENT: SOS ALERT TRIGGERED',
                    html: `
            <h2 style="color: red;">SOS ALERT TRIGGERED</h2>
            <p><strong>Alert ID:</strong> ${alertId}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Location:</strong> ${location || 'Location unavailable'}</p>
            <p><strong>IP Address:</strong> ${ipAddress}</p>
            <p>Please take immediate action and check the admin dashboard for details.</p>
          `
                };

                await transporter.sendMail(mailOptions);
            }
        } catch (emailError) {
            console.error('Email notification error:', emailError);
            // Continue even if email fails
        }

        res.json({
            success: true,
            alertId: alert.alertId,
            message: 'SOS alert sent successfully. Help is on the way!'
        });
    } catch (error) {
        console.error('SOS alert error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send SOS alert. Please call emergency services directly.'
        });
    }
};
