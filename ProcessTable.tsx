import { useState, useRef, useEffect } from "react";
import { ArrowDownUp, ChevronDown, ChevronRight } from "lucide-react";
import type { Process } from "@/hooks/useProcessSimulation";

interface ProcessTableProps {
  processes: Process[];
  onKill: (pid: number) => void;
  onRestart: (pid: number) => void;
  onToggleSort: () => void;
  sortByCpu: boolean;
  selectedPid?: number | null;
  onSelectPid?: (pid: number | null) => void;
}

const ContextMenu = ({
  x,
  y,
  process,
  onKill,
  onRestart,
  onClose,
}: {
  x: number;
  y: number;
  process: Process;
  onKill: (pid: number) => void;
  onRestart: (pid: number) => void;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const isStopped = process.status === "Stopped";

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[180px] rounded-lg border border-border/60 bg-card shadow-xl py-1 text-sm animate-fade-in"
      style={{ top: y, left: x }}
    >
      {!isStopped && (
        <button
          onClick={() => { onKill(process.pid); onClose(); }}
          className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive transition-colors"
        >
          End Task
        </button>
      )}
      <button
        onClick={() => { onRestart(process.pid); onClose(); }}
        className="w-full text-left px-4 py-2 hover:bg-muted/50 text-foreground transition-colors"
      >
        Restart
      </button>
      <div className="border-t border-border/30 my-1" />
      <button
        onClick={onClose}
        className="w-full text-left px-4 py-2 hover:bg-muted/50 text-muted-foreground transition-colors"
      >
        Go to Details
      </button>
      <button
        onClick={onClose}
        className="w-full text-left px-4 py-2 hover:bg-muted/50 text-muted-foreground transition-colors"
      >
        Open File Location
      </button>
    </div>
  );
};

const ProcessTable = ({ processes, onKill, onRestart, onToggleSort, sortByCpu, selectedPid, onSelectPid }: ProcessTableProps) => {
  const [appsOpen, setAppsOpen] = useState(true);
  const [bgOpen, setBgOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; process: Process } | null>(null);

  const apps = processes.filter((p) => p.type === "app");
  const background = processes.filter((p) => p.type === "background");

  const handleContextMenu = (e: React.MouseEvent, proc: Process) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, process: proc });
  };

  const renderRow = (proc: Process) => {
    const isHighCpu = proc.cpuUsage > 70;
    const isStopped = proc.status === "Stopped";
    const memPercent = ((proc.memoryMB / 16384) * 100).toFixed(1);

    return (
      <tr
        key={proc.pid}
        onClick={() => onSelectPid?.(proc.pid)}
        onContextMenu={(e) => handleContextMenu(e, proc)}
        className={`border-b border-border/20 data-transition hover:bg-muted/30 cursor-default ${
          selectedPid === proc.pid ? "bg-primary/10 ring-1 ring-primary/30" : ""
        } ${isStopped ? "opacity-40" : isHighCpu ? "bg-destructive/5" : ""}`}
      >
        <td className="px-4 py-2 font-medium text-xs">{proc.name}</td>
        <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{proc.pid}</td>
        <td className={`px-4 py-2 font-mono text-xs font-semibold ${isHighCpu ? "text-destructive" : "text-foreground"}`}>
          {proc.cpuUsage.toFixed(1)}%
        </td>
        <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{memPercent}%</td>
        <td className="px-4 py-2">
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
            proc.status === "Running" ? "bg-success/15 text-success"
            : proc.status === "Stopped" ? "bg-destructive/15 text-destructive"
            : proc.status === "Zombie" ? "bg-warning/15 text-warning"
            : "bg-muted text-muted-foreground"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              proc.status === "Running" ? "bg-success"
              : proc.status === "Stopped" ? "bg-destructive"
              : proc.status === "Zombie" ? "bg-warning"
              : "bg-muted-foreground"
            }`} />
            {proc.status}
          </span>
        </td>
        <td className="px-4 py-2 text-right">
          {!isStopped && (
            <button
              onClick={() => onKill(proc.pid)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive/70 hover:text-destructive transition-colors px-2 py-1 rounded hover:bg-destructive/10"
            >
              End task
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="glass-card overflow-hidden flex-1 flex flex-col">
      <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Processes ({processes.length})
        </h2>
        <button
          onClick={onToggleSort}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            sortByCpu ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <ArrowDownUp className="h-3 w-3" />
          Sort by CPU
        </button>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border/50 text-muted-foreground">
              <th className="text-left px-4 py-2.5 font-medium text-xs">Name</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs">PID</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs">CPU %</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs">Memory %</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs">Status</th>
              <th className="text-right px-4 py-2.5 font-medium text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Apps Section */}
            <tr
              className="bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => setAppsOpen(!appsOpen)}
            >
              <td colSpan={6} className="px-4 py-2 text-xs font-semibold text-foreground">
                <span className="inline-flex items-center gap-2">
                  {appsOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  Apps ({apps.length})
                </span>
              </td>
            </tr>
            {appsOpen && apps.map(renderRow)}

            {/* Background Section */}
            <tr
              className="bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
              onClick={() => setBgOpen(!bgOpen)}
            >
              <td colSpan={6} className="px-4 py-2 text-xs font-semibold text-foreground">
                <span className="inline-flex items-center gap-2">
                  {bgOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  Background Processes ({background.length})
                </span>
              </td>
            </tr>
            {bgOpen && background.map(renderRow)}

            {processes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground text-sm">
                  No processes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          process={contextMenu.process}
          onKill={onKill}
          onRestart={onRestart}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default ProcessTable;
