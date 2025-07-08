
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const solarData = [
  { month: 'Jan', radiation: 14.2, peakHours: 6.2, uvIndex: 7.1 },
  { month: 'Feb', radiation: 16.8, peakHours: 7.1, uvIndex: 8.3 },
  { month: 'Mar', radiation: 19.4, peakHours: 8.2, uvIndex: 9.2 },
  { month: 'Apr', radiation: 21.7, peakHours: 9.1, uvIndex: 10.1 },
  { month: 'May', radiation: 23.2, peakHours: 9.8, uvIndex: 10.8 },
  { month: 'Jun', radiation: 24.1, peakHours: 10.2, uvIndex: 11.2 },
  { month: 'Jul', radiation: 23.8, peakHours: 10.1, uvIndex: 11.0 },
  { month: 'Aug', radiation: 22.6, peakHours: 9.4, uvIndex: 10.4 },
  { month: 'Sep', radiation: 20.3, peakHours: 8.6, uvIndex: 9.3 },
  { month: 'Oct', radiation: 17.9, peakHours: 7.8, uvIndex: 8.5 },
  { month: 'Nov', radiation: 15.4, peakHours: 6.9, uvIndex: 7.7 },
  { month: 'Dec', radiation: 13.8, peakHours: 6.3, uvIndex: 7.2 },
];

export const SolarRadiationChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={solarData}>
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
