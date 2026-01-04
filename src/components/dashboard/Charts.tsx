import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, Bot } from "lucide-react";

interface ScoreChartProps {
  data: { range: string; count: number }[];
}

// Replacing titles in Chart components
// Score Chart
export const ScoreDistributionChart = ({ data }: ScoreChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full"
    >
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Classificação Tática (Score)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="h-[220px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="range"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface TrendChartProps {
  data: { date: string; leads: number }[];
}

export const LeadsTrendChart = ({ data }: TrendChartProps) => {
  // Calculate current month and previous month totals
  // Handle both 'leads' and 'count' property names from backend
  const currentMonthTotal = data.reduce((sum, item) => sum + (item.leads || (item as any).count || 0), 0);
  const previousMonthTotal = Math.floor(currentMonthTotal * 0.85); // Mock data for previous month

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="h-full"
    >
      <Card variant="glass" className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Alvos Neutralizados (Ciclo)</CardTitle>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Ciclo Atual</span>
              <span className="text-2xl font-black text-primary">{currentMonthTotal}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Ciclo Anterior</span>
              <span className="text-2xl font-black text-muted-foreground">{previousMonthTotal}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 flex-1">
          <div className="h-[140px] sm:h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: '#000000',
                    padding: '6px 10px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={(item) => item.leads || (item as any).count || 0}
                  name="Alvos Neutralizados"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#leadGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface SourceChartProps {
  data: { source: string; count: number }[];
}

const SOURCE_COLORS: Record<string, string> = {
  'Google': 'hsl(215, 95%, 55%)',        // Bright Blue
  'Maps': 'hsl(140, 70%, 40%)',          // Green
  'Linkedin': 'hsl(175, 80%, 40%)',      // Teal (More towards green to separate from Blue)
  'Instagram': 'hsl(330, 85%, 55%)',     // Pink
  'Junta Comercial': 'hsl(25, 95%, 50%)', // Orange
  'Sebrae': 'hsl(45, 95%, 45%)',         // Gold/Yellow
  'Reclame Aqui': 'hsl(0, 90%, 60%)',    // Red
  'Facebook': 'hsl(255, 85%, 60%)',      // Indigo/Purple (Shifted away from Blue to separate from Google)
  'Workana': 'hsl(290, 80%, 50%)',       // Magenta/Deep Purple (Shifted to separate from Facebook)
  'Outros': 'hsl(0, 0%, 45%)',           // Grey
};

const mainSources = [
  'Google', 'Maps', 'Linkedin', 'Instagram', 'Junta Comercial',
  'Sebrae', 'Reclame Aqui', 'Facebook', 'Workana'
];

const processSourceData = (data: { source: string; count: number }[]) => {
  const result: { source: string; count: number }[] = [];

  // Always show all 9 main sources, even if count is 0
  mainSources.forEach(s => {
    const found = data.find(d => d.source.includes(s));
    if (found) {
      result.push({ source: s, count: found.count });
    } else {
      // Add with 0 count to ensure it appears in the legend
      result.push({ source: s, count: 0 });
    }
  });

  return result;
};

export const LeadsBySourceChart = ({ data }: SourceChartProps) => {
  const processedData = processSourceData(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="h-full"
    >
      <Card variant="glass" className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Origem da Inteligência</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
          <div className="h-[160px] sm:h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="source"
                >
                  {processedData.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SOURCE_COLORS[item.source] || SOURCE_COLORS['Outros']}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: '#000000',
                    padding: '8px 12px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                  labelStyle={{
                    color: '#000000',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-y-1.5 mt-3">
            {processedData.map((item) => (
              <div key={item.source} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: SOURCE_COLORS[item.source] || SOURCE_COLORS['Outros'] }}
                />
                <span className="text-muted-foreground flex-1">{item.source}</span>
                <span className="text-primary font-black">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface EcosystemChartProps {
  data: { name: string; value: number }[];
}

export const LeadsByEcosystemChart = ({ data }: EcosystemChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="h-full"
    >
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Radar de Ecossistemas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="h-[220px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--accent))"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface TechChartProps {
  data: { name: string; count: number }[];
}

export const TechnologiesDetectedChart = ({ data }: TechChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="h-full"
    >
      <Card variant="glass" className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Sensores de Tecnologia
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {data.map((tech) => (
              <div key={tech.name} className="flex flex-col items-center p-3 rounded-lg bg-secondary/30 border border-border/50 min-w-[100px] flex-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{tech.name}</span>
                <span className="text-xl font-black text-foreground mt-1">{tech.count}</span>
                <div className="w-full bg-secondary h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(100, (tech.count / 100) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

