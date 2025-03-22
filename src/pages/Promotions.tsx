
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/StatCard";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarCheckIcon, 
  CalendarPlus, 
  CalendarX,
  List,
  Filter,
  PieChart,
  TrendingUp,
  Layers
} from "lucide-react";
import { format, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks, 
  isWithinInterval, addDays, isBefore, isToday } from "date-fns";
import CampaignCalendar from "@/components/promo/CampaignCalendar";
import CampaignList from "@/components/promo/CampaignList";
import { Campaign, CampaignStatus } from "@/types/campaign";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Promotions = () => {
  const [viewType, setViewType] = useState<"calendar" | "list">("calendar");
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | "all">("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(null);

  const [stats, setStats] = useState({
    live: 0,
    planned: 0,
    completed: 0,
    total: 0
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Summer Flash Sale",
      description: "25% off on all summer items",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5),
      status: "live",
      color: "#4CAF50"
    },
    {
      id: "2",
      title: "Free Delivery Week",
      description: "No delivery charges on all orders",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6),
      status: "live",
      color: "#8BC34A"
    },
    {
      id: "3",
      title: "Back to School",
      description: "Special discounts on school supplies",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 24),
      status: "planned",
      color: "#2196F3"
    },
    {
      id: "4",
      title: "Flash Sale",
      description: "24-hour flash discounts",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8),
      status: "planned",
      color: "#03A9F4"
    },
    {
      id: "5",
      title: "Weekend Special",
      description: "Buy one get one free",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6),
      status: "planned",
      color: "#00BCD4"
    },
    {
      id: "6",
      title: "Spring Collection",
      description: "New spring items launch",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 20),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 5),
      status: "completed",
      color: "#9C27B0"
    },
    {
      id: "7",
      title: "Easter Promotion",
      description: "Special Easter discounts",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 15),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 8),
      status: "completed",
      color: "#673AB7"
    },
    {
      id: "8",
      title: "Early Bird Sale",
      description: "Early access to summer collection",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 10),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 3),
      status: "completed",
      color: "#E91E63"
    }
  ]);

  useEffect(() => {
    const today = new Date();
    const filteredCampaigns = getFilteredCampaigns();
    
    // Update stats to count campaigns correctly based on their actual status
    const newStats = {
      live: filteredCampaigns.filter(c => 
        c.status === "live" && 
        !isBefore(c.endDate, today)
      ).length,
      planned: filteredCampaigns.filter(c => c.status === "planned").length,
      completed: filteredCampaigns.filter(c => 
        c.status === "completed" || 
        isBefore(c.endDate, today)
      ).length,
      total: filteredCampaigns.length
    };
    
    setStats(newStats);
  }, [campaigns, filterStatus]);

  const goToPrevious = () => {
    if (calendarView === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (calendarView === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const goToNext = () => {
    if (calendarView === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (calendarView === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getViewDateRange = () => {
    if (calendarView === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (calendarView === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    } else {
      return format(currentDate, "MMMM d, yyyy");
    }
  };

  const toggleFilter = (value: string) => {
    setSelectedFilters(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };

  const getFilteredCampaigns = () => {
    if (filterStatus === "all") {
      return campaigns;
    }
    return campaigns.filter(campaign => campaign.status === filterStatus);
  };

  const handleDayOfWeekSelect = (value: string) => {
    if (value === "none") {
      setSelectedDayOfWeek(null);
    } else {
      setSelectedDayOfWeek(parseInt(value));
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-purple-800 bg-clip-text text-transparent">
          Promotion Planner
        </h2>
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

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard 
          icon={<Layers className="h-5 w-5" />}
          iconColor="purple"
          title="Total Campaigns"
          value={stats.total}
        />
        <StatCard 
          icon={<CalendarCheckIcon className="h-5 w-5" />}
          iconColor="green"
          title="Live Campaigns"
          value={stats.live}
          trend={{ value: "Active Now", positive: true }}
        />
        <StatCard 
          icon={<CalendarPlus className="h-5 w-5" />}
          iconColor="blue"
          title="Planned Campaigns"
          value={stats.planned}
          trend={{ value: "Upcoming", positive: true }}
        />
        <StatCard 
          icon={<CalendarX className="h-5 w-5" />}
          iconColor="gray"
          title="Completed Campaigns"
          value={stats.completed}
          trend={{ value: "Past", positive: false }}
        />
      </div>

      <div className="grid gap-4">
        <Card className="border shadow-sm overflow-visible">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
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
                    className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="min-w-32 font-medium hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200" 
                    onClick={goToToday}
                  >
                    {getViewDateRange()}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={goToNext}
                    className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  {viewType === "calendar" && (
                    <>
                      <Select
                        value={calendarView}
                        onValueChange={(value) => {
                          setCalendarView(value as "month" | "week" | "day");
                          // Reset day of week selection when changing views
                          if (value !== "day") {
                            setSelectedDayOfWeek(null);
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Month View</SelectItem>
                          <SelectItem value="week">Week View</SelectItem>
                          <SelectItem value="day">Day View</SelectItem>
                        </SelectContent>
                      </Select>

                      {calendarView === "day" && (
                        <Select
                          value={selectedDayOfWeek !== null ? selectedDayOfWeek.toString() : "none"}
                          onValueChange={handleDayOfWeekSelect}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select day of week" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Single Day</SelectItem>
                            <SelectItem value="0">All Sundays</SelectItem>
                            <SelectItem value="1">All Mondays</SelectItem>
                            <SelectItem value="2">All Tuesdays</SelectItem>
                            <SelectItem value="3">All Wednesdays</SelectItem>
                            <SelectItem value="4">All Thursdays</SelectItem>
                            <SelectItem value="5">All Fridays</SelectItem>
                            <SelectItem value="6">All Saturdays</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <Filter className="h-4 w-4" />
                        <span>Campaign Types</span>
                        {selectedFilters.length > 0 && (
                          <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-600">{selectedFilters.length}</Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Campaign Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.includes("live")}
                        onCheckedChange={() => toggleFilter("live")}
                      >
                        <div className="flex items-center">
                          <CalendarCheckIcon className="h-4 w-4 text-green-500 mr-2" />
                          <span>Live Campaigns</span>
                        </div>
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.includes("planned")}
                        onCheckedChange={() => toggleFilter("planned")}
                      >
                        <div className="flex items-center">
                          <CalendarPlus className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Planned Campaigns</span>
                        </div>
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.includes("completed")}
                        onCheckedChange={() => toggleFilter("completed")}
                      >
                        <div className="flex items-center">
                          <CalendarX className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Completed Campaigns</span>
                        </div>
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

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

              <div className="flex items-center justify-start gap-4 flex-wrap bg-secondary/50 p-2 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">Legend:</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs">Live</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs">Planned</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-xs">No Promos</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></span>
                  <span className="text-xs">Past Dates</span>
                </div>
              </div>

              {viewType === "calendar" ? (
                <CampaignCalendar 
                  campaigns={getFilteredCampaigns()} 
                  currentDate={currentDate} 
                  view={calendarView}
                  selectedFilter={selectedFilters}
                  selectedDayOfWeek={selectedDayOfWeek}
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
