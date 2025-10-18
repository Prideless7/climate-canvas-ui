
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { MeteoData } from '../Dashboard';

interface HumidityChartProps {
  data: MeteoData[];
  detailed?: boolean;
}

const transformData = (data: MeteoData[]) => {
  if (data.length === 0) {
    return [{ month: 'No data', avgHumidity: 0, maxHumidity: 0, minHumidity: 0 }];
  }

  const monthlyData = data.reduce((acc, item) => {
    const date = item.date.includes('/') 
      ? new Date(item.date.split('/').reverse().join('-'))
      : new Date(item.date);
    const month = date.toLocaleDateString('en', { month: 'short' });
    
    if (!acc[month]) {
      acc[month] = { humidities: [], month };
    }
    acc[month].humidities.push(item.humidity);
    return acc;
  }, {} as Record<string, { humidities: number[]; month: string }>);

  return Object.values(monthlyData).map(({ month, humidities }) => ({
    month,
    avgHumidity: Number((humidities.reduce((s, h) => s + h, 0) / humidities.length).toFixed(1)),
    maxHumidity: Number(Math.max(...humidities).toFixed(1)),
    minHumidity: Number(Math.min(...humidities).toFixed(1))
  }));
};

export const HumidityChart = ({ data, detailed = false }: HumidityChartProps) => {
  const chartData = transformData(data);
  
  if (detailed) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--humidity))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--humidity))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
            formatter={(value, name) => [
              `${value}%`,
              name === 'maxHumidity' ? 'Max Humidity' : 
              name === 'avgHumidity' ? 'Avg Humidity' : 
              'Min Humidity'
            ]}
          />
          <Area
            type="monotone"
            dataKey="maxHumidity"
            stroke="hsl(var(--humidity))"
            fill="url(#humidityGradient)"
            strokeWidth={2}
            name="Max Humidity (%)"
          />
          <Line
            type="monotone"
            dataKey="avgHumidity"
            stroke="hsl(var(--humidity))"
            strokeWidth={3}
            name="Avg Humidity (%)"
            dot={{ fill: 'hsl(var(--humidity))', strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="minHumidity"
            stroke="hsl(var(--humidity))"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Min Humidity (%)"
            dot={{ fill: 'hsl(var(--humidity))', strokeWidth: 2, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="humidityGradientSimple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--humidity))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--humidity))" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
          formatter={(value) => [`${value}%`, 'Humidity']}
        />
        <Area
          type="monotone"
          dataKey="avgHumidity"
          stroke="hsl(var(--humidity))"
          fill="url(#humidityGradientSimple)"
          strokeWidth={3}
          name="Humidity (%)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
