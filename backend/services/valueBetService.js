const AnalysisService = require('./analysisService');

class ValueBetService {
  constructor() {
    this.minValueThreshold = 0.03;
    this.minConfidence = 0.6;
  }

  async findValueBets(fixtures, limit = 5) {
    const valueBets = [];

    for (const fixture of fixtures) {
      try {
        // Get simulated stats
        const statsService = require('./statsService');
        const homeStats = statsService.getSimulatedTeamStats(fixture.homeTeam.name);
        const awayStats = statsService.getSimulatedTeamStats(fixture.awayTeam.name);

        // Simulated odds
        const oddsService = require('./oddsService');
        const odds = {
          homeWin: 2.0 + Math.random(),
          awayWin: 2.0 + Math.random()
        };

        const analysis = await AnalysisService.analyzeMatch(
          fixture.homeTeam.name,
          fixture.awayTeam.name,
          homeStats.recentMatches || [],
          awayStats.recentMatches || [],
          odds
        );

        // Filter for value bets
        if (Math.max(analysis.value.home, analysis.value.away) > this.minValueThreshold &&
            parseFloat(analysis.recommendation.confidence) / 100 > this.minConfidence) {
          
          valueBets.push({
            match: fixture,
            analysis,
            timestamp: new Date()
          });
        }

      } catch (error) {
        console.error(`Error analyzing ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}:`, error);
      }
    }

    // Sort by expected value
    return valueBets
      .sort((a, b) => b.analysis.recommendation.expectedValue - a.analysis.recommendation.expectedValue)
      .slice(0, limit);
  }
}

module.exports = new ValueBetService();
