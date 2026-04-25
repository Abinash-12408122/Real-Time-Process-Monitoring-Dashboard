const DashboardFooter = () => (
  <footer className="flex items-center justify-between px-3 sm:px-5 py-2 text-[11px] text-muted-foreground border-t border-border/30 bg-card/50">
    <span>
      Developed by <span className="font-semibold text-foreground">Team AS</span> •
      OS Project © {new Date().getFullYear()}
    </span>
    <span className="text-muted-foreground/70 hidden sm:inline">
      Real-Time Process Monitoring System
    </span>
  </footer>
);

export default DashboardFooter;
