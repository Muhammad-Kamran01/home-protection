import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

interface MembershipRegistration {
  id: string;
  full_name: string;
  address: string;
  phone_number: string;
  total_acs_installed: number;
  ac_types: string;
  accepted_terms: boolean;
  created_at: string;
}

const MembershipPlanManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<MembershipRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("membership_registrations")
      .select("id, full_name, address, phone_number, total_acs_installed, ac_types, accepted_terms, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch membership registrations:", error.message);
      setRegistrations([]);
    } else {
      setRegistrations((data as MembershipRegistration[]) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-2xl text-blue-900">Membership Plan Details</h3>
        <button
          type="button"
          onClick={fetchRegistrations}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">AC Count</th>
              <th className="px-6 py-4">AC Types</th>
              <th className="px-6 py-4">Terms</th>
              <th className="px-6 py-4">Submitted</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {registrations.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60">
                <td className="px-6 py-4 text-sm font-bold text-blue-900">{row.full_name || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.phone_number || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-[240px]">{row.address || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.total_acs_installed ?? "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.ac_types || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                      row.accepted_terms
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.accepted_terms ? "Accepted" : "Not Accepted"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {row.created_at ? new Date(row.created_at).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading ? (
          <p className="p-6 text-sm text-gray-400">Loading membership registrations...</p>
        ) : null}

        {!loading && registrations.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No membership registrations found.</p>
        ) : null}
      </div>
    </div>
  );
};

export default MembershipPlanManagement;
