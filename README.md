# PennyWise - AI-Powered Lifestyle Creep Detector

## Problem Statement

Many people struggle with personal finance due to a lack of visibility and personalized, actionable advice. Manually tracking every expense is tedious, and generic budgeting apps often fail to inspire lasting behavioral change. As a result, people are often unaware of wasteful spending habits, miss opportunities to save, and feel anxious about their financial future.

**PennyWise** transforms raw transaction data into personalized insights that empower users to take control of their financial lives—with a special focus on detecting lifestyle creep before it becomes permanent.

## Demo
https://youtu.be/EwlslwB85gc

## Key Features

### Lifestyle Creep Detection (My Signature Feature)
Catch those sneaky spending increases before they become habits. Our AI analyzes your spending patterns over time to identify:
- Gradual increases in discretionary categories (dining, rideshare, shopping)
- Severity scoring (Low/Moderate/High) with specific thresholds
- Month-over-month trend analysis
- Category-specific recommendations

Just because PennyWise is a creep doesn't mean you need lifestyle creep!

### Transaction Analysis
- Upload CSV files from any bank
- Automatic categorization and deduplication
- Interactive spending visualizations
- AI-powered insights tailored to your patterns

### Smart Budgeting
- Simple range-based budget setup
- Compare actual spending vs. goals
- No tedious penny-counting required

### Privacy-First
- All processing happens locally
- Your financial data never leaves your machine
- Only anonymized summaries sent to AI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kennyxu256/pennywise.git
   cd pennywise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Application

You need to run both the backend server and frontend development server:

1. **Start the backend server** (in one terminal tab):
   ```bash
   npm run server
   ```
   The server will start on `http://localhost:3001`

2. **Start the frontend** (in a separate terminal tab):
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

## How to Use

### 1. Export Your Bank Transactions

Export transaction data from your bank(s) as CSV files. Most banks allow this through their online banking portal.

**Required CSV format:**
- Must include columns: `Date`, `Description`, `Amount`
- Optional: `Debit`/`Credit` columns (if amounts aren't signed)
- Date format: MM/DD/YYYY or similar standard formats

### 2. Upload and Analyze

- Navigate to the **Transaction Analyzer** tab
- Click "Choose Files" and select your CSV file(s)
- You can upload multiple files from different banks
- Click "Analyze Spending" to process your transactions

### 3. Check for Lifestyle Creep

- Go to the **Lifestyle Creep Detector** tab
- View your severity score (Low/Moderate/High)
- See which categories are driving spending increases
- Get specific recommendations to curb the creep

### 4. Review AI Insights

Get personalized recommendations including:
- Spending habit analysis
- Savings opportunities
- Behavioral patterns
- Actionable next steps

### 5. Set Your Budget

Use simple range selectors to set budget targets and compare against actual spending.

## Privacy & Security

- **Local Processing**: All transaction analysis happens on your machine
- **No Data Storage**: Your financial data is never saved to any database
- **Anonymized AI Requests**: Only aggregated, anonymized data is sent to OpenAI for insights
- **Open Source**: Review the code yourself to verify security practices

## Technology Stack

- **Frontend**: React + Vite
- **Backend**: Express.js
- **AI**: OpenAI GPT-4o-mini
- **Visualization**: Recharts
- **Routing**: React Router
- **Styling**: Custom CSS

## Design Documentation

### Architecture Overview

PennyWise follows a client-server architecture with a clear separation of concerns:

**Frontend (React + Vite)**
- Single-page application with React Router for navigation
- Component-based architecture for modularity and reusability
- Local state management using React hooks (useState, useEffect)
- CSV parsing and transaction processing happens client-side for privacy
- Recharts library for interactive data visualizations

**Backend (Express.js)**
- Lightweight REST API server
- Three main endpoints:
  - `/api/categorize` - Categorizes individual transactions using AI
  - `/api/insights` - Generates personalized financial insights
  - `/api/analyze-goal` - Analyzes user financial goals and provides recommendations
- OpenAI GPT-4o-mini integration for natural language processing
- CORS enabled for local development

**Data Flow**
1. User uploads CSV files → Frontend parses and deduplicates transactions
2. Transactions sent to backend for AI categorization
3. Categorized data processed locally to generate spending summaries
4. Anonymized summaries sent to backend for AI insights generation
5. Results cached in component state to avoid redundant API calls

### Key Design Decisions

**Privacy-First Approach**
- All transaction data stays in browser memory (never persisted)
- Only category totals sent to AI, never individual transaction details
- No user accounts or databases to minimize data exposure

**Lifestyle Creep Detection Algorithm**
- Compares spending across months to identify gradual increases
- Severity thresholds: Low (<15% increase), Moderate (15-30%), High (>30%)
- Category-specific analysis for targeted recommendations
- Results cached to prevent re-analysis on navigation

**Smart Budgeting Interface**
- Range-based inputs reduce cognitive load vs. exact amounts
- "Other" option provides flexibility for edge cases
- 50/30/20 rule integration for financial education
- Goal forecasting uses AI to provide personalized guidance

**AI Prompt Engineering**
- Context-aware prompts differentiate between monthly and annual views
- Structured JSON responses for consistent parsing
- Fallback extraction for markdown-wrapped responses
- Temperature tuning (0.7) balances creativity with accuracy

### Future Enhancements

**1. Plaid Integration**
- Automatically connect to financial institutions via Plaid API
- Real-time transaction syncing without manual CSV uploads
- Support for checking accounts, credit cards, and investment accounts
- Automatic categorization with bank-provided metadata
- Estimated implementation: 2-3 weeks

**2. User Authentication & Profile Management**
- User accounts with secure authentication (OAuth 2.0 or Auth0)
- Persistent storage of transaction history and analysis results
- Cloud database (PostgreSQL or MongoDB) for data persistence
- Session management to maintain state across browser refreshes
- User preferences and customizable budget categories
- Estimated implementation: 3-4 weeks

**3. Advanced Analytics**
- Predictive spending forecasts using historical trends
- Anomaly detection for unusual transactions
- Comparative analysis against peer spending patterns
- Custom reporting and data export features
- Estimated implementation: 2-3 weeks

**4. Mobile Application**
- React Native mobile app for iOS and Android
- Push notifications for spending alerts and budget warnings
- Receipt scanning with OCR for manual entry
- Estimated implementation: 6-8 weeks

**5. Enhanced Lifestyle Creep Detection**
- Machine learning model trained on spending patterns
- Personalized thresholds based on income and location
- Predictive alerts before creep becomes significant
- Estimated implementation: 4-5 weeks

**6. Social Features**
- Anonymous spending comparisons with similar demographics
- Community-driven budgeting tips and challenges
- Accountability partners for financial goals
- Estimated implementation: 3-4 weeks

## Contributing

This is a hackathon project submission. Feel free to fork and adapt for your own use.

## License

MIT
