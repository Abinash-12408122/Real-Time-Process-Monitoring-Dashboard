import { Cpu, HardDrive, Layers, AlertTriangle, BarChart3, Clock } from "lucide-react";
import type { SystemStats } from "@/hooks/useProcessSimulation";

interface MetricCardsProps {
  stats: SystemStats;
}

/** Small circular gauge SVG */
const MiniGauge = ({ value, color }: { value: number; color: string }) => (
  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
    <circle cx="30" cy="30" r="24" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
    <circle
      cx="30" cy="30" r="24"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeDasharray={`${(value / 100) * 150.8} 150.8`}
      className="data-transition"
    />
  </svg>
);

const MetricCards = ({ stats }: MetricCardsProps) => {
  const runningCount = stats.processes.filter((p) => p.status === "Running").length;
  const usedGB = (stats.usedMemory / 1024).toFixed(1);
  const totalGB = (stats.totalMemory / 1024).toFixed(0);
  const hasZombies = stats.zombieCount > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CPU */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">CPU Usage</span>
          </div>
          <span className={`text-3xl font-bold data-transition ${stats.cpuUsage > 80 ? "text-destructive" : stats.cpuUsage > 60 ? "text-warning" : "text-primary"}`}>
            {stats.cpuUsage}%
          </span>
          <span className="text-xs text-muted-foreground">{stats.cpuCores} cores · {stats.cpuModel}</span>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
            <div
              className={`h-full rounded-full data-transition ${stats.cpuUsage > 80 ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${stats.cpuUsage}%` }}
            />
          </div>
        </div>
        <MiniGauge value={stats.cpuUsage} color={stats.cpuUsage > 80 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
      </div>

      {/* Memory */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HardDrive className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider">Memory</span>
          </div>
          <span className={`text-3xl font-bold data-transition ${stats.memoryUsage > 80 ? "text-warning" : "text-primary"}`}>
            {stats.memoryUsage}%
          </span>
          <span className="text-xs text-muted-foreground">{usedGB} / {totalGB} GB</span>
          <div className="w-full h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
            <div
              className={`h-full rounded-full data-transition ${stats.memoryUsage > 80 ? "bg-warning" : "bg-primary"}`}
              style={{ width: `${stats.memoryUsage}%` }}
            />
          </div>
        </div>
        <MiniGauge value={stats.memoryUsage} color={stats.memoryUsage > 80 ? "hsl(var(--warning))" : "hsl(var(--primary))"} />
      </div>

      {/* Processes count */}
      <div className="glass-card p-5 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Layers className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider">Processes</span>
        </div>
        <span className="text-3xl font-bold text-foreground">{stats.processes.length}</span>
        <span className="text-xs text-muted-foreground">total running</span>
        <span className="text-xs text-success">— stable</span>
      </div>

      {/* Zombies */}
      <div className={`glass-card p-5 flex flex-col gap-1 ${hasZombies ? "border-destructive/40 bg-destructive/5" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs font-semibold uppercase tracking-wider">Zombies</span>
          </div>
          {hasZombies && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-destructive/20 text-destructive">Alert</span>
          )}
        </div>
        <span className={`text-3xl font-bold ${hasZombies ? "text-destructive" : "text-foreground"}`}>{stats.zombieCount}</span>
        <span className="text-xs text-muted-foreground">defunct processes</span>
        {hasZombies && <span className="text-xs text-destructive">Parent processes may need inspection</span>}
      </div>

      {/* Load Average */}
      <div className="glass-card p-5 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider">Load Avg</span>
        </div>
        <span className="text-3xl font-bold text-foreground">{stats.loadAvg1.toFixed(2)}</span>
        <span className="text-xs text-muted-foreground">1 min avg</span>
        <div className="flex gap-4 mt-1">
          <span className="text-xs text-muted-foreground">{stats.loadAvg5.toFixed(2)} <span className="text-[10px]">5m</span></span>
          <span className="text-xs text-muted-foreground">{stats.loadAvg15.toFixed(2)} <span className="text-[10px]">15m</span></span>
        </div>
      </div>

      {/* Uptime */}
      <div className="glass-card p-5 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider">Uptime</span>
        </div>
        <span className="text-2xl font-bold text-foreground">
          {stats.uptimeDays}d {stats.uptimeHours}h {stats.uptimeMinutes}m
        </span>
        <span className="text-xs text-muted-foreground">since last reboot</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">Swap: {(stats.swapUsed / 1024).toFixed(1)}GB / {(stats.swapTotal / 1024).toFixed(0)}GB</span>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary data-transition"
              style={{ width: `${(stats.swapUsed / stats.swapTotal) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
