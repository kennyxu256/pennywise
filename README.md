# Pennywise - AI-Powered Lifestyle Creep Detector

## Problem Statement

Many people struggle with personal finance due to a lack of visibility and personalized, actionable advice. Manually tracking every expense is tedious, and generic budgeting apps often fail to inspire lasting behavioral change. As a result, people are often unaware of wasteful spending habits, miss opportunities to save, and feel anxious about their financial future.

**Pennywise** transforms raw transaction data into personalized insights that empower users to take control of their financial lives—with a special focus on detecting lifestyle creep before it becomes permanent.

## Key Features

### 🎯 Lifestyle Creep Detection (Our Signature Feature)
Catch those sneaky spending increases before they become habits. Our AI analyzes your spending patterns over time to identify:
- Gradual increases in discretionary categories (dining, rideshare, shopping)
- Severity scoring (Low/Moderate/High) with specific thresholds
- Month-over-month trend analysis
- Category-specific recommendations

Just because PennyWise is a creep doesn't mean you need lifestyle creep!

### 📊 Transaction Analysis
- Upload CSV files from any bank
- Automatic categorization and deduplication
- Interactive spending visualizations
- AI-powered insights tailored to your patterns

### 💰 Smart Budgeting
- Simple range-based budget setup
- Compare actual spending vs. goals
- No tedious penny-counting required

### 🔒 Privacy-First
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
- **AI**: OpenAI GPT-4
- **Visualization**: Recharts
- **Routing**: React Router

## Contributing

This is a hackathon project submission. Feel free to fork and adapt for your own use.

## License

MIT
