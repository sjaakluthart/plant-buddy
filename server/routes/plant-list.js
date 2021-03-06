const express = require('express');
const winston = require('winston');

const db = require('../db.js');

const router = express.Router();

// Send the list of plants to the client
router.get('/', (req, response) => {
  winston.log('info', 'Finding plant list.');

  if (!req.session.user) {
    response.send('un auth');
    return false;
  }

  const selector = {
    forUserId: req.session.user._id
  };
  const options = {
    name: 1,
    species: 1,
    plantedOn: 1,
    referenceValues: 1,
    sensorReadings: 1
  };
  db.get().collection('plants').find(selector, options).toArray((err, res) => {
    if (err) {
      throw err;
    }
    winston.log('info', 'Found %s plants.', res.length);
    response.send(res);
  });
});

module.exports = router;
