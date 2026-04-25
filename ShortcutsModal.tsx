import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

const shortcuts = [
  { keys: "Ctrl + F", action: "Search process" },
  { keys: "Del", action: "End selected task" },
  { keys: "Ctrl + Alt + N", action: "Run new task" },
  { keys: "F5", action: "Refresh data" },
  { keys: "Ctrl + D", action: "Open Dashboard" },
  { keys: "Ctrl + P", action: "Open Processes" },
  { keys: "Ctrl + Shift + S", action: "Toggle sidebar" },
  { keys: "Ctrl + /", action: "Show shortcuts" },
  { keys: "Esc", action: "Deselect / Close" },
];

interface ShortcutsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ShortcutsModal = ({ open, onOpenChange }: ShortcutsModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Shortcuts (Ctrl+/)">
        <Keyboard className="h-4 w-4" />
      </button>
    </DialogTrigger>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-base">Keyboard Shortcuts</DialogTitle>
      </DialogHeader>
      <div className="space-y-2 mt-2">
        {shortcuts.map((s) => (
          <div key={s.keys} className="flex items-center justify-between py-1.5 px-1">
            <kbd className="px-2 py-1 rounded bg-muted border border-border/50 text-xs font-mono text-foreground">
              {s.keys}
            </kbd>
            <span className="text-sm text-muted-foreground">{s.action}</span>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default ShortcutsModal;
