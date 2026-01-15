"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { tradeStore, Trade } from "@/lib/store";

export default function TradeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tradeId = params.id as string;
  const [trade, setTrade] = useState<Trade | null>(null);

  useEffect(() => {
    const foundTrade = tradeStore.getTradeById(tradeId);
    if (!foundTrade) {
      // Trade not found, redirect to dashboard
      router.push("/dashboard");
      return;
    }
    setTrade(foundTrade);
  }, [tradeId, router]);

  if (!trade) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPnLColor = (pnl?: number) => {
    if (!pnl) return "text-gray-500";
    return pnl >= 0 ? "text-green-600" : "text-red-600";
  };

  // Mocked AI Review data
  const aiReview = {
    strengths: [
      "Good risk-reward ratio with proper stop loss placement",
      "Entry timing aligned with market structure",
      "Clear trade setup with defined levels",
    ],
    mistakes: [
      "Could have taken partial profits earlier",
      "Stop loss was slightly tight for volatility",
    ],
    nextActions: [
      "Monitor similar setups in the same instrument",
      "Review risk management rules for future trades",
      "Consider scaling in/out strategies",
    ],
    riskFlags: [
      trade.pnl && trade.pnl < 0 ? "Loss-making trade - review strategy" : null,
      trade.rMultiple && trade.rMultiple < 0 ? "Negative R-multiple indicates poor risk management" : null,
    ].filter(Boolean) as string[],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 font-medium mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Trade Details</h1>
        </div>

        {/* Trade Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Instrument</h3>
              <p className="text-lg font-semibold text-gray-900">{trade.instrument}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Direction</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  trade.direction === "Long"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {trade.direction}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Entry Price</h3>
              <p className="text-lg font-semibold text-gray-900">{trade.entryPrice}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Stop Price</h3>
              <p className="text-lg font-semibold text-gray-900">{trade.stopPrice}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Take Profit Price</h3>
              <p className="text-lg font-semibold text-gray-900">{trade.takeProfitPrice}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Exit Price</h3>
              <p className="text-lg font-semibold text-gray-900">
                {trade.exitPrice || "Not closed"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Quantity</h3>
              <p className="text-lg font-semibold text-gray-900">{trade.quantity}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">PnL</h3>
              <p className={`text-lg font-semibold ${getPnLColor(trade.pnl)}`}>
                {trade.pnl !== undefined ? formatCurrency(trade.pnl) : "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">R-Multiple</h3>
              <p className="text-lg font-semibold text-gray-900">
                {trade.rMultiple !== undefined ? trade.rMultiple.toFixed(2) : "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Entry Time</h3>
              <p className="text-sm text-gray-900">{formatDate(trade.entryTime)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Exit Time</h3>
              <p className="text-sm text-gray-900">{formatDate(trade.exitTime)}</p>
            </div>
          </div>

          {trade.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{trade.notes}</p>
            </div>
          )}
        </div>

        {/* AI Review Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Review</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Strengths
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {aiReview.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Mistakes
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {aiReview.mistakes.map((mistake, index) => (
                  <li key={index}>{mistake}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Next Actions
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {aiReview.nextActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>

            {aiReview.riskFlags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Risk Flags
                </h3>
                <ul className="list-disc list-inside space-y-2 text-red-700">
                  {aiReview.riskFlags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              * AI Review is currently mocked. Real AI analysis will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
