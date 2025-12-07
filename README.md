# Pennywise - AI-Powered Financial Coach

## Problem Statement

Many people struggle with personal finance due to a lack of visibility and personalized, actionable advice. Manually tracking every expense is tedious, and generic budgeting apps often fail to inspire lasting behavioral change. As a result, people are often unaware of wasteful spending habits, miss opportunities to save, and feel anxious about their financial future.

**Pennywise** transforms raw transaction data into personalized insights that empower users to take control of their financial lives using AI-powered analysis.

## Key Features

- **AI-Powered Insights**: Upload your bank transactions and receive personalized financial advice tailored to your spending patterns
- **Lifestyle Creep Detection**: Identifies gradual increases in spending that erode savings potential, with severity scoring
- **Smart Budgeting**: Simple range-based budget setup that compares against actual spending
- **Spending Analysis**: Automatic categorization and visualization of your expenses with intelligent deduplication
- **Privacy-First**: All processing happens locally - your financial data never leaves your machine

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

1. **Start the backend server** (in one terminal):
   ```bash
   npm run server
   ```
   The server will start on `http://localhost:3001`

2. **Start the frontend** (in a separate terminal):
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

### 2. Upload Your Data

- Navigate to the **Dashboard** tab
- Click "Choose Files" and select your CSV file(s)
- You can upload multiple files from different banks
- Click "Analyze Spending" to process your transactions

### 3. Review Your Insights

**Dashboard**: View your spending breakdown by category with interactive charts

**AI Insights**: Get personalized recommendations based on your spending patterns, including:
- Spending habit analysis
- Savings opportunities
- Behavioral patterns
- Actionable next steps

**Lifestyle Creep**: Discover if your spending has gradually increased over time with:
- Severity assessment (Low/Moderate/High)
- Specific categories driving the increase
- Month-over-month trend analysis

**Budget**: Set up a simple budget using range selectors and compare against actual spending

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
