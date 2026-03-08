import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, TrendingUp, PiggyBank, RefreshCw, ArrowLeft, Shield, Scale, Flame, Cpu, HeartPulse, Landmark, Zap, ShoppingCart, Factory, Building2, Radio, BarChart3, Layers, Blend, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BottomNav } from '@/components/BottomNav';
import { Link } from 'react-router-dom';
import stockBestieLogo from '@/assets/stock-bestie-logo.png';

const currencies = [
  { value: 'USD', label: '$ USD', symbol: '$' },
  { value: 'EUR', label: '€ EUR', symbol: '€' },
  { value: 'GBP', label: '£ GBP', symbol: '£' },
  { value: 'JPY', label: '¥ JPY', symbol: '¥' },
  { value: 'PHP', label: '₱ PHP', symbol: '₱' },
];

const categories: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'tech', label: 'Tech', icon: Cpu },
  { id: 'healthcare', label: 'Healthcare', icon: HeartPulse },
  { id: 'finance', label: 'Finance', icon: Landmark },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'consumer', label: 'Consumer', icon: ShoppingCart },
  { id: 'industrial', label: 'Industrial', icon: Factory },
  { id: 'realestate', label: 'Real Estate', icon: Building2 },
  { id: 'communication', label: 'Communication', icon: Radio },
];

const riskLevels = [
  { value: 0, label: 'Chill', icon: Shield, description: 'Low risk, stable returns' },
  { value: 50, label: 'Okay', icon: Scale, description: 'Balanced approach' },
  { value: 100, label: 'Brave', icon: Flame, description: 'High risk, high reward' },
];

const assetTypes: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'stocks', label: 'Stocks', icon: BarChart3 },
  { value: 'etfs', label: 'ETFs', icon: Layers },
  { value: 'both', label: 'Both', icon: Blend },
];

interface AllocationResult {
  ticker: string;
  name: string;
  percentage: number;
  amount: number;
  type: 'stock' | 'etf';
  reasoning: string;
}

interface BudgetResult {
  allocations: AllocationResult[];
  summary: string;
  riskNote: string;
}

export const BudgetPlanner = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [assetType, setAssetType] = useState<string>('both');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BudgetResult | null>(null);

  const getRiskLabel = (value: number) => {
    if (value <= 33) return riskLevels[0];
    if (value <= 66) return riskLevels[1];
    return riskLevels[2];
  };

  const currentRisk = getRiskLabel(riskLevel[0]);
  const selectedCurrency = currencies.find(c => c.value === currency);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAnalyze = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-budget', {
        body: {
          amount: parseFloat(amount),
          currency,
          assetType,
          categories: selectedCategories,
          riskLevel: currentRisk.label.toLowerCase(),
        },
      });

      if (error) throw error;

      setResult(data);
      toast.success('Budget analysis complete!');
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze budget');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCurrency('USD');
    setAssetType('both');
    setSelectedCategories([]);
    setRiskLevel([50]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/app" className="p-2 hover:bg-accent rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="p-1 flex-shrink-0">
              <img src={stockBestieLogo} alt="Stock Bestie Logo" className="h-8 w-8 object-contain logo-float" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Budget Planner</h1>
              <p className="text-xs text-muted-foreground">AI-powered allocation simulator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Budget Input */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PiggyBank className="h-5 w-5 text-primary" />
              Your Budget
            </CardTitle>
            <CardDescription>Enter your investment amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="10,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-lg font-semibold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Asset Type */}
        <Card className="animate-fade-in stagger-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Asset Type
            </CardTitle>
            <CardDescription>What would you like to invest in?</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleGroup
              type="single"
              value={assetType}
              onValueChange={(value) => value && setAssetType(value)}
              className="justify-start flex-wrap"
            >
              {assetTypes.map(asset => (
                <ToggleGroupItem key={asset.value} value={asset.value} className="px-4 py-2 rounded-full flex items-center gap-2">
                  <asset.icon className="w-5 h-5" />
                  {asset.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="animate-fade-in stagger-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>Select sectors you're interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Badge
                  key={cat.id}
                  variant={selectedCategories.includes(cat.id) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-2 text-sm transition-all hover:scale-105 flex items-center gap-2"
                  onClick={() => handleCategoryToggle(cat.id)}
                >
                  <img src={cat.icon} alt={cat.label} className="w-4 h-4 object-contain" />
                  {cat.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card className="animate-fade-in stagger-3 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Risk Vibe</CardTitle>
            <CardDescription>How adventurous are you feeling?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Custom Liquid Glass Slider */}
            <div className="relative px-1">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-4 px-1">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Chill
                </span>
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" />
                  Okay
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  Brave
                </span>
              </div>

              {/* Glassmorphism slider track */}
              <div className="relative h-3 w-full rounded-full overflow-hidden liquid-glass-track">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.8))`,
                  }}
                  animate={{ width: `${riskLevel[0]}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                {/* Glass shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />
              </div>

              <Slider
                value={riskLevel}
                onValueChange={setRiskLevel}
                max={100}
                step={1}
                className="absolute inset-x-1 top-[2.35rem] opacity-0 h-3 cursor-pointer"
              />
            </div>

            {/* Active risk display */}
            <motion.div
              layout
              className="relative rounded-2xl p-5 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--accent) / 0.5))`,
              }}
            >
              {/* Liquid glass backdrop */}
              <div className="absolute inset-0 backdrop-blur-xl border border-primary/10 rounded-2xl" />
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-30"
                animate={{
                  background: [
                    `radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`,
                    `radial-gradient(circle at 70% 50%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`,
                    `radial-gradient(circle at 30% 50%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`,
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="relative flex items-center gap-4">
                <motion.div
                  key={currentRisk.label}
                  initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))`,
                    boxShadow: `0 8px 24px hsl(var(--primary) / 0.15), inset 0 1px 0 rgba(255,255,255,0.2)`,
                  }}
                >
                  <currentRisk.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <div>
                  <motion.p
                    key={`label-${currentRisk.label}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold text-lg text-foreground"
                  >
                    {currentRisk.label}
                  </motion.p>
                  <motion.p
                    key={`desc-${currentRisk.label}`}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-sm text-muted-foreground"
                  >
                    {currentRisk.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={isLoading || !amount || selectedCategories.length === 0}
          className="w-full h-14 text-lg font-semibold gap-2 hover-glow"
          size="lg"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Analyze My Budget
            </>
          )}
        </Button>

        {/* Results */}
        <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
          <Card className="border-primary/40 shadow-xl shadow-primary/5">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Allocation
                </CardTitle>
                <CardDescription>{result.summary}</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.allocations.map((allocation, index) => (
                <motion.div
                  key={allocation.ticker}
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                  className="p-4 rounded-xl space-y-2 border border-primary/10 bg-gradient-to-br from-primary/[0.06] to-accent/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={allocation.type === 'etf' ? 'secondary' : 'default'} className="shadow-sm">
                        {allocation.ticker}
                      </Badge>
                      <span className="font-medium text-foreground">{allocation.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">{allocation.percentage}%</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedCurrency?.symbol}{allocation.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{allocation.reasoning}</p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (result.allocations.length) * 0.1 + 0.1, duration: 0.4 }}
                className="p-4 bg-orange-100 border border-orange-300 rounded-xl dark:bg-orange-950 dark:border-orange-800"
              >
                <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">{result.riskNote}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + (result.allocations.length) * 0.1 + 0.25, duration: 0.3 }}
              >
                <Button variant="outline" onClick={resetForm} className="w-full">
                  Start Over
                </Button>
              </motion.div>
            </CardContent>
          </Card>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center px-4">
          This is a simulation for educational purposes only. Not financial advice.
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default BudgetPlanner;
