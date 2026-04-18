"use client";
import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import Header from "./Header";
import ReactionDashboardSkeleton from "./ReactionDashboardSkeleton";

// ─── Types ───────────────────────────────────────────────────────────────────

type FatigueLevel = "normal" | "medium" | "high";
type RangeOption = 10 | 20 | "all";

interface SessionData {
  session: number;
  rt: number;
}

interface FatigueConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
  icon: string;
}

interface ReactionColors {
  text: string;
  bg: string;
  badge: string;
}

interface LastSession {
  attempt: number;
  rt: number;
  isPR: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

let ALL_SESSIONS: number[] = [
  302, 278, 315, 291, 263, 334, 258, 299, 277, 312, 285, 268, 321, 244, 307,
  273, 289, 331, 255, 296, 269, 314, 282, 247, 318, 260, 303, 275, 291, 338,
  252, 285, 270, 309, 261, 294, 279, 316, 248, 305,
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getFatigueStatus(data: number[]): FatigueLevel {
  if (data.length < 5) return "normal";
  const recent = data.slice(-5);
  const earlier = data.slice(-10, -5);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.length
    ? earlier.reduce((a, b) => a + b, 0) / earlier.length
    : recentAvg;
  const delta = recentAvg - earlierAvg;
  if (delta > 18) return "high";
  if (delta > 8) return "medium";
  return "normal";
}

const FATIGUE_CONFIG: Record<FatigueLevel, FatigueConfig> = {
  normal: {
    label: "Normal",
    color: "#22c55e",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    icon: "●",
  },
  medium: {
    label: "Moderate",
    color: "#f59e0b",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
    icon: "▲",
  },
  high: {
    label: "High",
    color: "#ef4444",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-400",
    icon: "⚠",
  },
};

function getReactionColor(ms: number): ReactionColors {
  if (ms <= 270)
    return {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-700",
    };
  if (ms <= 300)
    return {
      text: "text-amber-600",
      bg: "bg-amber-50",
      badge: "bg-amber-100 text-amber-700",
    };
  return {
    text: "text-red-500",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
  };
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    const val = payload[0].value as number;
    const c = getReactionColor(val);
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3 text-sm">
        <p className="text-slate-500 font-medium mb-1">Session {label}</p>
        <p className={`text-2xl font-bold ${c.text}`}>
          {val}
          <span className="text-sm font-normal text-slate-400 ml-1">ms</span>
        </p>
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReactionDashboard(): any {
  const [avgRTArray, setAvgRTArray] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showerror, setShowError] = useState<boolean>(false);
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setShowError(false);
      const res = await axios.get("/api/sessions");
      const session = res.data.data;
      console.log(session);
      const reactionTimes = session.map((s: any) => s.avgResponseTime);
      setAvgRTArray(reactionTimes);
    } catch (error: any) {
      console.log("Error" + error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSessions();
  }, []);
  const [range, setRange] = useState<RangeOption>(10);

  const displayData = useMemo<SessionData[]>(() => {
    const slice = range === "all" ? avgRTArray : avgRTArray.slice(-range);
    return slice.map((rt, i) => ({
      session: avgRTArray.length - slice.length + i + 1,
      rt,
    }));
  }, [range, avgRTArray]);

  const avg = useMemo<number>(() => {
  if (!displayData.length) return 0;

  return Math.round(
    displayData.reduce((a, b) => a + b.rt, 0) / displayData.length
  );
}, [displayData]);

  const fatigue = useMemo<FatigueLevel>(
    () => getFatigueStatus(displayData.map((d) => d.rt)),
    [displayData],
  );
  const fc = FATIGUE_CONFIG[fatigue];

  const best = useMemo<number>(() => {
  return avgRTArray.length ? Math.min(...avgRTArray) : 0;
}, [avgRTArray]);
  const bestSession = avgRTArray.indexOf(best) + 1;

  const lastSessions = useMemo<LastSession[]>(
    () =>
      avgRTArray.slice(-7).map((rt, i) => ({
        attempt: avgRTArray.length - 6 + i,
        rt,
        isPR: rt === best,
      })),
    [best],
  );

  const streak = 6;
  const totalAttempts = avgRTArray?.length;

  const yDomain: [number, number] = displayData.length
  ? [
      Math.floor(Math.min(...displayData.map((d) => d.rt)) / 10) * 10 - 10,
      Math.ceil(Math.max(...displayData.map((d) => d.rt)) / 10) * 10 + 10,
    ]
  : [0, 100];

  const RANGE_OPTIONS: RangeOption[] = [10, 20, "all"];
  if (loading) {
  return (
    <div>
      <ReactionDashboardSkeleton/>
    </div>
  );
}
  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <Header />
      <div
        className="min-h-screen bg-slate-50 px-6 pb-6"
        style={{ fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif" }}
      >
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Avg RT */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Avg Reaction
            </p>
            <p className="text-3xl font-bold text-slate-800">
              {avg}
              <span className="text-base font-normal text-slate-400 ml-1">
                ms
              </span>
            </p>
            <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-400 transition-all duration-500"
                style={{
                  width: `${Math.max(0, Math.min(100, ((400 - avg) / 200) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Fatigue */}
          <div
            className={`rounded-2xl p-5 shadow-sm border ${fc.bg} ${fc.border} hover:shadow-md transition-shadow`}
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Fatigue
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{fc.icon}</span>
              <p className={`text-2xl font-bold ${fc.text}`}>{fc.label}</p>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Based on last 10 sessions
            </p>
          </div>

          {/* Total Attempts */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Total Attempts
            </p>
            <p className="text-3xl font-bold text-slate-800">{totalAttempts}</p>
            <p className="text-xs text-slate-400 mt-2">Lifetime sessions</p>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Current Streak
            </p>
            <div className="flex items-end gap-1">
              <p className="text-3xl font-bold text-slate-800">{streak}</p>
              <p className="text-slate-400 text-sm mb-1">days</p>
            </div>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    i < streak ? "bg-violet-400" : "bg-slate-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Reaction Time Trend
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Response latency per session (ms)
                </p>
              </div>

              {/* Range Toggle */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                {RANGE_OPTIONS.map((r) => (
                  <button
                    key={String(r)}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      range === r
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {r === "all" ? "All" : `Last ${r}`}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={displayData}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#f1f5f9"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="session"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Session",
                    position: "insideBottom",
                    offset: -2,
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  domain={yDomain}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}`}
                  label={{
                    value: "ms",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={avg}
                  stroke="#c4b5fd"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                />
                <Line
                  type="monotoneX"
                  dataKey="rt"
                  stroke="url(#lineGrad)"
                  strokeWidth={2.5}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props as {
                      cx: number;
                      cy: number;
                      payload: SessionData;
                    };
                    const dotColor =
                      payload.rt <= 270
                        ? "#22c55e"
                        : payload.rt <= 300
                          ? "#f59e0b"
                          : "#ef4444";
                    return (
                      <circle
                        key={`dot-${payload.session}`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="white"
                        stroke={dotColor}
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    stroke: "#8b5cf6",
                    fill: "white",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-violet-400 rounded inline-block" />
                Average line
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                ≤270ms
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                270–300ms
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                &gt;300ms
              </span>
            </div>
          </div>

          {/* Latest Sessions Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="mb-5">
              <h2 className="text-base font-bold text-slate-800">
                Latest Sessions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Most recent 7 attempts
              </p>
            </div>

            <div className="space-y-2">
              {[...lastSessions].reverse().map((s) => {
                const c = getReactionColor(s.rt);
                return (
                  <div
                    key={s.attempt}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl ${c.bg} border border-transparent hover:border-slate-200 transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-500">
                        {s.attempt}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${c.text}`}>
                          {s.rt} ms
                        </p>
                        <p className="text-xs text-slate-400">
                          Session #{s.attempt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.isPR && (
                        <span className="text-xs font-bold bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full border border-violet-200">
                          PR 🏆
                        </span>
                      )}
                      <span
                        className={`w-2 h-2 rounded-full ${
                          s.rt <= 270
                            ? "bg-emerald-400"
                            : s.rt <= 300
                              ? "bg-amber-400"
                              : "bg-red-400"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PR Card */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between bg-linear-to-r from-violet-50 to-indigo-50 rounded-xl px-4 py-3 border border-violet-100">
                <div>
                  <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide">
                    Personal Record
                  </p>
                  <p className="text-2xl font-bold text-violet-700">
                    {best}
                    <span className="text-sm font-normal text-violet-400 ml-1">
                      ms
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    Session #{bestSession}
                  </p>
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
