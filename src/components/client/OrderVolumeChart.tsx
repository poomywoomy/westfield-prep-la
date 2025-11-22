import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartData } from "@/hooks/useChartData";
import { Loader2 } from "lucide-react";

type Dataset = 'orderVolume' | 'unitsReceived' | 'unitsShipped';

const datasetLabels = {
  orderVolume: 'Order Volume',
  unitsReceived: 'Units Received',
  unitsShipped: 'Units Shipped'
};

interface OrderVolumeChartProps {
  clientId: string;
}

export const OrderVolumeChart = ({ clientId }: OrderVolumeChartProps) => {
  const [activeDataset, setActiveDataset] = useState<Dataset>('orderVolume');
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days'>('7days');
  
  const days = timePeriod === '7days' ? 7 : 30;
  const { data, loading } = useChartData(clientId, days);

  const currentData = data?.[activeDataset] || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
          <Select value={timePeriod} onValueChange={(value: '7days' | '30days') => setTimePeriod(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
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
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="h-[300px] w-full">
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
          Showing {datasetLabels[activeDataset]} for the last {days} days
        </p>
      </CardContent>
    </Card>
  );
};