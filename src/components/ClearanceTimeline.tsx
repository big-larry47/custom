import { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  PauseCircle, 
  X, 
  Info, 
  AlertTriangle, 
  AlertCircle
} from "lucide-react";
import { mockShipment, type TimelineStage, type ActivityEntry } from "@/data/mockShipment";

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    dotClass: "bg-success text-success-foreground",
    lineClass: "bg-success",
    badgeClass: "status-completed",
    label: "Completed",
  },
  paused: {
    icon: PauseCircle,
    dotClass: "bg-warning text-warning-foreground", 
    lineClass: "bg-border",
    badgeClass: "status-paused",
    label: "Paused",
  },
  pending: {
    icon: Circle,
    dotClass: "bg-muted text-muted-foreground",
    lineClass: "bg-border",
    badgeClass: "status-pending",
    label: "Pending",
  },
};

// Activity Log Styling Configuration
const activityStyleMap = {
  info: { icon: Info, color: "text-blue-500 bg-blue-50 border-blue-200" },
  warning: { icon: AlertTriangle, color: "text-amber-500 bg-amber-50 border-amber-200" },
  success: { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50 border-emerald-200" },
  action: { icon: AlertCircle, color: "text-destructive bg-destructive/10 border-destructive/20" },
};

const ClearanceTimeline = ({ 
  stages, 
  activities = mockShipment?.activity || [] 
}: { 
  stages: TimelineStage[], 
  activities?: ActivityEntry[] 
}) => {
  const [selectedStage, setSelectedStage] = useState<TimelineStage | null>(null);

  // Reversing the array puts the newest/latest steps at the top
  const descendingStages = [...stages].reverse();

  // Smart logic: Finds the first paused stage. If none, finds the most recently completed stage. 
  const currentStageId = descendingStages.find(s => s.status === "paused")?.id 
    || descendingStages.find(s => s.status === "completed")?.id;

  return (
    <>
      <div className="space-y-0 relative">
        {descendingStages.map((stage, i) => {
          const config = statusConfig[stage.status as keyof typeof statusConfig] || statusConfig.pending;
          const Icon = config.icon;
          const isLastItem = i === descendingStages.length - 1;
          
          const isCurrent = stage.id === currentStageId;
          const isClearancePending = stage.status === "pending";
          const themeColor = stage.status === "paused" ? "warning" : "success";
          
          const hideBadge = isClearancePending;
          const disabledClass = isClearancePending ? "opacity-50 pointer-events-none" : "";

          return (
            <div 
              key={stage.id} 
              onClick={() => !isClearancePending && setSelectedStage(stage)}
              className={`flex gap-4 transition-all duration-300 md:cursor-default cursor-pointer active:bg-secondary/50 rounded-lg p-2 -ml-2 ${disabledClass} ${isCurrent ? `bg-${themeColor}/5` : ""}`}
            >
              {/* Timeline Connector */}
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center pt-1">
                  {/* The "Pulse" Visual Clue */}
                  {isCurrent && (
                    <span className={`absolute inset-0 rounded-full bg-${themeColor} animate-ping opacity-20`} />
                  )}
                  
                  <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-4 border-background ${config.dotClass} ${isCurrent ? `ring-2 ring-${themeColor}/30` : ""}`}>
                    <Icon className={`h-5 w-5 ${isCurrent ? "animate-pulse" : ""}`} />
                  </div>
                </div>
                
                {!isLastItem && (
                  <div className={`w-0.5 flex-1 min-h-[40px] ${config.lineClass}`} />
                )}
              </div>

              {/* Content Area */}
              <div className={`pb-8 pt-1.5 ${isLastItem ? "pb-0" : ""}`}>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className={`font-semibold ${isCurrent ? `text-${themeColor}-foreground` : "text-foreground"}`}>
                    {stage.label}
                  </h4>
                  
                  {!hideBadge && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.badgeClass}`}>
                      {config.label}
                    </span>
                  )}
                  
                  {/* Extra indicator text for clarity */}
                  {isCurrent && (
                    <span className={`text-[10px] uppercase tracking-wider font-bold animate-pulse text-${themeColor}`}>
                      • {stage.status === "paused" ? "Action Required" : "Recently Completed"}
                    </span>
                  )}
                </div>
                
                <p className={`text-sm leading-relaxed line-clamp-2 md:line-clamp-none ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {stage.description}
                </p>
                
                {/* Visual cue on mobile that there is more to see */}
                {isCurrent && activities.length > 0 && (
                  <p className="text-xs text-primary font-medium mt-2 md:hidden opacity-80">
                    Tap to view details
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Activity Log Modal (Bottom Sheet) */}
      {selectedStage && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:hidden" 
          onClick={() => setSelectedStage(null)}
        >
          <div 
            className="w-full max-h-[85vh] overflow-y-auto bg-background rounded-t-2xl p-6 shadow-xl animate-in slide-in-from-bottom-full duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold text-foreground">Stage Details</h3>
              <button 
                onClick={() => setSelectedStage(null)} 
                className="p-2 -mr-2 bg-secondary/50 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex flex-col gap-1 border-b border-border pb-4">
                <div className="flex items-center gap-2 mb-1">
                  {statusConfig[selectedStage.status as keyof typeof statusConfig]?.icon && 
                    (() => {
                      const StageIcon = statusConfig[selectedStage.status as keyof typeof statusConfig].icon;
                      return <StageIcon className={`h-5 w-5 ${statusConfig[selectedStage.status as keyof typeof statusConfig].dotClass.split(' ')[1]}`} />;
                    })()
                  }
                  <h4 className="font-semibold text-lg text-foreground leading-tight">{selectedStage.label}</h4>
                </div>
              </div>

              {/* Activity Log */}
              {(selectedStage.label === "Clearance Approval" || selectedStage.label === "Legal Documentation Verification") && activities.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Activity History
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary/40 px-2 py-1 rounded-sm">
                      Newest First
                    </span>
                  </div>
                  
                  <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                    {/* Reverse activities array to show newest logs at the top */}
                    {[...activities].reverse().map((log) => {
                      const logStyle = activityStyleMap[log.type] || activityStyleMap.info;
                      const LogIcon = logStyle.icon;
                      
                      const isAction = log.type === "action";
                      const boxStyle = isAction 
                        ? "bg-destructive/5 border-destructive/30 shadow-md ring-1 ring-destructive/10" 
                        : "bg-white border-border shadow-sm";

                      return (
                        <div key={log.id} className="relative pl-8">
                          {/* Log Node */}
                          <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background z-10 ${logStyle.color}`}>
                            <LogIcon className="w-3 h-3" />
                          </div>
                          
                          {/* Log Content */}
                          <div className={`flex flex-col border rounded-lg p-3 transition-colors ${boxStyle}`}>
                            <span className={`text-[11px] font-bold mb-1 block ${isAction ? "text-destructive" : "text-muted-foreground"}`}>
                              {isAction ? "ACTION REQUIRED" : "Log Entry"}
                            </span>
                            <p className={`text-sm leading-snug ${isAction ? "text-destructive font-medium" : "text-foreground"}`}>
                              {log.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedStage(null)}
                className="w-full py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors mt-4"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClearanceTimeline;