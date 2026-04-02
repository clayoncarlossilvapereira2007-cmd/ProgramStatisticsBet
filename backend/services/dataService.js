const axios = require('axios');

class DataService {
  constructor() {
    this.baseUrl = 'https://v3.football.api-sports.io';
    this.headers = {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': process.env.FOOTBALL_API_KEY
    };
  }

  async getFixtures(leagueId = 39, dateFrom, dateTo) { // 39 = Premier League
    try {
      const response = await axios.get(`${this.baseUrl}/fixtures`, {
        params: {
          league: leagueId,
          from: dateFrom,
          to: dateTo
        },
        headers: this.headers
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching fixtures:', error.response?.data || error.message);
      throw new Error('Failed to fetch fixtures');
    }
  }

  async getTeamStats(teamId, season = new Date().getFullYear()) {
    try {
      const response = await axios.get(`${this.baseUrl}/teams/statistics`, {
        params: {
          team: teamId,
          season
        },
        headers: this.headers
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching team stats:', error.response?.data || error.message);
      return null; // Return null for simulation
    }
  }

  normalizeFixture(fixture) {
    return {
      apiId: fixture.fixture.id.toString(),
      league: {
        id: fixture.league.id,
        name: fixture.league.name,
        country: fixture.league.country
      },
      homeTeam: {
        id: fixture.teams.home.id,
        name: fixture.teams.home.name
      },
      awayTeam: {
        id: fixture.teams.away.id,
        name: fixture.teams.away.name
      },
      date: new Date(fixture.fixture.date),
      status: fixture.fixture.status.long
    };
  }
}

module.exports = new DataService();
