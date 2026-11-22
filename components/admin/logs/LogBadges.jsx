const levelStyles = {
  error: "bg-red-50 text-red-600 border border-red-200",
  warn: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  info: "bg-blue-50 text-blue-600 border border-blue-200",
};

const categoryStyles = {
  api: "bg-gray-100 text-gray-600",
  database: "bg-purple-100 text-purple-700",
  auth: "bg-orange-100 text-orange-700",
  storage: "bg-sky-100 text-sky-700",
  infra: "bg-indigo-100 text-indigo-700",
  performance: "bg-teal-100 text-teal-700",
  client: "bg-pink-100 text-pink-700",
};

function statusCodeStyle(code) {
  if (!code) return "bg-gray-100 text-gray-400";
  if (code >= 500) return "bg-red-100 text-red-700";
  if (code >= 400) return "bg-orange-100 text-orange-700";
  if (code >= 300) return "bg-yellow-100 text-yellow-700";
  return "bg-green-100 text-green-700";
}

export const LevelBadge = ({ level }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${levelStyles[level] || levelStyles.info}`}>
    {level?.toUpperCase()}
  </span>
);

export const CategoryBadge = ({ category }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-medium ${categoryStyles[category] || "bg-gray-100 text-gray-500"}`}>
    {category}
  </span>
);

export const StatusCodeBadge = ({ code }) => code ? (
  <span className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${statusCodeStyle(code)}`}>
    {code}
  </span>
) : null;
