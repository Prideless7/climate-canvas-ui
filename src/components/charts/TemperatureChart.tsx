
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { MeteoData } from '../Dashboard';

interface TemperatureChartProps {
  data: MeteoData[];
  detailed?: boolean;
}

const transformData = (data: MeteoData[]) => {
  console.log('TemperatureChart transformData received data:', data.length, 'items');
  console.log('Sample data item:', data[0]);
  
  if (data.length === 0) {
    console.log('No data available for temperature chart');
    return [{ month: 'No data', avgTemp: 0, maxTemp: 0, minTemp: 0 }];
  }

  const monthlyData = data.reduce((acc, item) => {
    // Handle multiple date formats
    let date;
    if (typeof item.date === 'string') {
      // Try different date formats
      if (item.date.includes('/')) {
        // Try DD/MM/YYYY format first
        const parts = item.date.split('/');
        if (parts.length === 3) {
          date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else if (item.date.includes('-')) {
        // Try YYYY-MM-DD format
        date = new Date(item.date);
      }
    } else {
      date = new Date(item.date);
    }
    
    // Validate date
    if (!date || isNaN(date.getTime())) {
      console.warn('Invalid date:', item.date);
      return acc;
    }
    
    const monthIndex = date.getMonth();
    const month = date.toLocaleDateString('en', { month: 'short' });
    
    if (!acc[monthIndex]) {
      acc[monthIndex] = { temps: [], month, sortKey: monthIndex };
    }
    
    // Ensure temperature is a number
    const temp = Number(item.temperature);
    if (!isNaN(temp)) {
      acc[monthIndex].temps.push(temp);
    }
    
    return acc;
  }, {} as Record<number, { temps: number[]; month: string; sortKey: number }>);

  const result = Object.values(monthlyData)
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ month, temps }) => ({
      month,
      avgTemp: Number((temps.reduce((s, t) => s + t, 0) / temps.length).toFixed(1)),
      maxTemp: Number(Math.max(...temps).toFixed(1)),
      minTemp: Number(Math.min(...temps).toFixed(1))
    }));
  
  console.log('Transformed temperature data:', result);
  return result;
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
                    <p style={{ margin: 0, color: 'hsl(var(--temperature))' }}>Avg: {data.avgTemp}°C</p>
                    <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Max: {data.maxTemp}°C</p>
                    <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Min: {data.minTemp}°C</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="avgTemp"
            stroke="hsl(var(--temperature))"
            fill="url(#tempGradient)"
            strokeWidth={3}
            name="avgTemp"
            dot={{ fill: 'hsl(var(--temperature))', strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="tempGradientSimple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--temperature))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--temperature))" stopOpacity={0.2}/>
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
                  <p style={{ margin: 0, color: 'hsl(var(--temperature))' }}>Avg: {data.avgTemp}°C</p>
                  <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Max: {data.maxTemp}°C</p>
                  <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>Min: {data.minTemp}°C</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="avgTemp"
          stroke="hsl(var(--temperature))"
          fill="url(#tempGradientSimple)"
          strokeWidth={3}
          name="Temperature (°C)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
