import type { StartupApp } from "@/hooks/useProcessSimulation";

interface StartupAppsSectionProps {
  apps: StartupApp[];
  onToggle: (name: string) => void;
}

const StartupAppsSection = ({ apps, onToggle }: StartupAppsSectionProps) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-lg font-bold text-foreground">Startup Apps</h2>
    <p className="text-xs text-muted-foreground">Manage applications that run at system startup.</p>
    <div className="glass-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 text-muted-foreground">
            <th className="text-left px-5 py-3 font-medium text-xs">Name</th>
            <th className="text-left px-5 py-3 font-medium text-xs">Publisher</th>
            <th className="text-left px-5 py-3 font-medium text-xs">Status</th>
            <th className="text-left px-5 py-3 font-medium text-xs">Startup Impact</th>
            <th className="text-right px-5 py-3 font-medium text-xs">Toggle</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.name} className="border-b border-border/20 hover:bg-muted/30">
              <td className="px-5 py-2.5 font-medium text-xs">{app.name}</td>
              <td className="px-5 py-2.5 text-xs text-muted-foreground">{app.publisher}</td>
              <td className="px-5 py-2.5">
                <span className={`text-xs font-medium ${app.status === "Enabled" ? "text-success" : "text-muted-foreground"}`}>
                  {app.status}
                </span>
              </td>
              <td className="px-5 py-2.5">
                <span className={`text-xs font-medium ${
                  app.impact === "High" ? "text-destructive"
                  : app.impact === "Medium" ? "text-warning"
                  : "text-muted-foreground"
                }`}>
                  {app.impact}
                </span>
              </td>
              <td className="px-5 py-2.5 text-right">
                <button
                  onClick={() => onToggle(app.name)}
                  className={`text-[11px] font-medium px-3 py-1 rounded-md transition-colors ${
                    app.status === "Enabled"
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                      : "bg-success/10 text-success hover:bg-success/20"
                  }`}
                >
                  {app.status === "Enabled" ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default StartupAppsSection;
