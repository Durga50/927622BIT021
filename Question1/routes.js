const express = require('express');
const { getAveragePrice, getCorrelation } = require('./controllers');

const router = express.Router();

router.get('/stocks/average', getAveragePrice);
router.get('/stockcorrelation', getCorrelation);

module.exports = router;
