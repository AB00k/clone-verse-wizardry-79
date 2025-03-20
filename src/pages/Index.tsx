
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { CalendarClock, DollarSign, ShoppingCart, Tag, Activity, Percent, Calendar } from "lucide-react";
import StatCard from "@/components/StatCard";
import SpendingChart from "@/components/SpendingChart";
import BudgetProgressBar from "@/components/BudgetProgressBar";

// Sample chart data for the spending chart
const chartData = [
  { name: "1", amount: 12000 },
  { name: "5", amount: 15000 },
  { name: "10", amount: 18000 },
  { name: "15", amount: 14000 },
  { name: "20", amount: 21000 },
  { name: "25", amount: 19000 },
  { name: "30", amount: 25000 },
];

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6 text-lg font-medium">
            Delivery Discount Performance
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/promotions">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <CalendarClock className="mr-2 h-4 w-4" />
                    Promotions
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Discount Overview</h2>
            <Button variant="outline" className="border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-full px-4 py-2 flex items-center gap-2">
              <span>View All Running Discounts</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<Tag className="w-6 h-6" />}
              iconColor="gray"
              title="Live Promotions"
              value="8"
              trend={{ value: "+2", positive: true }}
            />
            <StatCard 
              icon={<DollarSign className="w-6 h-6" />}
              iconColor="orange"
              title="Total Discount Spend"
              value="AED 38750"
              trend={{ value: "+8%", positive: true }}
            />
            <StatCard 
              icon={<ShoppingCart className="w-6 h-6" />}
              iconColor="green"
              title="Discounted Orders"
              value="1435"
              trend={{ value: "+22%", positive: true }}
            />
            <StatCard 
              icon={<DollarSign className="w-6 h-6" />}
              iconColor="green"
              title="Operating Profit"
              value="AED 133750"
              trend={{ value: "+12%", positive: true }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<Activity className="w-6 h-6" />}
            iconColor="blue"
            title="ROI"
            value="5x"
            trend={{ value: "+0.3", positive: true }}
          />
          <StatCard 
            icon={<Percent className="w-6 h-6" />}
            iconColor="red"
            title="Average Discount %"
            value="18.5%"
            trend={{ value: "-2.3%", positive: false }}
          />
          <StatCard 
            icon={<ShoppingCart className="w-6 h-6" />}
            iconColor="purple"
            title="Discount Order AOV"
            value="AED 120.21"
            trend={{ value: "+3.5%", positive: true }}
          />
          <StatCard 
            icon={<Tag className="w-6 h-6" />}
            iconColor="blue"
            title="Top Discount Campaign"
            value="Summer Flash 25% Off"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="col-span-3 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900">Monthly Discount Spend</h3>
              <p className="text-sm text-gray-500">Total spent this month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">AED 33,200</p>
            </div>
            <SpendingChart data={chartData} />
          </Card>

          <Card className="col-span-2 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span>Discount Budget</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </h3>
                <p className="text-sm text-gray-500">Budget Utilization</p>
              </div>
              <p className="text-xl font-bold text-green-500">78%</p>
            </div>

            <div className="mb-8">
              <BudgetProgressBar percent={78} className="mb-6" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Budget</p>
                  <p className="text-lg font-bold text-gray-900">AED 50,000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="text-lg font-bold text-gray-900">AED 38,750</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  <span className="text-gray-700 font-medium">Remaining Budget</span>
                </div>
                <span className="text-gray-900 font-bold">AED 11,250</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </span>
                  <span className="text-gray-700 font-medium">Days Left This Month</span>
                </div>
                <span className="text-gray-900 font-bold">10</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
