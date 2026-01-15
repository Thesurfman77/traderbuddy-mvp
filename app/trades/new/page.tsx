"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { tradeStore } from "@/lib/store";

export default function NewTradePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    instrument: "",
    direction: "Long" as "Long" | "Short",
    entryPrice: "",
    stopPrice: "",
    takeProfitPrice: "",
    quantity: "",
    entryTime: "",
    exitTime: "",
    notes: "",
    exitPrice: "",
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.instrument.trim()) {
      newErrors.instrument = "Instrument is required";
    }

    if (formData.direction !== "Long" && formData.direction !== "Short") {
      newErrors.direction = "Direction must be Long or Short";
    }

    const entryPrice = parseFloat(formData.entryPrice);
    if (isNaN(entryPrice) || entryPrice <= 0) {
      newErrors.entryPrice = "Entry price must be a valid positive number";
    }

    const stopPrice = parseFloat(formData.stopPrice);
    if (isNaN(stopPrice) || stopPrice <= 0) {
      newErrors.stopPrice = "Stop price must be a valid positive number";
    }

    const takeProfitPrice = parseFloat(formData.takeProfitPrice);
    if (isNaN(takeProfitPrice) || takeProfitPrice <= 0) {
      newErrors.takeProfitPrice = "Take profit price must be a valid positive number";
    }

    const quantity = parseFloat(formData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = "Quantity must be a valid positive number";
    }

    if (!formData.entryTime) {
      newErrors.entryTime = "Entry time is required";
    }

    if (!formData.exitTime) {
      newErrors.exitTime = "Exit time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const exitPrice = formData.exitPrice ? parseFloat(formData.exitPrice) : undefined;

      tradeStore.addTrade({
        instrument: formData.instrument.trim(),
        direction: formData.direction,
        entryPrice: parseFloat(formData.entryPrice),
        stopPrice: parseFloat(formData.stopPrice),
        takeProfitPrice: parseFloat(formData.takeProfitPrice),
        quantity: parseFloat(formData.quantity),
        entryTime: formData.entryTime,
        exitTime: formData.exitTime,
        notes: formData.notes.trim(),
        exitPrice,
      });

      // Route back to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding trade:", error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">New Trade</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-2">
                  Instrument *
                </label>
                <input
                  type="text"
                  id="instrument"
                  name="instrument"
                  value={formData.instrument}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.instrument ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., EUR/USD"
                />
                {errors.instrument && (
                  <p className="mt-1 text-sm text-red-600">{errors.instrument}</p>
                )}
              </div>

              <div>
                <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-2">
                  Direction *
                </label>
                <select
                  id="direction"
                  name="direction"
                  value={formData.direction}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.direction ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="Long">Long</option>
                  <option value="Short">Short</option>
                </select>
                {errors.direction && (
                  <p className="mt-1 text-sm text-red-600">{errors.direction}</p>
                )}
              </div>

              <div>
                <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Price *
                </label>
                <input
                  type="number"
                  id="entryPrice"
                  name="entryPrice"
                  step="any"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.entryPrice ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1.0850"
                />
                {errors.entryPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.entryPrice}</p>
                )}
              </div>

              <div>
                <label htmlFor="stopPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Stop Price *
                </label>
                <input
                  type="number"
                  id="stopPrice"
                  name="stopPrice"
                  step="any"
                  value={formData.stopPrice}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.stopPrice ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1.0820"
                />
                {errors.stopPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.stopPrice}</p>
                )}
              </div>

              <div>
                <label htmlFor="takeProfitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Take Profit Price *
                </label>
                <input
                  type="number"
                  id="takeProfitPrice"
                  name="takeProfitPrice"
                  step="any"
                  value={formData.takeProfitPrice}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.takeProfitPrice ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1.0920"
                />
                {errors.takeProfitPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.takeProfitPrice}</p>
                )}
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  step="any"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label htmlFor="entryTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Entry Time *
                </label>
                <input
                  type="datetime-local"
                  id="entryTime"
                  name="entryTime"
                  value={formData.entryTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.entryTime ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.entryTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.entryTime}</p>
                )}
              </div>

              <div>
                <label htmlFor="exitTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Exit Time *
                </label>
                <input
                  type="datetime-local"
                  id="exitTime"
                  name="exitTime"
                  value={formData.exitTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.exitTime ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.exitTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.exitTime}</p>
                )}
              </div>

              <div>
                <label htmlFor="exitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Exit Price (optional)
                </label>
                <input
                  type="number"
                  id="exitPrice"
                  name="exitPrice"
                  step="any"
                  value={formData.exitPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="1.0900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Trade notes, observations, etc."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Trade"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
