
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarCheckIcon, 
  CalendarPlus, 
  CalendarX,
  List
} from "lucide-react";
import { format, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval } from "date-fns";
import CampaignCalendar from "@/components/promo/CampaignCalendar";
import CampaignList from "@/components/promo/CampaignList";
import { Campaign, CampaignStatus } from "@/types/campaign";

const Promotions = () => {
  const [viewType, setViewType] = useState<"calendar" | "list">("calendar");
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | "all">("all");

  // Sample campaign data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Summer Sale",
      description: "20% off on all summer products",
      startDate: new Date(2024, 5, 10), // June 10, 2024
      endDate: new Date(2024, 5, 20),   // June 20, 2024
      status: "live",
      color: "#4CAF50"
    },
    {
      id: "2",
      title: "Back to School",
      description: "Special discounts on school supplies",
      startDate: new Date(2024, 7, 15), // Aug 15, 2024
      endDate: new Date(2024, 7, 30),   // Aug 30, 2024
      status: "planned",
      color: "#2196F3"
    },
    {
      id: "3",
      title: "Spring Collection",
      description: "New spring items launch",
      startDate: new Date(2024, 2, 1),  // March 1, 2024
      endDate: new Date(2024, 2, 15),   // March 15, 2024
      status: "completed",
      color: "#9C27B0"
    },
    {
      id: "4",
      title: "Flash Sale",
      description: "24-hour flash discounts",
      startDate: new Date(2024, 6, 5),  // July 5, 2024
      endDate: new Date(2024, 6, 6),    // July 6, 2024
      status: "planned",
      color: "#FF9800"
    },
    {
      id: "5",
      title: "Black Friday",
      description: "Biggest sale of the year",
      startDate: new Date(2024, 10, 29), // Nov 29, 2024
      endDate: new Date(2024, 11, 2),    // Dec 2, 2024
      status: "planned",
      color: "#607D8B"
    }
  ]);

  // Navigation functions
  const goToPrevious = () => {
    if (calendarView === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (calendarView === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get the date range based on current view
  const getViewDateRange = () => {
    if (calendarView === "month") {
      return format(currentDate, "MMMM yyyy");
    } else {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
  };

  // Filter campaigns by status
  const getFilteredCampaigns = () => {
    if (filterStatus === "all") {
      return campaigns;
    }
    return campaigns.filter(campaign => campaign.status === filterStatus);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Promotion Planner</h2>
        <div className="flex items-center space-x-2">
          <Tabs 
            value={viewType} 
            onValueChange={(value) => setViewType(value as "calendar" | "list")}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {viewType === "calendar" ? "Campaign Calendar" : "Campaign List"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="min-w-32 font-medium" 
                    onClick={goToToday}
                  >
                    {getViewDateRange()}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  {viewType === "calendar" && (
                    <Select
                      value={calendarView}
                      onValueChange={(value) => setCalendarView(value as "month" | "week")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month View</SelectItem>
                        <SelectItem value="week">Week View</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <Select
                    value={filterStatus}
                    onValueChange={(value) => setFilterStatus(value as CampaignStatus | "all")}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campaigns</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {viewType === "calendar" ? (
                <CampaignCalendar 
                  campaigns={getFilteredCampaigns()} 
                  currentDate={currentDate} 
                  view={calendarView} 
                />
              ) : (
                <CampaignList 
                  campaigns={getFilteredCampaigns()} 
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Promotions;
