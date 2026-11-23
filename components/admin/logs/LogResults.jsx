import { CategoryBadge, LevelBadge, StatusCodeBadge } from "@/components/admin/logs/LogBadges";

const MetaItem = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1">
    {icon}
    <span>{children}</span>
  </span>
);

export default function LogResults({ logs, loading, expanded, setExpanded, pages, filters, setFilters }) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-2xs">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-[#f5c344] border-t-transparent" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-stone-500">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-stone-700">No logs found for current filters</p>
            <p className="mt-1 text-xs text-stone-400">Everything looks healthy.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0eee6]">
            {logs.map((log) => (
              <div key={log._id} className="px-6 py-4 transition-colors hover:bg-[#fcfbf7]">
                <div className="flex cursor-pointer items-start gap-3" onClick={() => setExpanded(expanded === log._id ? null : log._id)}>
                  <LevelBadge level={log.level} />
                  {log.category && <CategoryBadge category={log.category} />}
                  {log.statusCode && <StatusCodeBadge code={log.statusCode} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-800">{log.message}</p>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-stone-400">
                      {log.route && (
                        <MetaItem icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}>
                          {log.route}
                        </MetaItem>
                      )}
                      {log.userId && (
                        <MetaItem icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                          {log.userId.slice(0, 20)}…
                        </MetaItem>
                      )}
                      <MetaItem icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                        {new Date(log.createdAt).toLocaleString()}
                      </MetaItem>
                      {log.metadata?.latencyMs != null && (
                        <MetaItem icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
                          {log.metadata.latencyMs}ms
                        </MetaItem>
                      )}
                      {log.metadata?.metric && (
                        <MetaItem icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>
                          {log.metadata.metric} = {log.metadata.value}
                        </MetaItem>
                      )}
                    </div>
                  </div>
                  <svg className={`mt-1 size-4 shrink-0 text-stone-400 transition-transform ${expanded === log._id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {expanded === log._id && (
                  <div className="mt-3 space-y-2">
                    {log.stack && (
                      <pre className="max-h-64 overflow-x-auto overflow-y-auto whitespace-pre-wrap rounded-xl border border-border-subtle bg-surface-subtle p-4 font-mono text-xs text-rose-700">
                        {log.stack}
                      </pre>
                    )}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-stone-200 bg-stone-50 p-3 font-mono text-xs text-stone-700">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            className="rounded-xl border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition-colors hover:border-amber-500 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="px-3 py-2 text-xs font-medium text-stone-500">Page {filters.page} of {pages}</span>
          <button
            disabled={filters.page >= pages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            className="rounded-xl border border-border-subtle bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition-colors hover:border-amber-500 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
