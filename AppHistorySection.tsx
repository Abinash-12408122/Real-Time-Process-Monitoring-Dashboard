import type { AppHistoryEntry } from "@/hooks/useProcessSimulation";

interface AppHistorySectionProps {
  history: AppHistoryEntry[];
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const AppHistorySection = ({ history }: AppHistorySectionProps) => {
  const sorted = [...history].sort((a, b) => b.cpuTime - a.cpuTime);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-foreground">App History</h2>
      <p className="text-xs text-muted-foreground">Resource usage history since last reset.</p>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium text-xs">Name</th>
              <th className="text-left px-5 py-3 font-medium text-xs">CPU Time</th>
              <th className="text-left px-5 py-3 font-medium text-xs">Network (MB)</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry) => (
              <tr key={entry.name} className="border-b border-border/20 hover:bg-muted/30">
                <td className="px-5 py-2.5 font-medium text-xs">{entry.name}</td>
                <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground">{formatTime(entry.cpuTime)}</td>
                <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground">{entry.networkMB.toFixed(1)} MB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppHistorySection;
