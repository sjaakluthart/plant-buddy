const db = require('../db.js');
const express = require('express');
const moment = require('moment');
const winston = require('winston');

const router = express.Router();

/* Ref values
Light: min -> 77, max -> 25
Moisture: min -> 30 , max -> 5
Temperature: to be determined
*/
router.post('/', (req, response) => {
  // Create new user
  winston.log('info', 'Creating new plant for user: %s.', req.body.userId);

  // Insert new plant in DB
  const options = {
    forUserId: req.body.userId,
    species: req.body.species,
    name: req.body.name,
    plantedOn: req.body.plantedOn,
    harvestOn: moment(new Date(req.body.plantedOn)).add(12, 'weeks').toDate(),
    sensors: {
      moisture: req.body.moisture,
      light: req.body.light,
      temperature: req.body.temperture
    },
    referenceValues: {
      temperature: {
        type: 'temperature',
        min: 7,
        max: 24
      },
      moisture: {
        type: 'moisture',
        min: 30,
        max: 5
      },
      light: {
        type: 'light',
        min: 77,
        max: 25
      }
    },
    sensorReadings: {
      moisture: null,
      temperature: 10,
      light: null
    }
  };

  db.get().collection('plants').insert(options, (err, res) => {
    if (err) {
      throw err;
    }

    response.send(res);
  });
});

module.exports = router;
