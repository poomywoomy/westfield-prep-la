import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Dataset = 'orderVolume' | 'unitsReceived' | 'unitsShipped';

const chartDatasets = {
  orderVolume: [
    { name: 'Mon', value: 24 },
    { name: 'Tue', value: 45 },
    { name: 'Wed', value: 32 },
    { name: 'Thu', value: 58 },
    { name: 'Fri', value: 67 },
    { name: 'Sat', value: 43 },
    { name: 'Sun', value: 38 }
  ],
  unitsReceived: [
    { name: 'Mon', value: 150 },
    { name: 'Tue', value: 220 },
    { name: 'Wed', value: 180 },
    { name: 'Thu', value: 290 },
    { name: 'Fri', value: 340 },
    { name: 'Sat', value: 210 },
    { name: 'Sun', value: 190 }
  ],
  unitsShipped: [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 180 },
    { name: 'Wed', value: 165 },
    { name: 'Thu', value: 245 },
    { name: 'Fri', value: 298 },
    { name: 'Sat', value: 175 },
    { name: 'Sun', value: 156 }
  ]
};

const datasetLabels = {
  orderVolume: 'Order Volume',
  unitsReceived: 'Units Received',
  unitsShipped: 'Units Shipped'
};

export const OrderVolumeChart = () => {
  const [activeDataset, setActiveDataset] = useState<Dataset>('orderVolume');
  const [timePeriod, setTimePeriod] = useState('7days');

  const currentData = chartDatasets[activeDataset];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
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

        <p className="text-sm text-muted-foreground text-center">
          Showing {datasetLabels[activeDataset]} for the last 7 days
        </p>
      </CardContent>
    </Card>
  );
};