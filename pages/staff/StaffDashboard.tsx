import React, { useState, useEffect } from "react";
import { useAuth } from "../../App";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";

const StaffDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "jobs" | "schedule" | "history" | "stats"
  >("jobs");

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalEarnings: 0,
    totalJobs: 0,
    completedJobs: 0,
    avgRating: 0,
    jobsThisMonth: 0,
  });
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ASSIGNED BOOKINGS ---------------- */
  const fetchJobs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select("*, services(name)")
      .eq("assigned_staff", user.id)
      .neq("status", "completed")
      .order("scheduled_at", { ascending: true });

    if (!error && data) setJobs(data);
  };

  /* ---------------- FETCH COMPLETED JOBS ---------------- */
  const fetchCompletedJobs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select("*, services(name)")
      .eq("assigned_staff", user.id)
      .eq("status", "completed")
      .order("scheduled_at", { ascending: false });

    if (!error && data) setCompletedJobs(data);
  };

  /* ---------------- FETCH SCHEDULE ---------------- */
  const fetchSchedule = async () => {
    if (!user) return;

    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("bookings")
      .select("*, services(name)")
      .eq("assigned_staff", user.id)
      .gte("scheduled_at", today.toISOString())
      .lte("scheduled_at", nextWeek.toISOString())
      .order("scheduled_at", { ascending: true });

    if (!error && data) setSchedule(data);
  };

  /* ---------------- FETCH STATS ---------------- */
  const fetchStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all bookings for this staff
      const { data: allBookings } = await supabase
        .from("bookings")
        .select("*, services(price)")
        .eq("assigned_staff", user.id);

      if (allBookings) {
        const completedCount = allBookings.filter((b) => b.status === "completed").length;
        const totalEarnings = allBookings
          .filter((b) => b.status === "completed")
          .reduce((sum, b) => sum + (b.services?.price || 0), 0);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const jobsThisMonth = allBookings.filter((b) => {
          const date = new Date(b.scheduled_at);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear && b.status === "completed";
        }).length;

        setStats({
          totalEarnings,
          totalJobs: allBookings.length,
          completedJobs: completedCount,
          avgRating: 4.8, // Placeholder - you can add ratings table
          jobsThisMonth,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchCompletedJobs();
      fetchSchedule();
      fetchStats();
    }
  }, [user]);

  /* ---------------- MARK COMPLETED ---------------- */
  const markCompleted = async (id: string) => {
    await supabase
      .from("bookings")
      .update({ status: "completed" })
      .eq("id", id);

    fetchJobs();
  };

  /* ---------------- STATUS COLOR ---------------- */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in_progress":
        return "bg-yellow-100 text-blue-700 border-blue-200";
      default:
        return "bg-blue-100 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex h-[calc(100vh-80px)] overflow-hidden">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-64 md:w-72 bg-[#0b1b35] text-white flex flex-col shrink-0 overflow-hidden shadow-2xl">
        {/* Staff Profile Area */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">
              {user?.full_name?.[0]}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {user?.full_name}
              </h2>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">
                Technician
              </p>
            </div>
          </div>

          {/* Duty Toggle */}
          <button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-between transition-all border ${
              isOnDuty
                ? "bg-green-500/10 border-green-500/50 text-green-400"
                : "bg-red-500/10 border-red-500/50 text-red-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${isOnDuty ? "bg-green-400" : "bg-red-400"}`}
              ></div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isOnDuty ? "On Duty" : "Off Duty"}
              </span>
            </div>
            <i
              className={`fas ${
                isOnDuty ? "fa-toggle-on" : "fa-toggle-off"
              } text-lg`}
            ></i>
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: "jobs", name: "Active Tasks", icon: "fa-tasks" },
            { id: "schedule", name: "My Schedule", icon: "fa-calendar-alt" },
            { id: "history", name: "Work History", icon: "fa-history" },
            { id: "stats", name: "Earnings & Stats", icon: "fa-chart-line" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-bold text-sm ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {item.name}
            </button>
          ))}
        </nav>

        {/* BOTTOM */}
        <div className="p-6 bg-black/20 space-y-3">
          <Link
            to="/"
            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all font-bold text-xs text-blue-200 hover:bg-white/5"
          >
            <i className="fas fa-home w-5 text-center"></i> Back to Home
          </Link>

          <button
            onClick={signOut}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all font-bold text-xs text-red-400 hover:bg-red-500/10"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i> End Session
          </button>
        </div>
      </aside>

      {/* ---------------- CONTENT ---------------- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white px-10 py-6 shadow-sm border-b border-gray-100 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-black text-blue-900">
              {activeTab === "jobs" && "Assigned Service Requests"}
              {activeTab === "schedule" && "Shift Schedule"}
              {activeTab === "history" && "Job Completion History"}
              {activeTab === "stats" && "Performance Analytics"}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {activeTab === "jobs" && "Manage your active tasks and update their status"}
              {activeTab === "schedule" && "View and manage your shift schedule"}
              {activeTab === "history" && "Review your completed work and history"}
              {activeTab === "stats" && "Track your earnings and performance metrics"}
            </p>
          </div>
        </header>

        {/* ---------------- JOBS ---------------- */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10">
          {activeTab === "jobs" && (
            <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {jobs.length === 0 && (
                <p className="text-gray-400 font-medium">
                  No tasks assigned yet.
                </p>
              )}

              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border"
                >
                  {/* Status */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${job.status === 'completed' ? 'bg-green-500' : job.status === 'in_progress' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                      <span
                        className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border ${getStatusColor(
                          job.status,
                        )}`}
                      >
                        {job.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-400 text-[10px] font-medium mb-1">Booking ID</p>
                      <p className="text-gray-600 text-[11px] font-black tracking-wider">{job.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Service */}
                  <h3 className="text-xl font-black text-blue-900 mb-2">
                    {job.services?.name || "Service Booking"}
                  </h3>

                  {/* Address */}
                  <p className="text-gray-500 text-sm flex items-center gap-2 font-medium">
                    <i className="fas fa-map-marker-alt text-blue-500"></i>
                    {job.address}
                  </p>

                  {/* Customer Box */}
                  <div className="bg-blue-50/30 p-6 rounded-3xl border border-blue-50 gap-6 mt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 border border-blue-100 text-lg">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
                            Customer
                          </p>
                          <p className="font-bold text-blue-900">
                            {job.customer_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {/* Call */}
                      <a
                        href={`tel:${job.contact_number}`}
                        className="w-10 h-10 bg-white text-green-500 rounded-xl flex items-center justify-center shadow-sm border border-green-100 hover:bg-green-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-phone"></i>
                      </a>

                      {/* Navigation-Map*/}

                      <button className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                        Start Navigation
                      </button>

                      {/* Notes */}

                      <button
                        onClick={() =>
                          setSelectedNotes(job.notes || "No notes added.")
                        }
                        className="px-5 bg-white border border-gray-200 text-blue-900 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                      >
                        View Notes
                      </button>
                    </div>

                    {/* Complete */}
                    <br></br>
                    <div className="flex gap-4">
                      <button
                        onClick={() => markCompleted(job.id)}
                        className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---------------- SCHEDULE TAB ---------------- */}
          {activeTab === "schedule" && (
            <div className="grid lg:grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {schedule.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border text-center">
                  <div className="text-gray-400 mb-4 text-4xl">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <p className="text-gray-400 font-medium">No scheduled shifts for the next 7 days.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedule.map((shift, idx) => {
                    const scheduledDate = new Date(shift.scheduled_at);
                    const timeStr = scheduledDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const dateStr = scheduledDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <div
                        key={shift.id}
                        className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 font-bold text-center min-w-20">
                              <div className="text-sm">{dateStr.split(' ')[0]}</div>
                              <div className="text-lg">{dateStr.split(' ')[2]}</div>
                            </div>
                            <div>
                              <h4 className="font-bold text-blue-900 mb-1">{shift.services?.name}</h4>
                              <p className="text-gray-500 text-sm flex items-center gap-2">
                                <i className="fas fa-clock text-blue-600"></i>
                                {timeStr}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                              {shift.status.replace("_", " ").toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <i className="fas fa-map-marker-alt text-blue-500"></i>
                          {shift.address}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                              {shift.customer_name?.[0]}
                            </div>
                            <span className="text-sm text-gray-600">{shift.customer_name}</span>
                          </div>
                          <a
                            href={`tel:${shift.contact_number}`}
                            className="text-green-600 hover:text-green-700 font-bold text-sm flex items-center gap-2"
                          >
                            <i className="fas fa-phone"></i> Call
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ---------------- WORK HISTORY TAB ---------------- */}
          {activeTab === "history" && (
            <div className="grid lg:grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {completedJobs.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border text-center">
                  <div className="text-gray-400 mb-4 text-4xl">
                    <i className="fas fa-history"></i>
                  </div>
                  <p className="text-gray-400 font-medium">No completed jobs yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedJobs.map((job) => {
                    const completedDate = new Date(job.scheduled_at);
                    const dateStr = completedDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <div
                        key={job.id}
                        className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="bg-green-100 p-3 rounded-xl">
                              <i className="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-900 mb-1">{job.services?.name}</h4>
                              <p className="text-gray-500 text-sm">{dateStr}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                              Completed
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1">Customer</p>
                              <p className="font-bold text-gray-800">{job.customer_name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Location</p>
                              <p className="font-bold text-gray-800">{job.address}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Booking ID</p>
                              <p className="font-bold text-gray-800 font-mono text-xs">
                                {job.id.slice(0, 8).toUpperCase()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Service Type</p>
                              <p className="font-bold text-gray-800">{job.services?.name}</p>
                            </div>
                          </div>
                        </div>

                        {job.notes && (
                          <div className="border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-500 font-bold mb-2">NOTES</p>
                            <p className="text-gray-700 text-sm">{job.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ---------------- EARNINGS & STATS TAB ---------------- */}
          {activeTab === "stats" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Earnings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600 text-xl">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded">
                      Total
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-bold mb-1">TOTAL EARNINGS</p>
                  <h3 className="text-3xl font-black text-green-600">
                    ${stats.totalEarnings.toFixed(2)}
                  </h3>
                </div>

                {/* Jobs This Month */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600 text-xl">
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">
                      This Month
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-bold mb-1">JOBS COMPLETED</p>
                  <h3 className="text-3xl font-black text-blue-600">{stats.jobsThisMonth}</h3>
                </div>

                {/* Total Jobs */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-xl text-purple-600 text-xl">
                      <i className="fas fa-list-check"></i>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded">
                      All Time
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-bold mb-1">TOTAL JOBS</p>
                  <h3 className="text-3xl font-black text-purple-600">{stats.totalJobs}</h3>
                </div>

                {/* Completion Rate */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-orange-100 p-3 rounded-xl text-orange-600 text-xl">
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded">
                      Rating
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-bold mb-1">AVG RATING</p>
                  <h3 className="text-3xl font-black text-orange-600">
                    {stats.avgRating.toFixed(1)} ⭐
                  </h3>
                </div>
              </div>

              {/* Performance Details */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Performance Summary */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                  <h3 className="text-xl font-bold text-blue-900 mb-6">Performance Summary</h3>

                  <div className="space-y-6">
                    {/* Completion Rate */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-gray-700">Task Completion Rate</p>
                        <p className="text-sm font-black text-green-600">
                          {stats.totalJobs > 0
                            ? Math.round((stats.completedJobs / stats.totalJobs) * 100)
                            : 0}
                          %
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{
                            width:
                              stats.totalJobs > 0
                                ? `${(stats.completedJobs / stats.totalJobs) * 100}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Monthly Earnings */}
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">Job Breakdown</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-bold text-green-600">{stats.completedJobs}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">In Progress</span>
                          <span className="font-bold text-blue-600">
                            {stats.totalJobs - stats.completedJobs}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* This Month Stats */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-xs text-gray-500 font-bold mb-2">THIS MONTH</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-blue-600">
                          {stats.jobsThisMonth}
                        </span>
                        <span className="text-gray-600 text-sm">jobs completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Earnings Breakdown */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                  <h3 className="text-xl font-bold text-blue-900 mb-6">Earnings Overview</h3>

                  <div className="space-y-6 mb-6">
                    {/* Total Earned */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                      <p className="text-xs text-gray-600 font-bold mb-2">TOTAL EARNED</p>
                      <h4 className="text-3xl font-black text-green-600 mb-2">
                        ${stats.totalEarnings.toFixed(2)}
                      </h4>
                      <p className="text-xs text-gray-600">
                        From {stats.completedJobs} completed jobs
                      </p>
                    </div>

                    {/* Average Per Job */}
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">Average Per Job</p>
                      <p className="text-2xl font-black text-blue-600">
                        $
                        {stats.completedJobs > 0
                          ? (stats.totalEarnings / stats.completedJobs).toFixed(2)
                          : "0.00"}
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 mb-1">This Month</p>
                        <p className="font-bold text-gray-900">
                          ${(stats.totalEarnings * 0.3).toFixed(2)}
                          <span className="text-xs text-gray-500 font-normal"> (est.)</span>
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600 mb-1">Pending</p>
                        <p className="font-bold text-gray-900">
                          $
                          {(
                            stats.totalEarnings * 0.1 +
                            (stats.totalJobs - stats.completedJobs) * 50
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- NOTES MODAL ---------------- */}
      {selectedNotes && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="font-bold text-lg mb-4">Customer Notes</h3>
            <p className="text-gray-600 text-sm">{selectedNotes}</p>

            <button
              onClick={() => setSelectedNotes(null)}
              className="mt-6 bg-gray-100 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
