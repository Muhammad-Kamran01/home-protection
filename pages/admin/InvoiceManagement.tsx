import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { supabase } from "../../supabase";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // percentage
}

const InvoiceManagement: React.FC = () => {
  // Customer details
  const [customerName, setCustomerName] = useState("Abcdef Ghijkl");
  const [customerPhone, setCustomerPhone] = useState("0000-0000000");
  const [customerAddress, setCustomerAddress] = useState(
    "House 00, Street 00, Abc Area, DEF, Lahore, Punjab."
  );
  const [customerCnic, setCustomerCnic] = useState("-------------------");

  // Invoice metadata
  const [invoiceNumber, setInvoiceNumber] = useState("10001");
  const [invoiceDate, setInvoiceDate] = useState("19 June 2026");
  const [serviceDate, setServiceDate] = useState("18 June 2026");

  // Invoice line items (defaults to 3 empty/editable rows)
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "AC Deep Cleaning & Gas Refilling", quantity: 1, unitPrice: 3500, taxRate: 16 },
    { description: "Electrical Wiring Inspection", quantity: 1, unitPrice: 1500, taxRate: 16 },
    { description: "", quantity: 0, unitPrice: 0, taxRate: 0 },
    { description: "", quantity: 0, unitPrice: 0, taxRate: 0 },
  ]);

  const [otherTax, setOtherTax] = useState<number>(0);

  // Auto-calculated fields
  const [subTotal, setSubTotal] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  useEffect(() => {
    let tempSubTotal = 0;
    let tempSalesTax = 0;

    items.forEach((item) => {
      const amount = item.quantity * item.unitPrice;
      const tax = amount * (item.taxRate / 100);
      tempSubTotal += amount;
      tempSalesTax += tax;
    });

    setSubTotal(tempSubTotal);
    setSalesTax(tempSalesTax);
    setTotalPayable(tempSubTotal + tempSalesTax + otherTax);
  }, [items, otherTax]);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    if (field === "description") {
      updated[index].description = value;
    } else if (field === "quantity" || field === "unitPrice" || field === "taxRate") {
      updated[index][field] = Number(value) || 0;
    }
    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { description: "", quantity: 0, unitPrice: 0, taxRate: 0 }]);
  };

  const deleteRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    const el = document.getElementById('printable-invoice');
    if (!el) {
      alert('Printable element not found.');
      setIsGenerating(false);
      return;
    }

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const canvas = await html2canvas(el as HTMLElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoiceNumber || Date.now()}.pdf`);
    } catch (err) {
      console.warn('PDF libraries not available or failed, falling back to print()', err);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const saveInvoice = async () => {
    setIsSaving(true);
    try {
      const parseDate = (s: string) => {
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
      };

      const invoice_date = parseDate(invoiceDate);
      const service_date = parseDate(serviceDate);

      const invoicePayload: any = {
        invoice_number: invoiceNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_cnic: customerCnic,
        invoice_date,
        service_date,
        other_tax: otherTax,
        subtotal: subTotal,
        sales_tax: salesTax,
        total_payable: totalPayable,
      };

      const { data: inserted, error } = await supabase.from("invoices").insert([invoicePayload]).select("id").single();
      if (error) throw error;

      const invoiceId = (inserted as any)?.id;

      const itemsToInsert = items
        .filter((it) => it.description || it.quantity > 0 || it.unitPrice > 0)
        .map((it) => ({
          invoice_id: invoiceId,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unitPrice,
          tax_rate: it.taxRate,
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      setIsSaving(false);
      alert("Invoice saved successfully.");
    } catch (err: any) {
      setIsSaving(false);
      console.error(err);
      alert(`Failed to save invoice: ${err?.message || err}`);
    }
  };

  // Ensure table has at least 5 rows for identical visual structure as attachment
  const paddedItems = [...items];
  while (paddedItems.length < 5) {
    paddedItems.push({ description: "", quantity: 0, unitPrice: 0, taxRate: 0 });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dynamic styling for print layout */}
      <style>{`
        @media print {
          /* Hide everything except the invoice sheet */
          body * {
            visibility: hidden;
            background: transparent !important;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Editor Controls & Overview */}
      <div className="no-print bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-black text-2xl text-blue-900 uppercase tracking-tight">Invoice System</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">Generate, customize, and print service invoices with instant calculations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <i className="fas fa-download"></i> {isGenerating ? 'Preparing...' : 'Download'}
            </button>
            <button
              onClick={() => saveInvoice()}
              disabled={isSaving}
              className="bg-green-600 disabled:opacity-60 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-xl shadow-green-100 transition-all flex items-center gap-2"
            >
              <i className="fas fa-save"></i> {isSaving ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
          {/* Customer & Invoice Details Form */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-blue-900 border-b pb-2">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Customer Phone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Customer Address</label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">CNIC / NTN</label>
              <input
                type="text"
                value={customerCnic}
                onChange={(e) => setCustomerCnic(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-blue-900 border-b pb-2">Invoice Meta</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Invoice Date</label>
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Service Date</label>
                <input
                  type="text"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Other Tax amount (PKR)</label>
              <input
                type="number"
                value={otherTax}
                onChange={(e) => setOtherTax(Number(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Items Form Table */}
        <div className="pt-4 border-t border-gray-50 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-blue-900">Line Items & Services</h4>
            <button
              onClick={addRow}
              className="bg-blue-50 text-blue-600 font-bold text-xs px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Add Line Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-400">
                  <th className="py-2 pr-4 w-[45%]">Service Description</th>
                  <th className="py-2 px-4 w-[12%]">Quantity</th>
                  <th className="py-2 px-4 w-[15%]">Unit Price (PKR)</th>
                  <th className="py-2 px-4 w-[13%]">Tax Rate (%)</th>
                  <th className="py-2 px-4 w-[10%]">Amount</th>
                  <th className="py-2 pl-4 w-[5%] text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 pr-4">
                      <input
                        type="text"
                        placeholder="e.g. AC Deep Cleaning"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        min="0"
                        placeholder="1"
                        value={item.quantity || ""}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.unitPrice || ""}
                        onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        min="0"
                        placeholder="16"
                        value={item.taxRate || ""}
                        onChange={(e) => handleItemChange(idx, "taxRate", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-4 text-xs font-bold text-blue-900">
                      PKR {item.quantity * item.unitPrice}
                    </td>
                    <td className="py-2 pl-4 text-right">
                      {items.length > 1 && (
                        <button
                          onClick={() => deleteRow(idx)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 100% Matching Invoice Page Layout */}
      <div className="flex justify-center py-4 bg-gray-200/50 no-print rounded-[2rem]">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">A4 Printed Sheet Preview</p>
          <p className="text-[9px] text-gray-400">This matches the exact design shown in your document.</p>
        </div>
      </div>

      <div className="flex justify-center items-center w-full">
        {/* Printable Invoice Container */}
        <div
          id="printable-invoice"
          className="bg-white w-full max-w-[800px] aspect-[1/1.4] shadow-2xl rounded-[1.5rem] border border-gray-100 p-10 flex flex-col justify-between"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Header Row */}
          <div>
            <div className="relative pb-6">
              <div className="absolute left-0 top-0">
                <img src={logo} alt="Home Protection" className="w-20 h-20 object-contain" />
              </div>

              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-wider text-center">
                SERVICE INVOICE
              </h1>
            </div>

            {/* Billed To and Meta Info columns */}
            <div className="grid grid-cols-2 gap-8 mt-10 pb-8">
              {/* Left Column */}
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Billed To:</h2>
                <div className="text-sm space-y-1.5 text-gray-800 font-medium">
                  <p>
                    <span className="font-extrabold text-gray-950 text-base">Name:</span> {customerName}
                  </p>
                  <p>
                    <span className="font-extrabold text-gray-950 text-base">Phone:</span> {customerPhone}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-extrabold text-gray-950 text-base">Address:</span> {customerAddress}
                  </p>
                  <p>
                    <span className="font-extrabold text-gray-950 text-base">CNIC/NTN:</span> {customerCnic}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col items-end text-right space-y-2">
                <div className="text-sm space-y-1 text-gray-800">
                  <p className="font-bold text-gray-900 text-base">
                    Invoice # <span className="font-black text-gray-950">{invoiceNumber}</span>
                  </p>
                  <p>
                    <span className="font-extrabold text-gray-950">Invoice Date:</span> {invoiceDate}
                  </p>
                  <p>
                    <span className="font-extrabold text-gray-950">Service Date:</span> {serviceDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Table Details: items table and separate totals table */}
            <div className="mt-6">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border border-gray-400 border-collapse">
                  <thead>
                    <tr className="border-b border-gray-400 bg-gray-50/50">
                      <th className="py-2.5 px-4 border-r border-gray-400 font-bold text-[11px] text-gray-900 text-center uppercase tracking-wider w-[60%]">
                        Service Description
                      </th>
                      <th className="py-2.5 px-4 border-r border-gray-400 font-bold text-[11px] text-gray-900 text-center uppercase tracking-wider w-[10%]">
                        Quantity
                      </th>
                      <th className="py-2.5 px-4 border-r border-gray-400 font-bold text-[11px] text-gray-900 text-center uppercase tracking-wider w-[10%]">
                        Unit Price
                      </th>
                      <th className="py-2.5 px-4 border-r border-gray-400 font-bold text-[11px] text-gray-900 text-center uppercase tracking-wider w-[10%]">
                        Tax Rate (%)
                      </th>
                      <th className="py-2.5 px-4 font-bold text-[11px] text-gray-900 text-center uppercase tracking-wider w-[10%]">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paddedItems.map((item, idx) => {
                      const hasData = item.description || item.quantity > 0 || item.unitPrice > 0;
                      return (
                        <tr key={idx} className="border-b border-gray-400 h-8">
                          <td className="py-1 px-4 border-r border-gray-400 text-xs font-medium text-gray-800">
                            {item.description}
                          </td>
                          <td className="py-1 px-4 border-r border-gray-400 text-xs font-semibold text-center text-gray-800">
                            {hasData && item.quantity > 0 ? item.quantity : ""}
                          </td>
                          <td className="py-1 px-4 border-r border-gray-400 text-xs font-semibold text-right text-gray-800">
                            {hasData && item.unitPrice > 0 ? item.unitPrice.toLocaleString() : ""}
                          </td>
                          <td className="py-1 px-4 border-r border-gray-400 text-xs font-semibold text-center text-gray-800">
                            {hasData && item.taxRate > 0 ? `${item.taxRate}%` : ""}
                          </td>
                          <td className="py-1 px-4 text-xs font-bold text-right text-gray-900">
                            {hasData && item.quantity * item.unitPrice > 0
                              ? (item.quantity * item.unitPrice).toLocaleString()
                              : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="w-full flex justify-end mt-4">
                <table className="w-1/3 border border-gray-400 border-collapse text-right">
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border border-gray-400 bg-white text-[10px] uppercase tracking-wider font-extrabold text-gray-900">Sub Total</td>
                      <td className="py-2 px-4 border border-gray-400 text-xs font-bold text-right text-gray-900">{subTotal > 0 ? subTotal.toLocaleString() : ""}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border border-gray-400 bg-white text-[10px] uppercase tracking-wider font-extrabold text-gray-900">Sales Tax</td>
                      <td className="py-2 px-4 border border-gray-400 text-xs font-bold text-right text-gray-900">{salesTax > 0 ? salesTax.toLocaleString() : ""}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border border-gray-400 bg-white text-[10px] uppercase tracking-wider font-extrabold text-gray-900">Other Tax</td>
                      <td className="py-2 px-4 border border-gray-400 text-xs font-bold text-right text-gray-900">{otherTax > 0 ? otherTax.toLocaleString() : ""}</td>
                    </tr>
                    <tr className="bg-gray-50/70">
                      <td className="py-2.5 px-4 border-2 border-gray-400 bg-gray-100/50 text-[11px] uppercase tracking-wider font-black text-gray-950">Total Payable Amount</td>
                      <td className="py-2.5 px-4 border-2 border-gray-400 text-sm font-black text-right text-blue-900">{totalPayable > 0 ? totalPayable.toLocaleString() : ""}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lower Bottom Signature */}
          <div className="mt-12 space-y-12">
            <div className="w-56 text-left">
              <div className="border-t border-gray-400 w-full mb-2"></div>
              <p className="text-sm font-black text-gray-900 tracking-tight">Authorized Signatory</p>
            </div>

            {/* Blue Banner Footer */}
            <div className="bg-[#00a2e8] text-white p-4 rounded-xl text-center space-y-1">
              <p className="text-[10px] font-bold tracking-wider uppercase">Thank you for your service order.</p>
              <p className="text-[8px] opacity-90 font-medium">
                Email: support@homeprotection.pk | Phone: +923161455160 | Address: Town Ship, Lahore, Punjab, Pakistan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;