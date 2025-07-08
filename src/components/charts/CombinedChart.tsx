
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const combinedData = [
  { month: 'Jan', temp: 18.2, humidity: 72, radiation: 14.2, rainfall: 45.2 },
  { month: 'Feb', temp: 19.8, humidity: 69, radiation: 16.8, rainfall: 52.1 },
  { month: 'Mar', temp: 22.1, humidity: 65, radiation: 19.4, rainfall: 68.3 },
  { month: 'Apr', temp: 24.7, humidity: 62, radiation: 21.7, rainfall: 89.4 },
  { month: 'May', temp: 26.9, humidity: 58, radiation: 23.2, rainfall: 125.7 },
  { month: 'Jun', temp: 28.4, humidity: 55, radiation: 24.1, rainfall: 186.2 },
  { month: 'Jul', temp: 29.1, humidity: 53, radiation: 23.8, rainfall: 203.8 },
  { month: 'Aug', temp: 28.8, humidity: 56, radiation: 22.6, rainfall: 167.4 },
  { month: 'Sep', temp: 26.7, humidity: 59, radiation: 20.3, rainfall: 134.6 },
  { month: 'Oct', temp: 24.2, humidity: 63, radiation: 17.9, rainfall: 98.3 },
  { month: 'Nov', temp: 21.3, humidity: 67, radiation: 15.4, rainfall: 67.8 },
  { month: 'Dec', temp: 19.1, humidity: 71, radiation: 13.8, rainfall: 48.9 },
];

interface CombinedChartProps {
  detailed?: boolean;
}

export const CombinedChart = ({ detailed = false }: CombinedChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={detailed ? 500 : 400}>
      <ComposedChart data={combinedData}>
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
