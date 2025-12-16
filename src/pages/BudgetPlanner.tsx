import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, TrendingUp, PiggyBank, RefreshCw, ArrowLeft } from 'lucide-react';
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

const categories = [
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'healthcare', label: 'Healthcare', emoji: '🏥' },
  { id: 'finance', label: 'Finance', emoji: '🏦' },
  { id: 'energy', label: 'Energy', emoji: '⚡' },
  { id: 'consumer', label: 'Consumer', emoji: '🛒' },
  { id: 'industrial', label: 'Industrial', emoji: '🏭' },
  { id: 'realestate', label: 'Real Estate', emoji: '🏠' },
  { id: 'communication', label: 'Communication', emoji: '📱' },
];

const riskLevels = [
  { value: 0, label: 'Chill', emoji: '🧘', description: 'Low risk, stable returns' },
  { value: 50, label: 'Okay', emoji: '😎', description: 'Balanced approach' },
  { value: 100, label: 'Brave', emoji: '🔥', description: 'High risk, high reward' },
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
            <Link to="/" className="p-2 hover:bg-accent rounded-full transition-colors">
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
              <ToggleGroupItem value="stocks" className="px-4 py-2 rounded-full">
                📈 Stocks
              </ToggleGroupItem>
              <ToggleGroupItem value="etfs" className="px-4 py-2 rounded-full">
                📊 ETFs
              </ToggleGroupItem>
              <ToggleGroupItem value="both" className="px-4 py-2 rounded-full">
                🎯 Both
              </ToggleGroupItem>
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
                  className="cursor-pointer px-3 py-2 text-sm transition-all hover:scale-105"
                  onClick={() => handleCategoryToggle(cat.id)}
                >
                  {cat.emoji} {cat.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card className="animate-fade-in stagger-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Risk Vibe</CardTitle>
            <CardDescription>How adventurous are you feeling?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>🧘 Chill</span>
              <span>😎 Okay</span>
              <span>🔥 Brave</span>
            </div>
            <Slider
              value={riskLevel}
              onValueChange={setRiskLevel}
              max={100}
              step={1}
              className="py-2"
            />
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <span className="text-3xl">{currentRisk.emoji}</span>
              <p className="font-semibold mt-1">{currentRisk.label}</p>
              <p className="text-sm text-muted-foreground">{currentRisk.description}</p>
            </div>
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
        {result && (
          <Card className="animate-fade-in border-primary/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Your Allocation
              </CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.allocations.map((allocation, index) => (
                <div
                  key={allocation.ticker}
                  className={`p-4 bg-accent/30 rounded-lg space-y-2 animate-fade-in stagger-${index + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={allocation.type === 'etf' ? 'secondary' : 'default'}>
                        {allocation.ticker}
                      </Badge>
                      <span className="font-medium">{allocation.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{allocation.percentage}%</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedCurrency?.symbol}{allocation.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{allocation.reasoning}</p>
                </div>
              ))}

              <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <p className="text-sm text-warning-foreground">{result.riskNote}</p>
              </div>

              <Button variant="outline" onClick={resetForm} className="w-full">
                Start Over
              </Button>
            </CardContent>
          </Card>
        )}

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
