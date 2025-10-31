
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MeteoData } from '../Dashboard';

interface RainfallChartProps {
  data: MeteoData[];
  detailed?: boolean;
}

const transformData = (data: MeteoData[]) => {
  if (data.length === 0) {
    return [{ month: 'No data', rainfall: 0, days: 0 }];
  }

  const monthlyData = data.reduce((acc, item) => {
    const date = new Date(item.date.split('/').reverse().join('-'));
    const monthIndex = date.getMonth();
    const dayOfMonth = date.getDate();
    const month = date.toLocaleDateString('en', { month: 'short' });
    
    if (!acc[monthIndex]) {
      acc[monthIndex] = { rainfall: 0, rainyDays: new Set(), month, sortKey: monthIndex };
    }
    acc[monthIndex].rainfall += item.precipitation;
    if (item.precipitation > 0) {
      acc[monthIndex].rainyDays.add(dayOfMonth);
    }
    return acc;
  }, {} as Record<number, { rainfall: number; rainyDays: Set<number>; month: string; sortKey: number }>);

  return Object.values(monthlyData)
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ month, rainfall, rainyDays }) => ({
      month,
      rainfall: Number(rainfall.toFixed(1)),
      days: rainyDays.size
    }));
};

export const RainfallChart = ({ data, detailed = false }: RainfallChartProps) => {
  const chartData = transformData(data);
  
  return (
    <ResponsiveContainer width="100%" height={detailed ? 400 : 300}>
      <BarChart data={chartData}>
        <defs>
          <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--rainfall))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--rainfall))" stopOpacity={0.4}/>
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
            `${value}${name === 'rainfall' ? 'mm' : ' days'}`,
            name === 'rainfall' ? 'Rainfall' : 'Rainy Days'
          ]}
        />
        <Bar
          dataKey="rainfall"
          fill="url(#rainfallGradient)"
          name="rainfall"
          radius={[4, 4, 0, 0]}
        />
        {detailed && (
          <Bar
            dataKey="days"
            fill="hsl(var(--rainfall))"
            name="days"
            opacity={0.6}
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};
