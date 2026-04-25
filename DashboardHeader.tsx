import { RefreshCw, Search, Pause, Play, Plus, Sun, Moon, Activity } from "lucide-react";
import { useState } from "react";

interface DashboardHeaderProps {
  processCount: number;
  paused: boolean;
  onTogglePause: () => void;
  onRefresh: () => void;
  onAddProcess: (name?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  newTaskOpen?: boolean;
  onNewTaskOpenChange?: (open: boolean) => void;
  shortcutsButton?: React.ReactNode;
}

const DashboardHeader = ({
  processCount,
  paused,
  onTogglePause,
  onRefresh,
  onAddProcess,
  searchQuery,
  onSearchChange,
  newTaskOpen,
  onNewTaskOpenChange,
  shortcutsButton,
}: DashboardHeaderProps) => {
  const showNewTask = newTaskOpen ?? false;
  const setShowNewTask = onNewTaskOpenChange ?? (() => {});
  const [taskName, setTaskName] = useState("");
  const [isDark, setIsDark] = useState(true);

  const handleAddTask = () => {
    if (taskName.trim()) {
      onAddProcess(taskName.trim());
      setTaskName("");
      setShowNewTask(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("light-theme");
  };

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left: Logo & info */}
      <div className="flex items-center gap-2 sm:gap-3 ml-8 md:ml-0">
        <Activity className="h-5 w-5 text-primary hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold tracking-tight text-foreground">Real-Time Process Monitor</span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:block">System Dashboard</span>
        </div>
        <span className="text-xs text-muted-foreground ml-2 hidden lg:inline">
          | &gt;_ {processCount} processes
        </span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xs sm:max-w-md relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          id="process-search-input"
          type="text"
          placeholder="Search process..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-muted/50 border border-border/50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 text-xs">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${paused ? "" : "animate-ping bg-success"}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${paused ? "bg-warning" : "bg-success"}`} />
          </span>
          <span className="text-muted-foreground font-medium ml-1">{paused ? "PAUSED" : "LIVE"}</span>
        </div>

        <button onClick={onRefresh} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Refresh (F5)">
          <RefreshCw className="h-4 w-4" />
        </button>

        <button
          onClick={onTogglePause}
          className={`flex items-center gap-1 text-xs font-medium px-2 sm:px-3 py-1.5 rounded-lg transition-colors ${
            paused
              ? "bg-success/20 text-success hover:bg-success/30"
              : "bg-destructive/20 text-destructive hover:bg-destructive/30"
          }`}
          title={paused ? "Resume" : "Pause"}
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          <span className="hidden sm:inline">{paused ? "Resume" : "Pause"}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {shortcutsButton}

        {/* Run new task */}
        <div className="relative">
          <button
            onClick={() => setShowNewTask(!showNewTask)}
            className="flex items-center gap-1 text-xs font-medium px-2 sm:px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            title="Run new task (Ctrl+Alt+N)"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">New task</span>
          </button>
          {showNewTask && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-xl p-3 z-50 animate-fade-in">
              <label className="text-xs text-muted-foreground mb-1 block">Process name</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                placeholder="e.g. myapp.exe"
                className="w-full bg-muted border border-border/50 rounded px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  className="flex-1 text-xs font-medium px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Start
                </button>
                <button
                  onClick={() => setShowNewTask(false)}
                  className="text-xs font-medium px-3 py-1.5 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
