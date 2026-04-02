# Sports Betting AI Backend 🚀

Professional sports betting analysis platform with ML predictions.

## 🛠️ Tech Stack
- Node.js / Express
- MongoDB / Mongoose  
- TensorFlow.js (AI/ML)
- JWT Auth
- API-Football + The Odds API

## 🚀 Quick Start

1. **Clone & Install**
```bash
cd backend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
```
Edit `.env` with your API keys:
```
FOOTBALL_API_KEY=your_key
ODDS_API_KEY=your_key
MONGO_URI=mongodb://localhost:27017/sportsbetting
JWT_SECRET=your_secret
```

3. **Start Server**
```bash
npm run dev  # Development with nodemon
# or
npm start    # Production
```

## 📱 API Endpoints

### Authentication
```
POST /api/auth/register  {username, email, password}
POST /api/auth/login     {email, password}
```

### Analysis (JWT required)
```
GET  /api/analysis/recommendations  # Daily value bets
POST /api/analysis/match/:apiId     # Specific match analysis  
GET  /api/analysis/fixtures         # Upcoming matches
GET  /api/analysis/odds             # Live odds
GET  /api/health                    # Health check
```

## 🧠 AI Features
- **Statistical Model**: Form (35%) + Attack (30%) + Defense (20%) + Home (15%)
- **Neural Network**: TensorFlow.js (6 features → win probability)
- **Ensemble**: Stats (60%) + ML (40%)
- **Value Detection**: Model Prob > Implied Odds Prob + 5%

## 📊 Example Response
```json
{
  "recommendation": {
    "betType": "home",
    "confidence": "78.2", 
    "odds": 1.85,
    "explanation": "Model:72.5% vs Odds:54.1% (strong value)"
  }
}
```

## 🛡️ Security
- JWT Authentication
- Rate limiting
- Helmet security headers
- Input validation
- Error handling

## 🔮 Next Steps
- Redis caching
- WebSocket live odds
- More leagues/markets
- Historical backtesting
- Frontend integration

**Ready for production!** ⚽💰🤖
