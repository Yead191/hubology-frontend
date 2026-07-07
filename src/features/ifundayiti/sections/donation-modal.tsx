"use client";

import React, { useState } from "react";
import { X, Heart, CreditCard, DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import { useIFundAyiti } from "../context/ifundayiti-context";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function IFundAyitiDonationModal() {
  const { showDonModal, setShowDonModal, submitDonation } = useIFundAyiti();
  
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(100);
  
  // Payment card simulation fields
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!showDonModal) return null;

  const presets = [25, 50, 100, 250, 500];

  const handleAmountSelect = (val: number) => {
    setSelectedPreset(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPreset(null);
    setCustomAmount(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const finalAmount = selectedPreset !== null ? selectedPreset : parseFloat(customAmount);

    if (isNaN(finalAmount) || finalAmount <= 0) {
      setErrorMsg("Please select or enter a valid donation amount");
      return;
    }

    if (!donorEmail.trim()) {
      setErrorMsg("Please enter your email address");
      return;
    }

    setLoading(true);

    // Simulate processing payment gate
    setTimeout(() => {
      submitDonation(donorName.trim(), donorEmail.trim(), finalAmount);
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    setDonorName("");
    setDonorEmail("");
    setSelectedPreset(100);
    setCustomAmount("");
    setSuccess(false);
    setShowDonModal(false);
  };

  const activeAmount = selectedPreset !== null ? selectedPreset : parseFloat(customAmount) || 0;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-panel-soft border border-hairline-strong rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4 bg-panel">
          <h3 className="font-display font-bold text-cloud text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-violet-bright fill-violet-bright/10" />
            <span>Support IFundAyiti Fund</span>
          </h3>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full border border-hairline bg-white/3 text-mist hover:text-cloud hover:bg-white/8 outline-none cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          {success ? (
            /* Success confirmation */
            <div className="text-center py-4">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="font-display font-bold text-2xl text-cloud">Thank You for Your Support!</h4>
              <p className="text-sm text-mist max-w-sm mx-auto mt-3 leading-relaxed">
                Your donation of <strong className="text-cloud">{formatPrice(activeAmount)}</strong> has been processed successfully. 100% of these funds are directly committed to the central micro-grant pool to support Haitian builders.
              </p>
              <Button
                onClick={handleClose}
                className="mt-8 w-full bg-violet-bright hover:bg-violet-bright/90 text-white cursor-pointer"
              >
                Close Window
              </Button>
            </div>
          ) : (
            /* Donation Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Presets Grid */}
              <div>
                <span className="block text-cloud text-xs font-semibold uppercase tracking-wider mb-3">
                  Select Donation Amount (USD)
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={`h-11 rounded-xl font-semibold text-xs border transition-all duration-300 cursor-pointer ${
                        selectedPreset === preset
                          ? "bg-violet-bright border-transparent text-white shadow-lg shadow-violet/20"
                          : "bg-ink/40 border-hairline text-mist hover:border-hairline-strong hover:text-cloud"
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="relative mt-3">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-faint text-sm">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter custom amount..."
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="bg-ink/40 border-hairline text-cloud h-11 pl-9 placeholder:text-faint focus:ring-violet/40 focus:border-violet"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="donorName" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                    Your Name (Optional)
                  </Label>
                  <Input
                    id="donorName"
                    placeholder="e.g. Sarah Jenkins"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="bg-ink/40 border-hairline text-cloud h-11 placeholder:text-faint"
                  />
                </div>

                <div>
                  <Label htmlFor="donorEmail" className="text-cloud text-xs font-semibold uppercase tracking-wider mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    required
                    placeholder="e.g. name@domain.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="bg-ink/40 border-hairline text-cloud h-11 placeholder:text-faint"
                  />
                </div>
              </div>

              {/* Mock Credit Card Block */}
              <div className="border border-hairline-strong rounded-2xl p-4 bg-ink/30 space-y-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-faint flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-violet-bright" />
                  Simulated Payment Method
                </span>

                <div>
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="bg-ink/50 border-hairline text-cloud h-10 font-mono text-sm"
                    placeholder="Card Number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="bg-ink/50 border-hairline text-cloud h-10 font-mono text-sm"
                    placeholder="MM/YY"
                  />
                  <Input
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="bg-ink/50 border-hairline text-cloud h-10 font-mono text-sm"
                    placeholder="CVC"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-400 flex items-center gap-1.5">
                  <X className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit triggers */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-violet-bright hover:bg-violet-bright/90 glow-violet text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: "linear-gradient(160deg, #8131f0 30%, #b549ff 80%)"
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing payment...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 fill-white/10" />
                    <span>Donate {activeAmount > 0 ? formatPrice(activeAmount) : ""}</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
