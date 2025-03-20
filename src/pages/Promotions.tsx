
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarCheckIcon, 
  CalendarPlus, 
  CalendarX,
  List,
  Filter
} from "lucide-react";
import { format, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval } from "date-fns";
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
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<CampaignStatus | "all">("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Stats for the campaign summary
  const [stats, setStats] = useState({
    live: 0,
    planned: 0,
    completed: 0,
    total: 0
  });

  // Sample campaign data with various statuses and timeframes
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    // Currently live campaigns
    {
      id: "1",
      title: "Summer Flash Sale",
      description: "25% off on all summer items",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5),
      status: "live",
      color: "#4CAF50" // Green for live campaigns
    },
    {
      id: "2",
      title: "Free Delivery Week",
      description: "No delivery charges on all orders",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6),
      status: "live",
      color: "#8BC34A" // Light green for live campaigns
    },
    
    // Upcoming campaigns
    {
      id: "3",
      title: "Back to School",
      description: "Special discounts on school supplies",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 24),
      status: "planned",
      color: "#2196F3" // Blue for planned campaigns
    },
    {
      id: "4",
      title: "Flash Sale",
      description: "24-hour flash discounts",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8),
      status: "planned",
      color: "#03A9F4" // Light blue for planned campaigns
    },
    {
      id: "5",
      title: "Weekend Special",
      description: "Buy one get one free",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 4),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6),
      status: "planned",
      color: "#00BCD4" // Cyan for planned campaigns
    },
    
    // Completed campaigns
    {
      id: "6",
      title: "Spring Collection",
      description: "New spring items launch",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 20),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 5),
      status: "completed",
      color: "#9C27B0" // Purple for completed campaigns
    },
    {
      id: "7",
      title: "Easter Promotion",
      description: "Special Easter discounts",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 15),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 8),
      status: "completed",
      color: "#673AB7" // Deep purple for completed campaigns
    },
    {
      id: "8",
      title: "Early Bird Sale",
      description: "Early access to summer collection",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 10),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 3),
      status: "completed",
      color: "#E91E63" // Pink for completed campaigns
    }
  ]);

  // Calculate campaign stats
  useEffect(() => {
    const filteredCampaigns = getFilteredCampaigns();
    
    const newStats = {
      live: filteredCampaigns.filter(c => c.status === "live").length,
      planned: filteredCampaigns.filter(c => c.status === "planned").length,
      completed: filteredCampaigns.filter(c => c.status === "completed").length,
      total: filteredCampaigns.length
    };
    
    setStats(newStats);
  }, [campaigns, filterStatus]);

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

  // Toggle campaign type filter
  const toggleFilter = (value: string) => {
    setSelectedFilters(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };

  // Filter campaigns by status
  const getFilteredCampaigns = () => {
    if (filterStatus === "all") {
      return campaigns;
    }
    return campaigns.filter(campaign => campaign.status === filterStatus);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: CampaignStatus) => {
    switch (status) {
      case "live":
        return "default";
      case "planned":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "outline";
    }
  };

  // Get status icon
  const getStatusIcon = (status: CampaignStatus) => {
    switch (status) {
      case "live":
        return <CalendarCheckIcon className="h-4 w-4 text-green-500" />;
      case "planned":
        return <CalendarPlus className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CalendarX className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
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

      {/* Campaign statistics cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Campaigns</CardTitle>
            <CalendarCheckIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.live}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned Campaigns</CardTitle>
            <CalendarPlus className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Campaigns</CardTitle>
            <CalendarX className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <Filter className="h-4 w-4" />
                        <span>Campaign Types</span>
                        {selectedFilters.length > 0 && (
                          <Badge variant="secondary" className="ml-1">{selectedFilters.length}</Badge>
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
                          {getStatusIcon("live")}
                          <span className="ml-2">Live Campaigns</span>
                        </div>
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.includes("planned")}
                        onCheckedChange={() => toggleFilter("planned")}
                      >
                        <div className="flex items-center">
                          {getStatusIcon("planned")}
                          <span className="ml-2">Planned Campaigns</span>
                        </div>
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedFilters.includes("completed")}
                        onCheckedChange={() => toggleFilter("completed")}
                      >
                        <div className="flex items-center">
                          {getStatusIcon("completed")}
                          <span className="ml-2">Completed Campaigns</span>
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

              {/* Campaign Legend */}
              <div className="flex items-center justify-start gap-4 flex-wrap">
                <span className="text-sm">Legend:</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs">Live</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs">Planned</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span className="text-xs">Completed</span>
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
