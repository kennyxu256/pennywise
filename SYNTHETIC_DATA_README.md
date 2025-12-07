# Synthetic Transaction Data - 2024 Annual Dataset

This folder contains comprehensive synthetic transaction data for a young professional throughout 2024, designed to demonstrate lifestyle creep patterns and trigger actionable AI insights.

## Files Overview

### 1. `checking_account_2024.csv`
**Essential expenses with gradual inflation**
- Groceries (Whole Foods, Trader Joe's, Safeway → Erewhon)
- Gas/Transportation (Chevron, Shell, Uber, Lyft)
- Utilities (Verizon, PGE Electric)
- **Trend**: Grocery spending increases 3x from $67/trip (Jan) to $233/trip (Dec) as user shifts to premium stores

### 2. `credit_card_1_2024.csv`
**Dining and entertainment with lifestyle creep**
- Coffee (Starbucks → Blue Bottle → Philz)
- Food delivery (DoorDash, Uber Eats, Chipotle)
- Subscriptions (Netflix, Spotify, Planet Fitness)
- Entertainment (AMC Theatres)
- **Trend**: Food delivery orders increase from $28 (Jan) to $122 (Dec), coffee upgrades from $5.75 to $29.40

### 3. `credit_card_2_2024.csv`
**Shopping and discretionary spending**
- Online shopping (Amazon, Target)
- Fashion (Nordstrom, Zara, H&M, Lululemon, Sephora)
- Insurance (Geico - constant $125/month)
- Healthcare (CVS Pharmacy)
- **Trend**: Amazon spending increases from $45 (Jan) to $478 (Dec), fashion spending escalates significantly

### 4. `credit_card_3_2024.csv`
**Subscriptions and entertainment with accumulation**
- Gym (Equinox - constant $200/month premium gym)
- Streaming services (starts with 3, grows to 9+ services)
- Apple ecosystem (iCloud 50GB → 2TB, adds Arcade, Fitness+, News+, TV+)
- Events (concerts, festivals, Broadway shows)
- **Trend**: Monthly subscriptions grow from ~$240 to ~$320 as services accumulate

## Key Lifestyle Creep Patterns

### Groceries
- **Jan**: $67 at Whole Foods
- **Dec**: $233 at Erewhon (247% increase)
- Pattern: Gradual shift to premium grocery stores

### Dining Out
- **Jan**: $5.75 Starbucks, $28 delivery
- **Dec**: $29.40 Philz Coffee, $122 delivery (329% increase in delivery)
- Pattern: Coffee upgrades + larger/more frequent delivery orders

### Shopping
- **Jan**: $45 Amazon, $67 Target
- **Dec**: $478 Amazon (966% increase), $279 Target
- Pattern: Increased online shopping frequency and order sizes

### Subscriptions
- **Jan**: 5 subscriptions (~$240/month)
- **Dec**: 12+ subscriptions (~$320/month)
- Pattern: Subscription accumulation without canceling old ones

### Entertainment
- **Q1**: $85-145 per event
- **Q4**: Events become more frequent and expensive
- Pattern: More premium entertainment choices

## Expected AI Insights

When uploading all 4 files together, the AI should detect:

1. **High Priority**: Grocery spending increased 247% - consider meal planning and shopping at mid-tier stores
2. **High Priority**: Food delivery spending up 329% - cooking at home could save $1,000+/month
3. **Medium Priority**: 12+ active subscriptions costing $320/month - audit and cancel unused services
4. **Medium Priority**: Shopping spending increased 966% on Amazon - implement 24-hour rule before purchases
5. **Low Priority**: Coffee upgrades from $6 to $29 per visit - consider brewing at home

## Testing Multi-File Upload

To test the multi-file aggregation feature:
1. Select all 4 CSV files at once in the file picker
2. The app should automatically deduplicate and combine them
3. Total transactions: ~600+ across 12 months
4. Should show clear month-over-month trends in all categories

## Realistic Details

- Insurance stays constant ($125/month) - realistic fixed expense
- Gym membership constant ($200/month) - premium but stable
- Utilities show seasonal variation
- Gas prices reflect typical fluctuations
- Merchant names include realistic formatting (SQ*, location codes, store numbers)
- Mix of debit/credit columns to test CSV parsing robustness
