// In-memory store for mocked trade data
export interface Trade {
  id: string;
  instrument: string;
  direction: "Long" | "Short";
  entryPrice: number;
  stopPrice: number;
  takeProfitPrice: number;
  quantity: number;
  entryTime: string;
  exitTime: string;
  notes: string;
  exitPrice?: number;
  pnl?: number;
  rMultiple?: number;
}

// Mocked initial trades
const initialTrades: Trade[] = [
  {
    id: "1",
    instrument: "EUR/USD",
    direction: "Long",
    entryPrice: 1.0850,
    stopPrice: 1.0820,
    takeProfitPrice: 1.0920,
    quantity: 1,
    entryTime: "2024-01-15T09:30:00",
    exitTime: "2024-01-15T14:45:00",
    notes: "Strong bullish momentum, breakout trade",
    exitPrice: 1.0900,
    pnl: 50,
    rMultiple: 1.67,
  },
  {
    id: "2",
    instrument: "GBP/USD",
    direction: "Short",
    entryPrice: 1.2650,
    stopPrice: 1.2680,
    takeProfitPrice: 1.2580,
    quantity: 1,
    entryTime: "2024-01-16T10:15:00",
    exitTime: "2024-01-16T16:30:00",
    notes: "Resistance level rejection",
    exitPrice: 1.2600,
    pnl: 50,
    rMultiple: 1.67,
  },
  {
    id: "3",
    instrument: "USD/JPY",
    direction: "Long",
    entryPrice: 150.25,
    stopPrice: 149.95,
    takeProfitPrice: 151.05,
    quantity: 1,
    entryTime: "2024-01-17T08:00:00",
    exitTime: "2024-01-17T12:00:00",
    notes: "Trend continuation",
    exitPrice: 149.80,
    pnl: -45,
    rMultiple: -1.5,
  },
  {
    id: "4",
    instrument: "AUD/USD",
    direction: "Long",
    entryPrice: 0.6750,
    stopPrice: 0.6720,
    takeProfitPrice: 0.6810,
    quantity: 2,
    entryTime: "2024-01-18T11:20:00",
    exitTime: "2024-01-18T15:10:00",
    notes: "Support bounce",
    exitPrice: 0.6790,
    pnl: 80,
    rMultiple: 1.33,
  },
  {
    id: "5",
    instrument: "EUR/USD",
    direction: "Short",
    entryPrice: 1.0880,
    stopPrice: 1.0910,
    takeProfitPrice: 1.0830,
    quantity: 1,
    entryTime: "2024-01-19T09:45:00",
    exitTime: "2024-01-19T13:20:00",
    notes: "Failed breakout",
    exitPrice: 1.0845,
    pnl: 35,
    rMultiple: 1.17,
  },
];

// In-memory store
let trades: Trade[] = [...initialTrades];

export const tradeStore = {
  getAllTrades: (): Trade[] => {
    return [...trades];
  },

  getTradeById: (id: string): Trade | undefined => {
    return trades.find((trade) => trade.id === id);
  },

  addTrade: (trade: Omit<Trade, "id">): Trade => {
    const newTrade: Trade = {
      ...trade,
      id: Date.now().toString(),
      // Calculate PnL and R-multiple if exit price is provided
      ...(trade.exitPrice && {
        pnl: calculatePnL(trade),
        rMultiple: calculateRMultiple(trade),
      }),
    };
    trades.push(newTrade);
    return newTrade;
  },

  getLastNTrades: (n: number): Trade[] => {
    return [...trades].sort((a, b) => 
      new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
    ).slice(0, n);
  },

  getTodayPnL: (): number => {
    const today = new Date().toISOString().split("T")[0];
    return trades
      .filter((trade) => trade.exitTime?.startsWith(today) && trade.pnl)
      .reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  },

  getWinRate: (): number => {
    const closedTrades = trades.filter((t) => t.pnl !== undefined);
    if (closedTrades.length === 0) return 0;
    const wins = closedTrades.filter((t) => (t.pnl || 0) > 0).length;
    return (wins / closedTrades.length) * 100;
  },

  getTotalTrades: (): number => {
    return trades.length;
  },

  getAvgR: (): number => {
    const closedTrades = trades.filter((t) => t.rMultiple !== undefined);
    if (closedTrades.length === 0) return 0;
    const sum = closedTrades.reduce((acc, t) => acc + (t.rMultiple || 0), 0);
    return sum / closedTrades.length;
  },
};

function calculatePnL(trade: Omit<Trade, "id">): number {
  if (!trade.exitPrice) return 0;
  const priceDiff = trade.exitPrice - trade.entryPrice;
  const multiplier = trade.direction === "Long" ? 1 : -1;
  return priceDiff * multiplier * trade.quantity * 100; // Simplified PnL calculation
}

function calculateRMultiple(trade: Omit<Trade, "id">): number {
  if (!trade.exitPrice) return 0;
  const risk = Math.abs(trade.entryPrice - trade.stopPrice) * trade.quantity * 100;
  if (risk === 0) return 0;
  const pnl = calculatePnL(trade);
  return pnl / risk;
}
