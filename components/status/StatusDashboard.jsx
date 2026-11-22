"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import BrandLogo from "@/components/common/BrandLogo";

const REFRESH_INTERVAL_MS = 60_000;

const SERVICE_LABELS = {
  mongo: "Database",
  clerk: "Authentication",
  cloudinary: "Image delivery",
  razorpay: "Payments",
  inngest: "Background jobs",
};

function formatElapsed(checkedAt, now) {
  if (!checkedAt) return "Waiting for first check";
  const seconds = Math.max(0, Math.floor((now - new Date(checkedAt).getTime()) / 1000));
  if (seconds < 60) return `Checked ${seconds} sec${seconds === 1 ? "" : "s"} ago`;
  const minutes = Math.floor(seconds / 60);
  return `Checked ${minutes} min${minutes === 1 ? "" : "s"} ago`;
}

function ServiceRow({ name, service }) {
  const operational = service.status === "operational";
  const checking = service.status === "checking";
  const state = checking ? "Checking" : operational ? "Operational" : "Degraded";
  const detail = name === "website"
    ? operational ? "Pages are being served." : "The latest health check could not be reached."
    : `${operational ? "Responding normally." : "Experiencing an issue."} · ${service.latencyMs} ms`;

  return (
    <li className="flex items-center justify-between gap-5 border-b border-stone-200 px-5 py-4 last:border-b-0 sm:px-7">
      <div>
        <h3 className="text-sm font-semibold text-stone-900">{SERVICE_LABELS[name] || "Website"}</h3>
        <p className="mt-0.5 text-sm text-stone-600">{detail}</p>
      </div>
      <span className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        operational
          ? "bg-emerald-100 text-emerald-800"
          : checking
            ? "bg-stone-100 text-stone-600"
            : "bg-rose-100 text-rose-800"
      }`}>
        <span className={`size-1.5 rounded-full ${operational ? "bg-emerald-600" : checking ? "bg-stone-400" : "bg-rose-600"}`} />
        {state}
      </span>
    </li>
  );
}

function SummaryCard({ label, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 ${className}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">{label}</p>
      {children}
    </section>
  );
}

export default function StatusDashboard() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(Date.now());

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      const data = await response.json();
      setReport(data);
      setError(!response.ok || !data.success);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    const refreshId = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    const clockId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearInterval(refreshId);
      window.clearInterval(clockId);
    };
  }, [refresh]);

  const services = report?.services || {};
  const checks = Object.entries(services);
  const operationalCount = checks.filter(([, service]) => service.status === "operational").length;
  const degraded = error || report?.status === "degraded";
  const checking = !report && !error;
  const overallTitle = checking
    ? "Checking services"
    : error
      ? "Status check unavailable"
      : degraded
        ? "Some services are experiencing issues"
        : "All systems operational";
  const websiteService = { status: error ? "degraded" : checking ? "checking" : "operational" };

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-stone-950">
      <header className="border-b border-stone-200 bg-[#f8f8f5]">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <BrandLogo href="/" />
          <Link href="/all-products" className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
            Shop
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-14 sm:px-8 sm:pt-16">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">QUICKCART STATUS</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Website status</h1>
        <p className="mt-3 text-base text-stone-600 sm:text-lg">Live health of the QuickCart store and checkout services.</p>

        <section className="mt-8 flex items-start gap-4 rounded-3xl border border-stone-200 bg-white p-6 sm:gap-5 sm:p-8" aria-live="polite">
          <span className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${degraded ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
            {degraded ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v5m0 3h.01M10.3 3.9 1.9 18.5A1.7 1.7 0 0 0 3.4 21h17.2a1.7 1.7 0 0 0 1.5-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16.5 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <div className="pt-0.5">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{overallTitle}</h2>
            <p className="mt-1 text-sm text-stone-600 sm:text-base">
              {error
                ? "We could not retrieve the latest service report. Please check back shortly."
                : degraded
                  ? "We are investigating an issue affecting one or more services."
                  : "QuickCart services are running normally."}
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-stone-500 sm:text-sm">
              <span className={`size-2 rounded-full ${degraded ? "bg-rose-600" : "bg-emerald-600"}`} />
              {formatElapsed(report?.checkedAt, now)}
              {report?.checkedAt && ` · ${new Date(report.checkedAt).toLocaleTimeString()}`}
            </p>
          </div>
        </section>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
          <SummaryCard label="QuickCart store" className="border-amber-300 bg-amber-50">
            <h2 className="mt-2 text-xl font-bold">Ready to shop</h2>
            <Link href="/all-products" className="mt-1 inline-block text-sm font-medium text-stone-600 underline decoration-amber-500 underline-offset-4 hover:text-stone-950">
              Browse electronics
            </Link>
          </SummaryCard>
          <SummaryCard label="Services operational">
            <p className="mt-2 text-2xl font-bold">{checking || error ? "—" : `${operationalCount} / ${checks.length}`}</p>
            <p className="mt-1 text-sm text-stone-600">Live service checks</p>
          </SummaryCard>
          <SummaryCard label="Auto refresh">
            <p className="mt-2 text-2xl font-bold">60 sec</p>
            <p className="mt-1 text-sm text-stone-600">Status updates automatically</p>
          </SummaryCard>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">Components</h2>
          <ul className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
            <ServiceRow name="website" service={websiteService} />
            {Object.entries(services).map(([name, service]) => (
              <ServiceRow key={name} name={name} service={service} />
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-stone-500">
            This page refreshes itself every minute. Service checks cover the store database, authentication, image delivery, payments, and background jobs.
          </p>
        </section>
      </main>
    </div>
  );
}
