
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
    const monthIndex = date.getMonth();
    const month = date.toLocaleDateString('en', { month: 'short' });
    
    if (!acc[monthIndex]) {
      acc[monthIndex] = { humidities: [], month, sortKey: monthIndex };
    }
    acc[monthIndex].humidities.push(item.humidity);
    return acc;
  }, {} as Record<number, { humidities: number[]; month: string; sortKey: number }>);

  return Object.values(monthlyData)
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ month, humidities }) => ({
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
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div style={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    padding: '8px 12px'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '4px' }}>{data.month}</p>
                    <p style={{ margin: 0, color: 'hsl(var(--humidity))' }}>Avg: {data.avgHumidity}%</p>
                    <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Max: {data.maxHumidity}%</p>
                    <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Min: {data.minHumidity}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="avgHumidity"
            stroke="hsl(var(--humidity))"
            fill="url(#humidityGradient)"
            strokeWidth={3}
            name="avgHumidity"
            dot={{ fill: 'hsl(var(--humidity))', strokeWidth: 2, r: 4 }}
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
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div style={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  padding: '8px 12px'
                }}>
                  <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '4px' }}>{data.month}</p>
                  <p style={{ margin: 0, color: 'hsl(var(--humidity))' }}>Avg: {data.avgHumidity}%</p>
                  <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Max: {data.maxHumidity}%</p>
                  <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Min: {data.minHumidity}%</p>
                </div>
              );
            }
            return null;
          }}
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
