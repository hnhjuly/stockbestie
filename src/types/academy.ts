export interface LessonOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface LessonQuestion {
  id: string;
  question: string;
  options: LessonOption[];
  explanation: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: string;
  questions: LessonQuestion[];
}

export const ACADEMY_LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Stock Basics",
    description: "What is a stock and how does it work?",
    icon: "📈",
    questions: [
      {
        id: "1-1",
        question: "What does owning a stock mean?",
        options: [
          { id: "a", text: "You own a small piece of a company", isCorrect: true },
          { id: "b", text: "You work for the company", isCorrect: false },
          { id: "c", text: "You owe money to the company", isCorrect: false },
          { id: "d", text: "You can tell the CEO what to do", isCorrect: false },
        ],
        explanation: "When you buy a stock, you become a partial owner (shareholder) of that company!"
      },
      {
        id: "1-2",
        question: "What is a 'ticker symbol'?",
        options: [
          { id: "a", text: "The company's phone number", isCorrect: false },
          { id: "b", text: "A short code representing a stock (like AAPL for Apple)", isCorrect: true },
          { id: "c", text: "The stock's secret password", isCorrect: false },
          { id: "d", text: "The CEO's nickname", isCorrect: false },
        ],
        explanation: "Ticker symbols are short abbreviations used to identify stocks on exchanges. For example, TSLA = Tesla!"
      },
      {
        id: "1-3",
        question: "Where are most stocks bought and sold?",
        options: [
          { id: "a", text: "At the mall", isCorrect: false },
          { id: "b", text: "On a stock exchange like NYSE or NASDAQ", isCorrect: true },
          { id: "c", text: "On eBay", isCorrect: false },
          { id: "d", text: "At a bank branch only", isCorrect: false },
        ],
        explanation: "Stock exchanges are marketplaces where buyers and sellers trade stocks electronically!"
      },
    ]
  },
  {
    id: 2,
    title: "Price Movements",
    description: "Why do stock prices go up and down?",
    icon: "📊",
    questions: [
      {
        id: "2-1",
        question: "What mainly causes a stock price to go UP?",
        options: [
          { id: "a", text: "More people want to buy it than sell it", isCorrect: true },
          { id: "b", text: "The CEO posts on social media", isCorrect: false },
          { id: "c", text: "It's a sunny day", isCorrect: false },
          { id: "d", text: "The stock is painted green", isCorrect: false },
        ],
        explanation: "Stock prices rise when demand exceeds supply - more buyers than sellers pushes the price up!"
      },
      {
        id: "2-2",
        question: "What does 'volatility' mean in stocks?",
        options: [
          { id: "a", text: "The stock is about to explode", isCorrect: false },
          { id: "b", text: "How much and how quickly a stock's price changes", isCorrect: true },
          { id: "c", text: "The stock smells bad", isCorrect: false },
          { id: "d", text: "The company is closing", isCorrect: false },
        ],
        explanation: "High volatility means big price swings. Some investors love it, others prefer stability!"
      },
      {
        id: "2-3",
        question: "A stock drops 10% after bad earnings. What should you do FIRST?",
        options: [
          { id: "a", text: "Panic and sell everything immediately", isCorrect: false },
          { id: "b", text: "Buy more without thinking", isCorrect: false },
          { id: "c", text: "Research why it dropped and assess if the business is still strong", isCorrect: true },
          { id: "d", text: "Call the police", isCorrect: false },
        ],
        explanation: "Always research before acting! A price drop might be temporary or signal a real problem."
      },
    ]
  },
  {
    id: 3,
    title: "Key Metrics",
    description: "Understanding P/E ratio, Market Cap & more",
    icon: "🔢",
    questions: [
      {
        id: "3-1",
        question: "What is 'Market Cap' (Market Capitalization)?",
        options: [
          { id: "a", text: "The hat the CEO wears to meetings", isCorrect: false },
          { id: "b", text: "Total value of all a company's shares combined", isCorrect: true },
          { id: "c", text: "How much cash the company has", isCorrect: false },
          { id: "d", text: "The building's square footage", isCorrect: false },
        ],
        explanation: "Market Cap = Stock Price × Number of Shares. It tells you the company's total value!"
      },
      {
        id: "3-2",
        question: "What does a P/E ratio of 20 mean?",
        options: [
          { id: "a", text: "The stock costs $20", isCorrect: false },
          { id: "b", text: "Investors pay $20 for every $1 of earnings", isCorrect: true },
          { id: "c", text: "The company has 20 employees", isCorrect: false },
          { id: "d", text: "The stock will go up 20%", isCorrect: false },
        ],
        explanation: "P/E (Price-to-Earnings) ratio shows how much you're paying for each dollar of profit. Lower can mean cheaper, but context matters!"
      },
      {
        id: "3-3",
        question: "What is trading 'Volume'?",
        options: [
          { id: "a", text: "How loud traders yell", isCorrect: false },
          { id: "b", text: "The number of shares traded in a period", isCorrect: true },
          { id: "c", text: "The size of the stock certificate", isCorrect: false },
          { id: "d", text: "The company's warehouse capacity", isCorrect: false },
        ],
        explanation: "High volume means lots of trading activity. It often indicates high interest in a stock!"
      },
    ]
  },
  {
    id: 4,
    title: "Risk & Reward",
    description: "Balancing potential gains with losses",
    icon: "⚖️",
    questions: [
      {
        id: "4-1",
        question: "What is 'diversification'?",
        options: [
          { id: "a", text: "Putting all your money in one stock", isCorrect: false },
          { id: "b", text: "Spreading investments across different assets to reduce risk", isCorrect: true },
          { id: "c", text: "Changing your password frequently", isCorrect: false },
          { id: "d", text: "Trading as fast as possible", isCorrect: false },
        ],
        explanation: "Don't put all your eggs in one basket! Diversification helps protect you if one investment falls."
      },
      {
        id: "4-2",
        question: "Which investment typically has MORE risk?",
        options: [
          { id: "a", text: "A savings account at a bank", isCorrect: false },
          { id: "b", text: "Government bonds", isCorrect: false },
          { id: "c", text: "A single small-company stock", isCorrect: true },
          { id: "d", text: "Your mattress", isCorrect: false },
        ],
        explanation: "Individual stocks, especially smaller companies, can swing wildly. Higher risk often means higher potential reward (or loss)!"
      },
      {
        id: "4-3",
        question: "What's a 'stop-loss order'?",
        options: [
          { id: "a", text: "A request to stop losing weight", isCorrect: false },
          { id: "b", text: "An automatic sell order if a stock drops to a certain price", isCorrect: true },
          { id: "c", text: "A type of traffic sign", isCorrect: false },
          { id: "d", text: "A way to freeze your account", isCorrect: false },
        ],
        explanation: "Stop-loss orders help limit your losses by automatically selling if a stock falls too much!"
      },
    ]
  },
  {
    id: 5,
    title: "Long-Term Investing",
    description: "Building wealth over time",
    icon: "🏦",
    questions: [
      {
        id: "5-1",
        question: "What is 'compound interest' often called?",
        options: [
          { id: "a", text: "The 8th wonder of the world", isCorrect: true },
          { id: "b", text: "A boring math concept", isCorrect: false },
          { id: "c", text: "Something only banks care about", isCorrect: false },
          { id: "d", text: "A type of loan", isCorrect: false },
        ],
        explanation: "Einstein allegedly called it the 8th wonder! Your earnings generate their own earnings over time."
      },
      {
        id: "5-2",
        question: "What does 'buy and hold' strategy mean?",
        options: [
          { id: "a", text: "Buy stocks and keep them for a long time", isCorrect: true },
          { id: "b", text: "Buy something and return it", isCorrect: false },
          { id: "c", text: "Hold your phone while buying", isCorrect: false },
          { id: "d", text: "Trade every single day", isCorrect: false },
        ],
        explanation: "Buy and hold means investing for years or decades, not days. Time in the market beats timing the market!"
      },
      {
        id: "5-3",
        question: "What is a 'dividend'?",
        options: [
          { id: "a", text: "A fee you pay to own stocks", isCorrect: false },
          { id: "b", text: "A portion of company profits paid to shareholders", isCorrect: true },
          { id: "c", text: "A type of stock that's illegal", isCorrect: false },
          { id: "d", text: "The stock's birthday present", isCorrect: false },
        ],
        explanation: "Some companies share their profits with shareholders through regular dividend payments. Passive income!"
      },
    ]
  },
];
