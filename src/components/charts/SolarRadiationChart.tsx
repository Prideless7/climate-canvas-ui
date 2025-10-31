
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MeteoData } from '../Dashboard';

interface SolarRadiationChartProps {
  data: MeteoData[];
}

const transformData = (data: MeteoData[]) => {
  console.log('SolarRadiationChart - Processing data:', data.length, 'items');
  console.log('SolarRadiationChart - Sample item:', data[0]);
  
  if (data.length === 0) {
    console.log('SolarRadiationChart - No data available');
    return [{ month: 'No data', radiation: 0, peakHours: 0, uvIndex: 0 }];
  }

  const monthlyData = data.reduce((acc, item) => {
    // Handle both YYYY-MM-DD and DD/MM/YYYY formats
    const date = item.date.includes('/') 
      ? new Date(item.date.split('/').reverse().join('-'))
      : new Date(item.date);
    const monthIndex = date.getMonth();
    const month = date.toLocaleDateString('en', { month: 'short' });
    
    if (!acc[monthIndex]) {
      acc[monthIndex] = { radiations: [], month, sortKey: monthIndex };
    }
    acc[monthIndex].radiations.push(item.solarRadiation);
    return acc;
  }, {} as Record<number, { radiations: number[]; month: string; sortKey: number }>);

  const result = Object.values(monthlyData)
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ month, radiations }) => {
      const avgRadiation = radiations.reduce((s, r) => s + r, 0) / radiations.length;
      return {
        month,
        radiation: Number((avgRadiation * 0.0864).toFixed(1)), // Convert W/m² to MJ/m²/day
        peakHours: Math.min(12, Number((avgRadiation / 100).toFixed(1))),
        uvIndex: Math.min(11, Number((avgRadiation / 25).toFixed(1)))
      };
    });
  
  console.log('SolarRadiationChart - Transformed data:', result);
  return result;
};

export const SolarRadiationChart = ({ data }: SolarRadiationChartProps) => {
  const chartData = transformData(data);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--solar))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--solar))" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
          formatter={(value, name) => [
            `${value}${name === 'radiation' ? ' MJ/m²' : name === 'peakHours' ? ' hours' : ''}`,
            name === 'radiation' ? 'Solar Radiation' : name === 'peakHours' ? 'Peak Sun Hours' : 'UV Index'
          ]}
        />
        <Area
          type="monotone"
          dataKey="radiation"
          stroke="hsl(var(--solar))"
          fill="url(#solarGradient)"
          strokeWidth={3}
          name="radiation"
        />
        <Line
          type="monotone"
          dataKey="peakHours"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="peakHours"
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
