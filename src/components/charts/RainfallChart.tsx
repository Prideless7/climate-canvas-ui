
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const rainfallData = [
  { month: 'Jan', rainfall: 45.2, days: 8 },
  { month: 'Feb', rainfall: 52.1, days: 9 },
  { month: 'Mar', rainfall: 68.3, days: 12 },
  { month: 'Apr', rainfall: 89.4, days: 14 },
  { month: 'May', rainfall: 125.7, days: 16 },
  { month: 'Jun', rainfall: 186.2, days: 19 },
  { month: 'Jul', rainfall: 203.8, days: 21 },
  { month: 'Aug', rainfall: 167.4, days: 18 },
  { month: 'Sep', rainfall: 134.6, days: 15 },
  { month: 'Oct', rainfall: 98.3, days: 13 },
  { month: 'Nov', rainfall: 67.8, days: 10 },
  { month: 'Dec', rainfall: 48.9, days: 7 },
];

interface RainfallChartProps {
  detailed?: boolean;
}

export const RainfallChart = ({ detailed = false }: RainfallChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={detailed ? 400 : 300}>
      <BarChart data={rainfallData}>
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
