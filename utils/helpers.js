const crypto = require('crypto');

// Generate unique complaint ID
const generateComplaintId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CMP-${timestamp}-${random}`;
};

// Generate unique SOS alert ID
const generateSOSAlertId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `SOS-${timestamp}-${random}`;
};

// Validate file types
const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/avi', 'audio/mpeg', 'audio/wav', 'application/pdf'];

const isValidFileType = (mimetype) => {
  return allowedFileTypes.includes(mimetype);
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

module.exports = {
  generateComplaintId,
  generateSOSAlertId,
  isValidFileType,
  formatFileSize,
  formatDate
};
