import { useState } from "react";
import { Cpu, HardDrive, Disc, Wifi, Monitor } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import type { SystemStats } from "@/hooks/useProcessSimulation";

interface PerformanceDetailProps {
  stats: SystemStats;
}

const panels = [
  { id: "cpu", label: "CPU", icon: Cpu },
  { id: "memory", label: "Memory", icon: HardDrive },
  { id: "disk", label: "Disk", icon: Disc },
  { id: "network", label: "WiFi", icon: Wifi },
  { id: "gpu", label: "GPU", icon: Monitor },
] as const;

type PanelId = (typeof panels)[number]["id"];

const PerformanceDetail = ({ stats }: PerformanceDetailProps) => {
  const [activePanel, setActivePanel] = useState<PanelId>("cpu");

  const tooltipStyle = {
    background: "hsl(220 18% 14%)",
    border: "1px solid hsl(220 14% 20%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(210 20% 92%)",
  };

  return (
    <div className="flex gap-4 flex-1">
      {/* Left nav */}
      <div className="w-40 shrink-0 flex flex-col gap-1">
        {panels.map((p) => {
          const Icon = p.icon;
          const isActive = activePanel === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePanel(p.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Right content */}
      <div className="flex-1 glass-card p-5 flex flex-col gap-4">
        {activePanel === "cpu" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">CPU</h3>
              <span className="text-xs text-muted-foreground">{stats.cpuModel}</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.cpuHistory.map((v, i) => ({ t: i, cpu: v }))}>
                <XAxis dataKey="t" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "CPU"]} labelFormatter={() => ""} />
                <Area type="monotone" dataKey="cpu" stroke="hsl(199 89% 48%)" fill="hsl(199 89% 48% / 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="Speed" value={`${stats.cpuSpeedGHz.toFixed(2)} GHz`} />
              <StatItem label="Processes" value={`${stats.processes.length}`} />
              <StatItem label="Threads" value={`${Math.round(stats.totalThreads)}`} />
              <StatItem label="Uptime" value={`${stats.uptimeDays}d ${stats.uptimeHours}h ${stats.uptimeMinutes}m`} />
              <StatItem label="Cores" value={`${stats.cpuCores}`} />
              <StatItem label="Logical Cores" value={`${stats.cpuLogicalCores}`} />
              <StatItem label="Utilization" value={`${stats.cpuUsage}%`} />
              <StatItem label="Load Avg (1m)" value={`${stats.loadAvg1.toFixed(2)}`} />
            </div>
          </>
        )}

        {activePanel === "memory" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Memory</h3>
              <span className="text-xs text-muted-foreground">{(stats.totalMemory / 1024).toFixed(0)} GB DDR4</span>
            </div>
            <div className="w-full h-8 rounded-lg bg-muted overflow-hidden">
              <div className="h-full bg-primary data-transition" style={{ width: `${stats.memoryUsage}%` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="In Use" value={`${(stats.usedMemory / 1024).toFixed(1)} GB`} />
              <StatItem label="Available" value={`${(stats.availableMemory / 1024).toFixed(1)} GB`} />
              <StatItem label="Cached" value={`${(stats.cachedMemory / 1024).toFixed(1)} GB`} />
              <StatItem label="Swap Used" value={`${(stats.swapUsed / 1024).toFixed(1)} / ${(stats.swapTotal / 1024).toFixed(0)} GB`} />
            </div>
          </>
        )}

        {activePanel === "disk" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Disk</h3>
              <span className="text-xs text-muted-foreground">NVMe SSD</span>
            </div>
            <div className="w-full h-8 rounded-lg bg-muted overflow-hidden">
              <div className="h-full bg-primary data-transition" style={{ width: `${stats.diskUsagePercent}%` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="Total" value={`${stats.diskTotal} GB`} />
              <StatItem label="Used" value={`${stats.diskUsed.toFixed(0)} GB`} />
              <StatItem label="Usage" value={`${stats.diskUsagePercent.toFixed(1)}%`} />
              <StatItem label="Read Speed" value={`${stats.diskReadSpeed.toFixed(0)} MB/s`} />
              <StatItem label="Write Speed" value={`${stats.diskWriteSpeed.toFixed(0)} MB/s`} />
            </div>
          </>
        )}

        {activePanel === "network" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">WiFi</h3>
              <span className="text-xs text-muted-foreground">Connected</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={stats.networkDownloadHistory.map((v, i) => ({
                t: i,
                down: v,
                up: stats.networkUploadHistory[i],
              }))}>
                <XAxis dataKey="t" hide />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [`${v.toFixed(0)} KB/s`, n === "down" ? "Download" : "Upload"]} labelFormatter={() => ""} />
                <Line type="monotone" dataKey="down" stroke="hsl(199 89% 48%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="up" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4">
              <StatItem label="Download" value={`${stats.networkDownload.toFixed(0)} KB/s`} />
              <StatItem label="Upload" value={`${stats.networkUpload.toFixed(0)} KB/s`} />
            </div>
          </>
        )}

        {activePanel === "gpu" && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">GPU</h3>
              <span className="text-xs text-muted-foreground">{stats.gpuModel}</span>
            </div>
            <div className="w-full h-8 rounded-lg bg-muted overflow-hidden">
              <div className="h-full bg-primary data-transition" style={{ width: `${stats.gpuUsage}%` }} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="Utilization" value={`${stats.gpuUsage.toFixed(0)}%`} />
              <StatItem label="Temperature" value={`${stats.gpuTemp.toFixed(0)}°C`} />
              <StatItem label="VRAM Used" value={`${(stats.gpuMemoryUsed / 1024).toFixed(1)} GB`} />
              <StatItem label="VRAM Total" value={`${(stats.gpuMemoryTotal / 1024).toFixed(0)} GB`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold text-foreground">{value}</span>
  </div>
);

export default PerformanceDetail;
