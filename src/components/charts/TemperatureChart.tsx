
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const temperatureData = [
  { month: 'Jan', avgTemp: 18.2, maxTemp: 25.1, minTemp: 11.3 },
  { month: 'Feb', avgTemp: 19.8, maxTemp: 27.2, minTemp: 12.4 },
  { month: 'Mar', avgTemp: 22.1, maxTemp: 29.8, minTemp: 14.4 },
  { month: 'Apr', avgTemp: 24.7, maxTemp: 32.1, minTemp: 17.3 },
  { month: 'May', avgTemp: 26.9, maxTemp: 34.5, minTemp: 19.3 },
  { month: 'Jun', avgTemp: 28.4, maxTemp: 36.2, minTemp: 20.6 },
  { month: 'Jul', avgTemp: 29.1, maxTemp: 37.8, minTemp: 20.4 },
  { month: 'Aug', avgTemp: 28.8, maxTemp: 37.2, minTemp: 20.4 },
  { month: 'Sep', avgTemp: 26.7, maxTemp: 34.8, minTemp: 18.6 },
  { month: 'Oct', avgTemp: 24.2, maxTemp: 31.5, minTemp: 16.9 },
  { month: 'Nov', avgTemp: 21.3, maxTemp: 28.1, minTemp: 14.5 },
  { month: 'Dec', avgTemp: 19.1, maxTemp: 25.8, minTemp: 12.4 },
];

interface TemperatureChartProps {
  detailed?: boolean;
}

export const TemperatureChart = ({ detailed = false }: TemperatureChartProps) => {
  if (detailed) {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={temperatureData}>
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
      <LineChart data={temperatureData}>
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
