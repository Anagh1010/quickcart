'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MerchantDashboard = () => {
    const { getToken, user, currency } = useAppContext();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get("/api/seller/analytics", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setAnalytics(data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAnalytics();
        }
    }, [user]);

    if (loading || !analytics) return <Loading />;

    const { totalRevenue, totalOrdersCount, totalProductsCount, categoryData, timelineData } = analytics;

    // 📈 Calculate SVG Coordinates for Revenue Line Chart
    const chartWidth = 500;
    const chartHeight = 200;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const usableWidth = chartWidth - paddingLeft - paddingRight;
    const usableHeight = chartHeight - paddingTop - paddingBottom;

    const maxRevenue = timelineData.length > 0 ? Math.max(...timelineData.map(d => d.revenue), 100) : 100;

    const points = timelineData.map((d, i) => {
        const x = timelineData.length > 1 
            ? paddingLeft + (i / (timelineData.length - 1)) * usableWidth 
            : paddingLeft + usableWidth / 2;
        const y = chartHeight - paddingBottom - (d.revenue / maxRevenue) * usableHeight;
        return { x, y, date: d.date, val: d.revenue };
    });

    const pathData = points.length > 0 
        ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
        : "";

    const areaData = points.length > 0
        ? `${pathData} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`
        : "";

    // Calculate total category share sales for percentage bar chart
    const totalCategorySales = categoryData.reduce((acc, c) => acc + c.value, 0) || 1;

    return (
        <div className="min-h-screen flex-1 bg-canvas text-dark-surface">
            <div className="mx-auto w-full max-w-7xl space-y-8 p-4 md:p-10">
                {/* Header Section */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Seller center</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-dark-surface">Business overview</h2>
                    <p className="mt-2 text-sm font-medium text-stone-500">Revenue, orders, products, and category performance.</p>
                </div>

                {/* 📊 KPI Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Revenue Card */}
                    <div className="flex flex-col justify-between rounded-2xl border border-dark-surface bg-dark-surface p-6 shadow-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Sales Revenue</span>
                        <div className="flex items-baseline gap-1.5 mt-3">
                            <span className="text-3xl font-extrabold text-[#f5c344]">{currency}{totalRevenue.toLocaleString()}</span>
                            <span className="rounded-full bg-emerald-900/50 px-2 py-1 text-[10px] font-bold text-emerald-300">Paid & confirmed</span>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xs flex flex-col justify-between">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Fulfillment Orders</span>
                        <div className="flex items-baseline gap-1.5 mt-3">
                            <span className="text-3xl font-extrabold text-dark-surface">{totalOrdersCount}</span>
                            <span className="text-xs text-stone-400 font-medium">Transactions</span>
                        </div>
                    </div>

                    {/* Active Products Card */}
                    <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xs flex flex-col justify-between">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Products Listed</span>
                        <div className="flex items-baseline gap-1.5 mt-3">
                            <span className="text-3xl font-extrabold text-dark-surface">{totalProductsCount}</span>
                            <span className="text-xs text-stone-400 font-medium">Active listings</span>
                        </div>
                    </div>
                </div>

                {/* 📈 Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Line Area Chart for Sales Timeline */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-subtle shadow-xs">
                        <h3 className="text-sm font-bold text-stone-900 mb-6 pb-2 border-b border-[#f0eee6] uppercase tracking-wider">Sales Revenue Growth</h3>
                        
                        {timelineData.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-xs text-stone-400 italic">No sales transactions logged yet to plot growth timeline.</div>
                        ) : (
                            <div className="relative w-full">
                                {/* Native SVG Chart with CSS Gradients */}
                                <svg 
                                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                                    className="w-full h-auto overflow-visible select-none"
                                >
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#e6b02e" stopOpacity="0.25"/>
                                            <stop offset="100%" stopColor="#e6b02e" stopOpacity="0.00"/>
                                        </linearGradient>
                                    </defs>

                                    {/* Grid Lines */}
                                    <line x1={paddingLeft} y1={paddingTop} x2={chartWidth - paddingRight} y2={paddingTop} stroke="#f0eee6" strokeWidth="1" />
                                    <line x1={paddingLeft} y1={(paddingTop + chartHeight - paddingBottom) / 2} x2={chartWidth - paddingRight} y2={(paddingTop + chartHeight - paddingBottom) / 2} stroke="#f0eee6" strokeWidth="1" />
                                    <line x1={paddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingRight} y2={chartHeight - paddingBottom} stroke="#d2cfc4" strokeWidth="1.5" />

                                    {/* Line Area Path */}
                                    {areaData && <path d={areaData} fill="url(#revGrad)" />}
                                    
                                    {/* Stroke Line */}
                                    {pathData && <path d={pathData} fill="none" stroke="#e6b02e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                                    {/* Axis Dots */}
                                    {points.map((p, index) => (
                                        <g key={index} className="group/dot cursor-pointer">
                                            <circle cx={p.x} cy={p.y} r="4" fill="#e6b02e" stroke="#ffffff" strokeWidth="1.5" />
                                            {/* Hover tooltip values */}
                                            <title>{`${p.date}: ${currency}${p.val}`}</title>
                                        </g>
                                    ))}

                                    {/* Date Axis Labels */}
                                    {points.filter((_, idx) => points.length < 5 || idx % Math.floor(points.length / 3) === 0).map((p, index) => (
                                        <text 
                                            key={index}
                                            x={p.x} 
                                            y={chartHeight - 15} 
                                            textAnchor="middle" 
                                            className="text-[9px] fill-stone-400 font-bold uppercase tracking-wider"
                                        >
                                            {new Date(p.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </text>
                                    ))}

                                    {/* Y-Axis scale label */}
                                    <text x={10} y={paddingTop + 4} className="text-[9px] fill-stone-400 font-bold">{currency}{maxRevenue}</text>
                                    <text x={10} y={chartHeight - paddingBottom} className="text-[9px] fill-stone-400 font-bold">{currency}0</text>
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Sales category share breakdown */}
                    <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-xs">
                        <h3 className="text-sm font-bold text-stone-900 mb-6 pb-2 border-b border-[#f0eee6] uppercase tracking-wider">Category sales share</h3>
                        
                        {categoryData.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-xs text-stone-400 italic">No sales share statistics logged.</div>
                        ) : (
                            <div className="space-y-4">
                                {categoryData.map((c, index) => {
                                    const pct = (c.value / totalCategorySales) * 100;
                                    return (
                                        <div key={index} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-stone-700">{c.name}</span>
                                                <span className="text-amber-800">{currency}{c.value.toLocaleString()} ({pct.toFixed(0)}%)</span>
                                            </div>
                                            <div className="w-full bg-[#f3f1ea] h-2.5 rounded-full overflow-hidden border border-border-subtle/70">
                                                <div 
                                                    className="bg-[#e6b02e] h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MerchantDashboard;
