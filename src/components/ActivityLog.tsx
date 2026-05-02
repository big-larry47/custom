import { Info, AlertTriangle, CheckCircle2, ArrowRight, ScrollText } from "lucide-react";
import type { ActivityEntry } from "@/data/mockShipment";

const typeConfig = {
  info: { icon: Info, color: "text-info" },
  warning: { icon: AlertTriangle, color: "text-accent" },
  success: { icon: CheckCircle2, color: "text-success" },
  action: { icon: ArrowRight, color: "text-destructive" },
};

const ActivityLog = ({ entries }: { entries: ActivityEntry[] }) => {
  // Reverse the array so the latest entry appears at the top
  const descendingEntries = [...entries].reverse();

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <ScrollText className="h-5 w-5 text-muted-foreground translate-y-1" />
        <h3 className="text-lg font-semibold font-display text-foreground">
          Activity Log
          <span className="text-sm font-normal text-muted-foreground ml-2 hidden sm:inline-block">
            (Clearance Approval)
          </span>
        </h3>
      </div>
      <div className="space-y-0">
        {descendingEntries.map((entry, i) => {
          const config = typeConfig[entry.type];
          const Icon = config.icon;
          return (
            <div key={entry.id} className={`flex gap-3 py-3 ${i < descendingEntries.length - 1 ? "border-b border-border" : ""}`}>
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`} />
              <div className="min-w-0">
                <p className="text-sm text-foreground">{entry.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityLog;