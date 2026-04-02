const RecommendationService = require('../services/recommendationService');
const DataService = require('../services/dataService');
const OddsService = require('../services/oddsService');

// @desc    Get daily betting recommendations
// @route   GET /api/analysis/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await RecommendationService.getDailyRecommendations();
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze specific match
// @route   POST /api/analysis/match/:apiId
// @access  Private
const analyzeMatch = async (req, res, next) => {
  try {
    const { apiId } = req.params;
    const analysis = await RecommendationService.analyzeSpecificMatch(apiId);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live fixtures
// @route   GET /api/analysis/fixtures
// @access  Private
const getFixtures = async (req, res, next) => {
  try {
    const fixtures = await DataService.getFixtures(39, '2024-12-20', '2024-12-25');
    res.json({
      success: true,
      count: fixtures.length,
      data: fixtures.slice(0, 20).map(fixture => DataService.normalizeFixture(fixture))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current odds
// @route   GET /api/analysis/odds
// @access  Private
const getOdds = async (req, res, next) => {
  try {
    const odds = await OddsService.getOdds();
    res.json({
      success: true,
      count: odds.length,
      data: odds
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
  analyzeMatch,
  getFixtures,
  getOdds
};
