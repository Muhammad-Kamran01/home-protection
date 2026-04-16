import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { supabase } from "../supabase";
import popupImage from "../assets/popup.png";

const membershipTermsImage = popupImage;
const membershipDetailsPdfUrl = "/membership-details.pdf";

interface MembershipFormData {
  fullName: string;
  address: string;
  phoneNumber: string;
  totalAcsInstalled: number | "";
  acTypes: string[];
  paymentMethod: "" | "bank" | "easypaisa";
  agreedToTerms: boolean;
}

const initialFormState: MembershipFormData = {
  fullName: "",
  address: "",
  phoneNumber: "",
  totalAcsInstalled: "",
  acTypes: [],
  paymentMethod: "",
  agreedToTerms: false,
};

const acTypeOptions = ["Split", "Cabinet", "Cassette"];
const paymentMethods = [
  { label: "Bank Account", value: "bank" as const },
  { label: "Easypaisa", value: "easypaisa" as const },
];
const paymentProofBucket = "membership-payment-proofs";

const MembershipOfferModal: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState<MembershipFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const successPopupTimeoutRef = React.useRef<number | null>(null);

  useEffect(() => {
    const shouldShowOnRoute = location.pathname === "/" || location.pathname === "/services";
    if (shouldShowOnRoute) {
      setIsOpen(true);
      setShowDetailedForm(false);
      setShowSuccessPopup(false);
      setSubmitError("");
      setSubmitSuccess("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen && !showDetailedForm && !showSuccessPopup) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, showDetailedForm, showSuccessPopup]);

  const selectedAcTypes = useMemo(() => formData.acTypes.join(", "), [formData.acTypes]);

  const handleCheckboxToggle = (type: string) => {
    setFormData((prev) => {
      const exists = prev.acTypes.includes(type);

      return {
        ...prev,
        acTypes: exists
          ? prev.acTypes.filter((item) => item !== type)
          : [...prev.acTypes, type],
      };
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowDetailedForm(false);
    setShowSuccessPopup(false);
    setSubmitError("");
  };

  const handleOpenDetailedForm = () => {
    setShowDetailedForm(true);
    setFormData(initialFormState);
    setPaymentProofFile(null);
    setSubmitError("");
    setSubmitSuccess("");
  };

  const isMissingColumnError = (message: string) => {
    const normalizedMessage = message.toLowerCase();
    return (
      normalizedMessage.includes("column") &&
      (normalizedMessage.includes("does not exist") || normalizedMessage.includes("schema cache"))
    );
  };

  const handleViewMembershipDetails = () => {
    window.open(membershipDetailsPdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedFullName = formData.fullName.trim();
    const trimmedAddress = formData.address.trim();
    const trimmedPhoneNumber = formData.phoneNumber.trim();

    if (!trimmedFullName || !trimmedAddress || !trimmedPhoneNumber) {
      setSubmitError("Please complete all required fields.");
      return;
    }

    if (typeof formData.totalAcsInstalled !== "number" || formData.totalAcsInstalled < 1) {
      setSubmitError("Please enter a valid number of installed ACs.");
      return;
    }

    if (formData.acTypes.length === 0) {
      setSubmitError("Please select at least one AC type.");
      return;
    }

    if (!formData.paymentMethod) {
      setSubmitError("Please select a payment method.");
      return;
    }

    if (!paymentProofFile) {
      setSubmitError("Please attach payment proof before submitting.");
      return;
    }

    if (!formData.agreedToTerms) {
      setSubmitError("Please agree to the terms and conditions before submitting.");
      return;
    }

    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    const normalizedPhoneForPath = trimmedPhoneNumber.replace(/[^0-9]/g, "") || "user";
    const fileExtension = paymentProofFile.name.includes(".")
      ? paymentProofFile.name.split(".").pop()?.toLowerCase()
      : "file";
    const proofPath = `proofs/${Date.now()}-${normalizedPhoneForPath}.${fileExtension || "file"}`;

    const { error: uploadError } = await supabase.storage
      .from(paymentProofBucket)
      .upload(proofPath, paymentProofFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setSubmitError(uploadError.message || "Could not upload payment proof. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      full_name: trimmedFullName,
      address: trimmedAddress,
      phone_number: trimmedPhoneNumber,
      total_acs_installed: formData.totalAcsInstalled,
      ac_types: selectedAcTypes,
      payment_method: formData.paymentMethod,
      payment_proof_path: proofPath,
      accepted_terms: formData.agreedToTerms,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    let { error } = await supabase.from("membership_registrations").insert([payload]);

    if (error && isMissingColumnError(error.message || "")) {
      const fallbackPayload = {
        full_name: trimmedFullName,
        address: trimmedAddress,
        phone_number: trimmedPhoneNumber,
        total_acs_installed: formData.totalAcsInstalled,
        ac_types: selectedAcTypes,
        accepted_terms: formData.agreedToTerms,
        created_at: new Date().toISOString(),
      };

      const fallbackInsert = await supabase.from("membership_registrations").insert([fallbackPayload]);
      error = fallbackInsert.error;
    }

    if (error) {
      await supabase.storage.from(paymentProofBucket).remove([proofPath]);
      setSubmitError(error.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitSuccess("Registration submitted successfully. Thank you!");
    setFormData(initialFormState);
    setPaymentProofFile(null);
    setIsSubmitting(false);

    setSubmitError("");
    setShowDetailedForm(false);
    setIsOpen(false);
    setShowSuccessPopup(true);

    if (successPopupTimeoutRef.current) {
      window.clearTimeout(successPopupTimeoutRef.current);
    }

    successPopupTimeoutRef.current = window.setTimeout(() => {
      setShowSuccessPopup(false);
      setSubmitSuccess("");
      successPopupTimeoutRef.current = null;
    }, 2200);
  };

  if (!isOpen && !showDetailedForm && !showSuccessPopup) return null;

  if (showSuccessPopup) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/65 p-3 sm:p-5">
        <div className="relative w-[min(92vw,520px)] rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-200 text-center">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 z-10"
            aria-label="Close success popup"
          >
            ×
          </button>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <i className="fas fa-check text-2xl"></i>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-900">Registration Successful</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            {submitSuccess || "Your registration has been submitted successfully."}
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-6 w-full rounded-lg bg-blue-700 text-white py-2.5 text-sm font-black hover:bg-blue-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Image Only Modal
  if (isOpen && !showDetailedForm) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/65 p-3 sm:p-5">
        <div
          className="relative w-[min(90vw,90vh,700px)] h-auto bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="membership-offer-title"
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 z-10"
            aria-label="Close membership offer popup"
          >
            ×
          </button>

          <div className="p-4 sm:p-5 border-b border-gray-200">
            <h2 id="membership-offer-title" className="text-base sm:text-lg font-black text-blue-900 pr-8" style={{textAlign: "center"}}>
              Membership Offer - Package for Free AC Service
            </h2>
          </div>

          <div className="p-4 sm:p-5 flex flex-col items-center gap-4">
            <p className="text-lg font-black text-red-600" style={{textAlign: "center"}}>Limited Time Offer — Only in PKR 1000</p>
            <div className="w-full rounded-xl border border-gray-200 overflow-hidden bg-slate-50">
              <img
                src={membershipTermsImage}
                alt="Membership offer"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>

            <button
              type="button"
              onClick={handleViewMembershipDetails}
              className="w-full rounded-lg border border-blue-700 text-red-700 py-2.5 text-sm font-black hover:bg-blue-50"
            >
              View Complete Details and Conditions
            </button>

            <button
              type="button"
              onClick={handleOpenDetailedForm}
              className="w-full rounded-lg bg-blue-700 text-white py-2.5 text-sm font-black hover:bg-blue-800"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Detailed Form Modal
  if (showDetailedForm) {
    return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/65 p-3 sm:p-5">
      <div
        className="relative w-[min(92vw,92vh,760px)] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="membership-form-title"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 z-10"
          aria-label="Close registration form"
        >
          ×
        </button>

        <div className="p-4 sm:p-5 border-b border-gray-200">
          <h2 id="membership-form-title" className="text-base sm:text-lg font-black text-blue-900 pr-8" style={{textAlign: "center"}}>
            Register for Membership
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Address</label>
              <input
                required
                type="text"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="03XX XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Total number of ACs installed</label>
                <input
                  required
                  min={1}
                  type="number"
                  value={formData.totalAcsInstalled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalAcsInstalled: e.target.value === "" ? "" : Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <p className="block text-xs font-bold text-gray-700 mb-1">AC Type</p>
              <div className="flex flex-wrap gap-3">
                {acTypeOptions.map((type) => (
                  <label key={type} className="inline-flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.acTypes.includes(type)}
                      onChange={() => handleCheckboxToggle(type)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3 sm:p-4 space-y-3">
              <p className="text-xs font-bold text-blue-900">Payment Account Details</p>

              <div className="rounded-md border border-blue-200 bg-white p-3">
                <p className="text-xs font-bold text-gray-800 mb-1">1. Bank Account Details</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">Bank Name:</span> Faysal Bank Limited</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">Account Title:</span> MUHAMMAD SAMIULLAH KHAN</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">Branch:</span> IBB GHAZI CHOWK, LAHORE</p>
                <p className="text-xs text-gray-700 break-all"><span className="font-semibold">IBAN:</span> PK26FAYS3429301000001160</p>
              </div>

              <div className="rounded-md border border-blue-200 bg-white p-3">
                <p className="text-xs font-bold text-gray-800 mb-1">2. Easypaisa Details</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">Service:</span> Easypaisa</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">Account Title:</span> Muhammad Sami Ullah Khan</p>
                <p className="text-xs text-gray-700"><span className="font-semibold">Account No.:</span> 03161455160</p>
              </div>
            </div>

            <div>
              <p className="block text-xs font-bold text-gray-700 mb-1">Payment Method</p>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method) => (
                  <label key={method.value} className="inline-flex items-center gap-2 text-xs text-gray-700">
                    <input
                      required
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: e.target.value as MembershipFormData["paymentMethod"],
                        }))
                      }
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {method.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Payment Proof (Screenshot/Image/PDF)</label>
              <input
                required
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.webp,.gif,.bmp,.tif,.tiff,.heic,image/*,application/pdf"
                onChange={(e) => setPaymentProofFile(e.target.files?.[0] || null)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-blue-100 file:px-3 file:py-1.5 file:font-semibold file:text-blue-800 hover:file:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="mt-1 text-[11px] text-gray-500">Accepted formats include PNG, JPG, JPEG, PDF and other common image types.</p>
            </div>

            <label className="inline-flex items-start gap-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I have read and agree to the{" "}
                <a
                  href="#/terms-of-service"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-700 underline hover:text-blue-800"
                >
                  Terms of Service
                </a>
                ,{" "}
                <a
                  href="#/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-700 underline hover:text-blue-800"
                >
                  Privacy Policy
                </a>
                , and{" "}
                <a
                  href="#/refund-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-700 underline hover:text-blue-800"
                >
                  Refund Policy
                </a>
                .
              </span>
            </label>

            {submitError ? (
              <p className="text-xs font-semibold text-red-600">{submitError}</p>
            ) : null}
            {submitSuccess ? (
              <p className="text-xs font-semibold text-green-700">{submitSuccess}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-700 text-white py-2.5 text-sm font-black hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Register Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
    );
  }

  return null;
};

export default MembershipOfferModal;
