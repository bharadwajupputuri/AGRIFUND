import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CheckCircle, XCircle, DollarSign, Clock } from 'lucide-react';

// Dummy data
const analyticsData = {
  totalApplied: 12450,
  approved: 8920,
  rejected: 1830,
  needingHarvest: 1700
};

const chartData = [
  { name: 'Approved', value: 8920, color: '#22c55e' },
  { name: 'Pending', value: 1700, color: '#f59e0b' },
  { name: 'Rejected', value: 1830, color: '#ef4444' }
];

const barData = [
  { month: 'Jan', approved: 650, rejected: 120, pending: 80 },
  { month: 'Feb', value: 720, rejected: 140, pending: 95 },
  { month: 'Mar', approved: 890, rejected: 165, pending: 110 },
  { month: 'Apr', approved: 920, rejected: 155, pending: 125 },
  { month: 'May', approved: 1050, rejected: 180, pending: 140 },
  { month: 'Jun', approved: 1180, rejected: 200, pending: 155 }
];

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  color: string;
  delay: number;
}

const StatCard = ({ icon: Icon, title, value, color, delay }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = value / 50;
      let current = 0;
      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(counter);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">
        {displayValue.toLocaleString()}
      </div>
      <div className="text-gray-600 font-medium">{title}</div>
    </div>
  );
};

const Analytics = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Platform Analytics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time insights into our agricultural financing ecosystem
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <StatCard
            icon={Users}
            title="Total Farmers Applied"
            value={analyticsData.totalApplied}
            color="blue"
            delay={0}
          />
          <StatCard
            icon={CheckCircle}
            title="Farmers Approved"
            value={analyticsData.approved}
            color="green"
            delay={200}
          />
          <StatCard
            icon={XCircle}
            title="Applications Rejected"
            value={analyticsData.rejected}
            color="red"
            delay={400}
          />
          <StatCard
            icon={DollarSign}
            title="Needing Harvest Funds"
            value={analyticsData.needingHarvest}
            color="yellow"
            delay={600}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart className="mr-3 h-6 w-6 text-green-600" />
              Monthly Loan Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="approved" fill="#22c55e" name="Approved" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="mr-3 h-6 w-6 text-green-600" />
              Application Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => {
                    const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
                    const percent = total ? ((typeof value === 'number' ? value : 0) / total) * 100 : 0;
                    return `${name} ${percent.toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-6">
              {chartData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-gray-700 font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;