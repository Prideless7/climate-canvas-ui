
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { MeteoData } from '../Dashboard';

interface TemperatureChartProps {
  data: MeteoData[];
  detailed?: boolean;
}

const transformData = (data: MeteoData[]) => {
  if (data.length === 0) {
    return [{ month: 'No data', avgTemp: 0, maxTemp: 0, minTemp: 0 }];
  }

  const monthlyData = data.reduce((acc, item) => {
    const date = new Date(item.date.split('/').reverse().join('-'));
    const month = date.toLocaleDateString('en', { month: 'short' });
    
    if (!acc[month]) {
      acc[month] = { temps: [], month };
    }
    acc[month].temps.push(item.temperature);
    return acc;
  }, {} as Record<string, { temps: number[]; month: string }>);

  return Object.values(monthlyData).map(({ month, temps }) => ({
    month,
    avgTemp: Number((temps.reduce((s, t) => s + t, 0) / temps.length).toFixed(1)),
    maxTemp: Number(Math.max(...temps).toFixed(1)),
    minTemp: Number(Math.min(...temps).toFixed(1))
  }));
};

export const TemperatureChart = ({ data, detailed = false }: TemperatureChartProps) => {
  const chartData = transformData(data);
  
  if (detailed) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--temperature))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--temperature))" stopOpacity={0.1}/>
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
          />
          <Area
            type="monotone"
            dataKey="maxTemp"
            stroke="hsl(var(--temperature))"
            fill="url(#tempGradient)"
            strokeWidth={2}
            name="Max Temperature (°C)"
          />
          <Line
            type="monotone"
            dataKey="avgTemp"
            stroke="hsl(var(--temperature))"
            strokeWidth={3}
            name="Avg Temperature (°C)"
            dot={{ fill: 'hsl(var(--temperature))', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="minTemp"
            stroke="hsl(var(--temperature))"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Min Temperature (°C)"
            dot={{ fill: 'hsl(var(--temperature))', strokeWidth: 2, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }} 
        />
        <Line
          type="monotone"
          dataKey="avgTemp"
          stroke="hsl(var(--temperature))"
          strokeWidth={3}
          name="Temperature (°C)"
          dot={{ fill: 'hsl(var(--temperature))', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
