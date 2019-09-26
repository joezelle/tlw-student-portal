const express = require('express');

const Registration = require('../models/registration');
const EmailHandler = require('../utils/emailHandler');

const router = express.Router();

// Registration Routes

router.get('/', (req, res) => {
  res.render('registration/register');
});

router.get('/thank-you', (req, res) => {
  res.render('registration/thank-you');
});

router.post('/', async (req, res) => {
  const registration = await Registration.create(req.body);
  await new EmailHandler(
    registration.email,
    registration.name
  ).sendRegistered();
  res.redirect('/register/thank-you');
});

// Admission Form Routes

router.get('/interview', async (req, res) => {
  const registration = await Registration.findById(req.query.id);
  console.log(req.query.id, registration);
  res.render('registration/interview', {
    id: registration._id
  });
});

router.post('/interview', async (req, res) => {
  const interview = {
    date: req.body.date,
    time: req.body.time
  };

  const registration = await Registration.findByIdAndUpdate(
    req.body.id,
    interview
  );

  res.redirect('/register/updated');
});

router.get('/updated', (req, res) => {
  res.render('registration/updated');
});

router.get('/questionnaire', (req, res) => {
  res.render('registration/questionnaire');
});

router.post('/follow-up', async (req, res) => {
  // const registrations = await Registration.find({ registered: false });
  // registrations.forEach(async registration => {
  //   await new EmailHandler(
  //     registration.email,
  //     registration.name
  //   ).sendRegistered();
  //   registration.registered = true;
  //   await registration.save();
  // });

  const registration = await Registration.findOne({
    email: 'emmanuelheliot709@gmail.com'
  });
  if (!registration) {
    return res.json({ message: 'All Follow Up Emails NOT Sent!' });
  }
  await new EmailHandler(
    registration.email,
    registration.name,
    registration._id
  ).sendFollowUp();

  res.json({ message: 'All Follow Up Emails Sent!' });
});

module.exports = router;
