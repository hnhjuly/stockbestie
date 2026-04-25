import { LessonContent } from '@/types/academyContent';

export const ACADEMY_CONTENT: LessonContent[] = [
  // ============================================================
  // LESSON 1: WHAT IS A STOCK?
  // ============================================================
  {
    id: 1,
    title: "What is a Stock?",
    icon: "🌱",
    subtitle: "Let's start at the very beginning, no pressure, no jargon.",
    whatYoullLearn: [
      "What it actually means to 'own' a stock",
      "The difference between public and private companies",
      "How and where stocks are bought (brokerages, exchanges, tickers)",
      "Why stock prices move up and down",
      "The real meaning behind scary-sounding words like 'bull market' and 'IPO'"
    ],
    introduction:
      "Welcome to StockBestie! Before we dive in, take a breath. You don't need a finance degree to understand this, and you definitely don't need to memorize anything. " +
      "The word 'stock' gets thrown around on TikTok, in the news, at dinner tables, usually by people making it sound more complicated than it is. " +
      "\n\n" +
      "The truth is refreshingly simple: a stock is a small piece of ownership in a company. That's it. When you buy a stock, you literally own a tiny slice of that business. If the business grows, your slice becomes more valuable. If it shrinks, your slice does too. " +
      "\n\n" +
      "By the end of this lesson, you'll know what's actually happening when you see prices flashing on a screen, and why it's way less scary than it looks.",
    concepts: [
      {
        icon: "🍕",
        title: "A stock is a slice of the pizza",
        body:
          "Imagine your favorite pizza place decides to sell 100 slices of ownership in the restaurant. You buy one slice for $10. Now you own 1% of the pizza place. " +
          "\n\n" +
          "If the restaurant has a great year and becomes more valuable, your 1% slice is worth more. If a new pizza place opens next door and business drops, your slice is worth less. You didn't buy a pizza, you bought a piece of the business. " +
          "\n\n" +
          "That's it. That's what a stock is. Every time you hear 'share,' 'equity,' or 'stock,' just think: a slice of ownership.",
        bestieNote: "You don't need to understand anything more complicated than this to start. Everything else is just detail."
      },
      {
        icon: "🏢",
        title: "Public vs. Private companies",
        body:
          "Not every business sells slices to the public. The coffee shop on your corner is probably 'private', the owner keeps it in the family, and you can't just walk in and buy 5% of it. " +
          "\n\n" +
          "'Public' companies, on the other hand, have decided to let anyone buy a slice. They list their shares on a stock exchange, a kind of massive organized marketplace where buyers and sellers meet. The most famous ones are the NYSE (New York Stock Exchange) and NASDAQ. The event where a private company first lets the public buy in is called an IPO: Initial Public Offering. " +
          "\n\n" +
          "Apple, Nike, Netflix, they're all public. Your neighbor's bakery probably isn't."
      },
      {
        icon: "📱",
        title: "How you actually buy one",
        body:
          "You can't just walk into Apple's office and hand them $20. To buy stock, you need a brokerage, an app or website that acts as a bridge between you and the stock exchange. Robinhood, Fidelity, Charles Schwab, E*TRADE, these are all brokerages. " +
          "\n\n" +
          "Every stock has a 'ticker symbol', a short nickname. Apple is AAPL. Tesla is TSLA. Netflix is NFLX. You type the ticker, choose how many shares to buy, and confirm. That's it. " +
          "\n\n" +
          "Under the hood, a lot is happening (there are 'market makers' matching you with sellers, and a split-second price negotiation called the 'bid-ask spread'), but from your side it's usually just a few taps."
      },
      {
        icon: "📈",
        title: "Why prices move",
        body:
          "Stock prices go up and down for one core reason: supply and demand. If lots of people want to buy a stock (more demand than sellers), the price rises. If lots of people want to sell (more supply than buyers), the price falls. " +
          "\n\n" +
          "WHY they want to buy or sell is where it gets human. Good earnings report? People buy. A CEO scandal? People sell. A new product launch? Maybe. A random tweet? Sometimes. " +
          "\n\n" +
          "Long-term, stock prices tend to follow the company's actual business performance. Short-term, they can be moved by emotions, news, rumors, and hype. This is why StockBestie exists: the short-term noise is loud, and the long-term truth is calmer.",
        bestieNote: "You don't need to follow prices every day. Most successful investors rarely do."
      },
      {
        icon: "🐂",
        title: "Bulls, bears, and market moods",
        body:
          "Two terms you'll hear constantly: 'bull market' and 'bear market.' Picture the animals. A bull thrusts its horns UP, prices are rising, people are optimistic, the general mood is good. A bear swipes its paws DOWN, prices are falling, people are worried. " +
          "\n\n" +
          "The official definitions (per SEC and FINRA): a 'correction' is a decline of at least 10% from a recent high. A 'bear market' is a more serious decline of 20% or more from a recent high. " +
          "\n\n" +
          "Both are completely normal parts of the market cycle. Historically, every bear market has eventually been followed by a recovery. Past performance doesn't guarantee the future, but the long-term pattern is reassuring."
      }
    ],
    glossary: [
      { term: "Share / Stock", definition: "A small piece of ownership in a company. Buying one share = owning one slice of that business." },
      { term: "Ticker Symbol", definition: "A short nickname for a stock, usually 1–5 letters. Apple is AAPL, Tesla is TSLA." },
      { term: "Brokerage", definition: "An app or platform (like Robinhood, Fidelity, E*TRADE) that lets you buy and sell stocks." },
      { term: "Stock Exchange", definition: "The organized marketplace where stocks are traded. Big examples: NYSE and NASDAQ." },
      { term: "IPO (Initial Public Offering)", definition: "The first time a private company sells its shares to the general public." },
      { term: "Bull Market", definition: "A period when prices are generally rising and investors are optimistic." },
      { term: "Bear Market", definition: "A period when a broad market index has dropped 20% or more from a recent high." },
      { term: "Correction", definition: "A drop of at least 10% (but less than 20%) from a recent market high." }
    ],
    commonMistakes: [
      {
        mistake: "Thinking a $1 stock is 'cheaper' than a $100 stock",
        why: "The share price alone tells you nothing about value. A company with a $1 share price but billions of shares can be more expensive overall than one with a $100 share price. Always compare market capitalization (total company value), not share prices."
      },
      {
        mistake: "Assuming you need a lot of money to start",
        why: "Most modern brokerages allow 'fractional shares', you can buy $10 worth of a stock even if one share costs $500. You can start investing with whatever small amount feels safe to you."
      },
      {
        mistake: "Reacting emotionally to every headline",
        why: "The news is designed to be dramatic because drama keeps you watching. A 1–2% daily move is normal. A 'MARKETS IN CHAOS' banner often refers to something that would put a long-term investor gently to sleep."
      }
    ],
    readyToQuizMessage: "Feeling good? The quiz is a quick, low-pressure way to lock this in. You can't 'fail', every wrong answer comes with an explanation."
  },

  // ============================================================
  // LESSON 2: COMPANY BASICS
  // ============================================================
  {
    id: 2,
    title: "Company Basics",
    icon: "🏢",
    subtitle: "How to tell a 'Bestie' business from a 'basic' one.",
    whatYoullLearn: [
      "The difference between revenue and profit (a surprisingly huge deal)",
      "What 'overhead' is and why it can make or break a business",
      "How to think about a company's 'moat', its defense against competitors",
      "Why diversified revenue and scalability make investors excited",
      "How to spot a strong brand vs. a forgettable one"
    ],
    introduction:
      "Before you invest in a company, it helps to understand what makes a company actually good. Not 'good' in a vague way, good in a way that tends to show up in the stock price over time. " +
      "\n\n" +
      "The best investors don't just look at share prices. They look at the business underneath the stock. Is it making money? Does it have loyal customers? Can it grow without spending a fortune? Is there anything stopping a bigger competitor from eating its lunch? " +
      "\n\n" +
      "This lesson gives you the mental checklist to size up a business like a pro, without needing any accounting experience.",
    concepts: [
      {
        icon: "💰",
        title: "Revenue is not profit",
        body:
          "This one trips up a lot of beginners. Revenue is the total money a company brings in from sales. Profit is what's left after all the costs. " +
          "\n\n" +
          "Picture a lemonade stand. You sell $50 of lemonade today (that's revenue). But you spent $30 on lemons, sugar, and cups. Your profit is $20. " +
          "\n\n" +
          "A company can have huge revenue and still lose money if its costs are even higher. When you see headlines like 'Tesla made $25 billion!', always ask: is that revenue or profit? They're very different numbers, and they tell you very different stories.",
        bestieNote: "If you only remember one thing from this lesson: revenue = money in, profit = money kept."
      },
      {
        icon: "💸",
        title: "Overhead: the costs that never sleep",
        body:
          "Overhead refers to the fixed costs of running a business: rent, salaries, electricity, insurance. These bills arrive whether you make a sale or not. " +
          "\n\n" +
          "Imagine you open a pizza shop that costs $1,000 a month in rent. Even on a day you sell zero pizzas, that $1,000 is still due. High overhead makes a business fragile: when sales dip, those fixed costs can quickly flip a profit into a loss. " +
          "\n\n" +
          "Investors often prefer 'asset-light' or 'low-overhead' businesses (like many software companies) that can survive dry spells without burning through cash."
      },
      {
        icon: "🏰",
        title: "The 'Moat' concept",
        body:
          "Warren Buffett popularized a beautifully simple idea: a great business has an 'economic moat', something that protects it from competitors. Think of a medieval castle with a water-filled moat around it. Attackers can't easily cross it. " +
          "\n\n" +
          "Moats come in many forms. Instagram has a 'network effect' moat, everyone's already there, so a new social app struggles to pull people away. Coca-Cola has a 'brand' moat, people pay extra just for the red label. Apple has an 'ecosystem' moat, once you own an iPhone, MacBook, and AirPods, switching is painful. " +
          "\n\n" +
          "No moat = constant price wars and thin margins. Strong moat = protected profits over the long run."
      },
      {
        icon: "🌀",
        title: "Scalability: the growth shortcut",
        body:
          "Some businesses get more profitable as they grow. Others just get more expensive. The difference is scalability. " +
          "\n\n" +
          "A software company builds an app once. Selling it to 1,000 people costs almost nothing extra. Selling it to 10 million people still costs almost nothing extra. That's scalability, and it's why tech companies can become so enormously valuable. " +
          "\n\n" +
          "A bakery, by contrast, has to buy more flour, hire more staff, and rent more space every time demand grows. Not bad, just different. Businesses that scale well tend to be attractive to investors because each new customer barely adds to costs."
      },
      {
        icon: "🧺",
        title: "Diversification inside the business",
        body:
          "Apple doesn't just sell iPhones. It sells iPads, MacBooks, AirPods, Apple Watches, App Store apps, Apple Music, iCloud storage, and more. If iPhone sales stumble one year, the other products keep the engine running. " +
          "\n\n" +
          "Compare that to a company that only makes one product, say, a single type of phone charger. If that charger becomes obsolete, the whole company is in trouble. " +
          "\n\n" +
          "When looking at a business, check whether its revenue comes from many sources or just one. More sources = more resilience.",
        bestieNote: "Diversification isn't just for your portfolio. Good companies build it into their own business model."
      }
    ],
    glossary: [
      { term: "Revenue", definition: "The total amount of money a company brings in from sales, before any costs are subtracted. Sometimes called the 'top line.'" },
      { term: "Profit", definition: "What's left over after all costs are paid. Sometimes called 'net income' or the 'bottom line.'" },
      { term: "Overhead", definition: "The fixed costs a business has to pay regardless of how much it sells: rent, salaries, utilities." },
      { term: "Moat", definition: "A competitive advantage that makes it hard for rivals to steal customers. Can be brand, network effect, ecosystem, or cost advantages." },
      { term: "Scalability", definition: "The ability to grow revenue significantly without a matching increase in costs. Software is the classic example." },
      { term: "Market Share", definition: "The percentage of total sales in an industry that one company controls." },
      { term: "Pricing Power", definition: "The ability to raise prices without losing customers. Strong brands and wide moats usually have pricing power." },
      { term: "Business Model", definition: "How a company actually makes money: subscription, one-time purchase, ads, commission, etc." }
    ],
    commonMistakes: [
      {
        mistake: "Only looking at revenue growth",
        why: "A company doubling its revenue while losing more money every year isn't necessarily a win. Growing revenue with shrinking (or negative) profits can signal trouble. Always check both."
      },
      {
        mistake: "Assuming a famous brand is a good investment",
        why: "Popularity doesn't equal profitability. Plenty of well-known brands have struggled financially. Brand awareness is a starting point, not a reason to buy."
      },
      {
        mistake: "Ignoring competition",
        why: "A company with no moat in a crowded industry often ends up in a race to the bottom on price. Always ask: what would stop a bigger competitor from doing this better?"
      }
    ],
    readyToQuizMessage: "Ready to practice spotting good businesses? The quiz will throw a few scenarios at you, just apply what you read."
  },

  // ============================================================
  // LESSON 3: FINANCIAL STATEMENTS
  // ============================================================
  {
    id: 3,
    title: "Financial Statements",
    icon: "📊",
    subtitle: "Reading a company's 'report card' without getting a headache.",
    whatYoullLearn: [
      "The three main financial statements every investor should know",
      "The difference between 'profit' and 'cash flow' (they're NOT the same)",
      "What assets, liabilities, and equity actually mean",
      "How to spot red flags in a company's numbers",
      "Simple ratios that tell you a lot with one glance"
    ],
    introduction:
      "Every public company is required to publish detailed financial reports, usually every three months (quarterly) and once a year (annually). These reports are where the real story of a business lives. " +
      "\n\n" +
      "You don't need to be an accountant to read them. You just need to know the three main statements and what each one tells you. Think of it like reading a report card: some subjects matter more than others, and you quickly learn which numbers to check first. " +
      "\n\n" +
      "By the end of this lesson, you'll have a simple framework for sizing up a company's financial health in a few minutes.",
    concepts: [
      {
        icon: "📅",
        title: "The three main statements",
        body:
          "There are three core financial statements, and each answers a different question:" +
          "\n\n" +
          "• **Income Statement** (or P&L), 'How much did the company make or lose over a period of time?' Starts with revenue at the top, subtracts costs, and ends with profit at the bottom." +
          "\n" +
          "• **Balance Sheet**: 'What does the company own and owe, right now?' A snapshot of assets (what they have) vs. liabilities (what they owe)." +
          "\n" +
          "• **Cash Flow Statement**: 'Where is the actual cash coming and going?' Tracks real money moving in and out of the bank account." +
          "\n\n" +
          "Together, these three paint the full picture. Miss one, and you can get fooled.",
        bestieNote: "You don't need to memorize every line. Just remember what each statement is there to answer."
      },
      {
        icon: "⚖️",
        title: "Assets = Liabilities + Equity",
        body:
          "This is the foundational equation of the balance sheet. Let's decode it with a personal example. " +
          "\n\n" +
          "Say you have $100 in your pocket (asset) but owe your brother $40 (liability). What you truly own free and clear is $60. That $60 is your 'equity', your real ownership stake. " +
          "\n\n" +
          "Companies work the same way. A business might have $10 million in assets (cash, buildings, equipment, inventory) and $4 million in liabilities (loans, unpaid bills). That means $6 million in equity, the shareholders' actual stake. " +
          "\n\n" +
          "More equity generally means a stronger, less fragile business."
      },
      {
        icon: "💧",
        title: "Profit vs. Cash Flow: the silent killer of beginners",
        body:
          "This is one of the most important distinctions in finance, and it's invisible to anyone who only glances at headlines. " +
          "\n\n" +
          "A company can show big 'profits' on paper while having no actual cash in the bank. How? If they 'sold' products on credit, the profit is recorded immediately, but the money hasn't arrived yet. Meanwhile, rent and payroll still need to be paid. " +
          "\n\n" +
          "This is why the cash flow statement matters. It cuts through accounting to show what actually hit the bank account. A business can be profitable and still go bankrupt from running out of cash. It's happened many times. " +
          "\n\n" +
          "When you hear a company is 'cash flow positive,' that's usually a healthy sign."
      },
      {
        icon: "🔢",
        title: "Three quick ratios to know",
        body:
          "You can learn a lot with just three simple ratios, and you can find them on any financial site:" +
          "\n\n" +
          "• **Gross Margin** = (Revenue − Direct Costs) ÷ Revenue. A shirt that costs $20 to make and sells for $100 has a gross margin of 80%. High margins = strong business." +
          "\n" +
          "• **EPS (Earnings Per Share)** = Total Profit ÷ Number of Shares. It tells you how much profit is 'attached' to each share. Rising EPS over time = great sign." +
          "\n" +
          "• **Debt-to-Equity** = Total Debt ÷ Total Equity. How much the company owes vs. how much it actually owns. Lower is generally safer, though some debt is fine if used wisely." +
          "\n\n" +
          "Don't try to memorize all ratios at once. These three alone will get you surprisingly far."
      },
      {
        icon: "🚩",
        title: "Red flags to watch for",
        body:
          "A few patterns that often signal trouble: rapidly growing revenue with shrinking margins (the company may be buying growth unsustainably), a balance sheet loaded with debt relative to equity (fragile during downturns), piles of unsold inventory (products may be going stale), and cash flow that's consistently negative while reported 'profits' look positive (accounting might be flattering a weak underlying business). " +
          "\n\n" +
          "None of these are automatic disasters. They're just signs worth investigating further before investing."
      }
    ],
    glossary: [
      { term: "Income Statement (P&L)", definition: "Shows revenue, costs, and profit over a period (month, quarter, year). Answers: did the company make money?" },
      { term: "Balance Sheet", definition: "A snapshot of what a company owns and owes at a specific moment. Shows assets, liabilities, and equity." },
      { term: "Cash Flow Statement", definition: "Tracks the actual cash moving in and out of the business, separate from accounting profits." },
      { term: "Assets", definition: "Anything the company owns that has value: cash, property, inventory, patents." },
      { term: "Liabilities", definition: "Anything the company owes, loans, unpaid bills, taxes." },
      { term: "Equity", definition: "What's left for shareholders after liabilities are paid off. Assets minus liabilities." },
      { term: "EPS (Earnings Per Share)", definition: "Total profit divided by total shares outstanding. Rising EPS = good sign." },
      { term: "Gross Margin", definition: "The percentage of revenue left after direct production costs. High margins often signal a strong business." }
    ],
    commonMistakes: [
      {
        mistake: "Trusting 'profit' without checking cash flow",
        why: "Accounting profit can be real or can be smoke and mirrors. Cash flow is harder to fake. If profits are high but cash is draining, something may be off."
      },
      {
        mistake: "Fearing any debt",
        why: "Debt isn't automatically bad. Companies can borrow smartly to fund profitable growth. The question is whether their cash flow comfortably covers the interest payments."
      },
      {
        mistake: "Comparing companies across industries by raw numbers",
        why: "A software company and a grocery chain have totally different 'normal' margins and ratios. Always compare a company to its own industry peers for meaningful context."
      }
    ],
    readyToQuizMessage: "You've got more financial literacy than most people already. Time to lock it in with some practice."
  },

  // ============================================================
  // LESSON 4: VALUATION
  // ============================================================
  {
    id: 4,
    title: "Valuation",
    icon: "🏷️",
    subtitle: "Is this stock a steal, a scam, or somewhere in between?",
    whatYoullLearn: [
      "What the P/E ratio actually means (and its limits)",
      "Other valuation ratios: P/B, P/S, dividend yield, PEG",
      "The difference between 'cheap' and 'undervalued'",
      "What 'intrinsic value' and 'margin of safety' mean",
      "Why the same number means different things in different industries"
    ],
    introduction:
      "Valuation is the art (and partly science) of figuring out what a company is actually worth, and whether its current stock price is a deal, a disaster, or reasonable. " +
      "\n\n" +
      "Here's the big idea: price and value are not the same thing. Price is what the market is charging today. Value is what the thing is actually worth. Smart investors look for situations where the two are meaningfully different. " +
      "\n\n" +
      "You don't need complicated math for this. A handful of simple ratios and a healthy dose of common sense go a long way. Let's walk through them.",
    concepts: [
      {
        icon: "🥇",
        title: "P/E: the classic valuation yardstick",
        body:
          "P/E stands for 'Price-to-Earnings.' It's calculated as stock price divided by earnings per share. " +
          "\n\n" +
          "If a stock has a P/E of 20, you're paying $20 for every $1 of annual profit the company currently makes. A P/E of 10 means you're paying $10 per $1 of profit, 'cheaper' on this measure. A P/E of 100 means the market expects enormous future growth and is paying a big premium today. " +
          "\n\n" +
          "High P/E isn't automatically bad. If the company is growing 50% per year, today's earnings are a tiny fraction of what tomorrow's might be. Low P/E isn't automatically good either, sometimes it means the market expects earnings to shrink.",
        bestieNote: "P/E is a starting point, not a verdict. Always ask why a P/E is high or low."
      },
      {
        icon: "📚",
        title: "P/B and P/S: when P/E doesn't work",
        body:
          "Some companies don't have positive earnings yet (especially young biotech or tech startups). Others have weird accounting that makes P/E misleading. That's where other ratios help." +
          "\n\n" +
          "**P/B (Price-to-Book)** compares the stock price to the company's 'book value': roughly what you'd get if you sold off all its assets and paid off its debts. Useful for asset-heavy businesses like banks or manufacturers. A P/B under 1 means the market values the company at less than its accounting value, a possible bargain, or a warning sign." +
          "\n\n" +
          "**P/S (Price-to-Sales)** compares market cap to annual revenue. Useful when a company isn't profitable yet but has real sales. Lets you ask: 'How much am I paying per $1 of sales?'"
      },
      {
        icon: "📏",
        title: "PEG: P/E adjusted for growth",
        body:
          "The PEG ratio was popularized by legendary investor Peter Lynch. The idea: a high P/E is justified if the company is growing fast. The formula: P/E divided by earnings growth rate (as a whole number, not a decimal). " +
          "\n\n" +
          "A stock with a P/E of 30 growing earnings at 30% per year has a PEG of 1.0, which Lynch considered fairly priced. Under 1.0 may suggest undervalued for its growth rate. Over 1.0 may suggest the market has already baked in lots of optimism. " +
          "\n\n" +
          "Like all ratios, PEG is a rough guide, not a guarantee. Growth estimates can be wrong. Lynch himself said this ratio is most useful for actual growth companies, not slow, mature ones."
      },
      {
        icon: "💎",
        title: "Intrinsic value and the margin of safety",
        body:
          "Investing pioneer Benjamin Graham taught that every stock has an 'intrinsic value', what it's actually worth based on the underlying business, separate from what the market is willing to pay. " +
          "\n\n" +
          "Your job as an investor is to estimate that intrinsic value, then buy when the market price is comfortably below it. The gap between price and value is your 'margin of safety', a buffer that protects you when you're wrong (and you will be wrong sometimes). " +
          "\n\n" +
          "Graham said margin of safety was 'the central concept of investment.' His star student Warren Buffett has said the same thing for decades. The concept is 90 years old and still holds up.",
        bestieNote: "Price is what you pay. Value is what you get. Keep those two separate in your mind."
      },
      {
        icon: "🪤",
        title: "Beware the value trap",
        body:
          "A stock that's dropped 80% might look irresistibly cheap. But 'cheap' isn't the same as 'undervalued.' " +
          "\n\n" +
          "A 'value trap' is a stock that keeps looking cheap by traditional metrics, but stays cheap because the business is genuinely deteriorating. Customers leaving, products falling behind, margins shrinking. Each quarter the price drops more, each quarter the ratios look even more attractive on paper, and each quarter the underlying business is getting worse. " +
          "\n\n" +
          "The fix: always look at WHY a stock is cheap. A real bargain is a good company selling below its worth. A value trap is a bad company that looks good on a spreadsheet."
      }
    ],
    glossary: [
      { term: "P/E Ratio", definition: "Price-to-Earnings. Stock price ÷ earnings per share. Tells you how much you're paying per $1 of current profit." },
      { term: "P/B Ratio", definition: "Price-to-Book. Stock price relative to the company's accounting 'book value.' Useful for asset-heavy businesses." },
      { term: "P/S Ratio", definition: "Price-to-Sales. Stock price relative to revenue per share. Useful when the company isn't yet profitable." },
      { term: "PEG Ratio", definition: "P/E divided by earnings growth rate. Popularized by Peter Lynch; a PEG around 1 is considered fairly priced." },
      { term: "Dividend Yield", definition: "Annual dividend ÷ stock price. Tells you the cash return if you held the stock for a year at today's price." },
      { term: "Intrinsic Value", definition: "What a company is actually worth based on its underlying business, independent of today's stock price." },
      { term: "Margin of Safety", definition: "The buffer between what a stock is worth and what you pay. A Benjamin Graham concept, the foundation of value investing." },
      { term: "Value Trap", definition: "A stock that looks cheap on ratios but stays cheap because the underlying business is actually getting worse." }
    ],
    commonMistakes: [
      {
        mistake: "Using P/E alone to decide if something is 'cheap'",
        why: "P/E without context is almost useless. A P/E of 15 might be expensive for a slow grocery chain and cheap for a fast-growing tech leader. Always compare within an industry."
      },
      {
        mistake: "Ignoring the quality of the business",
        why: "A cheap price on a broken business is still a bad deal. Warren Buffett famously moved from pure 'cheap' value investing to preferring 'wonderful companies at fair prices.'"
      },
      {
        mistake: "Treating analyst estimates as facts",
        why: "Forward P/E and PEG ratios depend on analyst growth estimates, which are often wrong. Treat them as one data point among many, not as a promise."
      }
    ],
    readyToQuizMessage: "Valuation is one of those skills that feels confusing at first and then suddenly clicks. The quiz will help it click."
  },

  // ============================================================
  // LESSON 5: RISK
  // ============================================================
  {
    id: 5,
    title: "Risk",
    icon: "🛡️",
    subtitle: "Risk isn't the enemy. Pretending it doesn't exist is.",
    whatYoullLearn: [
      "Why diversification is your best friend",
      "The difference between volatility and true risk",
      "What 'risk tolerance' means, and why it's personal",
      "The importance of emergency funds before investing",
      "How beta, inflation risk, and concentration risk work"
    ],
    introduction:
      "Here's something most investing content gets wrong: it either pretends risk doesn't exist (hype videos) or treats risk as something to be avoided at all costs (fear-based content). Both are misleading. " +
      "\n\n" +
      "The real goal isn't to eliminate risk, it's to understand it, manage it, and take the right amount of it for your specific situation. Someone saving for retirement in 40 years should think about risk very differently than someone saving for a house in 6 months. " +
      "\n\n" +
      "By the end of this lesson, you'll have a much healthier, more realistic relationship with risk. No scare tactics, no hype, just the mechanics.",
    concepts: [
      {
        icon: "🧺",
        title: "Don't put all your eggs in one basket",
        body:
          "This old saying is the single most important principle in investing. If you put all your money into one stock and that stock goes to zero, you lose everything. If you spread it across 20 stocks and one goes to zero, you've lost 5%. Hugely different outcomes. " +
          "\n\n" +
          "This is 'diversification', spreading your money across different companies, sectors, and sometimes asset classes (stocks, bonds, cash). The math is unforgiving: a single concentrated bet can wipe out years of careful saving. " +
          "\n\n" +
          "The good news: modern tools like ETFs (Exchange-Traded Funds) give you instant diversification. Buying one share of a broad index ETF can give you exposure to hundreds of companies at once.",
        bestieNote: "Diversification won't make you rich overnight, but it keeps one bad event from wiping you out. That's the whole point."
      },
      {
        icon: "🎢",
        title: "Volatility vs. actual risk",
        body:
          "Volatility is how much a price swings up and down. Risk is the chance of losing money you can't afford to lose. They're related but not identical. " +
          "\n\n" +
          "A stock that bounces wildly up 40% and down 35% is volatile. But if you're holding it for 30 years, the volatility might not matter, what matters is where it ends up long term. On the other hand, money you need next month shouldn't be in anything volatile, because you might be forced to sell exactly when it's down. " +
          "\n\n" +
          "This is why 'time horizon' matters so much. Long horizon = more room to absorb volatility. Short horizon = stability matters more than upside."
      },
      {
        icon: "📊",
        title: "Beta: measuring one kind of risk",
        body:
          "Beta is a number that tells you how much a stock typically moves relative to the overall market. " +
          "\n\n" +
          "• A beta of 1 means the stock moves roughly in line with the market." +
          "\n" +
          "• A beta of 1.5 means the stock tends to move 50% MORE than the market. If the market drops 10%, this stock might drop 15%." +
          "\n" +
          "• A beta of 0.5 means the stock tends to move only half as much as the market, steadier, but often with less upside too." +
          "\n\n" +
          "Growth and tech stocks often have higher betas. Utilities and consumer staples often have lower betas. Beta is backward-looking (based on history), so it's a rough guide, not a crystal ball."
      },
      {
        icon: "🏃",
        title: "Risk tolerance is personal",
        body:
          "Two people can own the same stock. It drops 30%. One sleeps fine. The other panic-sells at midnight. The stock didn't get riskier, the people had different risk tolerances. " +
          "\n\n" +
          "Risk tolerance is a mix of emotional capacity (how much you can mentally handle seeing drops) and financial capacity (how much you can actually afford to lose). Both matter. " +
          "\n\n" +
          "If a 30% drop would make you panic-sell, you probably shouldn't be 100% in something that volatile. The 'best' portfolio isn't the one with the highest returns on paper, it's the one you can actually hold through the ugly periods without panicking.",
        bestieNote: "Know yourself first. Then build a portfolio you can actually live with."
      },
      {
        icon: "🛟",
        title: "The emergency fund goes first",
        body:
          "Before any long-term investing, most financial educators recommend building an emergency fund of 3–6 months of essential expenses in a safe, accessible account (like a high-yield savings account). " +
          "\n\n" +
          "Why? Life happens. Cars break. People get laid off. Medical bills appear. Without an emergency fund, an unexpected expense could force you to sell investments at a bad time, like during a market dip. That's one of the fastest ways to lock in losses. " +
          "\n\n" +
          "Think of your emergency fund as the oxygen mask. You put it on first, THEN help others. Investing comes after stability, not before."
      },
      {
        icon: "📉",
        title: "The sneaky risks: inflation and concentration",
        body:
          "Two risks beginners often underestimate:" +
          "\n\n" +
          "**Inflation risk**: cash 'feels' safe, but over time, inflation quietly erodes its buying power. At 3% annual inflation, $10,000 today has the purchasing power of about $7,400 in 10 years. 'Safe' doesn't mean 'no risk.'" +
          "\n\n" +
          "**Concentration risk**: owning too much of one thing. Especially dangerous when that one thing is your employer's stock, because your income AND your investments are tied to the same company. If the company struggles, you could lose your job AND most of your savings at once."
      }
    ],
    glossary: [
      { term: "Diversification", definition: "Spreading your money across many investments so no single one can wipe you out." },
      { term: "Volatility", definition: "How much a price swings up and down over time. High volatility = big swings, both up and down." },
      { term: "Beta", definition: "A measure of how much a stock tends to move relative to the overall market. Market = 1.0; higher = more volatile, lower = less." },
      { term: "Risk Tolerance", definition: "How much potential loss and volatility you can emotionally AND financially handle without panic-selling." },
      { term: "Time Horizon", definition: "How long before you actually need the money. Longer horizons allow more risk-taking." },
      { term: "Emergency Fund", definition: "3–6 months of essential expenses kept in a safe, accessible account. Build this BEFORE investing in markets." },
      { term: "Inflation Risk", definition: "The risk that rising prices erode the purchasing power of your cash over time." },
      { term: "Concentration Risk", definition: "The danger of having too much of your money tied up in one investment, industry, or employer." }
    ],
    commonMistakes: [
      {
        mistake: "Investing before having an emergency fund",
        why: "Without a cash cushion, a surprise expense can force you to sell investments at the worst possible time. Get the cushion first, then invest the rest."
      },
      {
        mistake: "Confusing 'no volatility' with 'no risk'",
        why: "Stashing cash under the mattress feels safe, but inflation quietly reduces your buying power every year. Not moving is its own form of risk."
      },
      {
        mistake: "Taking more risk than your stomach can handle",
        why: "The best strategy is one you can actually stick to. If you can't sleep through a 30% drop, you shouldn't be in a portfolio that might have one."
      }
    ],
    readyToQuizMessage: "Risk gets less scary once you understand the mechanics. Let's make sure they stuck."
  },

  // ============================================================
  // LESSON 6: MARKET PSYCHOLOGY
  // ============================================================
  {
    id: 6,
    title: "Market Psychology",
    icon: "🧠",
    subtitle: "The market is basically a giant group chat. Let's decode the vibes.",
    whatYoullLearn: [
      "Why your brain is often your biggest investing enemy",
      "The main biases that hurt investor returns (FOMO, loss aversion, anchoring)",
      "How herd behavior inflates bubbles and deepens crashes",
      "Why media headlines amplify emotion, and how to filter them",
      "The power of a written investment thesis"
    ],
    introduction:
      "Here's a truth most beginners don't realize until they lose money: investing is more about psychology than math. The math is usually simple. Your emotions are the hard part. " +
      "\n\n" +
      "Study after study has shown that the average investor underperforms the very funds they invest in, because they buy high in excitement and sell low in panic. The fund's returns are fine. The investor's returns are worse, because of behavior. " +
      "\n\n" +
      "This lesson is about knowing your own brain well enough to work around it. Everyone has biases, including professionals. The goal isn't to become robotic. It's to recognize the feelings as they happen and not let them drive the car.",
    concepts: [
      {
        icon: "🔥",
        title: "FOMO: the enemy of good decisions",
        body:
          "FOMO, Fear Of Missing Out, is the feeling that everyone else is getting rich except you. A stock is up 500% this week. Your group chat won't stop talking about it. Your friend just bought. You start to feel stupid for not being in. " +
          "\n\n" +
          "This feeling peaks right before things crash. Think about it: by the time a stock is a headline, it's usually already had its run. The people making the most noise about it are often the last ones in, not the first. " +
          "\n\n" +
          "The antidote to FOMO isn't willpower. It's having a plan you wrote down BEFORE the hype. If your plan doesn't include 'buy whatever TikTok is pumping,' the plan is doing its job.",
        bestieNote: "When everyone is screaming 'TO THE MOON,' the moon is usually already behind us."
      },
      {
        icon: "🐑",
        title: "Herd behavior",
        body:
          "Humans evolved to follow the herd. In the wilderness, this saved lives, if everyone else is running, you probably should too. In investing, it's often a disaster. " +
          "\n\n" +
          "Herd behavior is why bubbles inflate (everyone's buying because everyone's buying) and why crashes overshoot (everyone's selling because everyone's selling). The underlying business may not have changed at all. The herd is moving, so the price moves with it. " +
          "\n\n" +
          "Recognizing herd behavior in yourself is hard because it doesn't feel like following a herd. It feels like 'everyone can't be wrong.' (Spoiler: historically, everyone can absolutely be wrong.)"
      },
      {
        icon: "💔",
        title: "Loss aversion and the disposition effect",
        body:
          "Psychology research has shown that the pain of losing $100 is roughly twice as intense as the joy of gaining $100. This is called loss aversion. " +
          "\n\n" +
          "In investing, it causes a specific damaging pattern called the 'disposition effect': people sell their winners too early (to 'lock in' the gain) and hold onto their losers too long (to avoid 'realizing' the loss). The result is a portfolio of weeds instead of flowers. " +
          "\n\n" +
          "The better question to ask is NOT 'what did I pay for this?' but 'would I buy this today at this price?' If yes, hold. If no, you're only holding because of emotion, not logic."
      },
      {
        icon: "🎯",
        title: "Anchoring and confirmation bias",
        body:
          "**Anchoring** is when your mind grabs onto one number and uses it as a reference, even when it's no longer relevant. Example: you bought a stock at $100. It's now $40, and the business is worse than you thought. You tell yourself, 'I'll sell when it gets back to $100.' But the market doesn't care what you paid. The stock only goes where its future justifies. $100 is an anchor in your head, not a target in reality. " +
          "\n\n" +
          "**Confirmation bias** is the tendency to only pay attention to information that agrees with what you already believe. If you love a stock, you only read bullish articles about it. You skip the negative news. A disciplined investor actively seeks out the BEAR case, the reasons they might be wrong."
      },
      {
        icon: "📰",
        title: "Media filters and dramatic framing",
        body:
          "Financial media has a business model: drama keeps you watching. 'MARKETS IN CHAOS' gets more clicks than 'MARKETS DOWN 1.2%, HISTORICALLY NORMAL.' " +
          "\n\n" +
          "This doesn't mean the news is lying. It means the framing is often louder than the facts deserve. A 2% daily drop is a pretty ordinary Tuesday. Over any 50-year period, most days have looked nothing like the headlines. " +
          "\n\n" +
          "The fix: check the actual numbers, not just the tone. Is the market really 'crashing,' or is it down a normal amount? Has the company's fundamentals actually changed, or just the narrative?"
      },
      {
        icon: "📝",
        title: "The written investment thesis",
        body:
          "Here's one of the most powerful tricks in investing: before you buy ANY stock, write down in one paragraph WHY you're buying it and WHAT would make you sell. " +
          "\n\n" +
          "When the stock later drops 20% and your stomach churns, you can go back to your notes. Ask: 'Has any of my original thesis actually broken?' If no, the drop is noise. If yes, you can act on facts, not feelings. " +
          "\n\n" +
          "It feels like extra work, but it's the difference between investors who stick with great companies through rough patches and investors who panic-sell at the bottom.",
        bestieNote: "Future you will thank present you for writing things down. It's free and it works."
      }
    ],
    glossary: [
      { term: "FOMO", definition: "Fear Of Missing Out. The emotional urge to buy something that's already risen a lot, driven by watching others gain." },
      { term: "Herd Behavior", definition: "Doing what everyone else is doing instead of thinking independently. A major driver of bubbles and crashes." },
      { term: "Loss Aversion", definition: "The psychological tendency to feel losses about twice as intensely as equivalent gains. Leads to bad decisions." },
      { term: "Disposition Effect", definition: "Selling winners too early and holding losers too long. A direct result of loss aversion." },
      { term: "Anchoring", definition: "Getting mentally stuck on one number (often what you paid) that's no longer relevant to the decision ahead." },
      { term: "Confirmation Bias", definition: "Only paying attention to information that agrees with your existing beliefs. Avoid by actively seeking the opposing view." },
      { term: "Recency Bias", definition: "Assuming what just happened (bull market, crash, hot stock) will keep happening. Markets move in cycles." },
      { term: "Investment Thesis", definition: "A short written explanation of why you bought a stock and what would make you sell. Your best defense against emotional decisions." }
    ],
    commonMistakes: [
      {
        mistake: "Buying based on hype and headlines",
        why: "By the time something is a headline, the big move has often already happened. You're buying from the people who got in earlier."
      },
      {
        mistake: "Holding losers to 'break even'",
        why: "The market doesn't care what you paid. Holding a failing stock just to avoid 'realizing' the loss is an emotional decision dressed up as strategy."
      },
      {
        mistake: "Checking prices constantly",
        why: "Short-term prices are noise. Long-term investors who check rarely tend to outperform those who check daily, because they don't get shaken out by random dips."
      }
    ],
    readyToQuizMessage: "Understanding psychology might be the highest-ROI lesson in all of investing. Let's test it."
  },

  // ============================================================
  // LESSON 7: PORTFOLIO BASICS
  // ============================================================
  {
    id: 7,
    title: "Portfolio Basics",
    icon: "💼",
    subtitle: "Building your 'team' of investments for the long game.",
    whatYoullLearn: [
      "What asset allocation means and how to think about it",
      "How ETFs give you instant diversification",
      "The role of bonds alongside stocks",
      "What dollar-cost averaging is (and why the SEC likes it)",
      "Why fees quietly eat returns over decades"
    ],
    introduction:
      "A portfolio is just the collection of investments you hold. Building one doesn't have to be complicated. In fact, some of the most successful long-term investors use almost shockingly simple portfolios. " +
      "\n\n" +
      "The basics you'll learn here, diversification, asset allocation, low-cost funds, regular contributions, form the foundation of most good investing strategies. Fancy tactics come later (and often add less than you'd think). " +
      "\n\n" +
      "Think of this lesson as the blueprint of a solid investing foundation. Everything else is decoration.",
    concepts: [
      {
        icon: "🎭",
        title: "Asset allocation: your starting lineup",
        body:
          "Asset allocation is how you divide your money between major categories, usually stocks, bonds, and cash. This single decision has a bigger impact on your long-term results than which specific stocks you pick. " +
          "\n\n" +
          "A classic example is '70/30', 70% stocks (for growth) and 30% bonds (for stability). A younger investor with decades before retirement might go 90/10. Someone close to retirement might go 40/60. " +
          "\n\n" +
          "There's no universally 'right' allocation. It depends on your time horizon, risk tolerance, goals, and personality. The key is choosing an allocation you can stick with through both bull markets and crashes.",
        bestieNote: "Asset allocation is less like picking ingredients and more like choosing a recipe you can actually cook every week."
      },
      {
        icon: "🪣",
        title: "ETFs: instant diversification",
        body:
          "An ETF (Exchange-Traded Fund) is a bundle of many investments that trades like a single stock. Buy one share of an S&P 500 ETF, and you instantly own a tiny piece of 500 large U.S. companies. " +
          "\n\n" +
          "This solves a huge beginner problem: picking 500 individual stocks is impossible. Picking one diversified fund is easy. Index ETFs (which track a broad market index) are famously cheap, often charging less than 0.1% a year. " +
          "\n\n" +
          "Warren Buffett has repeatedly said most individual investors would do well with a simple low-cost S&P 500 index fund. That's not boring advice, it's deeply tested advice from one of the best investors of all time."
      },
      {
        icon: "🧱",
        title: "Bonds: the shock absorbers",
        body:
          "Bonds are essentially IOUs. You lend money to a government or company. In return, they pay you interest periodically and return your principal at the end. " +
          "\n\n" +
          "Bonds are generally less volatile than stocks. They often (though not always) zig when stocks zag, which smooths out your overall portfolio. In a stock market crash, high-quality bonds may hold steady or even rise in value, providing a cushion. " +
          "\n\n" +
          "The trade-off: lower long-term returns than stocks. That's why younger investors often hold more stocks (for growth) and older investors lean more into bonds (for stability). It's not either/or, it's a balance that shifts over time."
      },
      {
        icon: "⏰",
        title: "Dollar-cost averaging",
        body:
          "Dollar-cost averaging (DCA) is the practice of investing a fixed amount on a regular schedule, regardless of what the market is doing. The SEC describes it as 'investing your money in equal portions, at regular intervals, regardless of the ups and downs in the market.' " +
          "\n\n" +
          "Why it works: when prices are high, your fixed amount buys fewer shares. When prices are low, it buys more. Over time, this smooths out your average purchase price and, critically, removes the stress of trying to time the market. " +
          "\n\n" +
          "If you have a 401(k) or any automatic monthly investment, you're already dollar-cost averaging. It's not a magic trick. It's just a disciplined habit that quietly compounds over decades.",
        bestieNote: "Consistency beats timing. Always."
      },
      {
        icon: "🔄",
        title: "Rebalancing: keeping your team in shape",
        body:
          "Over time, your carefully chosen 70/30 portfolio drifts. Stocks rally for a few years, and suddenly you're at 85/15. Now you're taking more risk than you intended. " +
          "\n\n" +
          "Rebalancing is the practice of periodically selling some of what's grown too large and buying more of what's shrunk, bringing you back to your target allocation. Most long-term investors rebalance once a year, or when an allocation drifts more than about 5 percentage points from target. " +
          "\n\n" +
          "Bonus: rebalancing forces you to 'sell high' (trimming the winners) and 'buy low' (topping up the laggards), the exact opposite of what panicked investors do."
      },
      {
        icon: "🧯",
        title: "Fees: the silent killer",
        body:
          "An investment charging 1.5% per year doesn't sound like much. Over 30 years, though, it can reduce your final portfolio by tens of thousands of dollars compared to a similar fund charging 0.05%. " +
          "\n\n" +
          "This is why cost-conscious investors obsess over the 'expense ratio', the annual fee a fund charges. A low expense ratio compounds in your favor. A high one compounds in the fund company's favor. " +
          "\n\n" +
          "Always check the expense ratio before buying. It's usually right on the fund's page. 0.03%–0.20% is typical for good index funds. 1%+ should make you raise an eyebrow and ask what exactly you're paying for."
      }
    ],
    glossary: [
      { term: "Portfolio", definition: "The complete collection of your investments, stocks, bonds, cash, ETFs, and everything else." },
      { term: "Asset Allocation", definition: "How you divide your money between asset classes (stocks, bonds, cash). The single biggest driver of long-term returns." },
      { term: "ETF", definition: "Exchange-Traded Fund. A bundle of many investments that trades on an exchange like a single stock." },
      { term: "Index Fund", definition: "A fund that simply tracks a broad market index (like the S&P 500) instead of trying to pick winners. Usually very low cost." },
      { term: "Bonds", definition: "IOUs from a government or company. Generally less volatile than stocks and can cushion portfolio drops." },
      { term: "Dollar-Cost Averaging (DCA)", definition: "Investing a fixed amount on a regular schedule, regardless of market conditions." },
      { term: "Rebalancing", definition: "Periodically selling what's grown too large and buying what's shrunk, to stay near your target allocation." },
      { term: "Expense Ratio", definition: "The annual percentage a fund charges you to hold it. Lower is almost always better." }
    ],
    commonMistakes: [
      {
        mistake: "Paying high fees for 'active' funds that underperform",
        why: "Studies have consistently found that most actively managed funds fail to beat a simple low-cost index fund over 10+ year periods, especially after fees. Cheap and boring often wins."
      },
      {
        mistake: "Never rebalancing",
        why: "Your portfolio drifts over time. Without rebalancing, you may end up with way more risk than you originally chose."
      },
      {
        mistake: "Holding only one asset class",
        why: "A portfolio of 100% stocks can have brutal drawdowns. A portfolio of 100% bonds may not grow enough to outpace inflation. Most long-term investors use a mix."
      }
    ],
    readyToQuizMessage: "You've got the foundations. Let's see how it all fits together in the quiz."
  },

  // ============================================================
  // LESSON 8: MACROECONOMICS
  // ============================================================
  {
    id: 8,
    title: "Macroeconomics",
    icon: "🌍",
    subtitle: "The 'weather' of the economy, and how it moves the markets.",
    whatYoullLearn: [
      "What inflation, GDP, and recessions actually mean",
      "The role of central banks and why interest rates matter",
      "The business cycle and which sectors do well in each phase",
      "How unemployment and currency shifts affect companies",
      "Why geopolitics creates short-term volatility"
    ],
    introduction:
      "You don't need to be an economist to invest well. But you DO need to understand a handful of big concepts that drive the market's overall mood, inflation, interest rates, recessions, and so on. " +
      "\n\n" +
      "Think of macroeconomics as the weather. Individual companies are like houses. A great house can still be damaged by a hurricane. A flimsy house can survive a sunny year. Both the weather AND the specific company matter. " +
      "\n\n" +
      "This lesson gives you the macro vocabulary to understand what economic headlines actually mean, and why they move markets the way they do.",
    concepts: [
      {
        icon: "🎈",
        title: "Inflation: your money's silent enemy",
        body:
          "Inflation is the general rise in prices over time. If inflation is 3% this year, something that cost $100 last year now costs $103. Not dramatic in a single year. Hugely significant over decades. " +
          "\n\n" +
          "This is why cash 'sitting' in a regular savings account can lose purchasing power: if your savings earn 1% and inflation is 3%, you're technically falling behind by 2% per year in real terms. " +
          "\n\n" +
          "Inflation is one of the biggest reasons people invest in the first place. Historically, stocks have tended to outpace inflation over long periods, though with lots of bumps along the way. Past performance doesn't guarantee the future, but the logic is why 'doing nothing' with your savings can also be a form of risk.",
        bestieNote: "Safe doesn't mean 'no risk.' It just means a different type of risk, and inflation is a patient one."
      },
      {
        icon: "📐",
        title: "GDP and recessions",
        body:
          "GDP (Gross Domestic Product) measures the total value of goods and services a country produces. Rising GDP = economy growing. Falling GDP = economy shrinking. " +
          "\n\n" +
          "A common rule of thumb defines a recession as two consecutive quarters of negative GDP growth. But in the U.S., the official body, the NBER (National Bureau of Economic Research), uses a broader definition: 'a significant decline in economic activity spread across the economy, lasting more than a few months.' The NBER looks at employment, income, production, and sales, not just GDP. " +
          "\n\n" +
          "Recessions are a normal part of the economic cycle. Historically they've been followed by recoveries. They feel terrible while they happen, but they've also historically been when long-term investors who kept contributing came out ahead."
      },
      {
        icon: "🏦",
        title: "Central banks and interest rates",
        body:
          "A central bank (the Federal Reserve in the U.S., the ECB in the eurozone, the Bank of England in the UK, etc.) is the institution that manages a country's monetary policy. Its most powerful tool: setting short-term interest rates. " +
          "\n\n" +
          "When rates go up, borrowing becomes more expensive. Companies can't grow as cheaply. Consumers take out fewer loans. The economy slows. Stocks often fall. " +
          "\n\n" +
          "When rates go down, the opposite happens. Borrowing is cheap. Companies invest. Consumers spend. Stocks often rise. " +
          "\n\n" +
          "Central banks usually raise rates to fight high inflation, and lower rates to stimulate a weak economy. When they talk, markets listen, because the ripple effects hit almost everything."
      },
      {
        icon: "🎡",
        title: "The business cycle",
        body:
          "Economies don't grow in a straight line. They move through cycles: expansion → peak → contraction → trough → expansion again. " +
          "\n\n" +
          "Different sectors do well in different phases. In an expansion (unemployment low, spending strong), 'cyclical' sectors like travel, restaurants, and luxury retail often thrive. In a contraction, 'defensive' sectors, things people buy no matter what, like utilities, basic groceries, and healthcare, tend to hold up better. " +
          "\n\n" +
          "No one consistently predicts where we are in the cycle. But recognizing that cycles exist helps you avoid panicking during the downturns and getting too greedy during the good times."
      },
      {
        icon: "👥",
        title: "Unemployment and consumer strength",
        body:
          "Unemployment measures the share of people actively looking for work but unable to find it. Low unemployment generally means a healthy economy with strong consumer spending. High unemployment generally means weakness, less spending, tighter budgets, lower corporate revenue. " +
          "\n\n" +
          "The relationship runs deep because consumer spending drives about two-thirds of the U.S. economy. When people feel secure in their jobs, they spend. When they feel insecure, they save. " +
          "\n\n" +
          "Rising unemployment is one of the earliest signs of economic trouble. Falling unemployment often signals recovery."
      },
      {
        icon: "🌊",
        title: "Geopolitics and short-term shocks",
        body:
          "Wars, trade disputes, elections, pandemics, natural disasters, these events create short-term volatility. Markets often drop sharply on scary news, then recover as the situation becomes clearer. " +
          "\n\n" +
          "Historically, markets have weathered every major crisis of the past century: world wars, oil shocks, financial crashes, pandemics. Each time felt like 'this time is different.' Each time, markets eventually recovered and grew. " +
          "\n\n" +
          "This doesn't mean the next crisis will play out the same way. But it does suggest that reacting emotionally to every news flash is a losing strategy over the long run."
      }
    ],
    glossary: [
      { term: "Inflation", definition: "The general rise in prices over time. Measured as an annual percentage. Erodes the purchasing power of cash." },
      { term: "GDP", definition: "Gross Domestic Product. The total value of goods and services a country produces." },
      { term: "Recession", definition: "A significant, widespread decline in economic activity. Popularly defined as two consecutive quarters of negative GDP growth, though NBER uses a broader definition." },
      { term: "Central Bank", definition: "The institution that manages a country's monetary policy and sets short-term interest rates (e.g., the Federal Reserve in the U.S.)." },
      { term: "Interest Rates", definition: "The cost of borrowing money. Set short-term by central banks; they ripple through the entire economy and financial markets." },
      { term: "Business Cycle", definition: "The recurring pattern of expansion, peak, contraction, and trough that economies move through over time." },
      { term: "Cyclical Stocks", definition: "Companies that thrive during economic expansions, travel, restaurants, luxury goods, big-ticket retail." },
      { term: "Defensive Stocks", definition: "Companies that hold up well in downturns, utilities, basic groceries, healthcare." }
    ],
    commonMistakes: [
      {
        mistake: "Trying to perfectly time the economic cycle",
        why: "Even professional economists struggle to forecast recessions accurately. Most long-term investors do better by staying diversified and sticking to their plan than by trying to jump in and out."
      },
      {
        mistake: "Assuming every headline is a crisis",
        why: "News amplifies drama. Most economic 'crises' in the headlines turn out to be ordinary wobbles. Check actual numbers before reacting."
      },
      {
        mistake: "Ignoring inflation when evaluating 'safe' choices",
        why: "A 2% savings account in a 4% inflation world is losing you money in real terms. Always think in terms of real (inflation-adjusted) returns."
      }
    ],
    readyToQuizMessage: "Macro is where most people tune out. You just tuned in. Let's cement it with some practice."
  },

  // ============================================================
  // LESSON 9: STRATEGY
  // ============================================================
  {
    id: 9,
    title: "Strategy",
    icon: "🎯",
    subtitle: "Active, passive, growth, value, find YOUR vibe.",
    whatYoullLearn: [
      "The power of compounding and starting early",
      "Buy and hold vs. market timing",
      "Index investing and why it's so popular",
      "Growth vs. value investing philosophies",
      "Why most active strategies underperform over the long run"
    ],
    introduction:
      "There are many investing strategies, and smart people disagree about which is 'best.' What almost everyone agrees on: having a strategy matters more than finding the perfect one. " +
      "\n\n" +
      "The worst portfolio isn't one with a mediocre strategy, it's one with no strategy at all, drifting between hunches and headlines. " +
      "\n\n" +
      "This lesson walks you through the main approaches so you can recognize what you're reading about, pick what fits you, and commit with clarity. Pick one, stick with it, iterate slowly. That's the game.",
    concepts: [
      {
        icon: "❄️",
        title: "Compounding: the eighth wonder",
        body:
          "Compounding is when your returns start earning their own returns. It starts slow, then quietly becomes the most powerful force in investing. " +
          "\n\n" +
          "Quick illustration (hypothetical, at 7% annual returns): $100/month invested from age 20 to 65 could grow to roughly $380,000. Same $100/month starting at age 40 for 25 years? About $80,000. To match the early starter, the 40-year-old would need to invest closer to $470/month. " +
          "\n\n" +
          "Starting early with small amounts often beats starting late with bigger ones. Time is the secret ingredient that can't be bought.",
        bestieNote: "The best time to start investing was 10 years ago. The second best time is today. Even a small amount."
      },
      {
        icon: "🏠",
        title: "Buy and hold",
        body:
          "Buy-and-hold means purchasing quality investments and keeping them for years or decades, letting time and compounding do the heavy lifting. " +
          "\n\n" +
          "This is Warren Buffett's approach. His favorite holding period, he's said, is 'forever.' It's not because he's lazy, it's because most of the returns in investing come from a few big winners held for a long time. Trading in and out means extra fees, extra taxes, and more chances to buy high or sell low emotionally. " +
          "\n\n" +
          "Buy-and-hold doesn't mean 'never check anything.' It means you only sell when something fundamental changes, not every time the price wobbles."
      },
      {
        icon: "📊",
        title: "Index investing: the default for most people",
        body:
          "Index investing means buying a broad-market fund (like an S&P 500 index ETF) and letting it track the entire market's return, rather than trying to pick individual winners. " +
          "\n\n" +
          "It sounds too simple to work. But studies have consistently found that most professional active fund managers underperform a simple index fund over 10+ year periods, especially after fees. " +
          "\n\n" +
          "Jack Bogle (who founded Vanguard and invented the index fund) described the idea as 'Don't look for the needle. Buy the haystack.' Warren Buffett has publicly recommended low-cost index funds for most individual investors. It's not exciting, but 'not exciting' and 'works' often go together in investing."
      },
      {
        icon: "🕰️",
        title: "Time in the market beats timing the market",
        body:
          "Most investors know intellectually that you can't time the market. Most still try. It rarely works. " +
          "\n\n" +
          "Here's why: many of the market's best days cluster around its worst days, often during scary periods. If you panic-sell during a drop, you're likely to miss the rebounds. Studies have shown that missing just the 10 best days over several decades can dramatically reduce your returns. " +
          "\n\n" +
          "The takeaway: staying invested (even through ugly periods) usually beats jumping in and out. Your gut will scream to do something during crashes. Usually, 'nothing' is the right move."
      },
      {
        icon: "📐",
        title: "Growth vs. value",
        body:
          "These are two classic investing philosophies:" +
          "\n\n" +
          "**Growth investing** bets on companies expanding revenue and earnings fast, even if their valuations look expensive today. The bet: future growth will justify today's premium price." +
          "\n\n" +
          "**Value investing** looks for companies that are currently cheap relative to their fundamentals, often boring, unglamorous businesses the market has overlooked. The bet: the market will eventually realize its mistake and push the price up. " +
          "\n\n" +
          "Neither is 'right.' They take turns leading over different decades. Many long-term investors blend both or use index funds that cover everything.",
        bestieNote: "Pick the style that matches your temperament. Growth if you can stomach high volatility. Value if you like patience."
      },
      {
        icon: "🧘",
        title: "Match strategy to personality",
        body:
          "Here's the one rule most people skip: the best strategy is the one you can actually stick with. " +
          "\n\n" +
          "If checking the market constantly stresses you out, day trading is a terrible fit, even if the spreadsheet math looks great. If you love doing research, a 100% index fund approach might feel too passive. " +
          "\n\n" +
          "A realistic, slightly boring strategy you follow for 30 years will almost always beat an optimal strategy you abandon in year 3 during a scary drop. Know yourself. Then pick accordingly."
      }
    ],
    glossary: [
      { term: "Compounding", definition: "When your investment returns start earning their own returns. Grows slowly at first, then explosively over long periods." },
      { term: "Buy and Hold", definition: "Purchasing quality investments and keeping them for years or decades, minimizing trading and letting compounding work." },
      { term: "Index Investing", definition: "Buying a fund that tracks a broad market index (like the S&P 500) instead of picking individual stocks." },
      { term: "Active vs. Passive", definition: "Active = trying to beat the market by picking stocks or timing trades. Passive = tracking a broad index." },
      { term: "Growth Investing", definition: "Focus on companies expanding revenue and earnings fast, accepting higher valuations for the growth potential." },
      { term: "Value Investing", definition: "Looking for companies priced below their intrinsic value, buying 'bargains' the market has overlooked." },
      { term: "Market Timing", definition: "Trying to predict when to buy and sell based on short-term market moves. Rarely works over the long run." },
      { term: "Income Investing", definition: "Focus on investments that pay reliable cash (dividends or bond interest) rather than betting on price appreciation." }
    ],
    commonMistakes: [
      {
        mistake: "Chasing whatever strategy 'worked' last year",
        why: "Last year's winning strategy often underperforms the following year. Strategies go in and out of favor. Pick one you believe in and stick with it."
      },
      {
        mistake: "Jumping between strategies after short-term underperformance",
        why: "Every strategy has rough patches. Abandoning a sound plan because of 1–2 bad years is how you lock in losses and miss recoveries."
      },
      {
        mistake: "Confusing 'doing more' with 'doing better'",
        why: "In investing, activity is often the enemy of returns. Checking less, trading less, and sticking to the plan usually beats frantic optimization."
      }
    ],
    readyToQuizMessage: "Strategy clicks once you know yourself. Let's see what clicked."
  },

  // ============================================================
  // LESSON 10: SIMULATED INVESTING
  // ============================================================
  {
    id: 10,
    title: "Simulated Investing",
    icon: "🎮",
    subtitle: "Time to put your 'Bestie' skills to work, without the scary part.",
    whatYoullLearn: [
      "How earnings seasons move markets",
      "The crucial difference between investing and speculating",
      "How to spot pump-and-dump schemes",
      "Why paper trading and investment journals are underrated",
      "How to stay rational during portfolio drawdowns"
    ],
    introduction:
      "You've made it to the final lesson. Now it's time to zoom out and put everything together. " +
      "\n\n" +
      "Real investing doesn't happen in textbook scenarios, it happens in a messy world full of earnings surprises, viral tips, scary headlines, and your own emotions. This lesson is about the tools and mental habits that help you navigate that world without getting fleeced. " +
      "\n\n" +
      "The goal here isn't to turn you into a trader. It's to make you a calmer, smarter participant in your own financial life, whatever style you end up choosing.",
    concepts: [
      {
        icon: "📅",
        title: "Earnings seasons and why they move prices",
        body:
          "Every public company reports its financial results roughly every three months. These reports bunch together into 'earnings seasons', mid-January, mid-April, mid-July, and mid-October. During these weeks, big stock moves are common as companies report whether they beat or missed expectations. " +
          "\n\n" +
          "A stock can jump 10%+ on a great report or plunge 20%+ on a bad one. The actual business hasn't changed overnight, but the market's view of it has. " +
          "\n\n" +
          "Long-term investors try not to overreact to any single quarter. A great company has bad quarters sometimes, and a weak company can have a fluky good one. Trends matter more than single data points.",
        bestieNote: "One quarter is a data point. A pattern across many quarters is a trend. Big difference."
      },
      {
        icon: "🎯",
        title: "Investing vs. speculating",
        body:
          "Investing is making decisions based on the underlying business, its fundamentals, its moat, its long-term prospects. Speculating is making bets on short-term price moves without much underlying analysis. " +
          "\n\n" +
          "Both exist. Both are legitimate. But they're different activities, and people get into trouble when they confuse the two. Buying a hyped-up penny stock 'for a quick double' is speculating, even if you tell yourself it's investing. " +
          "\n\n" +
          "A reasonable rule: only speculate with money you can afford to lose entirely. Keep your real investing money separate and protected. And never mistake lucky speculation wins for genuine investing skill."
      },
      {
        icon: "⚠️",
        title: "Pump and dump: the classic scam",
        body:
          "Here's a pattern as old as markets: someone (or a group) buys a small, obscure stock quietly. Then they hype it aggressively on social media, group chats, or forums, claiming it's 'about to 10x.' New buyers rush in, pushing the price up. At the peak, the original hypers sell to the newcomers and disappear. The price then crashes as demand dies. " +
          "\n\n" +
          "This is a 'pump and dump.' It's illegal but still happens constantly, especially with small stocks and crypto. " +
          "\n\n" +
          "Red flags: urgency ('buy NOW'), vague promises, pressure to not 'miss out,' obscure tickers nobody talks about elsewhere, and anonymous sources. If a stranger online really had a guaranteed winner, they wouldn't be yelling about it in a chat room, they'd be quietly buying it themselves."
      },
      {
        icon: "🎓",
        title: "Paper trading and investment journals",
        body:
          "Two of the highest-ROI beginner habits: " +
          "\n\n" +
          "**Paper trading**: many brokerages offer free 'simulated' accounts where you can practice with fake money. It's a safe way to experience what real investing feels like, the excitement of wins, the sting of losses, without real consequences. You quickly learn that 'I know what I should do' and 'I actually do it with real money on the line' are two very different things. " +
          "\n\n" +
          "**Investment journal**: a simple log where you record each decision: what you bought, why, what would make you sell, and how you felt. Over 6–12 months, you'll start seeing your own patterns. Where you panic. Where you chase. Where your instincts actually work. It's uncomfortable. It's also where most real improvement comes from.",
        bestieNote: "Most investors overestimate their memory and underestimate their biases. A journal fixes both."
      },
      {
        icon: "📉",
        title: "Surviving drawdowns",
        body:
          "At some point, your portfolio will drop significantly. Maybe 20%. Maybe 40%. This has happened to every long-term investor in history, including the best ones. It's not a sign you did something wrong, it's a price of admission to long-term investing. " +
          "\n\n" +
          "What matters is how you respond. Ask: has my original investment thesis actually broken, or just the price? If the thesis is intact, drops are noise. If the thesis is broken (the business has fundamentally changed), it's time to reassess. " +
          "\n\n" +
          "Key rule: never make big decisions from a place of panic. Wait for the emotion to settle. Then make the rational move. If a 30% drop makes you want to sell everything, that's a signal your portfolio might be more aggressive than your true risk tolerance, useful information, but don't act on it in the middle of the storm."
      },
      {
        icon: "🌱",
        title: "Zoom out, always",
        body:
          "Here's the single most valuable habit in investing: zoom out. " +
          "\n\n" +
          "A 5% drop looks terrifying on a 1-day chart. It barely registers on a 10-year chart. The same event looks completely different depending on the time frame you view it from. Financial media lives in the 1-day chart. Your real goals live in the 10-year chart. " +
          "\n\n" +
          "When anxiety spikes, literally change the time frame on your portfolio view from 'today' to 'max.' Almost every short-term drama fades into the noise of a long-term upward trend. It's the simplest, most free 'strategy' available, and it works."
      }
    ],
    glossary: [
      { term: "Earnings Season", definition: "The few-week windows (January, April, July, October) when most public companies release their quarterly financial reports." },
      { term: "Investing", definition: "Making decisions based on a business's fundamentals and long-term prospects. Patient, analytical." },
      { term: "Speculating", definition: "Making short-term bets on price moves without deep business analysis. Not wrong, just different from investing." },
      { term: "Pump and Dump", definition: "An illegal scheme where promoters hype a cheap stock to new buyers, then sell at the inflated price. Common in small stocks and crypto." },
      { term: "Paper Trading", definition: "Practicing buying and selling with simulated money. A safe way to learn before committing real capital." },
      { term: "Investment Thesis", definition: "Your written reason for owning a particular investment. What would have to change for you to sell?" },
      { term: "Drawdown", definition: "The decline from a portfolio's peak to a trough. A normal and unavoidable part of long-term investing." },
      { term: "Past Performance Disclaimer", definition: "The universal reminder that historical returns do not guarantee future results. Print it on your bathroom mirror." }
    ],
    commonMistakes: [
      {
        mistake: "Acting on 'hot tips' from anonymous online strangers",
        why: "If someone actually had a guaranteed winner, they'd be quietly buying it, not loudly promoting it. Free tips from strangers are often pump-and-dump bait."
      },
      {
        mistake: "Confusing speculation wins with investing skill",
        why: "A lucky speculation doesn't prove you're a skilled investor. In a bull market, almost everything goes up. Real skill shows across many years and market conditions."
      },
      {
        mistake: "Making big decisions during panic",
        why: "The brain during panic is a terrible investor. Wait for the emotion to pass, check your thesis, and then decide with a clearer head."
      }
    ],
    readyToQuizMessage: "You've completed the full journey. One last quiz to put it all together, and then you're genuinely ahead of most people when it comes to financial literacy."
  }
];
