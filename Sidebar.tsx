import { useState } from "react";
import {
  LayoutGrid,
  LayoutList,
  Activity,
  Clock,
  Rocket,
  Users,
  List,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "processes", label: "Processes", icon: LayoutList },
  { id: "performance", label: "Performance", icon: Activity },
  { id: "app-history", label: "App history", icon: Clock },
  { id: "startup", label: "Startup apps", icon: Rocket },
  { id: "users", label: "Users", icon: Users },
  { id: "details", label: "Details", icon: List },
  { id: "services", label: "Services", icon: Settings },
];

const Sidebar = ({ activeTab, onTabChange, collapsed = false, onToggleCollapse }: SidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            title={collapsed ? tab.label : undefined}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors relative ${
              collapsed ? "justify-center px-2" : ""
            } ${
              isActive
                ? "text-sidebar-foreground bg-sidebar-accent"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r bg-primary" />
            )}
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{tab.label}</span>}
          </button>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-2 left-2 z-50 p-2 rounded-lg bg-card border border-border/50 text-foreground shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 bg-sidebar border-r border-border/50 flex flex-col py-2 z-10 animate-fade-in">
            <div className="flex items-center justify-between px-4 py-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex shrink-0 border-r border-border/50 bg-sidebar flex-col py-2 transition-all duration-300 ${
        collapsed ? "w-14" : "w-52"
      }`}>
        <button
          onClick={onToggleCollapse}
          className="self-end mx-2 mb-2 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
