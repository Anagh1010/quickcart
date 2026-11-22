import { CategoryBadge, LevelBadge, StatusCodeBadge } from "@/components/admin/logs/LogBadges";

export default function LogResults({ logs, loading, expanded, setExpanded, pages, filters, setFilters }) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="mb-3 text-4xl">✅</p>
            <p>No logs found for current filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map(log => (
              <div key={log._id} className="px-6 py-4 transition-colors hover:bg-gray-50">
                <div className="flex cursor-pointer items-start gap-3" onClick={() => setExpanded(expanded === log._id ? null : log._id)}>
                  <LevelBadge level={log.level} />
                  {log.category && <CategoryBadge category={log.category} />}
                  {log.statusCode && <StatusCodeBadge code={log.statusCode} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">{log.message}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                      {log.route && <span>📍 {log.route}</span>}
                      {log.userId && <span>👤 {log.userId.slice(0, 20)}…</span>}
                      <span>🕒 {new Date(log.createdAt).toLocaleString()}</span>
                      {log.metadata?.latencyMs != null && <span>⏱ {log.metadata.latencyMs}ms</span>}
                      {log.metadata?.metric && <span>📊 {log.metadata.metric} = {log.metadata.value}</span>}
                    </div>
                  </div>
                  <span className="mt-1 text-xs text-gray-400">{expanded === log._id ? "▲" : "▼"}</span>
                </div>
                {expanded === log._id && (
                  <div className="mt-3 space-y-2">
                    {log.stack && <pre className="max-h-64 overflow-x-auto overflow-y-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-red-500">{log.stack}</pre>}
                    {log.metadata && Object.keys(log.metadata).length > 0 && <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-indigo-100 bg-indigo-50 p-3 font-mono text-xs text-indigo-700">{JSON.stringify(log.metadata, null, 2)}</pre>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={filters.page <= 1} onClick={() => setFilters(filters => ({ ...filters, page: filters.page - 1 }))} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-orange-400 disabled:opacity-40">← Prev</button>
          <span className="px-4 py-2 text-sm text-gray-500">Page {filters.page} of {pages}</span>
          <button disabled={filters.page >= pages} onClick={() => setFilters(filters => ({ ...filters, page: filters.page + 1 }))} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-colors hover:border-orange-400 disabled:opacity-40">Next →</button>
        </div>
      )}
    </>
  );
}
