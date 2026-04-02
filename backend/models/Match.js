const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  apiId: {
    type: String,
    required: true,
    unique: true
  },
  league: {
    id: Number,
    name: String,
    country: String
  },
  homeTeam: {
    id: Number,
    name: String
  },
  awayTeam: {
    id: Number,
    name: String
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'finished', 'postponed'],
    default: 'scheduled'
  },
  score: {
    halftime: { home: Number, away: Number },
    fulltime: { home: Number, away: Number }
  },
  predictions: {
    homeWin: Number,
    awayWin: Number,
    valueBet: {
      type: String,
      enum: ['home', 'away', 'none']
    },
    confidence: Number,
    explanation: String
  },
  odds: {
    homeWin: { bookie: Number, impliedProb: Number },
    awayWin: { bookie: Number, impliedProb: Number }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Match', matchSchema);
