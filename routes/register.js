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
  let registration = await Registration.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }]
  });
  if (registration) {
    req.flash(
      'errormsg',
      'Email or Phone number already exists. Try with a different info'
    );
    return res.redirect('/register');
  }
  registration = await Registration.create(req.body);
  await new EmailHandler(
    registration.email,
    registration.name
  ).sendRegistered();
  res.redirect('/register/thank-you');
});

// Admission Form Routes

router.get('/interview', async (req, res) => {
  const registration = await Registration.findById(req.query.id);
  res.render('registration/interview', {
    id: registration._id,
    name: registration.name,
    email: registration.email
  });
});

router.patch('/interview', async (req, res) => {
  const interview = {
    day: req.body.day,
    time: req.body.time
  };

  const registration = await Registration.findById(req.body.id);

  registration.interview = interview;
  registration.registered = true;
  await registration.save();

  res.redirect('/register/updated');
});

router.get('/updated', (req, res) => {
  res.render('registration/updated');
});

router.get('/questionnaire', (req, res) => {
  res.render('registration/questionnaire');
});

router.post('/follow-up', async (req, res) => {
  const registrations = await Registration.find({ registered: false });
  registrations.forEach(async registration => {
    await new EmailHandler(
      registration.email,
      registration.name,
      registration._id
    ).sendFollowUp();
    registration.registered = true;
    await registration.save();
  });

  res.json({ message: 'All Follow Up Emails Sent!' });
});

module.exports = router;
