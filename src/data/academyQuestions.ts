import { Lesson } from '@/types/academy';

export const ACADEMY_LESSONS: Lesson[] = [
  {
    id: 1,
    title: "What is a Stock?",
    description: "Think of it as owning a slice of your favorite pizza shop or a piece of a massive tech empire.",
    icon: "🌱",
    questions: [
      { id: "1-b1", tier: "basic",
        explanation: "Imagine your friend starts a sneaker cleaning business. To buy better brushes, they sell you 10% of the business for $20. You now own a 'stock' in that business.",
        question: "If you own 10% of your friend's sneaker business, what does that actually mean?",
        options: [
          { id: "a", text: "You have to clean the sneakers yourself", isCorrect: false },
          { id: "b", text: "You own a piece of the business and a share of its future success", isCorrect: true },
          { id: "c", text: "You just gave your friend a $20 gift", isCorrect: false },
          { id: "d", text: "You are now the boss and can fire your friend", isCorrect: false }
        ],
        explanationExtended: "Owning stock isn't a gift or a job; it's ownership. If the business grows and becomes worth $1,000, your 10% is now worth $100! You didn't just give money away; you bought an asset."
      },
      { id: "1-b2", tier: "basic",
        explanation: "A 'Public' company is like an open party where anyone can walk in and buy a slice. A 'Private' company is like an invite-only dinner.",
        question: "Why can you buy Apple stock on your phone, but you can't easily buy stock in the local mom-and-pop burger joint?",
        options: [
          { id: "a", text: "Apple is just more famous", isCorrect: false },
          { id: "b", text: "Apple is a 'Public' company listed on an exchange; the burger joint is 'Private'", isCorrect: true },
          { id: "c", text: "The burger joint doesn't want to make money", isCorrect: false },
          { id: "d", text: "You need a special license to buy burger stocks", isCorrect: false }
        ],
        explanationExtended: "Public companies go through an 'IPO' to let regular people like us buy their shares on exchanges like the NASDAQ. Private companies keep their ownership limited to a few people."
      },
      { id: "1-b3", tier: "basic",
        explanation: "A ticker symbol is like a nickname for a company on the stock market. It's usually 1-5 letters long.",
        question: "You see the letters 'AAPL' flashing on a screen at the mall. What is this called in the stock world?",
        options: [
          { id: "a", text: "A secret discount code", isCorrect: false },
          { id: "b", text: "A Ticker Symbol", isCorrect: true },
          { id: "c", text: "The company's phone number", isCorrect: false },
          { id: "d", text: "A rating of how good the stock is", isCorrect: false }
        ],
        explanationExtended: "Ticker symbols are unique identifiers. Just like you have a name, companies have tickers so traders can find them quickly without typing out 'Apple Inc.' every time."
      },
      { id: "1-b4", tier: "basic",
        explanation: "A brokerage is the app or website you use to actually buy the stocks. They are the 'middleman' between you and the stock exchange.",
        question: "You have your $20 ready to buy a stock. Where do you actually go to make the purchase?",
        options: [
          { id: "a", text: "The company's front desk", isCorrect: false },
          { id: "b", text: "A brokerage app (like Robinhood or E*TRADE)", isCorrect: true },
          { id: "c", text: "The local bank's ATM", isCorrect: false },
          { id: "d", text: "The post office", isCorrect: false }
        ],
        explanationExtended: "You can't just walk into Apple and hand them $20. You need a brokerage account to connect you to the 'Stock Exchange' where all the buying and selling happens."
      },
      { id: "1-u1", tier: "understanding",
        explanation: "Stock prices are like a popularity contest. If everyone wants the new iPhone, Apple's stock price usually goes up because people think the company will make more money.",
        question: "A famous gamer starts using a new headset on stream, and suddenly everyone wants to buy shares in that headset company. What happens to the stock price?",
        options: [
          { id: "a", text: "The price stays the same because the product is the same", isCorrect: false },
          { id: "b", text: "The price goes up because demand for the stock increased", isCorrect: true },
          { id: "c", text: "The price goes down because the company is too busy", isCorrect: false },
          { id: "d", text: "The company has to give the gamer free stocks", isCorrect: false }
        ],
        explanationExtended: "Stock prices move based on 'Supply and Demand'. When more people want to buy (Demand) than sell (Supply), the price gets pushed up. It's like a limited edition drop!"
      },
      { id: "1-u2", tier: "understanding",
        explanation: "Dividends are like a 'Thank You' payment from a company to its owners. If the company makes a lot of profit, they might send some of it back to you in cash.",
        question: "You own 10 shares of a soda company. Every 3 months, they send $5 to your account just for owning the stock. What is this called?",
        options: [
          { id: "a", text: "A refund", isCorrect: false },
          { id: "b", text: "A Dividend", isCorrect: true },
          { id: "c", text: "A loan", isCorrect: false },
          { id: "d", text: "Interest", isCorrect: false }
        ],
        explanationExtended: "Not all companies pay dividends, but the ones that do are basically sharing their success with you. It's a way to make 'Passive Income' without selling your shares."
      },
      { id: "1-u3", tier: "understanding",
        explanation: "A 'Bull Market' is when everyone is happy and prices are going up. A 'Bear Market' is when the market has dropped 20% or more from its recent high — that's the official definition. A smaller drop (around 10%) is called a 'Correction'.",
        question: "The news says we are in a 'Bear Market'. What does that tell you about how far prices have fallen?",
        options: [
          { id: "a", text: "Prices are rising fast", isCorrect: false },
          { id: "b", text: "The market has dropped 20% or more from its recent peak", isCorrect: true },
          { id: "c", text: "The market is closed for the winter", isCorrect: false },
          { id: "d", text: "Only animal-related stocks are being traded", isCorrect: false }
        ],
        explanationExtended: "Think of it this way: A Bull thrusts its horns UP (prices up), and a Bear swipes its paws DOWN (prices down). A Bear Market means a serious 20%+ drop — not just a rough week. Bear markets are a normal part of the cycle and eventually recover."
      },
      { id: "1-u4", tier: "understanding",
        explanation: "An IPO (Initial Public Offering) is the 'Birthday' of a stock. It's the first time a private company lets the public buy its shares.",
        question: "A new electric bike company is 'Going Public' tomorrow. What is the official name for this event?",
        options: [
          { id: "a", text: "A Grand Opening", isCorrect: false },
          { id: "b", text: "An IPO", isCorrect: true },
          { id: "c", text: "A Stock Split", isCorrect: false },
          { id: "d", text: "A Merger", isCorrect: false }
        ],
        explanationExtended: "Before the IPO, only the founders and big investors owned the company. After the IPO, anyone with a brokerage account can buy a piece of it."
      },
      { id: "1-s1", tier: "situation",
        explanation: "Market Cap is the total 'Price Tag' of the whole company. Don't be fooled by a low share price!",
        question: "Company A has shares for $1. Company B has shares for $100. Your friend says Company A is 'cheaper'. Why might they be wrong?",
        options: [
          { id: "a", text: "Company A is definitely cheaper; $1 is less than $100", isCorrect: false },
          { id: "b", text: "Company A might have billions of shares, making the whole company more expensive than Company B", isCorrect: true },
          { id: "c", text: "Company B is always better because it costs more", isCorrect: false },
          { id: "d", text: "Share prices are set by the government", isCorrect: false }
        ],
        explanationExtended: "Think of it like pizza. One giant pizza cut into 100 tiny slices ($1 each) is the same total amount as a pizza cut into 4 big slices ($25 each). You have to look at the 'Market Cap' (the whole pizza price) to know the true value."
      },
      { id: "1-s2", tier: "situation",
        explanation: "Liquidity is how fast you can turn your stock back into cash. A popular stock like Apple is 'Liquid' because millions of people want to buy it every second.",
        question: "You need $100 for a concert tonight. You own $100 worth of a very rare, unknown stock that almost nobody trades. What problem might you face?",
        options: [
          { id: "a", text: "The stock is too valuable to sell", isCorrect: false },
          { id: "b", text: "Low Liquidity: You might not find a buyer in time to get your cash", isCorrect: true },
          { id: "c", text: "The government won't let you sell on a Friday", isCorrect: false },
          { id: "d", text: "Rare stocks can only be sold for other stocks", isCorrect: false }
        ],
        explanationExtended: "Just because a stock is 'worth' $100 doesn't mean you can get that cash instantly. If nobody is buying, you're stuck. This is why many investors stick to 'Liquid' stocks."
      }
    ]
  },
  {
    id: 2,
    title: "Company Basics",
    description: "Learn how to spot a 'Bestie' business from a 'Basic' one.",
    icon: "🏢",
    questions: [
      { id: "2-b1", tier: "basic",
        explanation: "Revenue is the total cash coming in (like your total allowance). Profit is what's left after you buy snacks and games.",
        question: "Your lemonade stand sells $50 worth of drinks. You spent $30 on lemons and sugar. What is your 'Profit'?",
        options: [
          { id: "a", text: "$50", isCorrect: false },
          { id: "b", text: "$20", isCorrect: true },
          { id: "c", text: "$30", isCorrect: false },
          { id: "d", text: "$80", isCorrect: false }
        ],
        explanationExtended: "Revenue ($50) is just the 'Top Line'. You have to subtract your costs ($30) to get your 'Bottom Line' or Profit ($20). A company with huge sales but even bigger costs is actually losing money!"
      },
      { id: "2-b2", tier: "basic",
        explanation: "Overhead refers to the fixed costs of running a business, like rent or electricity, that you have to pay even if you don't sell anything.",
        question: "You open a pizza shop. Even if you sell ZERO pizzas today, you still have to pay $1,000 for rent. What is this $1,000 called?",
        options: [
          { id: "a", text: "Profit", isCorrect: false },
          { id: "b", text: "Overhead (or Fixed Costs)", isCorrect: true },
          { id: "c", text: "Revenue", isCorrect: false },
          { id: "d", text: "Dividends", isCorrect: false }
        ],
        explanationExtended: "High overhead can be dangerous for a business. If sales drop, those fixed costs can quickly turn a profit into a loss. Investors like companies that can keep their overhead low."
      },
      { id: "2-b3", tier: "basic",
        explanation: "Market Share is the percentage of total sales in an industry that a company controls. It's like how much of the 'Industry Pie' they own.",
        question: "There are 100 phones sold in your city. 60 of them are iPhones. What is Apple's 'Market Share' in your city?",
        options: [
          { id: "a", text: "100%", isCorrect: false },
          { id: "b", text: "60%", isCorrect: true },
          { id: "c", text: "40%", isCorrect: false },
          { id: "d", text: "60 phones", isCorrect: false }
        ],
        explanationExtended: "Market share shows how dominant a company is. If a company's market share is growing, it means they are winning against their competitors."
      },
      { id: "2-b4", tier: "basic",
        explanation: "A business model is simply the plan for how a company makes money. Some sell products, some sell subscriptions, some sell ads.",
        question: "Netflix charges you $15 every month to watch movies. What kind of business model is this?",
        options: [
          { id: "a", text: "One-time purchase", isCorrect: false },
          { id: "b", text: "Subscription (Recurring Revenue)", isCorrect: true },
          { id: "c", text: "Advertising-based", isCorrect: false },
          { id: "d", text: "Donation-based", isCorrect: false }
        ],
        explanationExtended: "Investors LOVE subscription models because the money comes in every month like clockwork. It's much more predictable than selling a product once and hoping the customer comes back."
      },
      { id: "2-u1", tier: "understanding",
        explanation: "A 'Moat' (a term made famous by investor Warren Buffett) is a competitive advantage that keeps other companies from stealing your customers. Like how everyone uses Instagram because their friends are already there.",
        question: "Why is it hard for a new social media app to beat Instagram even if they have better features?",
        options: [
          { id: "a", text: "Instagram has a 'Moat' because that's where all the creators and users already are", isCorrect: true },
          { id: "b", text: "Instagram is owned by a secret group", isCorrect: false },
          { id: "c", text: "The government doesn't allow new apps", isCorrect: false },
          { id: "d", text: "New apps are always glitchy", isCorrect: false }
        ],
        explanationExtended: "This is called a 'Network Effect'. The more people use it, the more valuable it becomes. This 'Moat' protects Instagram from new competitors trying to steal their 'Market Share'."
      },
      { id: "2-u2", tier: "understanding",
        explanation: "Brand Loyalty is when customers keep buying from the same company even if it's more expensive, because they trust the name.",
        question: "You need new sneakers. You choose Nikes for $120 even though a generic pair looks the same and costs $40. What is Nike's advantage here?",
        options: [
          { id: "a", text: "They have a better website", isCorrect: false },
          { id: "b", text: "Brand Equity and Loyalty", isCorrect: true },
          { id: "c", text: "They have more employees", isCorrect: false },
          { id: "d", text: "The generic pair is illegal", isCorrect: false }
        ],
        explanationExtended: "A strong brand allows a company to charge 'Premium Prices'. This leads to higher profit margins, which makes the company more valuable to investors."
      },
      { id: "2-u3", tier: "understanding",
        explanation: "Scaling is when a company grows its sales much faster than its costs. Software is a great example: you build it once and the cost to serve each additional customer is almost nothing.",
        question: "A software company spends $1M to build an app. To sell it to 1 person costs almost nothing extra. To sell it to 1 million people also costs almost nothing extra. What is this called?",
        options: [
          { id: "a", text: "A scam", isCorrect: false },
          { id: "b", text: "Scalability", isCorrect: true },
          { id: "c", text: "Overhead", isCorrect: false },
          { id: "d", text: "Market Cap", isCorrect: false }
        ],
        explanationExtended: "Software is highly scalable because you build it once and sell it forever. Compare this to a bakery, which has to buy more flour for every single cupcake they sell."
      },
      { id: "2-u4", tier: "understanding",
        explanation: "Diversified Revenue means a company makes money from many different products or services, so they aren't in trouble if one fails.",
        question: "Apple makes money from iPhones, MacBooks, Apps, and Music. Why is this 'safer' than a company that only sells one specific type of phone charger?",
        options: [
          { id: "a", text: "No company ever fails once it gets big enough", isCorrect: false },
          { id: "b", text: "They have Diversified Revenue streams", isCorrect: true },
          { id: "c", text: "They have more stores", isCorrect: false },
          { id: "d", text: "Chargers are boring", isCorrect: false }
        ],
        explanationExtended: "If people stop buying chargers, the charger company goes bankrupt. If people stop buying MacBooks, Apple still has billions coming in from Apps and iPhones. It's about 'Reducing Risk'."
      },
      { id: "2-s1", tier: "situation",
        explanation: "Sectors are groups of similar businesses. If gas prices go up, the 'Energy' sector usually makes more money, but the 'Airlines' sector might struggle.",
        question: "There's a massive new breakthrough in battery technology. Which sector are you most likely to see jumping in value?",
        options: [
          { id: "a", text: "Healthcare", isCorrect: false },
          { id: "b", text: "Technology / Energy", isCorrect: true },
          { id: "c", text: "Consumer Staples (like toilet paper)", isCorrect: false },
          { id: "d", text: "Real Estate", isCorrect: false }
        ],
        explanationExtended: "Battery tech directly impacts tech companies and energy storage. Understanding 'Sectors' helps you realize that news doesn't affect every company the same way."
      },
      { id: "2-s2", tier: "situation",
        explanation: "A 'Price War' is when competitors keep lowering prices to steal customers, which often hurts everyone's profits.",
        question: "Two pizza shops on the same street keep lowering their prices to $1 per slice. Both are now losing money on every sale. What should an investor do?",
        options: [
          { id: "a", text: "Buy both because the pizza is cheap", isCorrect: false },
          { id: "b", text: "Be careful; a 'Price War' destroys profit margins for both companies", isCorrect: true },
          { id: "c", text: "Invest in the one with the cooler sign", isCorrect: false },
          { id: "d", text: "Wait for the government to set the price", isCorrect: false }
        ],
        explanationExtended: "While great for customers, price wars are terrible for investors. Without 'Pricing Power', companies can't make the profits needed to grow their stock price."
      }
    ]
  },
  {
    id: 3,
    title: "Financial Statements",
    description: "Reading the 'Report Card' of a company without getting a headache.",
    icon: "📊",
    questions: [
      { id: "3-b1", tier: "basic",
        explanation: "The Balance Sheet is a snapshot of what a company HAS (Assets) vs what it OWES (Liabilities).",
        question: "You have $100 in your pocket, but you owe your brother $40. On your personal 'Balance Sheet', what is your 'Equity'?",
        options: [
          { id: "a", text: "$100", isCorrect: false },
          { id: "b", text: "$60", isCorrect: true },
          { id: "c", text: "$40", isCorrect: false },
          { id: "d", text: "$140", isCorrect: false }
        ],
        explanationExtended: "Equity = Assets ($100) - Liabilities ($40). It's what you actually 'own' free and clear. Companies work the same way!"
      },
      { id: "3-b2", tier: "basic",
        explanation: "The Income Statement (or P&L) shows how much money a company made and spent over a period of time (like a month or a year).",
        question: "Which financial statement would you check to see if a company made a profit last year?",
        options: [
          { id: "a", text: "The Balance Sheet", isCorrect: false },
          { id: "b", text: "The Income Statement", isCorrect: true },
          { id: "c", text: "The CEO's Instagram", isCorrect: false },
          { id: "d", text: "The Ticker Symbol", isCorrect: false }
        ],
        explanationExtended: "The Income Statement tracks the 'Flow' of money. It starts with Revenue at the top and ends with Net Income (Profit) at the bottom."
      },
      { id: "3-b3", tier: "basic",
        explanation: "Assets are things a company owns that have value, like cash, buildings, or even 'Intellectual Property' (like the recipe for Coke).",
        question: "A tech company owns a massive office building and a patent for a new chip. What are these called on their financial statements?",
        options: [
          { id: "a", text: "Liabilities", isCorrect: false },
          { id: "b", text: "Assets", isCorrect: true },
          { id: "c", text: "Revenue", isCorrect: false },
          { id: "d", text: "Equity", isCorrect: false }
        ],
        explanationExtended: "Assets are the 'Tools' a company uses to make money. The more high-quality assets they have, the stronger the company usually is."
      },
      { id: "3-b4", tier: "basic",
        explanation: "Liabilities are the 'IOUs' of a company. This includes bank loans, unpaid bills, and taxes they owe.",
        question: "A company takes out a $1M loan from a bank to build a new factory. Where does this loan go on their Balance Sheet?",
        options: [
          { id: "a", text: "Assets", isCorrect: false },
          { id: "b", text: "Liabilities", isCorrect: true },
          { id: "c", text: "Revenue", isCorrect: false },
          { id: "d", text: "Profit", isCorrect: false }
        ],
        explanationExtended: "Debt isn't always bad — companies can borrow smartly to grow faster. But too many liabilities can crush a company if they can't make enough profit to cover the interest payments."
      },
      { id: "3-u1", tier: "understanding",
        explanation: "Cash Flow is the actual movement of money. A company can show a 'Profit' on paper but have no cash to pay its employees if customers haven't paid their bills yet.",
        question: "A company sells a fleet of trucks for $1M on credit (to be paid next year). They report a $1M profit today. Why might they still struggle to pay rent this month?",
        options: [
          { id: "a", text: "They are lying about the profit", isCorrect: false },
          { id: "b", text: "They have 'Profit' but no 'Cash Flow' yet", isCorrect: true },
          { id: "c", text: "The trucks were stolen", isCorrect: false },
          { id: "d", text: "Rent is too expensive for big companies", isCorrect: false }
        ],
        explanationExtended: "Profit is an accounting number, but Cash is king. If the cash hasn't hit the bank account yet, the company can't spend it. This is why we check the 'Cash Flow Statement'."
      },
      { id: "3-u2", tier: "understanding",
        explanation: "Accounts Receivable is money that customers owe the company for products they already received. It's like an 'I Owe You' note.",
        question: "A company has $5M in 'Accounts Receivable'. What does this mean for their future cash flow?",
        options: [
          { id: "a", text: "They are losing $5M", isCorrect: false },
          { id: "b", text: "They expect to receive $5M in cash soon", isCorrect: true },
          { id: "c", text: "They owe $5M to their suppliers", isCorrect: false },
          { id: "d", text: "The money is gone forever", isCorrect: false }
        ],
        explanationExtended: "Receivables are assets because they represent future cash. However, if customers can't pay, the company has to write it off as a loss."
      },
      { id: "3-u3", tier: "understanding",
        explanation: "Gross Margin is the percentage of revenue left after paying for the direct cost of making the product (like the leather for a shoe).",
        question: "It costs $20 to make a shirt. You sell it for $100. Your 'Gross Profit' is $80. What is your 'Gross Margin'?",
        options: [
          { id: "a", text: "20%", isCorrect: false },
          { id: "b", text: "80%", isCorrect: true },
          { id: "c", text: "$80", isCorrect: false },
          { id: "d", text: "100%", isCorrect: false }
        ],
        explanationExtended: "High margins are a sign of a 'Bestie' company. It means they have a lot of money left over to pay for marketing, research, and expansion."
      },
      { id: "3-u4", tier: "understanding",
        explanation: "Inventory is the stock of products a company has ready to sell. Too much inventory can be bad if the products go out of style or expire.",
        question: "A fashion company has $10M worth of last year's winter coats sitting in a warehouse. Why is this a 'Risk'?",
        options: [
          { id: "a", text: "The coats might get dusty", isCorrect: false },
          { id: "b", text: "The inventory might lose value and have to be sold at a loss", isCorrect: true },
          { id: "c", text: "Inventory is always a good thing", isCorrect: false },
          { id: "d", text: "The warehouse rent will go up", isCorrect: false }
        ],
        explanationExtended: "This is called 'Inventory Risk'. Efficient companies keep just enough stock to meet demand without having millions tied up in products that aren't selling."
      },
      { id: "3-s1", tier: "situation",
        explanation: "Debt-to-Equity compares how much a company owes to how much it actually owns. High debt makes a company 'Fragile' during a recession when revenues can drop suddenly.",
        question: "The economy is slowing down. Company A has $0 debt but limited cash. Company B has $1B in debt and must make monthly interest payments. Which one faces more immediate pressure during a 2-year slump?",
        options: [
          { id: "a", text: "Company A, because having no debt means no safety net", isCorrect: false },
          { id: "b", text: "Company B, because they must keep making interest payments even when sales drop", isCorrect: true },
          { id: "c", text: "Both are equally safe", isCorrect: false },
          { id: "d", text: "Debt doesn't matter for big companies", isCorrect: false }
        ],
        explanationExtended: "Debt is like a weight. When times are good, it can help you run faster (grow). When times are bad, those required payments can pull you underwater. Note: some debt is fine — the danger is taking on more debt than your cash flow can comfortably service."
      },
      { id: "3-s2", tier: "situation",
        explanation: "Operating Leverage is when a company can grow its sales without needing to hire more people or buy more equipment.",
        question: "A software company doubles its users but doesn't need to hire any new engineers. What happens to its profit margins?",
        options: [
          { id: "a", text: "They stay the same", isCorrect: false },
          { id: "b", text: "They expand rapidly because costs didn't go up", isCorrect: true },
          { id: "c", text: "They shrink because of more users", isCorrect: false },
          { id: "d", text: "The company has to lower prices", isCorrect: false }
        ],
        explanationExtended: "This is the 'Holy Grail' of investing. When revenue grows but costs stay flat, almost every new dollar of sales goes straight to profit. This is why tech companies are so valuable."
      }
    ]
  },
  {
    id: 4,
    title: "Valuation",
    description: "Is that stock a 'Steal' or a 'Scam'? Let's check the price tag.",
    icon: "🏷️",
    questions: [
      { id: "4-b1", tier: "basic",
        explanation: "The P/E Ratio is like checking the price of a candy bar relative to its size. A P/E of 20 means you're paying $20 for every $1 of profit the company makes.",
        question: "Company A has a P/E of 10. Company B has a P/E of 100. Which one are investors 'paying more' for relative to its current earnings?",
        options: [
          { id: "a", text: "Company A", isCorrect: false },
          { id: "b", text: "Company B", isCorrect: true },
          { id: "c", text: "They are the same price", isCorrect: false },
          { id: "d", text: "You can't tell from P/E", isCorrect: false }
        ],
        explanationExtended: "A high P/E (like 100) means people are 'hyped' and expecting massive growth. A low P/E (like 10) might mean the company is a bargain, or it might mean it's struggling."
      },
      { id: "4-u1", tier: "understanding",
        explanation: "Sometimes a high price makes sense if the company is growing super fast. It's like paying more for a rookie basketball player who might become a superstar.",
        question: "Why would anyone buy a stock with a P/E of 500 when they could buy one with a P/E of 15?",
        options: [
          { id: "a", text: "They don't know how to do math", isCorrect: false },
          { id: "b", text: "They expect the high P/E company to grow its profits 100x in the future", isCorrect: true },
          { id: "c", text: "The high P/E company has a cooler logo", isCorrect: false },
          { id: "d", text: "High P/E stocks are guaranteed to go up", isCorrect: false }
        ],
        explanationExtended: "Valuation is about the FUTURE. If a company is doubling its sales every month, investors will pay a premium today for the profits they expect tomorrow."
      }
    ]
  },
  {
    id: 5,
    title: "Risk",
    description: "Don't put all your 'Eggs' in one 'Basket' (or all your money in one meme coin).",
    icon: "🛡️",
    questions: [
      { id: "5-b1", tier: "basic",
        explanation: "Diversification is your safety net. If you own 10 different stocks and one goes to zero, you still have 9 left. If you only own one, you're in trouble.",
        question: "You have $1,000. Why is it 'riskier' to buy $1,000 of one AI stock than $100 of 10 different companies?",
        options: [
          { id: "a", text: "It's not riskier; one big win is better", isCorrect: false },
          { id: "b", text: "Because if that one company fails, you lose 100% of your money", isCorrect: true },
          { id: "c", text: "It takes more time to research 10 different companies well", isCorrect: false },
          { id: "d", text: "It's harder to track 10 stocks", isCorrect: false }
        ],
        explanationExtended: "This is called 'Concentration Risk'. Spreading your money (Diversification) protects you from one bad event ruining your whole portfolio."
      },
      { id: "5-u1", tier: "understanding",
        explanation: "Volatility is how much a stock 'mood swings'. A stable stock moves 1% a day. A volatile stock might jump 20% or drop 30% in an hour.",
        question: "You see a stock that is 'highly volatile'. What should you expect?",
        options: [
          { id: "a", text: "It will definitely make you rich", isCorrect: false },
          { id: "b", text: "The price will jump up and down aggressively, which can be scary", isCorrect: true },
          { id: "c", text: "The price will never change", isCorrect: false },
          { id: "d", text: "The company is about to close", isCorrect: false }
        ],
        explanationExtended: "Volatility isn't always 'bad', but it's risky. If you need the money tomorrow, a volatile stock is a bad place to put it because it might be 'down' exactly when you need to sell."
      }
    ]
  },
  {
    id: 6,
    title: "Market Psychology",
    description: "The market is basically a giant group chat full of people who are either too excited or too scared.",
    icon: "🧠",
    questions: [
      { id: "6-b1", tier: "basic",
        explanation: "FOMO (Fear Of Missing Out) is when you buy a stock just because your friends are bragging about their gains. Usually, this is the worst time to buy.",
        question: "A stock has gone up 500% this week. Everyone on TikTok is saying 'To the moon!' What is the biggest psychological trap here?",
        options: [
          { id: "a", text: "Missing out on a guaranteed win", isCorrect: false },
          { id: "b", text: "Buying at the 'Top' because of FOMO", isCorrect: true },
          { id: "c", text: "The stock exchange might close", isCorrect: false },
          { id: "d", text: "The company might run out of shares", isCorrect: false }
        ],
        explanationExtended: "When everyone is 'Greedy', that's often when the price is highest. Smart investors try to stay calm when everyone else is panicking or over-hyped."
      },
      { id: "6-u1", tier: "understanding",
        explanation: "Panic Selling is the opposite of FOMO. It's when the market drops a little, everyone gets scared, and they sell their stocks at a loss just to make the 'scary numbers' stop.",
        question: "The market drops 10% in a day. You see red numbers everywhere. What is the 'Panic' reaction?",
        options: [
          { id: "a", text: "Buying more because it's on sale", isCorrect: false },
          { id: "b", text: "Selling everything immediately because you're afraid it will go to zero", isCorrect: true },
          { id: "c", text: "Checking the company's actual profits", isCorrect: false },
          { id: "d", text: "Ignoring the app for a week", isCorrect: false }
        ],
        explanationExtended: "Panic selling locks in your losses. If the company's fundamentals are still healthy, the price will likely recover. That said — if something has fundamentally changed about the business, selling can be the right call. The key is to decide based on facts, not fear."
      }
    ]
  },
  {
    id: 7,
    title: "Portfolio Basics",
    description: "Building your 'Team' of investments to win the long game.",
    icon: "💼",
    questions: [
      { id: "7-b1", tier: "basic",
        explanation: "Asset Allocation is the 'Lineup' of your team. You might have some 'Aggressive' stocks (Strikers) and some 'Safe' bonds (Goalies).",
        question: "If you are 15 and don't need your money for 50 years, why might you have more 'Aggressive' stocks than 'Safe' bonds?",
        options: [
          { id: "a", text: "Because young people like to gamble", isCorrect: false },
          { id: "b", text: "Because you have a long 'Time Horizon' to recover from market drops", isCorrect: true },
          { id: "c", text: "Bonds are illegal for teenagers", isCorrect: false },
          { id: "d", text: "Stocks are always safer than bonds", isCorrect: false }
        ],
        explanationExtended: "Time is your superpower. Since you don't need the money soon, you can handle the 'mood swings' of stocks for the chance of much higher long-term growth."
      },
      { id: "7-u1", tier: "understanding",
        explanation: "Rebalancing is like subbing out a player who is tired. If your tech stocks grew so much they now make up 90% of your portfolio, you sell some to buy other things and stay balanced.",
        question: "Your 'Safe' stocks did okay, but your 'Tech' stocks exploded and now make up almost your whole portfolio. What is the risk here?",
        options: [
          { id: "a", text: "There is no risk; you're winning!", isCorrect: false },
          { id: "b", text: "You are no longer diversified; if Tech drops, your whole portfolio crashes", isCorrect: true },
          { id: "c", text: "The 'Safe' stocks will be jealous", isCorrect: false },
          { id: "d", text: "You have too much money to manage", isCorrect: false }
        ],
        explanationExtended: "Rebalancing forces you to 'Sell High' (your winners) and 'Buy Low' (your laggards), keeping your risk level where you want it."
      }
    ]
  },
  {
    id: 8,
    title: "Macroeconomics",
    description: "The 'Weather' of the economy. Is it sunny (Expansion) or rainy (Recession)?",
    icon: "🌍",
    questions: [
      { id: "8-b1", tier: "basic",
        explanation: "Inflation is when your $5 footlong suddenly costs $8. Your money buys less stuff than it used to.",
        question: "If inflation is 10% and your bank only pays you 1% interest, what is happening to your 'Purchasing Power'?",
        options: [
          { id: "a", text: "It's going up because you're earning interest", isCorrect: false },
          { id: "b", text: "It's going down; your money is losing value faster than it's growing", isCorrect: true },
          { id: "c", text: "It stays the same", isCorrect: false },
          { id: "d", text: "Inflation doesn't affect savings", isCorrect: false }
        ],
        explanationExtended: "This is one reason many people consider investing — keeping cash under the mattress means inflation quietly 'eats' its value over time. That said, always keep an emergency fund in a safe account before putting money into markets. (Educational content, not financial advice.)"
      },
      { id: "8-u1", tier: "understanding",
        explanation: "Interest Rates are the 'Cost of Money'. When the Fed raises rates, it's like making the 'Game' harder for companies because borrowing money to grow gets more expensive.",
        question: "Why does the stock market often drop when the Federal Reserve announces they are raising interest rates?",
        options: [
          { id: "a", text: "The Fed hates the stock market", isCorrect: false },
          { id: "b", text: "It becomes more expensive for companies to borrow money and grow", isCorrect: true },
          { id: "c", text: "People stop using credit cards", isCorrect: false },
          { id: "d", text: "Interest rates only affect banks", isCorrect: false }
        ],
        explanationExtended: "Higher rates = Higher costs for businesses = Lower profits = Lower stock prices. It also makes 'Safe' savings accounts more attractive than 'Risky' stocks."
      }
    ]
  },
  {
    id: 9,
    title: "Strategy",
    description: "Are you a 'Hunter' (Growth) or a 'Farmer' (Value)?",
    icon: "🎯",
    questions: [
      { id: "9-b1", tier: "basic",
        explanation: "Compounding is the 'Magic Snowball'. You earn returns on your returns. Over decades, even a small amount of money can grow into something significant.",
        question: "Why is starting to invest $100 a month at age 20 potentially as powerful as starting $1,000 a month at age 40?",
        options: [
          { id: "a", text: "Because 20-year-olds have better luck", isCorrect: false },
          { id: "b", text: "Because your money has 20 extra years to 'Compound' — earning returns on returns", isCorrect: true },
          { id: "c", text: "It's actually not better", isCorrect: false },
          { id: "d", text: "Fees are lower for younger investors", isCorrect: false }
        ],
        explanationExtended: "Time is more important than the amount you invest. At a 7% average annual return, $100/mo from age 20 for 45 years grows to roughly the same as $1,000/mo from age 40 for 25 years. The 'Snowball' needs a long hill to get really big. Start early, even with small amounts!"
      },
      { id: "9-u1", tier: "understanding",
        explanation: "Value Investing is like buying a designer shirt at a thrift store. Growth Investing is like buying a tech startup that might become the next Google.",
        question: "You find a solid, boring company that makes soap. It's been around for 100 years and the stock is 'on sale' because of a temporary market panic. What strategy is this?",
        options: [
          { id: "a", text: "Growth Investing", isCorrect: false },
          { id: "b", text: "Value Investing", isCorrect: true },
          { id: "c", text: "Day Trading", isCorrect: false },
          { id: "d", text: "Speculating", isCorrect: false }
        ],
        explanationExtended: "Value investors look for 'Intrinsic Value'—what the company is actually worth—and wait for the market to realize its mistake and push the price back up."
      }
    ]
  },
  {
    id: 10,
    title: "Simulated Investing",
    description: "Time to put your 'Bestie' skills to the test in the real world (sort of).",
    icon: "🎮",
    questions: [
      { id: "10-b1", tier: "basic",
        explanation: "Earnings Reports are the 'Quarterly Exams'. If a company fails the exam, the stock price usually gets grounded.",
        question: "A company you own shares in announces they made 50% LESS profit than they promised. What do you expect the stock to do tomorrow morning?",
        options: [
          { id: "a", text: "Go up because people feel bad for them", isCorrect: false },
          { id: "b", text: "Drop significantly as investors lose confidence", isCorrect: true },
          { id: "c", text: "Stay exactly the same", isCorrect: false },
          { id: "d", text: "The company will be deleted from the app", isCorrect: false }
        ],
        explanationExtended: "The market hates bad surprises. If a company 'Misses Earnings', it means the business isn't doing as well as people thought, so they sell their shares."
      },
      { id: "10-s1", tier: "situation",
        explanation: "Scenario: A new law is passed that makes all plastic packaging illegal. You own a company that makes plastic water bottles.",
        question: "What is one reasonable 'Bestie' response after hearing this news?",
        options: [
          { id: "a", text: "Buy more because the stock is now 'cheaper'", isCorrect: false },
          { id: "b", text: "Research whether to sell — the core business model faces a serious regulatory threat", isCorrect: true },
          { id: "c", text: "Do nothing and hope the law changes", isCorrect: false },
          { id: "d", text: "Complain on social media", isCorrect: false }
        ],
        explanationExtended: "This is 'Regulatory Risk'. When a law directly targets a company's core product, investors should reassess. Key questions: Can they pivot? How long until enforcement? Is the risk already priced into the stock? There's no single right answer in real investing — but ignoring major regulatory changes is rarely wise. (Educational content, not financial advice.)"
      }
    ]
  }
];
