export default function LogToolbar({
  total, ttlDays, ttlInput, setTtlInput, savingTtl, handleSaveTtl,
  loggingEnabled, togglingLog, handleToggleLogging, fireTestLog,
  deleting, handleClearOld, handleClearAll, migrating, handleMigrate, filters, setFilters, fetchLogs,
}) {
  const testCases = [
    { level: "error", category: "api", statusCode: 500, label: "API 500", style: "text-red-600 border-red-200 hover:bg-red-50" },
    { level: "error", category: "database", statusCode: 503, label: "DB 503", style: "text-purple-600 border-purple-200 hover:bg-purple-50" },
    { level: "warn", category: "auth", statusCode: 403, label: "Auth 403", style: "text-orange-600 border-orange-200 hover:bg-orange-50" },
    { level: "error", category: "storage", statusCode: 502, label: "CDN 502", style: "text-sky-600 border-sky-200 hover:bg-sky-50" },
    { level: "error", category: "infra", statusCode: 503, label: "Infra 503", style: "text-indigo-600 border-indigo-200 hover:bg-indigo-50" },
    { level: "info", category: "client", statusCode: null, label: "Client", style: "text-pink-600 border-pink-200 hover:bg-pink-50" },
  ];

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-950">Error Logs</h2>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {total} total log entries · auto-purged after {ttlDays} days
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggleLogging}
            disabled={togglingLog}
            title={loggingEnabled ? "Click to disable logging" : "Click to enable logging"}
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${loggingEnabled ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"}`}
          >
            <span className={`size-2 rounded-full ${togglingLog ? "animate-pulse bg-gray-400" : loggingEnabled ? "bg-green-500" : "bg-red-400"}`} />
            {togglingLog ? "Updating…" : loggingEnabled ? "Logging ON" : "Logging OFF"}
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-gray-400">Test:</span>
            {testCases.map(({ level, category, statusCode, label, style }) => (
              <button key={label} onClick={() => fireTestLog(level, category, statusCode)} className={`rounded-xl border bg-white px-2.5 py-1.5 text-xs font-semibold transition-colors ${style}`}>
                {label}
              </button>
            ))}
          </div>

          <button onClick={() => handleClearOld(30)} disabled={deleting} className="rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50 cursor-pointer">
            {deleting ? "Clearing…" : "Clear > 30 days"}
          </button>
          <button onClick={handleClearAll} disabled={deleting || total === 0} className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50 cursor-pointer">
            {deleting ? "Clearing…" : "Clear All Logs"}
          </button>
          <button onClick={handleMigrate} disabled={migrating} className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-xs text-indigo-600 transition-colors hover:bg-indigo-50 disabled:opacity-50">
            {migrating ? "Tagging…" : "🏷 Tag Existing Logs"}
          </button>

          <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5">
            <span className="whitespace-nowrap text-xs text-gray-400">Auto-purge after</span>
            <input type="number" min={1} max={365} value={ttlInput} onChange={event => setTtlInput(event.target.value)} className="w-14 rounded-lg border border-gray-200 px-1.5 py-1 text-center text-xs focus:border-orange-400 focus:outline-none" />
            <span className="text-xs text-gray-400">days</span>
            <button onClick={handleSaveTtl} disabled={savingTtl || parseInt(ttlInput) === ttlDays} className="rounded-lg border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-500 transition-colors hover:bg-orange-100 disabled:opacity-40">
              {savingTtl ? "…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {!loggingEnabled && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
          <span className="text-lg">🔕</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">Error logging is currently OFF</p>
            <p className="mt-0.5 text-xs text-red-500">No new errors are being recorded. Click <strong>Logging OFF</strong> above to re-enable.</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <select value={filters.level} onChange={event => setFilters(filters => ({ ...filters, level: event.target.value, page: 1 }))} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none">
          <option value="all">All Levels</option><option value="error">Error</option><option value="warn">Warning</option><option value="info">Info</option>
        </select>
        <select value={filters.category} onChange={event => setFilters(filters => ({ ...filters, category: event.target.value, page: 1 }))} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none">
          <option value="all">All Categories</option><option value="api">API</option><option value="database">Database</option><option value="auth">Auth</option><option value="storage">Storage</option><option value="infra">Infra</option><option value="performance">Performance</option><option value="client">Client</option>
        </select>
        <select value={filters.statusCode} onChange={event => setFilters(filters => ({ ...filters, statusCode: event.target.value, page: 1 }))} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-orange-400 focus:outline-none">
          <option value="all">All Status Codes</option><option value="4xx">4xx Client Errors</option><option value="5xx">5xx Server Errors</option><option value="400">400 Bad Request</option><option value="401">401 Unauthorized</option><option value="403">403 Forbidden</option><option value="404">404 Not Found</option><option value="500">500 Internal Error</option><option value="502">502 Bad Gateway</option><option value="503">503 Service Unavailable</option>
        </select>
        <input type="text" placeholder="Filter by route…" value={filters.route} onChange={event => setFilters(filters => ({ ...filters, route: event.target.value, page: 1 }))} className="w-56 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:outline-none" />
        <button onClick={fetchLogs} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 transition-colors hover:border-orange-400">Refresh</button>
      </div>
    </>
  );
}
