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
      { id: "1-b5", tier: "basic",
        explanation: "A share is one single unit of ownership in a company. Owning more shares means owning a bigger slice of the company.",
        question: "You buy 5 shares of a company and your friend buys 1 share. Who owns more of the company?",
        options: [
          { id: "a", text: "Your friend, because single shares are more valuable", isCorrect: false },
          { id: "b", text: "You, because you own more shares (and therefore a bigger slice)", isCorrect: true },
          { id: "c", text: "Neither, shares don't represent ownership", isCorrect: false },
          { id: "d", text: "It depends on who bought theirs first", isCorrect: false }
        ],
        explanationExtended: "A 'share' literally means a share of ownership. More shares = more ownership. Companies can issue millions or even billions of shares, so one share is usually a very tiny slice of the whole."
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
        explanation: "A 'Bull Market' is when everyone is happy and prices are going up. A 'Bear Market' is when the market has dropped 20% or more from its recent high, that's the official definition. A smaller drop (around 10%) is called a 'Correction'.",
        question: "The news says we are in a 'Bear Market'. What does that tell you about how far prices have fallen?",
        options: [
          { id: "a", text: "Prices are rising fast", isCorrect: false },
          { id: "b", text: "The market has dropped 20% or more from its recent peak", isCorrect: true },
          { id: "c", text: "The market is closed for the winter", isCorrect: false },
          { id: "d", text: "Only animal-related stocks are being traded", isCorrect: false }
        ],
        explanationExtended: "Think of it this way: A Bull thrusts its horns UP (prices up), and a Bear swipes its paws DOWN (prices down). A Bear Market means a serious 20%+ drop, not just a rough week. Bear markets are a normal part of the cycle and eventually recover."
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
      { id: "1-u5", tier: "understanding",
        explanation: "A stock split is when a company divides each existing share into multiple smaller shares. The total value stays the same, like exchanging one $20 bill for four $5 bills.",
        question: "A stock trading at $400 does a 4-for-1 stock split. What happens to your single share?",
        options: [
          { id: "a", text: "You now have 4 shares worth $100 each; your total value is unchanged", isCorrect: true },
          { id: "b", text: "Your share is now worth $1,600", isCorrect: false },
          { id: "c", text: "You lose 75% of your investment", isCorrect: false },
          { id: "d", text: "The company has to pay you $300", isCorrect: false }
        ],
        explanationExtended: "Splits don't change the company's value, they just make shares cheaper per unit so smaller investors can buy in. Companies like Apple, Tesla, and Google have all done splits to keep their shares accessible."
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
        explanationExtended: "Debt isn't always bad, companies can borrow smartly to grow faster. But too many liabilities can crush a company if they can't make enough profit to cover the interest payments."
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
      { id: "3-u5", tier: "understanding",
        explanation: "EPS (Earnings Per Share) is the company's total profit divided by the number of shares. It tells you how much profit is 'attached' to each share you own.",
        question: "A company makes $100 million in profit and has 50 million shares outstanding. What is their EPS?",
        options: [
          { id: "a", text: "$0.50", isCorrect: false },
          { id: "b", text: "$2.00", isCorrect: true },
          { id: "c", text: "$50", isCorrect: false },
          { id: "d", text: "$100 million", isCorrect: false }
        ],
        explanationExtended: "$100M ÷ 50M shares = $2 per share. Rising EPS over time is a great sign. It's also the 'E' in the famous P/E ratio, which you'll meet in the next lesson."
      },
      { id: "3-s1", tier: "situation",
        explanation: "Debt-to-Equity compares how much a company owes to how much it actually owns. High debt makes a company 'Fragile' during a recession when revenues can drop suddenly.",
        question: "The economy is slowing down. Company A has $0 debt. Company B has $1B in debt and must make monthly interest payments. Which one faces more immediate pressure during a 2-year slump?",
        options: [
          { id: "a", text: "Company A, because having no debt means they can't borrow their way out of trouble", isCorrect: false },
          { id: "b", text: "Company B, because they must keep making interest payments even when sales drop", isCorrect: true },
          { id: "c", text: "Both are equally safe", isCorrect: false },
          { id: "d", text: "Debt doesn't matter for big companies", isCorrect: false }
        ],
        explanationExtended: "Debt is like a weight. When times are good, it can help you run faster (grow). When times are bad, those required payments can pull you underwater. Note: some debt is fine, the danger is taking on more debt than your cash flow can comfortably service."
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
      { id: "4-b2", tier: "basic",
        explanation: "P/B (Price-to-Book) compares a company's stock price to its 'Book Value', basically what you'd get if you sold everything and paid off all debts. Useful for checking banks and asset-heavy businesses.",
        question: "A stock trades at a P/B of 0.8. What does that tell you at a glance?",
        options: [
          { id: "a", text: "The stock is priced higher than what the company is 'worth on paper'", isCorrect: false },
          { id: "b", text: "The stock is priced lower than what the company is 'worth on paper'", isCorrect: true },
          { id: "c", text: "The stock is out of stock", isCorrect: false },
          { id: "d", text: "P/B doesn't mean anything", isCorrect: false }
        ],
        explanationExtended: "A P/B under 1 means the market thinks the company is worth LESS than its assets minus debts. This could be a bargain, or a warning that the assets aren't really worth what the books say."
      },
      { id: "4-b3", tier: "basic",
        explanation: "P/S (Price-to-Sales) compares a company's market cap to its yearly revenue. It's super useful for young companies that aren't profitable yet (so P/E doesn't work).",
        question: "A new biotech hasn't made any profit yet, so its P/E can't be calculated. Which valuation metric can you still use?",
        options: [
          { id: "a", text: "P/E Ratio", isCorrect: false },
          { id: "b", text: "P/S Ratio (Price-to-Sales)", isCorrect: true },
          { id: "c", text: "Dividend Yield", isCorrect: false },
          { id: "d", text: "EPS", isCorrect: false }
        ],
        explanationExtended: "P/S works because almost every company has revenue, even if they aren't profitable. It lets you ask: 'How much am I paying for every $1 of sales?' Just know that sales without profit is risky."
      },
      { id: "4-b4", tier: "basic",
        explanation: "Dividend Yield is the yearly dividend divided by the stock price. It tells you the 'cash return' you'd get if the stock price stayed flat.",
        question: "A stock costs $100 and pays $4 in dividends per year. What is the dividend yield?",
        options: [
          { id: "a", text: "0.4%", isCorrect: false },
          { id: "b", text: "4%", isCorrect: true },
          { id: "c", text: "40%", isCorrect: false },
          { id: "d", text: "$100", isCorrect: false }
        ],
        explanationExtended: "$4 ÷ $100 = 4%. Solid dividend stocks often sit in the 2-5% yield range. Be cautious of yields above 8-10%, sometimes that means the price has crashed and the dividend is about to be cut."
      },
      { id: "4-u1", tier: "understanding",
        explanation: "Sometimes a high price makes sense if the company is growing super fast. It's like paying more for a rookie basketball player who might become a superstar.",
        question: "Why would anyone buy a stock with a P/E of 500 when they could buy one with a P/E of 15?",
        options: [
          { id: "a", text: "They don't know how to do math", isCorrect: false },
          { id: "b", text: "They expect the high P/E company to grow its profits massively in the future", isCorrect: true },
          { id: "c", text: "The high P/E company has a cooler logo", isCorrect: false },
          { id: "d", text: "High P/E stocks are guaranteed to go up", isCorrect: false }
        ],
        explanationExtended: "Valuation is about the FUTURE. If a company is doubling its sales every year, investors will pay a premium today for the profits they expect tomorrow."
      },
      { id: "4-u2", tier: "understanding",
        explanation: "The PEG ratio (popularized by investor Peter Lynch) takes the P/E and divides it by the earnings growth rate. It adjusts the P/E for how fast the company is growing.",
        question: "A stock has a P/E of 30 and is growing earnings at 30% per year. What is its PEG ratio, and roughly what does that suggest?",
        options: [
          { id: "a", text: "PEG of 1, fairly priced relative to its growth", isCorrect: true },
          { id: "b", text: "PEG of 900, extremely overvalued", isCorrect: false },
          { id: "c", text: "PEG of 0, undervalued", isCorrect: false },
          { id: "d", text: "PEG doesn't apply to growth stocks", isCorrect: false }
        ],
        explanationExtended: "Peter Lynch's rule of thumb: a fairly-priced growth stock has a PEG around 1. Below 1 can suggest it's undervalued for its growth rate; above 1 can suggest it's getting pricey. This is a ROUGH guideline, not a guarantee."
      },
      { id: "4-u3", tier: "understanding",
        explanation: "'Intrinsic Value' is what a company is actually worth based on its future cash flows, not just what the market happens to price it at today.",
        question: "A panic in the market pushes a great company's price far below its intrinsic value. What concept describes this gap?",
        options: [
          { id: "a", text: "Market Cap", isCorrect: false },
          { id: "b", text: "Margin of Safety", isCorrect: true },
          { id: "c", text: "Dividend Yield", isCorrect: false },
          { id: "d", text: "IPO Discount", isCorrect: false }
        ],
        explanationExtended: "'Margin of Safety' (a Benjamin Graham concept) is the buffer between what a stock is worth and what you pay. Buying well below intrinsic value gives you room to be wrong without losing everything."
      },
      { id: "4-u4", tier: "understanding",
        explanation: "A 'cheap' stock isn't the same as an 'undervalued' stock. Cheap just means the price is low. Undervalued means the price is low RELATIVE to what the company is actually worth.",
        question: "A stock has been crashing for 3 years because the company keeps losing customers and profits keep shrinking. A friend says 'It's so cheap now, buy it!' What's the issue?",
        options: [
          { id: "a", text: "Nothing, cheap always means buy", isCorrect: false },
          { id: "b", text: "It might be a 'Value Trap': cheap for good reason because the business is getting worse", isCorrect: true },
          { id: "c", text: "Stocks always rebound", isCorrect: false },
          { id: "d", text: "The friend must be right because the stock fell a lot", isCorrect: false }
        ],
        explanationExtended: "A 'Value Trap' is a stock that looks cheap on paper but keeps getting cheaper because the underlying business is deteriorating. Price is what you pay, value is what you get."
      },
      { id: "4-s1", tier: "situation",
        explanation: "Comparing valuations across different industries can be misleading. A grocery chain and a software company have totally different 'normal' P/E ranges.",
        question: "You see a grocery chain with a P/E of 18 and a cloud software company with a P/E of 45. Which is 'more expensive'?",
        options: [
          { id: "a", text: "The grocery chain, because 18 is lower than 45", isCorrect: false },
          { id: "b", text: "You can't tell just from this, each industry has its own normal P/E range", isCorrect: true },
          { id: "c", text: "The software company, 45 is always too high", isCorrect: false },
          { id: "d", text: "They're the same", isCorrect: false }
        ],
        explanationExtended: "Groceries typically trade at low P/Es (slow growth, thin margins). Software often trades at high P/Es (fast growth, high margins). Always compare a stock's P/E to its industry peers, not the whole market."
      },
      { id: "4-s2", tier: "situation",
        explanation: "Forward P/E uses projected future earnings instead of past earnings. It can give a very different picture, especially when a company is expected to grow or shrink a lot.",
        question: "A stock has a trailing P/E of 60 (based on last year) but a forward P/E of 20 (based on analyst estimates for next year). What does this suggest?",
        options: [
          { id: "a", text: "Analysts expect earnings to grow rapidly, making the stock look cheaper going forward", isCorrect: true },
          { id: "b", text: "The stock will definitely triple in price", isCorrect: false },
          { id: "c", text: "One of the numbers must be wrong", isCorrect: false },
          { id: "d", text: "Forward P/E is always more accurate than trailing", isCorrect: false }
        ],
        explanationExtended: "Forward P/E reflects expectations, not facts. If analysts are right, the stock is much cheaper than the trailing P/E suggests. If they're wrong, the 'forward' number is fiction. Always check both."
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
          { id: "c", text: "10 stocks cost more in total", isCorrect: false },
          { id: "d", text: "It's harder to track 10 stocks", isCorrect: false }
        ],
        explanationExtended: "This is called 'Concentration Risk'. Spreading your money (Diversification) protects you from one bad event ruining your whole portfolio."
      },
      { id: "5-b2", tier: "basic",
        explanation: "'Risk Tolerance' is how much of a price drop you can emotionally AND financially handle without panic-selling.",
        question: "Two investors both own the same stock. It drops 30%. Investor A loses sleep and sells everything. Investor B stays calm and waits. What does this tell you?",
        options: [
          { id: "a", text: "Investor A is smarter", isCorrect: false },
          { id: "b", text: "They have different risk tolerances, the stock was too risky for Investor A", isCorrect: true },
          { id: "c", text: "The stock is guaranteed to recover", isCorrect: false },
          { id: "d", text: "Selling is always the right call after a drop", isCorrect: false }
        ],
        explanationExtended: "The 'right' level of risk is different for everyone. If a 30% drop makes you panic, you probably shouldn't have been in something that volatile. Know yourself before you invest."
      },
      { id: "5-b3", tier: "basic",
        explanation: "A 'Time Horizon' is how long you plan to keep your money invested before you need it. Longer horizons let you take more risk because you have time to recover from drops.",
        question: "You're saving for a vacation 6 months from now. Which is the BIGGEST problem with putting that money in a volatile stock?",
        options: [
          { id: "a", text: "Stocks are illegal for short-term use", isCorrect: false },
          { id: "b", text: "The stock might be down exactly when you need the cash", isCorrect: true },
          { id: "c", text: "Vacations are expensive", isCorrect: false },
          { id: "d", text: "You'd owe taxes immediately", isCorrect: false }
        ],
        explanationExtended: "Short time horizons and volatile assets are a bad mix. For money you need within 1-2 years, a high-yield savings account is usually safer than stocks. (Educational content, not financial advice.)"
      },
      { id: "5-b4", tier: "basic",
        explanation: "An 'Emergency Fund' is 3-6 months of expenses in cash, set aside before you invest. It means you won't have to sell stocks at a bad time if life surprises you.",
        question: "Why do financial educators usually recommend building an emergency fund BEFORE investing in stocks?",
        options: [
          { id: "a", text: "Because stocks aren't allowed without one", isCorrect: false },
          { id: "b", text: "So you aren't forced to sell stocks at a loss when an unexpected expense hits", isCorrect: true },
          { id: "c", text: "Emergency funds pay higher returns than stocks", isCorrect: false },
          { id: "d", text: "It's a legal requirement", isCorrect: false }
        ],
        explanationExtended: "Without an emergency fund, a surprise medical bill or car repair could force you to sell investments during a market dip. An emergency fund is your 'oxygen mask', put it on first."
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
      },
      { id: "5-u2", tier: "understanding",
        explanation: "Beta measures how much a stock moves compared to the overall market (like the S&P 500). A beta of 1 moves with the market; above 1 is more volatile; below 1 is less volatile.",
        question: "A stock has a beta of 1.5. If the market drops 10% tomorrow, what does beta roughly predict?",
        options: [
          { id: "a", text: "The stock will drop about 15% (1.5x the market)", isCorrect: true },
          { id: "b", text: "The stock will rise by 15%", isCorrect: false },
          { id: "c", text: "The stock will drop by exactly 1.5%", isCorrect: false },
          { id: "d", text: "Beta doesn't predict anything", isCorrect: false }
        ],
        explanationExtended: "Beta is a rough guide, not a guarantee. High-beta stocks (often tech and growth) swing harder in both directions. Low-beta stocks (often utilities and consumer staples) are steadier. Beta looks backward, it's not a crystal ball."
      },
      { id: "5-u3", tier: "understanding",
        explanation: "There are two big types of risk: 'Systematic Risk' (affects the whole market, like a recession) and 'Unsystematic Risk' (affects one company, like a bad CEO). Diversification reduces unsystematic risk, but not systematic risk.",
        question: "You own 50 different stocks. A major recession hits and everything drops. Which type of risk did diversification NOT protect you from?",
        options: [
          { id: "a", text: "Unsystematic risk (company-specific risk)", isCorrect: false },
          { id: "b", text: "Systematic risk (market-wide risk)", isCorrect: true },
          { id: "c", text: "Inventory risk", isCorrect: false },
          { id: "d", text: "Liquidity risk", isCorrect: false }
        ],
        explanationExtended: "Owning 50 stocks protects you if ONE company fails, but when the whole market drops, diversification inside stocks alone won't save you. That's why some investors also hold bonds, cash, or other asset classes."
      },
      { id: "5-u4", tier: "understanding",
        explanation: "Inflation risk is the risk that your money loses purchasing power over time. Cash under the mattress 'feels' safe but quietly gets weaker every year.",
        question: "You keep $10,000 in a drawer for 10 years. Inflation averages 3% per year. What's the main risk you've taken?",
        options: [
          { id: "a", text: "No risk, the cash is still there", isCorrect: false },
          { id: "b", text: "Inflation risk, the $10,000 now buys significantly less than it did 10 years ago", isCorrect: true },
          { id: "c", text: "The cash will physically disappear", isCorrect: false },
          { id: "d", text: "The government will tax you for hoarding cash", isCorrect: false }
        ],
        explanationExtended: "'Safe' isn't the same as 'no risk'. Cash loses purchasing power to inflation. At 3% inflation, $10,000 today only buys about $7,400 worth of stuff in 10 years. This is why many people invest at least SOME of their money."
      },
      { id: "5-s1", tier: "situation",
        explanation: "Concentration risk hits hardest when your one big holding is also tied to your income, like owning lots of your employer's stock.",
        question: "You work at TechCo and 80% of your net worth is in TechCo stock you got as compensation. What's the hidden danger?",
        options: [
          { id: "a", text: "There's no danger, you know the company well", isCorrect: false },
          { id: "b", text: "If TechCo struggles, you could lose your job AND most of your savings at the same time", isCorrect: true },
          { id: "c", text: "You'll pay less in taxes this way", isCorrect: false },
          { id: "d", text: "The company will always protect employee shareholders", isCorrect: false }
        ],
        explanationExtended: "This is 'Concentrated Employer Risk'. Your income and your investments are riding on the same horse. Many advisors suggest gradually selling and diversifying employer stock to reduce this double exposure. (Educational content, not financial advice.)"
      },
      { id: "5-s2", tier: "situation",
        explanation: "'Risk-Adjusted Return' asks: how much return did you get for the amount of risk you took? A smaller, steady return can beat a big but wildly volatile one in practice.",
        question: "Portfolio A returns 10% every year, like clockwork. Portfolio B averages 10% but swings wildly, up 50%, down 30%, up 20%. Same average return. Why might Portfolio A actually be better for most people?",
        options: [
          { id: "a", text: "Portfolio A is illegal to beat", isCorrect: false },
          { id: "b", text: "Portfolio B's wild swings make it more likely the investor panic-sells at a bad time", isCorrect: true },
          { id: "c", text: "Portfolio A pays more taxes", isCorrect: false },
          { id: "d", text: "They're identical in every way", isCorrect: false }
        ],
        explanationExtended: "Real investor returns are usually LOWER than portfolio returns, because people buy high and sell low when volatility hurts. Smooth returns are easier to stick with. 'The best portfolio is the one you can actually hold through tough times.'"
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
      { id: "6-b2", tier: "basic",
        explanation: "'Herd Behavior' is when people do what everyone else is doing instead of thinking for themselves. In markets, this can push prices way above (or below) what makes sense.",
        question: "A stock is going up purely because influencers keep posting about it, not because the company changed at all. What's happening here?",
        options: [
          { id: "a", text: "The stock is becoming more valuable", isCorrect: false },
          { id: "b", text: "Herd behavior is pushing the price up, detached from the actual business", isCorrect: true },
          { id: "c", text: "The company is secretly growing faster", isCorrect: false },
          { id: "d", text: "Influencers always pick winners", isCorrect: false }
        ],
        explanationExtended: "The market can stay irrational longer than you might expect. Prices driven purely by hype eventually snap back to reality, often brutally."
      },
      { id: "6-b3", tier: "basic",
        explanation: "'Loss Aversion' is a psychology term meaning the pain of losing $100 feels bigger than the joy of gaining $100. This pushes people toward bad decisions.",
        question: "A stock you own is down 20%. You keep holding it (even though the company is clearly failing) because 'I don't want to realize the loss'. What bias is this?",
        options: [
          { id: "a", text: "FOMO", isCorrect: false },
          { id: "b", text: "Loss Aversion (and the related 'disposition effect')", isCorrect: true },
          { id: "c", text: "Brand loyalty", isCorrect: false },
          { id: "d", text: "Diversification", isCorrect: false }
        ],
        explanationExtended: "A paper loss is still a loss. Holding a failing business just to avoid 'admitting' it doesn't reverse the damage. Always ask: 'Would I buy this stock today at this price?' If no, that's useful info."
      },
      { id: "6-b4", tier: "basic",
        explanation: "'Confirmation Bias' is when you only pay attention to info that agrees with what you already believe.",
        question: "You love a stock. You only read bullish articles about it and scroll past any negative news. What bias are you falling into?",
        options: [
          { id: "a", text: "FOMO", isCorrect: false },
          { id: "b", text: "Confirmation Bias", isCorrect: true },
          { id: "c", text: "Loss Aversion", isCorrect: false },
          { id: "d", text: "Herd Behavior", isCorrect: false }
        ],
        explanationExtended: "Good investing means actively seeking out the BEAR case, the reasons you might be wrong. If you can't name three reasons the stock might fail, you don't know it well enough."
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
        explanationExtended: "Panic selling locks in your losses. If the company's fundamentals are still healthy, the price will likely recover. That said, if something has fundamentally changed about the business, selling can be the right call. The key is to decide based on facts, not fear."
      },
      { id: "6-u2", tier: "understanding",
        explanation: "'Recency Bias' is when recent events feel way more important than they really are. A stock up 50% this month feels like it'll keep going up. A market down 20% feels like it'll keep crashing.",
        question: "The market has been rising for 18 months. You start assuming it'll always go up and load up on risky stocks. What bias is this?",
        options: [
          { id: "a", text: "Confirmation bias", isCorrect: false },
          { id: "b", text: "Recency bias", isCorrect: true },
          { id: "c", text: "Survivor bias", isCorrect: false },
          { id: "d", text: "Home bias", isCorrect: false }
        ],
        explanationExtended: "Markets move in cycles. Every bull market in history was followed by a bear market. Every bear market was followed by recovery. Assuming the recent trend is permanent is one of the most expensive mistakes in investing."
      },
      { id: "6-u3", tier: "understanding",
        explanation: "'Anchoring' is when you get stuck on one number, usually the price you paid, and use it as a reference point, even when it's no longer relevant.",
        question: "You bought a stock at $100. It's now at $40 and the business is worse than you thought. You tell yourself 'I'll sell when it gets back to $100'. What's wrong with that?",
        options: [
          { id: "a", text: "Nothing, you should always wait to break even", isCorrect: false },
          { id: "b", text: "The market doesn't care what YOU paid, the stock only goes where its future justifies", isCorrect: true },
          { id: "c", text: "$100 is a magic number for every stock", isCorrect: false },
          { id: "d", text: "You should sell when it hits $50 instead", isCorrect: false }
        ],
        explanationExtended: "'Getting back to even' is not a strategy, it's an emotion. The decision should always be forward-looking: 'Based on what I know now, is this a good investment?' What you paid is a sunk cost."
      },
      { id: "6-u4", tier: "understanding",
        explanation: "'Overconfidence' is when a few wins make you think you're a genius and you start taking bigger risks.",
        question: "You picked 3 winning stocks in a row during a bull market. Now you're convinced you have a special skill and start betting huge amounts on your next pick. What's the trap?",
        options: [
          { id: "a", text: "Three wins mean you've mastered the market", isCorrect: false },
          { id: "b", text: "A rising market lifts most stocks; you can't tell skill from luck in a short sample", isCorrect: true },
          { id: "c", text: "You should bet even more because the streak continues", isCorrect: false },
          { id: "d", text: "There's no such thing as overconfidence in investing", isCorrect: false }
        ],
        explanationExtended: "In a bull market, throwing darts at a stock list often 'works'. Real skill shows up over many years and across different market conditions. Humility is a superpower in investing."
      },
      { id: "6-s1", tier: "situation",
        explanation: "The financial media often amplifies fear or greed because dramatic headlines get more clicks. Staying calm often means tuning the noise down.",
        question: "A news channel runs a red banner: 'MARKETS IN CHAOS!' You check, the S&P 500 is down 1.2% on the day. What's a reasonable response?",
        options: [
          { id: "a", text: "Sell everything immediately", isCorrect: false },
          { id: "b", text: "Recognize that 1-2% daily moves are normal, not 'chaos', don't let dramatic framing drive decisions", isCorrect: true },
          { id: "c", text: "Buy everything immediately", isCorrect: false },
          { id: "d", text: "Panic without selling", isCorrect: false }
        ],
        explanationExtended: "News channels need drama to keep you watching. A 1-2% move is a normal Tuesday. Historically, the market has had many days down 1-2%, and has still grown a lot over decades. Context matters more than headlines."
      },
      { id: "6-s2", tier: "situation",
        explanation: "Writing down WHY you bought a stock, before you buy it, is one of the best defenses against emotional decisions later.",
        question: "A stock you own drops 15% on scary headlines. You check your original notes, the reasons you bought it are all still true. What's the most rational response?",
        options: [
          { id: "a", text: "Sell immediately because the price dropped", isCorrect: false },
          { id: "b", text: "Reassess whether the original thesis still holds; if yes, drops alone aren't a reason to sell", isCorrect: true },
          { id: "c", text: "Buy 10x more because of panic", isCorrect: false },
          { id: "d", text: "Delete the app forever", isCorrect: false }
        ],
        explanationExtended: "An 'investment thesis' is your written reason for owning a stock. Ask: 'Has anything in my thesis actually broken?' If no, the price drop is noise. If yes, it might be time to act, based on facts, not feelings."
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
      { id: "7-b2", tier: "basic",
        explanation: "An ETF (Exchange-Traded Fund) is a bundle of many stocks you can buy in one click. An S&P 500 ETF, for example, gives you a tiny slice of 500 big U.S. companies at once.",
        question: "You have $100 and want exposure to hundreds of companies at once without researching each one. What's the most beginner-friendly tool?",
        options: [
          { id: "a", text: "Buy one share of one company", isCorrect: false },
          { id: "b", text: "An index ETF (like an S&P 500 ETF)", isCorrect: true },
          { id: "c", text: "An individual penny stock", isCorrect: false },
          { id: "d", text: "A lottery ticket", isCorrect: false }
        ],
        explanationExtended: "ETFs give you instant diversification. Many long-term investors start with a broad market index ETF and add individual stocks later once they've learned more. (Educational content, not financial advice.)"
      },
      { id: "7-b3", tier: "basic",
        explanation: "Bonds are essentially IOUs, you lend money to a government or company, and they pay you interest plus your principal back. Generally less volatile than stocks.",
        question: "Why do some investors hold bonds alongside stocks in their portfolio?",
        options: [
          { id: "a", text: "Bonds always pay higher returns than stocks", isCorrect: false },
          { id: "b", text: "Bonds tend to be less volatile and can cushion a portfolio when stocks drop", isCorrect: true },
          { id: "c", text: "Bonds are required by law", isCorrect: false },
          { id: "d", text: "Bonds can only be bought by rich people", isCorrect: false }
        ],
        explanationExtended: "Stocks and bonds often (though not always) zig and zag at different times. Holding both can smooth out your portfolio's ride. The classic mix used to be called '60/40', 60% stocks, 40% bonds, though today there's more debate about the 'right' split."
      },
      { id: "7-b4", tier: "basic",
        explanation: "Dollar-Cost Averaging (DCA) means investing a fixed amount on a regular schedule, regardless of what the market is doing. The SEC describes it as investing in equal portions, at regular intervals.",
        question: "You commit to investing $100 every month into an ETF, rain or shine. What investing strategy is this?",
        options: [
          { id: "a", text: "Market timing", isCorrect: false },
          { id: "b", text: "Dollar-Cost Averaging (DCA)", isCorrect: true },
          { id: "c", text: "Day trading", isCorrect: false },
          { id: "d", text: "Short selling", isCorrect: false }
        ],
        explanationExtended: "When prices are high, your $100 buys fewer shares. When prices are low, it buys more. Over time, this averages out your purchase price and removes the emotional question of 'should I buy today?'. According to the SEC, DCA can help manage risk by following a consistent pattern."
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
      },
      { id: "7-u2", tier: "understanding",
        explanation: "'Asset Classes' are broad categories of investments, like stocks, bonds, cash, and real estate. They often behave differently, so mixing them reduces overall risk.",
        question: "You hold only U.S. tech stocks. What's the main way to improve your diversification?",
        options: [
          { id: "a", text: "Buy even more U.S. tech stocks", isCorrect: false },
          { id: "b", text: "Add different asset classes, sectors, and geographies (like bonds, non-tech sectors, international stocks)", isCorrect: true },
          { id: "c", text: "Put everything in one single stock for focus", isCorrect: false },
          { id: "d", text: "Close the account and start over", isCorrect: false }
        ],
        explanationExtended: "Diversification works on multiple levels: across companies, across sectors, across asset classes, and across countries. Owning 20 tech stocks is still basically one bet, on tech."
      },
      { id: "7-u3", tier: "understanding",
        explanation: "Fees quietly eat your returns. An investment charging 2% a year doesn't sound like much, but over decades it can cost you a huge chunk of your final portfolio.",
        question: "Two ETFs track the same index. Fund A charges 0.05% a year. Fund B charges 1.5%. Over 30 years, all else equal, which one likely leaves you with significantly more money?",
        options: [
          { id: "a", text: "Fund A, lower fees compound into a big difference over decades", isCorrect: true },
          { id: "b", text: "Fund B, higher fees mean higher returns", isCorrect: false },
          { id: "c", text: "They'll end identical", isCorrect: false },
          { id: "d", text: "It's random", isCorrect: false }
        ],
        explanationExtended: "A 1.45% fee difference over 30 years can easily cost you tens of thousands of dollars, depending on amounts invested. Always check the 'expense ratio' before buying any fund."
      },
      { id: "7-u4", tier: "understanding",
        explanation: "Compound growth means returns earn returns. Reinvesting dividends (instead of spending them) is one of the most underrated long-term wealth builders.",
        question: "Your index fund pays $200 in dividends this year. What's a classic long-term move?",
        options: [
          { id: "a", text: "Withdraw the $200 and spend it", isCorrect: false },
          { id: "b", text: "Reinvest the $200 to buy more shares, so next year's dividend is even bigger", isCorrect: true },
          { id: "c", text: "Leave it in cash and do nothing", isCorrect: false },
          { id: "d", text: "Donate it back to the company", isCorrect: false }
        ],
        explanationExtended: "Reinvesting dividends turns your portfolio into a self-growing snowball, your dividends buy more shares, which produce more dividends, which buy more shares. Many brokerages offer auto-reinvestment (a 'DRIP') for free."
      },
      { id: "7-s1", tier: "situation",
        explanation: "Rebalancing too often creates taxes and fees; rebalancing too rarely lets your portfolio drift far from your target.",
        question: "You set a target of 70% stocks / 30% bonds. A year later, stocks rallied and you're at 82/18. What's a reasonable move?",
        options: [
          { id: "a", text: "Ignore it forever", isCorrect: false },
          { id: "b", text: "Rebalance back toward your target, sell some stocks and add to bonds, OR direct new contributions to bonds", isCorrect: true },
          { id: "c", text: "Go all-in on stocks because they're winning", isCorrect: false },
          { id: "d", text: "Sell everything immediately", isCorrect: false }
        ],
        explanationExtended: "Common approaches: rebalance once a year, or whenever an allocation drifts more than ~5 percentage points from target. Using new contributions to rebalance (instead of selling) avoids triggering taxes in non-retirement accounts."
      },
      { id: "7-s2", tier: "situation",
        explanation: "Taxes can take a big bite out of investment gains. Tax-advantaged accounts (like Roth IRAs in the U.S., ISAs in the UK, etc.) help reduce that bite, rules vary by country.",
        question: "You have a choice between a regular brokerage account and a tax-advantaged retirement account for long-term savings. What's generally the consideration?",
        options: [
          { id: "a", text: "They're identical", isCorrect: false },
          { id: "b", text: "Tax-advantaged accounts can significantly increase your long-term returns by reducing tax drag, worth understanding what's available in your country", isCorrect: true },
          { id: "c", text: "Regular brokerage is always better", isCorrect: false },
          { id: "d", text: "Tax-advantaged accounts are scams", isCorrect: false }
        ],
        explanationExtended: "Rules differ by country, but most countries offer SOME form of tax-advantaged investment account for retirement or long-term saving. Learning what's available to you is one of the highest-ROI research tasks in investing. (Educational content, not tax advice, consult a qualified professional for your situation.)"
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
        explanationExtended: "This is one reason many people consider investing, keeping cash under the mattress means inflation quietly 'eats' its value over time. That said, always keep an emergency fund in a safe account before putting money into markets. (Educational content, not financial advice.)"
      },
      { id: "8-b2", tier: "basic",
        explanation: "GDP (Gross Domestic Product) is the total value of everything a country produces in a year. A rising GDP means the economy is growing; a falling GDP means it's shrinking.",
        question: "A country's GDP grew by 3% this year. What does that generally suggest about the economy?",
        options: [
          { id: "a", text: "The country is becoming poorer", isCorrect: false },
          { id: "b", text: "The economy is expanding, more goods and services were produced than last year", isCorrect: true },
          { id: "c", text: "GDP has nothing to do with the economy", isCorrect: false },
          { id: "d", text: "The stock market is guaranteed to drop", isCorrect: false }
        ],
        explanationExtended: "GDP growth is one of the most-watched economic signals. Strong growth often supports corporate earnings; falling GDP can signal a recession (a 'recession' is often defined as two consecutive quarters of negative GDP growth, though the official definition can vary)."
      },
      { id: "8-b3", tier: "basic",
        explanation: "A 'Recession' is a significant, widespread decline in economic activity, usually lasting months. Unemployment often rises; spending falls.",
        question: "The economy has shrunk for two quarters in a row and unemployment is rising. This likely fits the general description of what?",
        options: [
          { id: "a", text: "A boom", isCorrect: false },
          { id: "b", text: "A recession", isCorrect: true },
          { id: "c", text: "A dividend", isCorrect: false },
          { id: "d", text: "A stock split", isCorrect: false }
        ],
        explanationExtended: "Recessions are part of the normal economic cycle, they've happened many times and have always (eventually) been followed by recovery. Long-term investors generally ride them out rather than trying to time them."
      },
      { id: "8-b4", tier: "basic",
        explanation: "The Federal Reserve (in the U.S.) is the 'Central Bank'. It sets short-term interest rates and tries to keep inflation and unemployment under control. Other countries have their own central banks (Bank of England, ECB, etc.).",
        question: "What's the main job of a country's central bank (like the U.S. Federal Reserve)?",
        options: [
          { id: "a", text: "To run all the private banks", isCorrect: false },
          { id: "b", text: "To manage monetary policy, setting interest rates and aiming for stable prices and low unemployment", isCorrect: true },
          { id: "c", text: "To print money for the stock market", isCorrect: false },
          { id: "d", text: "To pick which stocks should go up", isCorrect: false }
        ],
        explanationExtended: "Central bank decisions, especially about interest rates, ripple through the whole economy and stock market. When the Fed talks, markets listen."
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
        explanationExtended: "Higher rates = Higher costs for businesses = Potentially lower profits = Often lower stock prices. Higher rates also make 'safer' options like savings accounts and bonds more attractive relative to stocks."
      },
      { id: "8-u2", tier: "understanding",
        explanation: "The 'Business Cycle' describes how economies move through phases: expansion → peak → contraction → trough → expansion again. Different sectors tend to do well in different phases.",
        question: "In a long expansion phase, unemployment is low and consumer spending is strong. Which general type of company often does well?",
        options: [
          { id: "a", text: "Only doomsday prep companies", isCorrect: false },
          { id: "b", text: "'Cyclical' companies like travel, restaurants, and big-ticket retail, they benefit from strong consumer spending", isCorrect: true },
          { id: "c", text: "No companies do well in expansions", isCorrect: false },
          { id: "d", text: "Only utility companies", isCorrect: false }
        ],
        explanationExtended: "Cyclical sectors rise and fall with the economy. 'Defensive' sectors (like utilities, consumer staples, and healthcare) tend to be steadier because people buy toilet paper and electricity regardless of the economy."
      },
      { id: "8-u3", tier: "understanding",
        explanation: "Unemployment data shows what share of people who WANT jobs can't find them. Very high unemployment usually signals a weak economy; very low unemployment can sometimes fuel inflation.",
        question: "The unemployment rate rises sharply for several months in a row. What does this likely signal?",
        options: [
          { id: "a", text: "The economy is probably weakening", isCorrect: true },
          { id: "b", text: "The economy is definitely booming", isCorrect: false },
          { id: "c", text: "Stocks are guaranteed to go up", isCorrect: false },
          { id: "d", text: "Inflation is about to disappear", isCorrect: false }
        ],
        explanationExtended: "Rising unemployment = less spending = less corporate revenue = pressure on profits. It's one of several 'economic indicators' investors and policymakers watch closely."
      },
      { id: "8-u4", tier: "understanding",
        explanation: "Currency exchange rates matter because companies that sell overseas get paid in other currencies. A stronger dollar (for example) can make U.S. exports more expensive abroad.",
        question: "A U.S. company earns most of its revenue in Europe. The U.S. dollar strengthens a lot vs. the Euro. All else equal, what's a likely effect on the company's reported revenue in dollars?",
        options: [
          { id: "a", text: "It goes up massively", isCorrect: false },
          { id: "b", text: "It can be pressured lower when Euro sales are converted back into stronger dollars", isCorrect: true },
          { id: "c", text: "Currency doesn't affect multinational companies", isCorrect: false },
          { id: "d", text: "It doubles automatically", isCorrect: false }
        ],
        explanationExtended: "This is 'Currency Risk'. Big multinational companies deal with this constantly and often 'hedge' currency exposure. For long-term investors, currency effects usually smooth out over years."
      },
      { id: "8-s1", tier: "situation",
        explanation: "Geopolitical events (wars, trade disputes, major elections) can cause short-term volatility. Markets usually overreact, then settle, then focus back on fundamentals.",
        question: "A sudden international crisis causes markets to drop 5% in a day. As a long-term investor, what's a historically reasonable response?",
        options: [
          { id: "a", text: "Sell everything and never invest again", isCorrect: false },
          { id: "b", text: "Stay calm, stick to your plan, and remember markets have historically recovered from many past crises", isCorrect: true },
          { id: "c", text: "Borrow money to buy everything immediately", isCorrect: false },
          { id: "d", text: "Panic sell, then panic buy, then panic sell again", isCorrect: false }
        ],
        explanationExtended: "Historically, markets have weathered wars, pandemics, political crises, oil shocks, and more, always with drops, always with recoveries. Past performance doesn't guarantee the future, but emotional reactions to headlines rarely help. (Educational content, not financial advice.)"
      },
      { id: "8-s2", tier: "situation",
        explanation: "Rising interest rates affect different sectors differently. Banks can benefit (higher loan margins); high-debt or high-growth companies often struggle (higher borrowing costs, future profits worth less today).",
        question: "The Fed starts aggressively raising rates to fight inflation. Which type of company is generally MOST at risk?",
        options: [
          { id: "a", text: "A highly profitable bank with pricing power on loans", isCorrect: false },
          { id: "b", text: "A high-growth, money-losing tech company that relies on borrowing to survive", isCorrect: true },
          { id: "c", text: "A utility that's been stable for 100 years", isCorrect: false },
          { id: "d", text: "All companies benefit equally", isCorrect: false }
        ],
        explanationExtended: "When rates rise, companies that don't yet make profits but keep borrowing to grow get squeezed hardest. Their future earnings also get 'discounted' more heavily, making their high valuations harder to justify."
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
        explanation: "Compounding is the 'Magic Snowball'. You earn returns on your returns. Over decades, even small regular amounts can grow into something significant.",
        question: "Why is starting to invest $100/month at age 20 surprisingly powerful compared to waiting until age 40?",
        options: [
          { id: "a", text: "Because 20-year-olds have better luck", isCorrect: false },
          { id: "b", text: "Because your money has many extra years to 'Compound', earning returns on returns", isCorrect: true },
          { id: "c", text: "It's actually not better", isCorrect: false },
          { id: "d", text: "Fees are lower for younger investors", isCorrect: false }
        ],
        explanationExtended: "Rough illustration: at a hypothetical 7% average annual return, $100/month from age 20 to 65 could grow to roughly $380,000, while starting at 40 and contributing the same $100/month for 25 years gets you only about $80,000. To match the early starter, the 40-year-old would need to invest closer to $470/month. Start early, even with small amounts! (Illustrative math, real returns vary. Not financial advice.)"
      },
      { id: "9-b2", tier: "basic",
        explanation: "'Buy and Hold' means buying quality investments and keeping them for years or decades, letting time and compounding do the heavy lifting. Famous proponents include Warren Buffett.",
        question: "Which of these is the core idea of 'Buy and Hold' investing?",
        options: [
          { id: "a", text: "Trade as often as possible to capture every wiggle", isCorrect: false },
          { id: "b", text: "Invest in quality assets and hold them for a long time, riding out short-term noise", isCorrect: true },
          { id: "c", text: "Only buy stocks on Mondays", isCorrect: false },
          { id: "d", text: "Only hold stocks for exactly one year", isCorrect: false }
        ],
        explanationExtended: "Buy and hold minimizes trading costs and taxes, avoids most market-timing mistakes, and leans into compounding. Most studies find that long-term, low-activity investors tend to outperform frequent traders."
      },
      { id: "9-b3", tier: "basic",
        explanation: "Index investing means buying a fund that tracks a broad market index (like the S&P 500) instead of picking individual stocks. You essentially 'own the market' at very low cost.",
        question: "You don't want to research individual companies. You just want to own a slice of the overall U.S. market. What's a common, beginner-friendly approach?",
        options: [
          { id: "a", text: "Invest in a broad low-cost index fund or index ETF", isCorrect: true },
          { id: "b", text: "Pick one random stock you've heard of", isCorrect: false },
          { id: "c", text: "Buy only penny stocks", isCorrect: false },
          { id: "d", text: "Avoid the market entirely forever", isCorrect: false }
        ],
        explanationExtended: "Index investing is famously endorsed by Warren Buffett himself for most individual investors. It's simple, diversified, and low-cost, a strong default starting point while you learn more. (Educational content, not financial advice.)"
      },
      { id: "9-b4", tier: "basic",
        explanation: "'Active investing' means trying to beat the market by picking stocks or timing trades. 'Passive investing' means tracking a broad market index and holding it.",
        question: "Someone who just buys and holds an S&P 500 ETF without trying to pick individual winners is using what kind of approach?",
        options: [
          { id: "a", text: "Active investing", isCorrect: false },
          { id: "b", text: "Passive investing", isCorrect: true },
          { id: "c", text: "Day trading", isCorrect: false },
          { id: "d", text: "Technical analysis", isCorrect: false }
        ],
        explanationExtended: "Studies have consistently found that most active fund managers fail to beat a simple index fund over 10+ year periods, especially after fees. Passive isn't 'lazy', it's often just smart."
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
        explanationExtended: "Value investors look for 'Intrinsic Value', what the company is actually worth, and wait for the market to realize its mistake and push the price back up."
      },
      { id: "9-u2", tier: "understanding",
        explanation: "Growth investing prioritizes companies with fast-rising revenue and earnings, even if valuations look expensive today.",
        question: "A cloud software company's revenue has been growing 40% per year and it keeps reinvesting profits into more growth. A growth investor would likely...",
        options: [
          { id: "a", text: "Ignore it because the P/E is high", isCorrect: false },
          { id: "b", text: "Consider buying, betting that future earnings growth will justify today's high valuation", isCorrect: true },
          { id: "c", text: "Short it immediately", isCorrect: false },
          { id: "d", text: "Wait for the stock to fall to $0", isCorrect: false }
        ],
        explanationExtended: "Growth vs. value isn't about 'right' or 'wrong', they're different approaches with different risk profiles. Growth can deliver bigger wins and bigger losses; value is often steadier but slower."
      },
      { id: "9-u3", tier: "understanding",
        explanation: "'Time in the market beats timing the market' is one of the most-repeated phrases in investing. Missing just a handful of the best days over decades can dramatically reduce returns.",
        question: "Studies of long-term market returns generally find what about investors who try to time the market (jumping in and out)?",
        options: [
          { id: "a", text: "They consistently beat long-term buy-and-hold investors", isCorrect: false },
          { id: "b", text: "They often underperform because missing even a few of the market's best days dramatically reduces returns", isCorrect: true },
          { id: "c", text: "Timing is easy if you watch CNBC enough", isCorrect: false },
          { id: "d", text: "Timing has no effect on returns", isCorrect: false }
        ],
        explanationExtended: "Many of the market's best days come clustered around its worst days, often during scary periods. Investors who sell in panic tend to miss the rebounds. Staying invested (through the ugly parts) is historically one of the strongest long-term strategies."
      },
      { id: "9-u4", tier: "understanding",
        explanation: "'Income investing' focuses on stocks (and bonds) that pay reliable dividends/interest, rather than betting on fast price appreciation.",
        question: "Someone approaching retirement who prioritizes steady cash payouts over huge growth is likely leaning toward what style?",
        options: [
          { id: "a", text: "Day trading", isCorrect: false },
          { id: "b", text: "Income / dividend investing", isCorrect: true },
          { id: "c", text: "Meme-coin speculation", isCorrect: false },
          { id: "d", text: "Short selling", isCorrect: false }
        ],
        explanationExtended: "Dividend-paying stocks can provide steady income while still offering some price appreciation. Many retirees combine dividend stocks and bonds to generate cash flow without constantly selling principal."
      },
      { id: "9-s1", tier: "situation",
        explanation: "There's no one 'right' strategy, what works depends on your goals, time horizon, and temperament. Many long-term investors use a blend.",
        question: "You're 25, saving for retirement decades away, hate checking the market, and feel queasy during big drops. Which approach is probably the worst fit?",
        options: [
          { id: "a", text: "Dollar-cost averaging into broad index funds monthly", isCorrect: false },
          { id: "b", text: "Day-trading options on high-volatility meme stocks every day", isCorrect: true },
          { id: "c", text: "Buy-and-hold diversified ETFs", isCorrect: false },
          { id: "d", text: "A simple 70/30 stocks-to-bonds mix", isCorrect: false }
        ],
        explanationExtended: "Matching strategy to personality is as important as the strategy itself. If a plan stresses you out, you'll abandon it, usually at the worst time. Most beginners do better with simple, automatic approaches than with flashy, active ones."
      },
      { id: "9-s2", tier: "situation",
        explanation: "Trying to pick individual stocks is HARD even for professionals. Many studies show that most active fund managers underperform a simple index fund over 10+ year periods, especially after fees.",
        question: "You want to actively pick individual stocks instead of just buying an index fund. What's a realistic expectation to set?",
        options: [
          { id: "a", text: "You will definitely beat every professional", isCorrect: false },
          { id: "b", text: "Beating the overall market long-term is genuinely hard, many pros don't manage it; keep fees and expectations in check", isCorrect: true },
          { id: "c", text: "Stock picking is guaranteed money", isCorrect: false },
          { id: "d", text: "Nobody has ever beaten the market", isCorrect: false }
        ],
        explanationExtended: "Some people absolutely do beat the market over long periods, but the base rate is low. A reasonable middle ground: put most of your money in low-cost index funds and use a smaller 'satellite' portion for individual picks you really believe in. That way, if your picks underperform, your core is still doing fine."
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
      { id: "10-b2", tier: "basic",
        explanation: "'Earnings Season' happens every 3 months, when most public companies release quarterly results within the same few-week window. Expect lots of price moves during this period.",
        question: "A stock you own is whipping up and down more than usual. It's April and all the big companies are announcing their last quarter's results. What's likely going on?",
        options: [
          { id: "a", text: "The stock market is broken", isCorrect: false },
          { id: "b", text: "It's earnings season, volatility is normal as companies beat or miss expectations", isCorrect: true },
          { id: "c", text: "Everyone is selling forever", isCorrect: false },
          { id: "d", text: "Stocks always behave this way in April", isCorrect: false }
        ],
        explanationExtended: "Earnings season (roughly mid-Jan, mid-April, mid-July, mid-October) brings big moves in both directions as new data comes in. Long-term investors try not to overreact to any single quarter."
      },
      { id: "10-b3", tier: "basic",
        explanation: "Before you buy a stock, it helps to write a quick note: why you're buying it, what would make you sell, and what return you expect. Future-you will thank present-you.",
        question: "You're about to buy your first stock. What's a great habit to build RIGHT NOW?",
        options: [
          { id: "a", text: "Buy without thinking", isCorrect: false },
          { id: "b", text: "Write a short 'investment thesis', why you're buying, and what would change your mind", isCorrect: true },
          { id: "c", text: "Only buy what influencers recommend", isCorrect: false },
          { id: "d", text: "Never read about the company", isCorrect: false }
        ],
        explanationExtended: "An investment thesis is one of the best tools for fighting emotional decisions later. When the stock drops 20% and you panic, you can re-read your own notes and ask: 'Has anything I wrote actually broken?'"
      },
      { id: "10-b4", tier: "basic",
        explanation: "Past performance doesn't guarantee future results. A stock that's been up 200% in a year isn't more likely to keep doing that, sometimes, the opposite.",
        question: "A friend says 'This stock went up 300% last year, it's a sure thing for next year!' What's the mistake?",
        options: [
          { id: "a", text: "Nothing, past performance always continues", isCorrect: false },
          { id: "b", text: "Past performance is not a reliable predictor of future results, in fact, hot stocks often cool off", isCorrect: true },
          { id: "c", text: "Your friend is definitely right", isCorrect: false },
          { id: "d", text: "Stocks that go up must keep going up by law", isCorrect: false }
        ],
        explanationExtended: "Every regulated financial document contains a version of 'past performance does not guarantee future results', there's a reason for that. Assess companies on their current fundamentals and future prospects, not last year's chart."
      },
      { id: "10-u1", tier: "understanding",
        explanation: "There's a big difference between investing (long-term ownership based on fundamentals) and speculating (short-term bets on price moves). Both exist, but they shouldn't be confused with each other.",
        question: "You buy a hyped-up penny stock you know nothing about because it's 'definitely going to double this week'. Which word best describes this?",
        options: [
          { id: "a", text: "Value investing", isCorrect: false },
          { id: "b", text: "Speculating (or outright gambling)", isCorrect: true },
          { id: "c", text: "Passive investing", isCorrect: false },
          { id: "d", text: "Dollar-cost averaging", isCorrect: false }
        ],
        explanationExtended: "Speculating isn't necessarily 'wrong', but you should know when you're doing it. A good rule: only speculate with money you can afford to lose entirely. Never confuse lucky speculation wins with real investing skill."
      },
      { id: "10-u2", tier: "understanding",
        explanation: "When a 'hot tip' from a random source, group chat, or influencer hits your phone, the question should always be: 'Why is this person telling me now?'",
        question: "A stranger in a Discord says 'Buy XYZ NOW, it's about to 10x!' The stock is tiny and obscure. What's the red flag?",
        options: [
          { id: "a", text: "Nothing, hot tips are always legit", isCorrect: false },
          { id: "b", text: "This pattern fits classic 'pump and dump' schemes, people talk up a cheap stock, and when newbies rush in, the promoters sell at the top", isCorrect: true },
          { id: "c", text: "You should invest your whole savings instantly", isCorrect: false },
          { id: "d", text: "Discord strangers are the best source of stock picks", isCorrect: false }
        ],
        explanationExtended: "Pump and dump is illegal, but it still happens constantly in small stocks and crypto. If someone REALLY had a guaranteed winner, they wouldn't be yelling about it in a chat room, they'd be quietly buying it."
      },
      { id: "10-u3", tier: "understanding",
        explanation: "A 'paper trading' account lets you practice buying and selling with fake money. It's one of the best ways to test your strategy and emotions before risking real cash.",
        question: "You want to try day trading, but you're scared of losing money. What's a reasonable first step?",
        options: [
          { id: "a", text: "Borrow your life savings and dive in", isCorrect: false },
          { id: "b", text: "Use a paper-trading account to practice with simulated money first", isCorrect: true },
          { id: "c", text: "Put 100% of your net worth in one stock", isCorrect: false },
          { id: "d", text: "Skip practice, reading about it is enough", isCorrect: false }
        ],
        explanationExtended: "Many brokerages offer paper trading for free. It exposes the gap between 'I know what I should do' and 'I actually do it when real money is on the line'. Beginners are often surprised by how different it feels."
      },
      { id: "10-u4", tier: "understanding",
        explanation: "An 'Investment Journal', where you log your trades, reasons, and emotions, is one of the highest-ROI habits in investing. It reveals your patterns over time.",
        question: "Why is keeping a short journal of your investing decisions so powerful over time?",
        options: [
          { id: "a", text: "It doesn't help at all", isCorrect: false },
          { id: "b", text: "It shows your real patterns and biases, what you actually do vs. what you think you do", isCorrect: true },
          { id: "c", text: "It's required by the SEC for all investors", isCorrect: false },
          { id: "d", text: "Journals automatically increase returns", isCorrect: false }
        ],
        explanationExtended: "Most investors remember their wins and forget their losses. A journal forces honesty. Over 6–12 months, you'll spot your real strengths and weaknesses, and that's where all the real improvement comes from."
      },
      { id: "10-s1", tier: "situation",
        explanation: "Scenario: A new law is passed that makes all plastic packaging illegal. You own a company that makes plastic water bottles.",
        question: "What is one reasonable 'Bestie' response after hearing this news?",
        options: [
          { id: "a", text: "Buy more because the stock is now 'cheaper'", isCorrect: false },
          { id: "b", text: "Research whether to sell, the core business model faces a serious regulatory threat", isCorrect: true },
          { id: "c", text: "Do nothing and hope the law changes", isCorrect: false },
          { id: "d", text: "Complain on social media", isCorrect: false }
        ],
        explanationExtended: "This is 'Regulatory Risk'. When a law directly targets a company's core product, investors should reassess. Key questions: Can they pivot? How long until enforcement? Is the risk already priced into the stock? There's no single right answer in real investing, but ignoring major regulatory changes is rarely wise. (Educational content, not financial advice.)"
      },
      { id: "10-s2", tier: "situation",
        explanation: "Scenario: Your portfolio is down 25% in three months. You haven't slept well in weeks and keep checking the app. A friend suggests 'just sell everything and wait it out'.",
        question: "Using everything you've learned, what's a reasonable calm response?",
        options: [
          { id: "a", text: "Sell at the bottom in panic", isCorrect: false },
          { id: "b", text: "Step back. Re-read your original investment thesis. If the fundamentals haven't broken, the drop alone isn't a reason to sell, but maybe reduce checking frequency and confirm your risk tolerance is properly set", isCorrect: true },
          { id: "c", text: "Buy 10x more with borrowed money to 'get it back'", isCorrect: false },
          { id: "d", text: "Delete the app and forget everything forever", isCorrect: false }
        ],
        explanationExtended: "If 25% down is keeping you up at night, it's a useful signal: your portfolio might be more aggressive than your true risk tolerance. Many investors quietly shift to slightly less volatile allocations after big drops, but ideally AFTER the panic passes, not during it. Never make big changes from a place of fear. (Educational content, not financial advice.)"
      },
      { id: "10-s3", tier: "situation",
        explanation: "Scenario: You inherit $10,000 from a relative. You're 28, have no debt, 3 months of emergency savings, and have been learning about investing for a few months.",
        question: "From everything you've learned in StockBestie, what's a reasonable 'Bestie' starting move?",
        options: [
          { id: "a", text: "Put it all into one hot meme stock you heard about yesterday", isCorrect: false },
          { id: "b", text: "Define your goals and time horizon, consider investing most of it over time (dollar-cost averaging) into diversified low-cost funds, and learn more before going wild with individual stocks", isCorrect: true },
          { id: "c", text: "Borrow another $90,000 to 'really send it'", isCorrect: false },
          { id: "d", text: "Spend it all immediately so you don't have to think about it", isCorrect: false }
        ],
        explanationExtended: "There's no single correct answer for inheriting money, but 'slow, diversified, and boring' is usually smarter than 'fast, concentrated, and exciting' for someone still learning. Reminder: the goal of StockBestie is understanding, not recommendations, always consult a qualified financial professional for decisions involving real money. (Educational content, not financial advice.)"
      }
    ]
  }
];
