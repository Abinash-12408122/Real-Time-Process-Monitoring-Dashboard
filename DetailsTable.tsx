import type { Process } from "@/hooks/useProcessSimulation";

interface DetailsTableProps {
  processes: Process[];
}

const DetailsTable = ({ processes }: DetailsTableProps) => (
  <div className="glass-card overflow-hidden flex-1 flex flex-col">
    <div className="px-5 py-3 border-b border-border/50">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Details ({processes.length})
      </h2>
    </div>
    <div className="overflow-auto flex-1">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-card z-10">
          <tr className="border-b border-border/50 text-muted-foreground">
            <th className="text-left px-4 py-2.5 font-medium text-xs">Name</th>
            <th className="text-left px-4 py-2.5 font-medium text-xs">PID</th>
            <th className="text-left px-4 py-2.5 font-medium text-xs">Status</th>
            <th className="text-left px-4 py-2.5 font-medium text-xs">CPU %</th>
            <th className="text-left px-4 py-2.5 font-medium text-xs">Memory</th>
            <th className="text-left px-4 py-2.5 font-medium text-xs">Threads</th>
            <th className="text-left px-4 py-2.5 font-medium text-xs">Priority</th>
            <th className="text-left px-4 py-2.5 font-medium text-xs">User</th>
            <th className="text-left px-4 py-2.5 font-medium text-xs">Description</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((proc) => {
            const priority = proc.cpuUsage > 60 ? "High" : proc.cpuUsage > 30 ? "Above Normal" : "Normal";
            return (
              <tr key={proc.pid} className="border-b border-border/20 hover:bg-muted/30">
                <td className="px-4 py-2 font-medium text-xs">{proc.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{proc.pid}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-medium ${
                    proc.status === "Running" ? "text-success"
                    : proc.status === "Stopped" ? "text-destructive"
                    : proc.status === "Zombie" ? "text-warning"
                    : "text-muted-foreground"
                  }`}>
                    {proc.status}
                  </span>
                </td>
                <td className="px-4 py-2 font-mono text-xs">{proc.cpuUsage.toFixed(1)}%</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{proc.memoryMB.toFixed(0)} MB</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{proc.threads}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{priority}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{proc.user}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground truncate max-w-[200px]">{proc.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default DetailsTable;
