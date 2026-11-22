import connectDB from "@/config/db";
import { runHealthChecks } from "@/lib/healthCheck";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const checks = await runHealthChecks();
    const services = Object.fromEntries(
      Object.entries(checks).map(([name, check]) => [name, {
        status: check.ok ? "operational" : "degraded",
        latencyMs: check.latencyMs,
      }])
    );
    const healthy = Object.values(checks).every((check) => check.ok);

    return NextResponse.json({
      success: true,
      status: healthy ? "operational" : "degraded",
      checkedAt: new Date().toISOString(),
      services,
    }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[api/status] Health check failed:", error);
    return NextResponse.json({
      success: false,
      status: "unknown",
      checkedAt: new Date().toISOString(),
    }, {
      status: 503,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
}
