
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MeteoData } from '../Dashboard';

interface CombinedChartProps {
  data: MeteoData[];
  detailed?: boolean;
}

const transformData = (data: MeteoData[]) => {
  if (data.length === 0) {
    return [{ month: 'No data', temp: 0, humidity: 0, radiation: 0, rainfall: 0 }];
  }

  const monthlyData = data.reduce((acc, item) => {
    const date = new Date(item.date.split('/').reverse().join('-'));
    const monthIndex = date.getMonth();
    const month = date.toLocaleDateString('en', { month: 'short' });
    
    if (!acc[monthIndex]) {
      acc[monthIndex] = { temps: [], humidities: [], radiations: [], rainfalls: [], month, sortKey: monthIndex };
    }
    acc[monthIndex].temps.push(item.temperature);
    acc[monthIndex].humidities.push(item.humidity);
    acc[monthIndex].radiations.push(item.solarRadiation);
    acc[monthIndex].rainfalls.push(item.precipitation);
    return acc;
  }, {} as Record<number, { temps: number[]; humidities: number[]; radiations: number[]; rainfalls: number[]; month: string; sortKey: number }>);

  return Object.values(monthlyData)
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ month, temps, humidities, radiations, rainfalls }) => ({
      month,
      temp: Number((temps.reduce((s, t) => s + t, 0) / temps.length).toFixed(1)),
      humidity: Number((humidities.reduce((s, h) => s + h, 0) / humidities.length).toFixed(1)),
      radiation: Number((radiations.reduce((s, r) => s + r, 0) / radiations.length * 0.0864).toFixed(1)),
      rainfall: Number((rainfalls.reduce((s, r) => s + r, 0)).toFixed(1))
    }));
};

export const CombinedChart = ({ data, detailed = false }: CombinedChartProps) => {
  const chartData = transformData(data);
  
  return (
    <ResponsiveContainer width="100%" height={detailed ? 500 : 400}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '12px' }}
        />
        
        {/* Left Y-axis for Temperature, Humidity, Radiation */}
        <YAxis 
          yAxisId="left"
          stroke="hsl(var(--muted-foreground))"
          label={{ value: 'Temp (°C) / Humidity (%) / Radiation (MJ/m²)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
        />
        
        {/* Right Y-axis for Rainfall */}
        <YAxis 
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--rainfall))"
          label={{ value: 'Rainfall (mm)', angle: 90, position: 'insideRight', style: { fontSize: '12px' } }}
        />
        
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
          formatter={(value: any, name: any) => {
            const labels: Record<string, string> = {
              'temp': 'Temperature',
              'humidity': 'Humidity',
              'radiation': 'Solar Radiation',
              'rainfall': 'Rainfall'
            };
            const units: Record<string, string> = {
              'temp': '°C',
              'humidity': '%',
              'radiation': ' MJ/m²',
              'rainfall': ' mm'
            };
            return [
              `${typeof value === 'number' ? value.toFixed(1) : value}${units[name] || ''}`,
              labels[name] || name
            ];
          }}
        />
        <Legend />
        
        {/* Rainfall on right axis */}
        <Bar
          yAxisId="right"
          dataKey="rainfall"
          fill="hsl(var(--rainfall))"
          name="Rainfall"
          opacity={0.6}
          radius={[2, 2, 0, 0]}
        />
        
        {/* Temperature on left axis */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="temp"
          stroke="hsl(var(--temperature))"
          strokeWidth={3}
          name="Temperature"
          dot={{ fill: 'hsl(var(--temperature))', strokeWidth: 2, r: 4 }}
        />
        
        {/* Humidity on left axis */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="humidity"
          stroke="hsl(var(--humidity))"
          strokeWidth={2}
          name="Humidity"
          dot={{ fill: 'hsl(var(--humidity))', strokeWidth: 2, r: 3 }}
        />
        
        {/* Solar Radiation on left axis */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="radiation"
          stroke="hsl(var(--solar))"
          strokeWidth={2}
          name="Solar Radiation"
          dot={{ fill: 'hsl(var(--solar))', strokeWidth: 2, r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
