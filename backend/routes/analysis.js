const express = require('express');
const {
  getRecommendations,
  analyzeMatch,
  getFixtures,
  getOdds
} = require('../controllers/analysisController');

const router = express.Router();

router.get('/recommendations', getRecommendations);
router.post('/match/:apiId', analyzeMatch);
router.get('/fixtures', getFixtures);
router.get('/odds', getOdds);

module.exports = router;
