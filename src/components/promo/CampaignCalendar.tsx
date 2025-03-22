
import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, 
  eachDayOfInterval, isToday, isSameDay, addDays, isBefore, isAfter, isWithinInterval, 
  getDay, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Campaign } from "@/types/campaign";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CalendarPlus, CalendarCheck, CalendarX, Monitor, Smartphone, Globe, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CampaignCalendarProps {
  campaigns: Campaign[];
  currentDate: Date;
  view: "month" | "week" | "day";
  selectedFilter: string[];
  selectedDayOfWeek: number | null;
}

const CampaignCalendar: React.FC<CampaignCalendarProps> = ({ 
  campaigns, 
  currentDate, 
  view,
  selectedFilter,
  selectedDayOfWeek
}) => {
  const getCalendarDays = () => {
    if (view === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else if (view === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      // Day view - return just the current day
      // Or if selectedDayOfWeek is set, return all matching days in the month
      if (selectedDayOfWeek !== null) {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
        return allDays.filter(day => getDay(day) === selectedDayOfWeek);
      } else {
        return [currentDate];
      }
    }
  };

  const renderDayHeader = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    if (view === "day" && selectedDayOfWeek !== null) {
      return (
        <div className="text-center text-sm font-medium text-muted-foreground py-2">
          All {weekDays[selectedDayOfWeek]}s in {format(currentDate, "MMMM yyyy")}
        </div>
      );
    }
    
    return (
      <div className={cn(
        "grid gap-1 mb-2",
        view === "month" || view === "week" ? "grid-cols-7" : "grid-cols-1"
      )}>
        {view === "day" && selectedDayOfWeek === null ? (
          <div className="text-center text-sm font-medium text-muted-foreground py-2">
            {format(currentDate, "EEEE")}
          </div>
        ) : (
          weekDays.map((day, index) => (
            <div 
              key={day} 
              className={cn(
                "text-center text-sm font-medium py-2",
                (selectedDayOfWeek === index) ? "text-purple-600 bg-purple-50 rounded-md dark:bg-purple-900/20" : "text-muted-foreground"
              )}
            >
              {day}
            </div>
          ))
        )}
      </div>
    );
  };

  const getCampaignsForDay = (day: Date) => {
    return campaigns.filter(campaign => 
      isWithinInterval(day, { start: startOfDay(campaign.startDate), end: endOfDay(campaign.endDate) }) &&
      (selectedFilter.length === 0 || selectedFilter.includes(campaign.status))
    );
  };

  const isPastDay = (day: Date) => {
    return isBefore(day, new Date()) && !isToday(day);
  };

  const days = getCalendarDays();

  return (
    <div className="rounded-lg border shadow-sm bg-card">
      {renderDayHeader()}
      
      <div className={cn(
        "grid gap-1.5",
        view === "month" ? "grid-cols-7" : 
        view === "week" ? "grid-cols-7" : 
        selectedDayOfWeek !== null ? "grid-cols-1 gap-3" : "grid-cols-1"
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
                isPast && "bg-gray-100 dark:bg-slate-800/40", // All past days get this gray background
                isToday(day) && "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
                view === "week" && "h-32",
                view === "day" && "h-40",
                selectedDayOfWeek !== null && "h-40"
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
              
              {dayCampaigns.length > 0 ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-1 mt-1 cursor-pointer">
                      <Badge variant="outline" className={cn(
                        "text-xs h-5 px-1.5 transition-all",
                        isPast 
                          ? "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100" // Past day promos always gray
                          : dayCampaigns.some(c => c.status === "live") 
                            ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100" 
                            : dayCampaigns.some(c => c.status === "planned")
                              ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      )}>
                        {dayCampaigns.length} {dayCampaigns.length === 1 ? 'promo' : 'promos'}
                      </Badge>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="p-0 w-80 overflow-hidden shadow-lg border border-purple-100 dark:border-purple-900/50">
                    <div className="max-w-xs">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-3 font-medium">
                        <div className="text-lg">{format(day, "MMMM d, yyyy")}</div>
                        <div className="text-xs text-purple-200 font-normal mt-1">
                          {dayCampaigns.length} {dayCampaigns.length === 1 ? 'promotion' : 'promotions'} active
                        </div>
                      </div>
                      <div className="p-4 space-y-4 max-h-72 overflow-y-auto">
                        {dayCampaigns.map((campaign) => (
                          <div key={campaign.id} className="space-y-2 pb-3 border-b last:border-0 last:pb-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: campaign.color }}></span>
                                <span className="font-medium text-sm">{campaign.title}</span>
                              </div>
                              <Badge className={cn(
                                "text-[10px] px-1.5 py-0 h-4 capitalize",
                                campaign.status === "live" && !isPast ? "bg-green-500" : 
                                campaign.status === "planned" ? "bg-blue-500" : "bg-gray-500"
                              )}>
                                {campaign.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{campaign.description}</p>
                            
                            <div className="flex flex-col space-y-2 text-xs">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1.5" />
                                <span>
                                  {format(campaign.startDate, "MMM d, yyyy")} - {format(campaign.endDate, "MMM d, yyyy")}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <span className="text-muted-foreground mr-1">Platforms:</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Monitor className="h-3.5 w-3.5 text-blue-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Desktop</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Smartphone className="h-3.5 w-3.5 text-green-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Mobile</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Globe className="h-3.5 w-3.5 text-purple-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">Web</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <div className="mt-2">
                  <Badge variant="outline" className={cn(
                    "text-xs h-5 px-1.5", 
                    isPast ? "bg-gray-50 text-gray-600 border-gray-200" : "bg-red-50 text-red-600 border-red-200"
                  )}>
                    0 promos
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignCalendar;
