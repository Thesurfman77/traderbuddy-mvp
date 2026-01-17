"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { tradeStore, Trade } from "@/lib/store";

interface AIReview {
  grade?: "A" | "B" | "C" | "D" | "F";
  summary?: string;
  strengths?: string[];
  mistakes?: string[];
  rule_violations?: string[];
  invalidation_triggers?: string[];
  next_actions?: string[];
  risk_flags?: string[];
}

export default function TradeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tradeId = params.id as string;

  const [trade, setTrade] = useState<Trade | null>(null);
  const [aiReview, setAiReview] = useState<AIReview | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const foundTrade = tradeStore.getTradeById(tradeId);
    if (!foundTrade) {
      router.push("/dashboard");
      return;
    }
    setTrade(foundTrade);

    // Load saved AI review if it exists
    if ((foundTrade as any).ai_review) {
      setAiReview((foundTrade as any).ai_review);
    }
  }, [tradeId, router]);

  const generateAIReview = async () => {
    if (!trade) return;

    setIsLoadingReview(true);
    setReviewError(null);

    try {
      const response = await fetch("/api/analyze-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trade),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate AI review");
      }

      const data = await response.json();
      setAiReview(data);

      // Auto-save review onto trade
      const updatedTrade = { ...trade, ai_review: data } as any;

      if (typeof (tradeStore as any).updateTrade === "function") {
        (tradeStore as any).updateTrade(tradeId, updatedTrade);
      } else if (typeof (tradeStore as any).saveTrade === "function") {
        (tradeStore as any).saveTrade(updatedTrade);
      }

      setTrade(updatedTrade);
    } catch (err: any) {
      setReviewError(err.message || "Error generating AI review");
    } finally {
      setIsLoadingReview(false);
    }
  };

  const clearSavedReview = () => {
    if (!trade) return;

    setAiReview(null);
    setReviewError(null);

    // Clear saved review so old (no-grade) review won't come back
    const updatedTrade = { ...(trade as any) };
    delete updatedTrade.ai_review;

    if (typeof (tradeStore as any).updateTrade === "function") {
      (tradeStore as any).updateTrade(tradeId, updatedTrade);
    } else if (typeof (tradeStore as any).saveTrade === "function") {
      (tradeStore as any).saveTrade(updatedTrade);
    }

    setTrade(updatedTrade);
  };

  if (!trade) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="text-indigo-600 hover:text-indigo-800 font-medium mb-4"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Trade Details</h1>

        {/* AI REVIEW */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">AI Review</h2>
            {!aiReview && (
              <button
                onClick={generateAIReview}
                disabled={isLoadingReview}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoadingReview ? "Analyzing..." : "Generate AI Review"}
              </button>
            )}
          </div>

          {reviewError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded mb-6 text-red-700">
              {reviewError}
            </div>
          )}

          {!aiReview && !isLoadingReview && !reviewError && (
            <div className="py-6 text-center text-gray-600">
              Click <b>Generate AI Review</b> to analyze this trade.
            </div>
          )}

          {aiReview && (
            <div className="space-y-6">
              {/* BIG GRADE */}
              {aiReview.grade && (
                <div className="flex items-center gap-4">
                  <div
                    className={`text-5xl font-bold px-6 py-3 rounded-lg ${
                      aiReview.grade === "A"
                        ? "bg-green-100 text-green-800"
                        : aiReview.grade === "B"
                        ? "bg-blue-100 text-blue-800"
                        : aiReview.grade === "C"
                        ? "bg-yellow-100 text-yellow-800"
                        : aiReview.grade === "D"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {aiReview.grade}
                  </div>
                  <div className="text-gray-600">
                    <p className="font-medium">Trade Quality Grade</p>
                    <p className="text-sm">Based on process & risk discipline (not PnL)</p>
                  </div>
                </div>
              )}

              {aiReview.summary && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Summary</h3>
                  <p className="text-gray-700">{aiReview.summary}</p>
                </div>
              )}

              {aiReview.strengths?.length ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Strengths</h3>
                  <ul className="list-disc list-inside">
                    {aiReview.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {aiReview.mistakes?.length ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-yellow-700">Mistakes</h3>
                  <ul className="list-disc list-inside">
                    {aiReview.mistakes.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {aiReview.rule_violations?.length ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-orange-700">
                    Rule Violations
                  </h3>
                  <ul className="list-disc list-inside">
                    {aiReview.rule_violations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {aiReview.invalidation_triggers?.length ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-purple-700">
                    Trade Invalidation Triggers
                  </h3>
                  <ul className="list-disc list-inside">
                    {aiReview.invalidation_triggers.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {aiReview.next_actions?.length ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">Next Actions</h3>
                  <ul className="list-disc list-inside">
                    {aiReview.next_actions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {aiReview.risk_flags?.length ? (
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-red-700">Risk Flags</h3>
                  <ul className="list-disc list-inside">
                    {aiReview.risk_flags.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <button
                onClick={clearSavedReview}
                className="text-indigo-600 text-sm font-medium"
              >
                Generate New Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
