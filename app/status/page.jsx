import StatusDashboard from "@/components/status/StatusDashboard";

export const metadata = {
  title: "Website Status | QuickCart",
  description: "Live operational status for QuickCart services.",
};

export default function StatusPage() {
  return <StatusDashboard />;
}
