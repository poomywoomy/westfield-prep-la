import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartData, TimeframeType } from "@/hooks/useChartData";
import { Loader2 } from "lucide-react";

type Dataset = 'orderVolume' | 'unitsReceived' | 'unitsShipped';

const datasetLabels = {
  orderVolume: 'Order Volume',
  unitsReceived: 'Units Received',
  unitsShipped: 'Units Shipped'
};

const timeframeLabels = {
  '7days': 'Last 7 Days',
  '30days': 'Last 30 Days',
  '90days': 'Last 90 Days',
  'mtd': 'Month-to-Date',
  'ytd': 'Year-to-Date'
};

interface OrderVolumeChartProps {
  clientId: string;
}

export const OrderVolumeChart = ({ clientId }: OrderVolumeChartProps) => {
  const [activeDataset, setActiveDataset] = useState<Dataset>('orderVolume');
  const [timeframe, setTimeframe] = useState<TimeframeType>('7days');
  
  const { data, loading } = useChartData(clientId, timeframe);

  const currentData = data?.[activeDataset] || [];
  
  // Calculate tick interval for MTD, 30 and 90 day views
  const getXAxisTicks = () => {
    if (timeframe === 'mtd' && currentData.length > 0) {
      // Show every 2 days: 1, 3, 5, 7, 9...
      return currentData.filter((_, i) => i % 2 === 0).map(d => d.name);
    } else if (timeframe === '30days' && currentData.length > 0) {
      // Show exactly 15 evenly spaced ticks
      const step = Math.max(1, Math.floor(currentData.length / 15));
      return currentData.filter((_, i) => i % step === 0).map(d => d.name);
    } else if (timeframe === '90days' && currentData.length > 0) {
      // Show exactly 15 evenly spaced ticks
      const step = Math.max(1, Math.floor(currentData.length / 15));
      return currentData.filter((_, i) => i % step === 0).map(d => d.name);
    }
    return undefined; // Auto for other timeframes
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
          <Select value={timeframe} onValueChange={(value: TimeframeType) => setTimeframe(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="mtd">Month-to-Date</SelectItem>
              <SelectItem value="ytd">Year-to-Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dataset Switcher */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeDataset === 'orderVolume' ? 'default' : 'outline'}
            onClick={() => setActiveDataset('orderVolume')}
            className="flex-1"
          >
            Order Volume
          </Button>
          <Button
            size="sm"
            variant={activeDataset === 'unitsReceived' ? 'default' : 'outline'}
            onClick={() => setActiveDataset('unitsReceived')}
            className="flex-1"
          >
            Units Received
          </Button>
          <Button
            size="sm"
            variant={activeDataset === 'unitsShipped' ? 'default' : 'outline'}
            onClick={() => setActiveDataset('unitsShipped')}
            className="flex-1"
          >
            Units Shipped
          </Button>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="h-[350px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                ticks={getXAxisTicks()}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Showing {datasetLabels[activeDataset]} - {timeframeLabels[timeframe]}
        </p>
      </CardContent>
    </Card>
  );
};