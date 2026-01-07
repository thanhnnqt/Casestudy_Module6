import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    ResponsiveContainer
} from "recharts";
import {
    getCompareReport,
    getEmployeePerformance,
    getAirlineRevenue
} from "../service/employeeService";

import "./RevenueChart.css";

const COLORS = ["#005eff", "#ff4d4f", "#00c49f"];
const OTHER_COLOR = "#cccccc";

const RevenueChart = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const reportType = params.get("type");
    const start = params.get("start");
    const end = params.get("end");
    const view = params.get("view");

    const year = new Date(start).getFullYear();
    const month = new Date(start).getMonth() + 1;

    const [barData, setBarData] = useState([]);
    const [pieCharts, setPieCharts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    /* ================= HELPERS ================= */
    const buildTimeLabel = () => {
        if (view === "Tháng") return `Tháng ${month}/${year}`;
        if (view === "Quý") return `Theo Quý năm ${year}`;
        return `Năm ${year}`;
    };

    const buildDaysInMonth = () => {
        const days = new Date(year, month, 0).getDate();
        return Array.from({ length: days }, (_, i) => `Ngày ${i + 1}`);
    };

    const buildMonthsInYear = () =>
        Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

    const buildQuartersInYear = () =>
        ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];

    const normalizeWithOther = (data = []) => {
        const hasOther = data.some(i => i.name === "Khác");
        return hasOther ? data : [...data, { name: "Khác", value: 0 }];
    };

    /* ================= FETCH DATA ================= */
    const fetchData = async () => {
        setLoading(true);
        try {

            /* ===== PIE – NHÂN VIÊN ===== */
            if (reportType === "Hiệu suất nhân viên") {
                const res = await getEmployeePerformance(
                    view === "Tháng" ? "MONTH" : view === "Quý" ? "QUARTER" : "YEAR",
                    start,
                    end,
                    year
                );

                const charts = (Array.isArray(res) ? res : [res]).map(c => ({
                    ...c,
                    data: normalizeWithOther(c.data)
                }));

                setPieCharts(charts);
            }

            /* ===== PIE – HÃNG ===== */
            if (reportType === "Theo hãng") {
                const res = await getAirlineRevenue(
                    view === "Tháng" ? "MONTH" : view === "Quý" ? "QUARTER" : "YEAR",
                    start,
                    end,
                    year
                );
                console.log(res)
                const charts = (Array.isArray(res) ? res : [res]).map(c => ({
                    ...c,
                    data: normalizeWithOther(c.data)
                }));

                setPieCharts(charts);
            }

            /* ===== BAR – DOANH THU ===== */
            if (reportType === "Doanh thu") {
                const res = await getCompareReport(
                    "revenue",
                    view === "Tháng" ? "MONTH" : view === "Quý" ? "QUARTER" : "YEAR",
                    start,
                    end,
                    null,
                    null
                );

                let fullLabels = [];
                if (view === "Tháng") fullLabels = buildDaysInMonth();
                if (view === "Năm") fullLabels = buildMonthsInYear();
                if (view === "Quý") fullLabels = buildQuartersInYear();

                const valueMap = {};
                res.labels.forEach((l, i) => {
                    valueMap[l] = res.main[i];
                });

                setBarData(
                    fullLabels.map(l => ({
                        label: l,
                        value: valueMap[l] || 0
                    }))
                );
            }

            setMessage("");
        } catch (e) {
            console.error(e);
            setMessage("Lỗi tải dữ liệu báo cáo");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [location.search]);

    if (loading) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;
    if (message) return <p className="text-danger text-center mt-5">{message}</p>;

    /* ================= RENDER ================= */
    return (
        <div className="container py-3">
            <div className="card shadow-sm p-3">

                <h5 className="fw-bold text-primary text-center mb-1">
                    {reportType}
                </h5>
                <p className="text-center text-muted small mb-2">
                    {buildTimeLabel()}
                </p>

                {/* ===== PIE ===== */}
                {reportType !== "Doanh thu" && (
                    <div className="row">
                        {pieCharts.map((chart, idx) => (
                            <div key={idx} className="col-md-6 mb-2">
                                <div className="border rounded p-2 h-100">
                                    <h6 className="fw-bold text-center mb-1">
                                        {chart.title}
                                    </h6>

                                    <div className="chart-box">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chart.data}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={80}
                                                    label={({ value, percent }) =>
                                                        value === 0
                                                            ? "0%"
                                                            : `${(percent * 100).toFixed(1)}%`
                                                    }
                                                    labelLine={false}
                                                >
                                                    {chart.data.map((item, i) => (
                                                        <Cell
                                                            key={i}
                                                            fill={
                                                                item.name === "Khác"
                                                                    ? OTHER_COLOR
                                                                    : COLORS[i % COLORS.length]
                                                            }
                                                        />
                                                    ))}
                                                </Pie>

                                                <Tooltip
                                                    formatter={(v, n) =>
                                                        reportType === "Theo hãng"
                                                            ? [`${v.toLocaleString()} ₫`, n]
                                                            : [`${v} vé`, n]
                                                    }
                                                />
                                                <Legend verticalAlign="bottom" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ===== BAR ===== */}
                {reportType === "Doanh thu" && (
                    <div className="chart-box">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 20, right: 20, left: 70, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis width={70} tickFormatter={v => v.toLocaleString()} />
                                <Tooltip formatter={v => `${v.toLocaleString()} ₫`} />
                                <Legend />
                                <Bar dataKey="value" name="Doanh thu" fill="#005eff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="mt-3 text-center">
                    <Link to="/report" className="btn btn-outline-secondary btn-sm">
                        Quay lại
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
