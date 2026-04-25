import type { Process } from "@/hooks/useProcessSimulation";

interface TopProcessesPanelProps {
  processes: Process[];
}

const TopProcessesPanel = ({ processes }: TopProcessesPanelProps) => {
  const top5 = [...processes]
    .filter((p) => p.status !== "Stopped")
    .sort((a, b) => b.cpuUsage - a.cpuUsage)
    .slice(0, 5);

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Top Processes by CPU
      </h3>
      <div className="space-y-2">
        {top5.map((proc) => (
          <div key={proc.pid} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-medium text-foreground truncate">{proc.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full data-transition ${proc.cpuUsage > 70 ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${Math.min(proc.cpuUsage, 100)}%` }}
                />
              </div>
              <span className={`text-xs font-mono font-semibold w-12 text-right ${proc.cpuUsage > 70 ? "text-destructive" : "text-foreground"}`}>
                {proc.cpuUsage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProcessesPanel;
