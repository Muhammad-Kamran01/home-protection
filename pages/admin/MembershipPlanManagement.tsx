import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

interface MembershipRegistration {
  id: string;
  full_name: string;
  address: string;
  phone_number: string;
  total_acs_installed: number;
  ac_types: string;
  status?: "pending" | "accepted" | "denied" | "rejected" | string;
  payment_method?: "bank" | "easypaisa" | string;
  payment_proof_path?: string;
  accepted_terms: boolean;
  created_at: string;
}

const paymentProofBucket = "membership-payment-proofs";

const formatPaymentMethod = (method?: string) => {
  if (!method) return "-";
  if (method === "easypaisa") return "Easypaisa";
  if (method === "bank") return "Bank Account";
  return method;
};

const getPaymentProofUrl = (paymentProofPath?: string) => {
  if (!paymentProofPath) return "";

  if (/^https?:\/\//i.test(paymentProofPath)) {
    return paymentProofPath;
  }

  const { data } = supabase.storage.from(paymentProofBucket).getPublicUrl(paymentProofPath);
  return data.publicUrl || "";
};

const getStatusPillClasses = (status?: string) => {
  if (status === "pending") return "bg-amber-100 text-amber-700 border-amber-200";
  if (status === "accepted") return "bg-green-100 text-green-700 border-green-200";
  if (status === "denied") return "bg-red-100 text-red-700 border-red-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const MembershipPlanManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<MembershipRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<MembershipRegistration | null>(null);
  const [tableError, setTableError] = useState("");

  const fetchRegistrations = async () => {
    setLoading(true);
    setTableError("");

    const { data, error } = await supabase
      .from("membership_registrations")
      .select(
        "id, full_name, address, phone_number, total_acs_installed, ac_types, status, payment_method, payment_proof_path, accepted_terms, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      const message = error.message || "Failed to fetch membership registrations.";

      if (message.toLowerCase().includes("status") && message.toLowerCase().includes("column")) {
        const fallback = await supabase
          .from("membership_registrations")
          .select(
            "id, full_name, address, phone_number, total_acs_installed, ac_types, payment_method, payment_proof_path, accepted_terms, created_at"
          )
          .order("created_at", { ascending: false });

        if (fallback.error) {
          console.error("Failed to fetch membership registrations:", fallback.error.message);
          setTableError(fallback.error.message || "Failed to load membership registrations.");
          setRegistrations([]);
        } else {
          setRegistrations(
            ((fallback.data as MembershipRegistration[]) || []).map((item) => ({
              ...item,
              status: item.status || "pending",
            }))
          );
          setTableError("Status column was not found in database; showing default status.");
        }
      } else {
        console.error("Failed to fetch membership registrations:", message);
        setTableError(message);
        setRegistrations([]);
      }
    } else {
      setRegistrations(
        ((data as MembershipRegistration[]) || []).map((item) => ({
          ...item,
          status: item.status || "pending",
        }))
      );
    }

    setLoading(false);
  };

  const updateStatus = async (id: string, status: "pending" | "accepted" | "denied" | "rejected") => {
    setStatusUpdatingId(id);
    setTableError("");

    const { error } = await supabase
      .from("membership_registrations")
      .update({ status })
      .eq("id", id);

    if (error) {
      setTableError(error.message || "Unable to update status.");
      setStatusUpdatingId(null);
      return;
    }

    setRegistrations((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setSelectedRegistration((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    setStatusUpdatingId(null);
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
          <thead className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-400 text-left">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4">Payment Proof</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {registrations.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60">
                <td className="px-6 py-4 text-sm font-bold text-blue-900">{row.full_name || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{row.phone_number || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{formatPaymentMethod(row.payment_method)}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {row.payment_proof_path ? (
                    <a
                      href={getPaymentProofUrl(row.payment_proof_path)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-blue-700 hover:text-blue-800"
                    >
                      View Receipt
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={row.status || "pending"}
                    onChange={(e) =>
                      updateStatus(row.id, e.target.value as "pending" | "accepted" | "denied" | "rejected")
                    }
                    disabled={statusUpdatingId === row.id}
                    className={`text-[10px] font-black uppercase tracking-widest rounded-lg px-3 py-1.5 outline-none border cursor-pointer transition-all ${getStatusPillClasses(
                      row.status
                    )} disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="denied">Denied</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRegistration(row)}
                    className="text-blue-600 font-bold text-xs hover:underline"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tableError ? <p className="px-6 pt-6 text-sm text-red-600">{tableError}</p> : null}

        {loading ? (
          <p className="p-6 text-sm text-gray-400">Loading membership registrations...</p>
        ) : null}

        {!loading && registrations.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No membership registrations found.</p>
        ) : null}
      </div>

      {selectedRegistration ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Membership Details</h3>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Name:</strong> {selectedRegistration.full_name || "-"}</p>
              <p><strong>Phone:</strong> {selectedRegistration.phone_number || "-"}</p>
              <p><strong>Address:</strong> {selectedRegistration.address || "-"}</p>
              <p><strong>Total ACs Installed:</strong> {selectedRegistration.total_acs_installed ?? "-"}</p>
              <p><strong>AC Types:</strong> {selectedRegistration.ac_types || "-"}</p>
              <p><strong>Payment Method:</strong> {formatPaymentMethod(selectedRegistration.payment_method)}</p>
              <p>
                <strong>Payment Proof:</strong>{" "}
                {selectedRegistration.payment_proof_path ? (
                  <a
                    href={getPaymentProofUrl(selectedRegistration.payment_proof_path)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-700 underline hover:text-blue-800"
                  >
                    View Receipt
                  </a>
                ) : (
                  "-"
                )}
              </p>
              <p><strong>Status:</strong> {(selectedRegistration.status || "pending").toUpperCase()}</p>
              <p><strong>Terms Accepted:</strong> {selectedRegistration.accepted_terms ? "Yes" : "No"}</p>
              <p>
                <strong>Submitted:</strong>{" "}
                {selectedRegistration.created_at
                  ? new Date(selectedRegistration.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MembershipPlanManagement;
