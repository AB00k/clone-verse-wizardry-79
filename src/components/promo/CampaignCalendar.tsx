
import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, 
  eachDayOfInterval, isToday, isSameDay, addDays, isBefore, isAfter, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { Campaign } from "@/types/campaign";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarPlus, CalendarCheck, CalendarX } from "lucide-react";

interface CampaignCalendarProps {
  campaigns: Campaign[];
  currentDate: Date;
  view: "month" | "week";
}

const CampaignCalendar: React.FC<CampaignCalendarProps> = ({ 
  campaigns, 
  currentDate, 
  view 
}) => {
  const getCalendarDays = () => {
    if (view === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
  };

  const renderDayHeader = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const getCampaignsForDay = (day: Date) => {
    return campaigns.filter(campaign => 
      isWithinInterval(day, { start: campaign.startDate, end: campaign.endDate })
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <CalendarPlus className="h-3 w-3 text-blue-500" />;
      case "live":
        return <CalendarCheck className="h-3 w-3 text-green-500" />;
      case "completed":
        return <CalendarX className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const days = getCalendarDays();

  return (
    <div className="rounded-md border">
      {renderDayHeader()}
      
      <div className={cn(
        "grid gap-1",
        view === "month" ? "grid-cols-7" : "grid-cols-7"
      )}>
        {days.map((day) => {
          const dayCampaigns = getCampaignsForDay(day);
          const isCurrentMonth = view === "month" ? isSameMonth(day, currentDate) : true;
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-24 p-2 border rounded-md",
                !isCurrentMonth && "bg-muted/50",
                isToday(day) && "bg-blue-50/60 dark:bg-blue-950/20",
                view === "week" && "h-40"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-muted-foreground",
                    isToday(day) && "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center"
                  )}
                >
                  {format(day, "d")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(day, "EEE")}
                </span>
              </div>
              
              <div className="space-y-1 mt-1 overflow-y-auto max-h-20">
                <TooltipProvider>
                  {dayCampaigns.slice(0, 3).map((campaign) => (
                    <Tooltip key={campaign.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="text-xs px-1.5 py-0.5 rounded-sm flex items-center gap-1 truncate cursor-pointer"
                          style={{ backgroundColor: `${campaign.color}20`, borderLeft: `3px solid ${campaign.color}` }}
                        >
                          {getStatusIcon(campaign.status)}
                          <span className="truncate">{campaign.title}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">{campaign.title}</p>
                          <p className="text-xs">{campaign.description}</p>
                          <p className="text-xs opacity-80">
                            {format(campaign.startDate, "MMM d")} - {format(campaign.endDate, "MMM d, yyyy")}
                          </p>
                          <div className="flex items-center gap-1 text-xs">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: campaign.color }}
                            ></span>
                            <span className="capitalize">{campaign.status}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  
                  {dayCampaigns.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">
                      +{dayCampaigns.length - 3} more
                    </div>
                  )}
                </TooltipProvider>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignCalendar;
