
import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, 
  eachDayOfInterval, isToday, isSameDay, addDays, isBefore, isAfter, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { Campaign } from "@/types/campaign";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CalendarPlus, CalendarCheck, CalendarX, Monitor, Smartphone, Globe } from "lucide-react";
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

  const getPlatformIcons = () => {
    return (
      <div className="flex space-x-1 mt-1">
        <Monitor className="h-3 w-3 text-blue-400" />
        <Smartphone className="h-3 w-3 text-green-400" />
        <Globe className="h-3 w-3 text-purple-400" />
      </div>
    );
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
    <div className="rounded-lg border shadow-sm bg-card">
      {renderDayHeader()}
      
      <div className={cn(
        "grid gap-1.5",
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
                "min-h-16 p-2 border rounded-md transition-all duration-200 hover:shadow-md",
                !isCurrentMonth && "bg-muted/50",
                isPast && "bg-gray-100 dark:bg-slate-800/40",
                isToday(day) && "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
                view === "week" && "h-32"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-muted-foreground",
                    isToday(day) && "bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                  )}
                >
                  {format(day, "d")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(day, "EEE")}
                </span>
              </div>
              
              {dayCampaigns.length > 0 && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-1 mt-1 cursor-pointer">
                      <Badge variant="outline" className={cn(
                        "text-xs h-5 px-1.5 transition-all",
                        dayCampaigns.some(c => c.status === "live") 
                          ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100" 
                          : "hover:bg-secondary"
                      )}>
                        {dayCampaigns.length} {dayCampaigns.length === 1 ? 'promo' : 'promos'}
                      </Badge>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="p-0 w-72 overflow-hidden">
                    <div className="max-w-xs">
                      <div className="bg-purple-500 text-white px-4 py-2 font-medium">
                        {format(day, "MMMM d, yyyy")}
                      </div>
                      <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
                        {dayCampaigns.map((campaign) => (
                          <div key={campaign.id} className="space-y-1 pb-2 border-b last:border-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: campaign.color }}></span>
                                <span className="font-medium">{campaign.title}</span>
                              </div>
                              <Badge className={cn(
                                "text-[10px] px-1.5 py-0 h-4 capitalize",
                                campaign.status === "live" ? "bg-green-500" : 
                                campaign.status === "planned" ? "bg-blue-500" : "bg-purple-500"
                              )}>
                                {campaign.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{campaign.description}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <span className="text-xs text-muted-foreground mr-1">Platforms:</span>
                              <Monitor className="h-3 w-3 text-blue-400" />
                              <Smartphone className="h-3 w-3 text-green-400" />
                              <Globe className="h-3 w-3 text-purple-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignCalendar;
