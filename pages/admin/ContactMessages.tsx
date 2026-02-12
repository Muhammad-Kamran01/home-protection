import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
    } else {
      setMessages(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id);

    fetchMessages();
  };

  return (
    <div className="space-y-8">
      <h3 className="font-bold text-2xl text-blue-900">
        Contact Messages
      </h3>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {messages.map((m) => (
              <tr key={m.id}>
                <td className="px-6 py-4 font-bold">
                  {m.name}
                </td>

                <td className="px-6 py-4 text-sm">
                  <p>{m.email}</p>
                  <p className="text-gray-400">{m.phone}</p>
                </td>

                <td className="px-6 py-4 text-sm">
                  {m.category}
                </td>

                <td className="px-6 py-4 text-sm max-w-xs">
                  {m.message}
                </td>

                <td className="px-6 py-4 text-sm">
                  {new Date(m.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <select
                    value={m.status || "unread"}
                    onChange={(e) =>
                      updateStatus(m.id, e.target.value)
                    }
                    className="text-xs bg-gray-100 rounded px-2 py-1"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <p className="p-6 text-sm text-gray-400">
            Loading messages...
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;