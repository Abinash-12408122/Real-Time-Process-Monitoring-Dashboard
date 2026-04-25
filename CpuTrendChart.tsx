import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface CpuTrendChartProps {
  history: number[];
  currentCpu: number;
}

const CpuTrendChart = ({ history, currentCpu }: CpuTrendChartProps) => {
  const data = history.map((val, i) => ({ time: i, cpu: val }));
  const avg = (history.reduce((a, b) => a + b, 0) / history.length).toFixed(1);
  const peak = Math.max(...history).toFixed(1);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            CPU Usage Trend
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">60s</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground">avg <span className="text-primary font-semibold">{avg}%</span></span>
          <span className="text-muted-foreground">peak <span className="text-destructive font-semibold">{peak}%</span></span>
          <span className="text-muted-foreground">~ <span className="text-foreground font-semibold">{currentCpu}%</span></span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            contentStyle={{
              background: "hsl(220 18% 14%)",
              border: "1px solid hsl(220 14% 20%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(210 20% 92%)",
            }}
            formatter={(value: number) => [`${value}%`, "CPU"]}
            labelFormatter={() => ""}
          />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke="hsl(199 89% 48%)"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CpuTrendChart;
