class StatsService {
  calculateForm(matches, numMatches = 5) {
    const recentMatches = matches.slice(0, numMatches);
    let points = 0;
    
    recentMatches.forEach(match => {
      if (match.isWin) points += 3;
      else if (match.isDraw) points += 1;
    });
    
    return points / (numMatches * 3); // Normalized 0-1
  }

  calculateAttackStrength(matches, homeMatchesOnly = false) {
    const relevantMatches = homeMatchesOnly 
      ? matches.filter(m => m.venue === 'home')
      : matches;
    
    const totalGoals = relevantMatches.reduce((sum, match) => sum + match.goalsScored, 0);
    return totalGoals / relevantMatches.length || 0;
  }

  calculateDefenseStrength(matches, homeMatchesOnly = false) {
    const relevantMatches = homeMatchesOnly 
      ? matches.filter(m => m.venue === 'home')
      : matches;
    
    const goalsConceded = relevantMatches.reduce((sum, match) => sum + match.goalsConceded, 0);
    const avgConceded = goalsConceded / relevantMatches.length || 0;
    return Math.min(avgConceded / 3, 1); // Normalize 0-1 (3 goals = max poor defense)
  }

  getHomeAdvantageFactor(homeStats, awayStats) {
    const homeAttackHome = this.calculateAttackStrength(homeStats, true);
    const awayDefenseAway = this.calculateDefenseStrength(awayStats, true);
    return (homeAttackHome * (1 - awayDefenseAway)) * 0.15;
  }

  calculateTeamStrength(form, attack, defense, homeFactor) {
    return (
      (form * 0.35) +
      (attack * 0.30) +
      ((1 - defense) * 0.20) +
      homeFactor
    );
  }

  // Simulate historical stats for demo
  getSimulatedTeamStats(teamName) {
    const baseStats = {
      form: 0.6,
      attack: 1.8,
      defense: 1.2,
      homeWins: 0.65,
      recentMatches: []
    };

    // Adjust based on team strength (demo)
    const teamStrengths = {
      'Manchester United': { form: 0.7, attack: 2.1, defense: 1.0 },
      'Liverpool': { form: 0.75, attack: 2.3, defense: 0.8 },
      'Manchester City': { form: 0.8, attack: 2.5, defense: 0.7 }
    };

    return teamStrengths[teamName] || baseStats;
  }

  getSimulatedMatches(teamId, count = 10) {
    const results = ['W', 'D', 'L'];
    return Array.from({ length: count }, (_, i) => ({
      date: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000),
      opponent: `Opponent ${i + 1}`,
      goalsScored: Math.floor(Math.random() * 4),
      goalsConceded: Math.floor(Math.random() * 3),
      venue: i % 2 === 0 ? 'home' : 'away',
      result: results[Math.floor(Math.random() * 3)]
    }));
  }
}

module.exports = new StatsService();
