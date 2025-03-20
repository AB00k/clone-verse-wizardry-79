
import React, { useEffect, useState } from 'react';
import { Tag, DollarSign, ShoppingCart, PercentIcon, BarChart, Activity, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StatCard from '@/components/StatCard';
import BudgetProgressBar from '@/components/BudgetProgressBar';
import SpendingChart from '@/components/SpendingChart';

// Mock data for the spending chart
const generateChartData = () => {
  const data = [];
  for (let i = 1; i <= 30; i++) {
    // Generate a simulated spending amount with a general upward trend
    const base = 1800 + i * 30;
    const random = Math.random() * 300 - 150;
    const amount = Math.max(1500, base + random);
    
    data.push({
      name: i.toString(),
      amount: Math.round(amount)
    });
  }
  return data;
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState(generateChartData());
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-500">Delivery Discount Performance</h1>
          <Button className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-full px-6 py-2 flex items-center gap-2 transition-all duration-300">
            <span className="text-xl">+</span> Create a new campaign
          </Button>
        </header>

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
            icon={<PercentIcon className="w-6 h-6" />}
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
};

export default Index;
