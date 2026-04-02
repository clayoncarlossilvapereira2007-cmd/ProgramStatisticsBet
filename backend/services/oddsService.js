const axios = require('axios');

class OddsService {
  constructor() {
    this.baseUrl = 'https://api.the-odds-api.com/v4/sports';
    this.apiKey = process.env.ODDS_API_KEY;
  }

  async getOdds(sportKey = 'soccer_epl', regions = 'us,uk,eu', markets = 'h2h') {
    try {
      const response = await axios.get(`${this.baseUrl}/${sportKey}/odds/`, {
        params: {
          apiKey: this.apiKey,
          regions,
          markets,
          oddsFormat: 'decimal'
        }
      });
      
      // Convert odds to implied probability and normalize
      return response.data.map(game => ({
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        commenceTime: game.commence_time,
        bookmakers: game.bookmakers.map(bookmaker => ({
          name: bookmaker.key,
          odds: {
            homeWin: bookmaker.markets[0].outcomes[0].price,
            awayWin: bookmaker.markets[0].outcomes[1].price
          }
        }))
      }));
    } catch (error) {
      console.error('Error fetching odds:', error.response?.data || error.message);
      // Return simulated odds
      return this.getSimulatedOdds();
    }
  }

  getSimulatedOdds() {
    return [
      {
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        commenceTime: new Date(Date.now() + 86400000).toISOString(),
        bookmakers: [{
          name: 'DemoBookie',
          odds: { homeWin: 2.5, awayWin: 2.8 }
        }]
      }
    ];
  }

  oddsToImpliedProb(odds) {
    return 1 / odds;
  }
}

module.exports = new OddsService();
