
import React from "react";
import { Campaign } from "@/types/campaign";
import { Card, CardContent } from "@/components/ui/card";
import { format, isAfter, isBefore, isToday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, CalendarCheck, CalendarX, Calendar, Monitor, Smartphone, Globe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CampaignListProps {
  campaigns: Campaign[];
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  const today = new Date();
  
  const getStatusBadge = (campaign: Campaign) => {
    let status = campaign.status;
    let icon = <Calendar className="h-3 w-3 mr-1" />;
    let color = "bg-gray-500";
    
    // If the campaign is completed or the end date is in the past, show as gray
    if (status === "completed" || isBefore(campaign.endDate, today)) {
      icon = <CalendarX className="h-3 w-3 mr-1" />;
      color = "bg-gray-500 hover:bg-gray-600";
    } 
    // If it's a future campaign marked as planned
    else if (status === "planned") {
      icon = <CalendarPlus className="h-3 w-3 mr-1" />;
      color = "bg-blue-500 hover:bg-blue-600";
    }
    // If it's currently active
    else if (status === "live" && !isBefore(campaign.endDate, today)) {
      icon = <CalendarCheck className="h-3 w-3 mr-1" />;
      color = "bg-green-500 hover:bg-green-600";
    }
    
    return (
      <Badge className={`flex items-center ${color}`}>
        {icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };
  
  // Sort campaigns by start date
  const sortedCampaigns = [...campaigns].sort((a, b) => 
    a.startDate.getTime() - b.startDate.getTime()
  );

  return (
    <div className="space-y-4">
      {sortedCampaigns.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No campaigns found with the selected filter
        </div>
      ) : (
        sortedCampaigns.map((campaign) => {
          const isPast = isBefore(campaign.endDate, today);
          
          return (
            <Card 
              key={campaign.id} 
              className={cn(
                "overflow-hidden hover:shadow-md transition-all",
                isPast && "opacity-75"
              )}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div 
                    className="w-2 md:w-2 h-full md:h-auto"
                    style={{ backgroundColor: isPast ? "#9CA3AF" : campaign.color }}
                  />
                  <div className="p-4 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-medium">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground">{campaign.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(campaign)}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {format(campaign.startDate, "MMM d, yyyy")} - {format(campaign.endDate, "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <span className="text-xs text-muted-foreground">Platforms:</span>
                        <div className="flex space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Monitor className="h-4 w-4 text-blue-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Desktop</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Smartphone className="h-4 w-4 text-green-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Mobile</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Globe className="h-4 w-4 text-purple-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Web</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default CampaignList;
