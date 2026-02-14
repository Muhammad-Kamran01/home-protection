
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../supabase';

interface StatsState {
  totalRevenue: number;
  totalBookings: number;
  pendingOrders: number;
  pendingApplications: number;
  recentBookings: any[];
  chartData: any[];
}

const AdminStats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsState>({
    totalRevenue: 0,
    totalBookings: 0,
    pendingOrders: 0,
    pendingApplications: 0,
    recentBookings: [],
    chartData: []
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch Bookings for Revenue, Counts, and Pending Status
      const { data: bookings, error: bError } = await supabase
        .from('bookings')
        .select('total_amount, created_at, status');
      
      if (bError) throw bError;

      // 2. Fetch Pending Applications (HR/Careers)
      const { count: pendingAppsCount, error: aError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (aError) throw aError;

      // Process Revenue, Chart Data, and Pending Orders
      let revenue = 0;
      let pendingCount = 0;
      const monthlyData: Record<string, number> = {};
      
      // Initialize last 6 months with 0
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      for (let i = 5; i >= 0; i--) {
        const mIndex = (currentMonth - i + 12) % 12;
        monthlyData[months[mIndex]] = 0;
      }

      bookings?.forEach(b => {
        // Calculate Total Revenue from Completed Bookings
        if (b.status === 'completed') {
          revenue += (b.total_amount || 0);
        }
        
        // Count Pending Orders (Anything not finished or killed)
        if (b.status === 'pending' || b.status === 'in_progress') {
          pendingCount++;
        }
        
        // Prepare Chart Data
        const date = new Date(b.created_at);
        const mName = months[date.getMonth()];
        if (monthlyData[mName] !== undefined) {
          monthlyData[mName] += (b.total_amount || 0);
        }
      });

      const processedChartData = Object.keys(monthlyData).map(name => ({
        name,
        value: monthlyData[name]
      }));

      // Get 5 most recent bookings for the feed
      const recent = [...(bookings || [])]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setStats({
        totalRevenue: revenue,
        totalBookings: bookings?.length || 0,
        pendingOrders: pendingCount,
        pendingApplications: pendingAppsCount || 0,
        recentBookings: recent,
        chartData: processedChartData
      });

    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Real-time update every 30 seconds for live feel
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const cardItems = [
    { label: 'Total Revenue', value: `PKR ${stats.totalRevenue.toLocaleString()}`, icon: 'fa-wallet', color: 'bg-green-500', change: 'Live' },
    { label: 'Total Bookings', value: stats.totalBookings.toString(), icon: 'fa-calendar-check', color: 'bg-blue-50', iconColor: 'text-blue-600', change: 'Total' },
    { label: 'Pending Orders', value: stats.pendingOrders.toString(), icon: 'fa-hourglass-half', color: 'bg-orange-500', change: 'To Do' },
    { label: 'Pending Apps', value: stats.pendingApplications.toString(), icon: 'fa-user-clock', color: 'bg-yellow-500', change: 'Review' },
  ];

  if (loading && stats.totalBookings === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardItems.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.color} p-3 rounded-2xl text-white shadow-lg`}>
                <i className={`fas ${item.icon} text-xl`}></i>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {item.change}
              </span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">{item.label}</h3>
            <p className="text-2xl font-black text-blue-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-blue-900 uppercase tracking-tight">Revenue Trend</h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              Real-time
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700}} 
                  formatter={(value: any) => [`PKR ${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-black text-blue-900 uppercase tracking-tight mb-8">Recent Operations</h3>
          <div className="flex-1 space-y-6">
            {stats.recentBookings.map((b, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xs border border-blue-100">
                    {b.profiles?.full_name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-black text-sm text-blue-900">{b.profiles?.full_name || 'Anonymous'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      {b.services?.name || 'General Maintenance'} • {new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-blue-600">PKR {b.total_amount?.toLocaleString()}</p>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                    b.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    b.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentBookings.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 italic py-10">
                <i className="fas fa-inbox text-4xl mb-4 opacity-20"></i>
                <p>No recent activity detected.</p>
              </div>
            )}
          </div>
          <div className="mt-6">
            <button className="w-full py-4 text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all">
              Launch Full Operations Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
