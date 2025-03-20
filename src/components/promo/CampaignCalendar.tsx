
import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, 
  eachDayOfInterval, isToday, isSameDay, addDays, isBefore, isAfter, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { Campaign } from "@/types/campaign";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarPlus, CalendarCheck, CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CampaignCalendarProps {
  campaigns: Campaign[];
  currentDate: Date;
  view: "month" | "week";
  selectedFilter: string[];
}

const CampaignCalendar: React.FC<CampaignCalendarProps> = ({ 
  campaigns, 
  currentDate, 
  view,
  selectedFilter
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
      isWithinInterval(day, { start: campaign.startDate, end: campaign.endDate }) &&
      (selectedFilter.length === 0 || selectedFilter.includes(campaign.status))
    );
  };

  const isPastDay = (day: Date) => {
    return isBefore(day, new Date()) && !isToday(day);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <CalendarPlus className="h-3 w-3 text-blue-500" />;
      case "live":
        return <CalendarCheck className="h-3 w-3 text-green-500" />;
      case "completed":
        return <CalendarX className="h-3 w-3 text-purple-500" />;
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
          const isPast = isPastDay(day);
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-16 p-2 border rounded-md",
                !isCurrentMonth && "bg-muted/50",
                isPast && "bg-gray-100 dark:bg-slate-800/40",
                isToday(day) && "bg-blue-50/60 dark:bg-blue-950/20",
                view === "week" && "h-32"
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
              
              {dayCampaigns.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 mt-1 cursor-pointer">
                        <Badge variant="outline" className="text-xs h-5 px-1.5">
                          {dayCampaigns.length} {dayCampaigns.length === 1 ? 'promo' : 'promos'}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="p-0 overflow-hidden">
                      <div className="max-w-xs p-2 space-y-2">
                        <p className="font-medium text-sm border-b pb-1">{format(day, "MMMM d, yyyy")}</p>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {dayCampaigns.map((campaign) => (
                            <div key={campaign.id} className="text-sm">
                              <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: campaign.color }}></span>
                                <span className="font-medium">{campaign.title}</span>
                                <span className="ml-auto text-xs capitalize">{campaign.status}</span>
                              </div>
                              <p className="text-xs ml-3 opacity-80">{campaign.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignCalendar;
