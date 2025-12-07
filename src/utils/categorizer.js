// Rule-based merchant categorization
const MERCHANT_RULES = {
  // Groceries
  groceries: [
    'whole foods', 'trader joe', 'safeway', 'kroger', 'publix', 'wegmans', 'aldi', 'costco',
    'walmart', 'target', 'sprouts', 'fresh market', 'food lion', 'giant', 'stop & shop',
    'albertsons', 'vons', 'ralphs', 'fred meyer', 'qfc', 'harris teeter', 'hy-vee',
    'meijer', 'winco', 'grocery', 'market', 'erewhon', 'gelson'
  ],
  
  // Dining & Restaurants
  dining: [
    'restaurant', 'cafe', 'coffee', 'starbucks', 'dunkin', 'chipotle', 'panera', 'subway',
    'mcdonald', 'burger king', 'wendy', 'taco bell', 'kfc', 'pizza', 'domino', 'papa john',
    'doordash', 'uber eats', 'grubhub', 'postmates', 'seamless', 'caviar', 'dine', 'bistro',
    'grill', 'bar', 'pub', 'kitchen', 'eatery', 'food', 'sweetgreen', 'cava', 'shake shack',
    'five guys', 'in-n-out', 'chick-fil-a', 'panda express', 'olive garden', 'applebee',
    'chili', 'outback', 'red lobster', 'cheesecake factory', 'nobu', 'catch', 'tao',
    'blue bottle', 'peet', 'caribou', 'dutch bros'
  ],
  
  // Transportation
  transportation: [
    'uber', 'lyft', 'taxi', 'cab', 'transit', 'metro', 'subway', 'bus', 'train', 'parking',
    'gas', 'shell', 'chevron', 'exxon', 'bp', 'mobil', 'arco', 'valero', '76', 'citgo',
    'speedway', 'wawa', 'sheetz', 'getaround', 'zipcar', 'turo', 'lime', 'bird', 'spin'
  ],
  
  // Shopping
  shopping: [
    'amazon', 'ebay', 'etsy', 'shop', 'store', 'retail', 'mall', 'nordstrom', 'macy',
    'bloomingdale', 'saks', 'neiman marcus', 'dillard', 'jcpenney', 'kohl', 'tj maxx',
    'marshalls', 'ross', 'burlington', 'h&m', 'zara', 'uniqlo', 'gap', 'old navy',
    'banana republic', 'urban outfitters', 'anthropologie', 'free people', 'lululemon',
    'nike', 'adidas', 'foot locker', 'dick sporting', 'rei', 'best buy', 'apple store',
    'microsoft store', 'gamestop', 'sephora', 'ulta', 'cvs', 'walgreens', 'rite aid',
    'revolve', 'asos', 'shein', 'fashion nova', 'pretty little thing'
  ],
  
  // Entertainment
  entertainment: [
    'theater', 'cinema', 'movie', 'amc', 'regal', 'cinemark', 'spotify', 'apple music',
    'youtube', 'twitch', 'concert', 'ticketmaster', 'stubhub', 'eventbrite', 'live nation',
    'bowling', 'arcade', 'golf', 'gym', 'fitness', 'planet fitness', 'la fitness', '24 hour',
    'equinox', 'crunch', 'anytime fitness', 'orange theory', 'crossfit', 'soulcycle',
    'peloton', 'classpass'
  ],
  
  // Subscriptions
  subscriptions: [
    'netflix', 'hulu', 'disney+', 'hbo', 'amazon prime', 'paramount', 'peacock', 'apple tv',
    'spotify premium', 'youtube premium', 'adobe', 'microsoft 365', 'icloud', 'dropbox',
    'google one', 'patreon', 'onlyfans', 'substack', 'medium', 'new york times', 'wsj',
    'washington post', 'audible', 'kindle unlimited', 'scribd'
  ],
  
  // Utilities
  utilities: [
    'electric', 'gas company', 'water', 'internet', 'comcast', 'xfinity', 'verizon', 'at&t',
    't-mobile', 'sprint', 'spectrum', 'cox', 'frontier', 'centurylink', 'optimum', 'rcn',
    'phone bill', 'utility', 'pge', 'con edison', 'duke energy', 'southern company'
  ],
  
  // Healthcare
  healthcare: [
    'pharmacy', 'doctor', 'hospital', 'clinic', 'medical', 'dental', 'dentist', 'vision',
    'optometry', 'urgent care', 'kaiser', 'cvs pharmacy', 'walgreens pharmacy', 'rite aid pharmacy',
    'health', 'therapy', 'counseling', 'psychiatry', 'psychology'
  ],
  
  // Insurance
  insurance: [
    'insurance', 'geico', 'state farm', 'allstate', 'progressive', 'liberty mutual',
    'farmers insurance', 'usaa', 'nationwide', 'travelers'
  ]
}

// Clean merchant name from bank transaction descriptions
function cleanMerchantName(description) {
  if (!description) return ''
  
  // Remove common prefixes
  let cleaned = description
    .replace(/^(SQ \*|PAR\*|PP\*|TST\*|SNACK\*|SP \*)/i, '')
    .replace(/ONLINE PAYMENT.*/i, 'payment')
  
  // Remove location info (city, state)
  cleaned = cleaned.replace(/\s+[A-Z]{2}(\s+null)?\s+X+\d+$/i, '')
  cleaned = cleaned.replace(/\s+\d{3}-\d{3}-\d{4}\s+[A-Z]{2}$/i, '')
  
  // Remove card numbers
  cleaned = cleaned.replace(/X+\d{4}/g, '')
  
  // Remove extra whitespace and null
  cleaned = cleaned.replace(/\s+null\s+/gi, ' ')
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  
  return cleaned
}

// Categorize based on merchant name
function categorizeByRules(merchant) {
  if (!merchant) return null
  
  const cleaned = cleanMerchantName(merchant)
  const lowerMerchant = cleaned.toLowerCase()
  
  for (const [category, keywords] of Object.entries(MERCHANT_RULES)) {
    if (keywords.some(keyword => lowerMerchant.includes(keyword))) {
      return category
    }
  }
  
  return null
}

// AI-based categorization fallback
async function categorizeByAI(merchant) {
  try {
    const response = await fetch('http://localhost:3001/api/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ merchant })
    })
    
    const { category } = await response.json()
    return category
  } catch (error) {
    console.error('AI categorization failed:', error)
    return 'other'
  }
}

// Main categorization function
export async function categorizeTransaction(merchant) {
  // Try rule-based first
  const ruleCategory = categorizeByRules(merchant)
  if (ruleCategory) {
    return ruleCategory
  }
  
  // Fallback to AI
  return await categorizeByAI(merchant)
}

// Batch categorization for efficiency
export async function categorizeTransactions(transactions) {
  const categorized = []
  const needsAI = []
  
  // First pass: rule-based
  for (const transaction of transactions) {
    const merchant = transaction.description || transaction.merchant || ''
    const ruleCategory = categorizeByRules(merchant)
    if (ruleCategory) {
      categorized.push({ ...transaction, category: ruleCategory })
    } else {
      needsAI.push({ ...transaction, merchant })
    }
  }
  
  // Second pass: AI for remaining
  if (needsAI.length > 0) {
    const aiResults = await Promise.all(
      needsAI.map(async (t) => ({
        ...t,
        category: await categorizeByAI(t.merchant)
      }))
    )
    categorized.push(...aiResults)
  }
  
  return categorized
}
