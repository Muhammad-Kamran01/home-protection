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
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);

  /* ---------------- FETCH ASSIGNED BOOKINGS ---------------- */
  const fetchJobs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("assigned_staff", user.id)
      .neq("status", "completed")
      .order("scheduled_at", { ascending: true });

    if (!error && data) setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
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
              Manage your active tasks and update their status.
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
                  <div className="flex justify-between mb-6">
                    <span
                      className={`px-4 py-1 text-[10px] font-black uppercase rounded-xl border ${getStatusColor(
                        job.status,
                      )}`}
                    >
                      {job.status.replace("_", " ")}
                    </span>

                    <span className="text-gray-300 text-[10px] font-black">
                      {job.id.slice(0, 8)}
                    </span>
                  </div>

                  {/* Service */}
                  <h3 className="text-xl font-black text-blue-900 mb-2">
                    Service Booking
                  </h3>

                  {/* Address */}
                  <p className="text-gray-500 text-sm flex items-center gap-2 font-medium">
                    <i className="fas fa-map-marker-alt text-blue-500"></i>
                    {job.address}
                  </p>

                  {/* Customer Box */}
                  <div className="bg-blue-50/30 p-6 rounded-3xl border border-blue-50">
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
