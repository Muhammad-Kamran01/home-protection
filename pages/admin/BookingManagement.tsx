import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { Booking } from "../../types";

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [staffList, setStaffList] = useState<any[]>([]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*, services(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      console.log("Bookings:", data);
      setBookings(data);
    }
  };

  const fetchStaff = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "staff");

    if (data) setStaffList(data);
  };

  useEffect(() => {
    fetchBookings();
    fetchStaff();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchBookings();
  };

  const assignStaff = async (bookingId: string, staffId: string) => {
    await supabase
      .from("bookings")
      .update({ assigned_staff: staffId })
      .eq("id", bookingId);

    fetchBookings();
  };

  return (
    <div className="space-y-8">
      <h3 className="font-bold text-2xl text-blue-900">Live Bookings</h3>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400 text-center">
            <tr>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Service Details</th>
              <th className="px-8 py-4">Scheduled For</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50">
                <td className="px-8 py-6">
                  <p className="font-bold text-blue-900">
                    {(b.profiles?.full_name || b.customer_name)}
                  </p>
                  <p className="text-xs text-gray-400">{b.profiles?.phone || b.contact_number}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-blue-600">{b.services?.name}</p>
                  <p className="text-sm text-gray-600">{b.address}</p>
                </td>
                <td className="px-8 py-6">
                {/* Assign Staff */}
                  <select
                    value={b.assigned_staff || ""}
                    onChange={(e) => assignStaff(b.id, e.target.value)}
                    className="text-[10px] font-black uppercase tracking-widest bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 transition-all w-full max-w-[150px] cursor-pointer"
                  >
                    <option value="">Assign Staff</option>

                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.full_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-8 py-6">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className={`text-[9px] font-black uppercase tracking-widest rounded-lg px-3 py-1.5 outline-none border cursor-pointer transition-all ${
                        b.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 
                        b.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        b.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                        b.status === 'in_progress' ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-8 py-6 space-y-2">
                  {/* Details Button */}
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="block text-blue-600 font-bold text-xs hover:underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                Booking Details
              </h3>

              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <strong>Service:</strong>{" "}
                  {selectedBooking.services?.name || "Unknown Service"}
                  {selectedBooking.services?.description ? (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedBooking.services.description}
                    </p>
                  ) : null}
                </div>
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedBooking.profiles?.full_name || "Not Registered"}
                </p>

                <p>
                  <strong>Name:</strong> {selectedBooking.customer_name}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedBooking.contact_number}
                </p>
                <p>
                  <strong>Email:</strong> {selectedBooking.customer_email}
                </p>
                <p>
                  <strong>Notes:</strong> {selectedBooking.notes || "—"}
                </p>
                <p>
                  <strong>Address:</strong> {selectedBooking.address}
                </p>

                <p>
                  <strong>Scheduled Date:</strong>{" "}
                  {new Date(selectedBooking.scheduled_at).toLocaleString()}
                </p>

                <p>
                  <strong>Total Amount:</strong> PKR{" "}
                  {selectedBooking.total_amount}
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
