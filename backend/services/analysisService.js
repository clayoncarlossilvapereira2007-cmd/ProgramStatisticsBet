const StatsService = require('./statsService');
const OddsService = require('./oddsService');
const MLService = require('./mlService');

class AnalysisService {
  async analyzeMatch(homeTeam, awayTeam, homeStats, awayStats, odds) {
    // Calculate statistical model
    const homeForm = StatsService.calculateForm(homeStats);
    const awayForm = StatsService.calculateForm(awayStats);
    
    const homeAttack = StatsService.calculateAttackStrength(homeStats);
    const awayAttack = StatsService.calculateAttackStrength(awayStats);
    
    const homeDefense = StatsService.calculateDefenseStrength(homeStats);
    const awayDefense = StatsService.calculateDefenseStrength(awayStats);
    
    const homeAdvantage = StatsService.getHomeAdvantageFactor(homeStats, awayStats);
    
    const homeStrength = StatsService.calculateTeamStrength(
      homeForm, homeAttack, homeDefense, homeAdvantage
    );
    
    const awayStrength = StatsService.calculateTeamStrength(
      awayForm, awayAttack, awayDefense, 0
    );
    
    const statHomeProb = homeStrength / (homeStrength + awayStrength);
    const statAwayProb = 1 - statHomeProb;

    // ML Prediction
    const mlHomeProb = await MLService.predict([
      homeForm, homeAttack, homeDefense,
      awayForm, awayAttack, awayDefense
    ]);

    // Combined prediction
    const finalHomeProb = (statHomeProb * 0.6) + (mlHomeProb * 0.4);
    const finalAwayProb = 1 - finalHomeProb;

    // Odds analysis
    const homeImpliedProb = OddsService.oddsToImpliedProb(odds.homeWin);
    const awayImpliedProb = OddsService.oddsToImpliedProb(odds.awayWin);

    // Value detection
    const homeValue = finalHomeProb - homeImpliedProb;
    const awayValue = finalAwayProb - awayImpliedProb;

    const recommendation = this.getRecommendation(
      finalHomeProb, finalAwayProb,
      homeValue, awayValue, odds
    );

    return {
      statistical: { homeProb: statHomeProb, awayProb: statAwayProb },
      ml: { homeProb: mlHomeProb },
      final: { homeProb: finalHomeProb, awayProb: finalAwayProb },
      odds: { homeImpliedProb, awayImpliedProb, homeWin: odds.homeWin, awayWin: odds.awayWin },
      value: { home: homeValue, away: awayValue },
      recommendation,
      explanation: this.generateExplanation(
        finalHomeProb, homeImpliedProb, homeValue,
        recommendation.confidence
      )
    };
  }

  getRecommendation(homeProb, awayProb, homeValue, awayValue, odds) {
    const confidenceThreshold = 0.65;
    const valueThreshold = 0.05;

    let betType = 'none';
    let confidence = Math.max(homeProb, awayProb);
    let bestOdds = 0;

    if (homeProb > confidenceThreshold && homeValue > valueThreshold) {
      betType = 'home';
      bestOdds = odds.homeWin;
    } else if (awayProb > confidenceThreshold && awayValue > valueThreshold) {
      betType = 'away';
      bestOdds = odds.awayWin;
    }

    confidence = Math.min(confidence * 100, 95); // Cap at 95%

    return {
      betType,
      confidence: confidence.toFixed(1),
      odds: bestOdds,
      expectedValue: betType === 'none' ? 0 : (confidence / 100) * (bestOdds - 1) - (1 - confidence / 100)
    };
  }

  generateExplanation(finalProb, impliedProb, value, confidence) {
    const valueText = value > 0.05 ? 'strong' : value > 0.02 ? 'moderate' : 'slight';
    return `Model predicts ${ (finalProb * 100).toFixed(1) }% chance vs ${ (impliedProb * 100).toFixed(1) }% implied by odds (${valueText} value detected). Confidence: ${confidence}%.`;
  }
}

module.exports = new AnalysisService();
