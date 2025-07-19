
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
    const month = date.toLocaleDateString('en', { month: 'short' });
    
    if (!acc[month]) {
      acc[month] = { temps: [], humidities: [], radiations: [], rainfalls: [], month };
    }
    acc[month].temps.push(item.temperature);
    acc[month].humidities.push(item.humidity);
    acc[month].radiations.push(item.solarRadiation);
    acc[month].rainfalls.push(item.precipitation);
    return acc;
  }, {} as Record<string, { temps: number[]; humidities: number[]; radiations: number[]; rainfalls: number[]; month: string }>);

  return Object.values(monthlyData).map(({ month, temps, humidities, radiations, rainfalls }) => ({
    month,
    temp: Number((temps.reduce((s, t) => s + t, 0) / temps.length).toFixed(1)),
    humidity: Number((humidities.reduce((s, h) => s + h, 0) / humidities.length).toFixed(1)),
    radiation: Number((radiations.reduce((s, r) => s + r, 0) / radiations.length / 1000000 * 24).toFixed(1)),
    rainfall: Number((rainfalls.reduce((s, r) => s + r, 0)).toFixed(1))
  }));
};

export const CombinedChart = ({ data, detailed = false }: CombinedChartProps) => {
  const chartData = transformData(data);
  
  return (
    <ResponsiveContainer width="100%" height={detailed ? 500 : 400}>
      <ComposedChart data={chartData}>
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
            `${value}${
              name === 'temp' ? '°C' : 
              name === 'humidity' ? '%' : 
              name === 'radiation' ? ' MJ/m²' : 
              'mm'
            }`,
            name === 'temp' ? 'Temperature' : 
            name === 'humidity' ? 'Humidity' : 
            name === 'radiation' ? 'Solar Radiation' : 
            'Rainfall'
          ]}
        />
        <Legend />
        
        <Bar
          dataKey="rainfall"
          fill="hsl(var(--rainfall))"
          name="Rainfall (mm)"
          opacity={0.6}
          radius={[2, 2, 0, 0]}
        />
        
        <Line
          type="monotone"
          dataKey="temp"
          stroke="hsl(var(--temperature))"
          strokeWidth={3}
          name="Temperature (°C)"
          dot={{ fill: 'hsl(var(--temperature))', strokeWidth: 2, r: 4 }}
        />
        
        <Line
          type="monotone"
          dataKey="humidity"
          stroke="hsl(var(--humidity))"
          strokeWidth={2}
          name="Humidity (%)"
          dot={{ fill: 'hsl(var(--humidity))', strokeWidth: 2, r: 3 }}
        />
        
        <Line
          type="monotone"
          dataKey="radiation"
          stroke="hsl(var(--solar))"
          strokeWidth={2}
          name="Solar Radiation (MJ/m²)"
          dot={{ fill: 'hsl(var(--solar))', strokeWidth: 2, r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
