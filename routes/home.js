const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('home', { title: 'Anti-Ragging Portal' });
});

// Static pages
router.get('/about', (req, res) => {
  res.render('static/about', { title: 'About Anti-Ragging' });
});

router.get('/rules', (req, res) => {
  res.render('static/rules', { title: 'Anti-Ragging Rules' });
});

router.get('/penalties', (req, res) => {
  res.render('static/penalties', { title: 'Penalties & Punishments' });
});

router.get('/rights', (req, res) => {
  res.render('static/rights', { title: 'Student Rights' });
});

router.get('/committee', (req, res) => {
  res.render('static/committee', { title: 'Anti-Ragging Committee' });
});

router.get('/contact', (req, res) => {
  res.render('static/contact', { title: 'Emergency Contacts' });
});

module.exports = router;
