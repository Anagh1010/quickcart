'use client'
import React, { useEffect, useRef, useState } from "react";

const TEST_CASES = [
  { level: "error", category: "api", statusCode: 500, label: "API 500", dot: "bg-rose-500" },
  { level: "error", category: "database", statusCode: 503, label: "DB 503", dot: "bg-purple-500" },
  { level: "warn", category: "auth", statusCode: 403, label: "Auth 403", dot: "bg-amber-500" },
  { level: "error", category: "storage", statusCode: 502, label: "CDN 502", dot: "bg-sky-500" },
  { level: "error", category: "infra", statusCode: 503, label: "Infra 503", dot: "bg-indigo-500" },
  { level: "info", category: "client", statusCode: null, label: "Client Info", dot: "bg-pink-500" },
];

export default function LogToolbar({
  total, ttlDays, ttlInput, setTtlInput, savingTtl, handleSaveTtl,
  loggingEnabled, togglingLog, handleToggleLogging, fireTestLog,
  deleting, handleClearOld, handleClearAll, filters, setFilters, fetchLogs,
}) {
  const [simOpen, setSimOpen] = useState(false);
  const simRef = useRef(null);

  useEffect(() => {
    if (!simOpen) return;
    const onOutside = (e) => {
      if (simRef.current && !simRef.current.contains(e.target)) setSimOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [simOpen]);

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-950">Error Logs</h2>
          <p className="mt-1 text-xs font-medium text-stone-500">
            {total.toLocaleString()} total log entries · auto-purged after {ttlDays} days
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggleLogging}
            disabled={togglingLog}
            title={loggingEnabled ? "Click to disable logging" : "Click to enable logging"}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
              loggingEnabled
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            <span className={`size-2 rounded-full ${togglingLog ? "animate-pulse bg-stone-400" : loggingEnabled ? "bg-emerald-500" : "bg-rose-500"}`} />
            {togglingLog ? "Updating…" : loggingEnabled ? "Logging ON" : "Logging OFF"}
          </button>

          {/* Collapsible Simulate Error dropdown */}
          <div className="relative" ref={simRef}>
            <button
              type="button"
              onClick={() => setSimOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-[#e6e4dc] bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50 shadow-2xs"
            >
              <span>Simulate Error</span>
              <svg className={`size-3.5 text-stone-400 transition-transform ${simOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {simOpen && (
              <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-xl border border-[#e6e4dc] bg-white p-1.5 shadow-lg">
                {TEST_CASES.map(({ level, category, statusCode, label, dot }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setSimOpen(false);
                      fireTestLog(level, category, statusCode);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    <span className={`size-2 rounded-full ${dot}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleClearOld(30)}
            disabled={deleting}
            className="rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50 shadow-2xs"
          >
            {deleting ? "Clearing…" : "Clear > 30 days"}
          </button>

          <button
            onClick={handleClearAll}
            disabled={deleting || total === 0}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50 shadow-2xs"
          >
            {deleting ? "Clearing…" : "Clear All Error Logs"}
          </button>

          <div className="flex items-center gap-1.5 rounded-xl border border-[#e6e4dc] bg-white px-3 py-1.5 shadow-2xs">
            <span className="whitespace-nowrap text-xs text-stone-500">Auto-purge</span>
            <input
              type="number"
              min={1}
              max={365}
              value={ttlInput}
              onChange={(event) => setTtlInput(event.target.value)}
              className="w-14 rounded-lg border border-[#e6e4dc] px-1.5 py-0.5 text-center text-xs text-stone-900 focus:border-amber-500 focus:outline-none"
            />
            <span className="text-xs text-stone-500">d</span>
            <button
              onClick={handleSaveTtl}
              disabled={savingTtl || parseInt(ttlInput) === ttlDays}
              className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-40"
            >
              {savingTtl ? "…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {!loggingEnabled && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3">
          <svg className="size-5 shrink-0 text-rose-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-800">Error logging is currently OFF</p>
            <p className="mt-0.5 text-xs text-rose-600">No new errors are being recorded. Click <strong>Logging OFF</strong> above to re-enable.</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5">
        <select value={filters.level} onChange={(e) => setFilters((f) => ({ ...f, level: e.target.value, page: 1 }))} className="rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-medium text-stone-700 focus:border-amber-500 focus:outline-none">
          <option value="all">All Levels</option><option value="error">Error</option><option value="warn">Warning</option><option value="info">Info</option>
        </select>
        <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))} className="rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-medium text-stone-700 focus:border-amber-500 focus:outline-none">
          <option value="all">All Categories</option><option value="api">API</option><option value="database">Database</option><option value="auth">Auth</option><option value="storage">Storage</option><option value="infra">Infra</option><option value="performance">Performance</option><option value="client">Client</option>
        </select>
        <select value={filters.statusCode} onChange={(e) => setFilters((f) => ({ ...f, statusCode: e.target.value, page: 1 }))} className="rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-medium text-stone-700 focus:border-amber-500 focus:outline-none">
          <option value="all">All Status Codes</option><option value="4xx">4xx Client Errors</option><option value="5xx">5xx Server Errors</option><option value="400">400 Bad Request</option><option value="401">401 Unauthorized</option><option value="403">403 Forbidden</option><option value="404">404 Not Found</option><option value="500">500 Internal Error</option><option value="502">502 Bad Gateway</option><option value="503">503 Service Unavailable</option>
        </select>
        <input type="text" placeholder="Filter by route…" value={filters.route} onChange={(e) => setFilters((f) => ({ ...f, route: e.target.value, page: 1 }))} className="w-56 rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:outline-none" />
        <button onClick={fetchLogs} className="rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-stone-600 transition-colors hover:border-amber-500">Refresh</button>
      </div>
    </>
  );
}
