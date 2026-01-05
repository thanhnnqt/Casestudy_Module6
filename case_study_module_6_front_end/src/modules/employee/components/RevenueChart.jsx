import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import * as XLSX from "xlsx";

import {
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    ResponsiveContainer
} from "recharts";
import { getCompareReport } from "../service/employeeService";

const COLORS = ["#005eff", "#ff4d4f", "#00c49f", "#ff7300", "#aa00ff"];

const RevenueChart = () => {

    const params = new URLSearchParams(useLocation().search);

    const chartType = params.get("chart");
    const reportType = params.get("type");
    const start = params.get("start");
    const end = params.get("end");
    const compareStart = params.get("compareStart");
    const compareEnd = params.get("compareEnd");

    const hasCompare = !!(compareStart && compareEnd);

    const [labels, setLabels] = useState([]);
    const [mainData, setMainData] = useState([]);
    const [compareData, setCompareData] = useState([]);
    const [unit, setUnit] = useState("VND");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const handleExportExcel = () => {
        if (!labels.length) return;

        const unitLabel =
            reportType === "Hiệu suất nhân viên" ? "Vé" : "VND";

        const rows = labels.map((label, i) => {
            const row = {
                "Tên": label,
                "Kỳ chính": mainData[i]
            };

            if (hasCompare) {
                row["Kỳ so sánh"] = compareData[i] ?? 0;
            }

            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(rows);

        // Thêm metadata (header trên cùng)
        XLSX.utils.sheet_add_aoa(
            worksheet,
            [
                [`BÁO CÁO: ${reportType.toUpperCase()}`],
                [`Kỳ chính: ${start} → ${end}`],
                hasCompare ? [`So sánh: ${compareStart} → ${compareEnd}`] : [],
                [`Đơn vị: ${unitLabel}`],
                []
            ],
            { origin: "A1" }
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const fileName =
            `bao_cao_${reportType.replace(/\s/g, "_")}_${start}_${end}.xlsx`;

        XLSX.writeFile(workbook, fileName);
    };

    const yAxisWidth =
        reportType === "Doanh thu" || unit === "VND"
            ? 100
            : 100;


    const fetchData = async () => {
        setLoading(true);
        try {
            const typeParam =
                reportType === "Doanh thu" ? "revenue" :
                    reportType === "Hiệu suất nhân viên" ? "employee" : "airline";

            const res = await getCompareReport(
                typeParam,
                start,
                end,
                hasCompare ? compareStart : null,
                hasCompare ? compareEnd : null
            );

            if (res.message) {
                setMessage(res.message);
                return;
            }

            setLabels(res.labels);
            setMainData(res.main);
            setCompareData(res.compare || []);
            setUnit(res.unit);

        } catch {
            setMessage("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatValue = (v) => {
        if (reportType === "Hiệu suất nhân viên") return `${v} vé`;
        return `${v.toLocaleString()} ₫`;
    };

    const renderChart = () => {
        const data = labels.map((l, i) => ({
            label: l,
            main: mainData[i],
            ...(hasCompare && { compare: compareData[i] })
        }));

        if (chartType.includes("tròn")) {
            const total = mainData.reduce((t, v) => t + v, 0);
            const pieData = labels.map((l, i) => ({
                name: l,
                value: mainData[i],
                percent: ((mainData[i] / total) * 100).toFixed(1)
            }));

            return (
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name"
                             label={({ name, value, percent }) =>
                                 `${name}: ${value} (${percent}%)`
                             }>
                            {pieData.map((_, i) =>
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            );
        }

        if (chartType.includes("đường")) {
            return (
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="4 4" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip formatter={formatValue} />
                        <Legend />
                        <Line dataKey="main" name="Kỳ chính" stroke="#005eff" strokeWidth={3} />
                        {hasCompare &&
                            <Line dataKey="compare" name="Kỳ so sánh" stroke="#ff4d4f" strokeWidth={3} />}
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        return (
            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="label" />
                    <YAxis
                        width={yAxisWidth}
                        allowDecimals={false}
                        tickFormatter={(v) =>
                            reportType === "Hiệu suất nhân viên"
                                ? v
                                : v.toLocaleString()
                        }
                    />
                    <Tooltip formatter={formatValue} />
                    <Legend />
                    <Bar dataKey="main" name="Kỳ chính" fill="#005eff" />
                    {hasCompare &&
                        <Bar dataKey="compare" name="Kỳ so sánh" fill="#ff4d4f" />}
                </BarChart>
            </ResponsiveContainer>

        );
    };

    return (
        <div className="container py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-primary">{reportType}</h5>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-success btn-sm"
                        onClick={handleExportExcel}
                        disabled={!labels.length}
                    >
                        Xuất Excel
                    </button>
                    <Link to="/report" className="btn btn-secondary btn-sm">
                        Quay lại
                    </Link>
                </div>
            </div>


            <p className="small">Kỳ chính: {start} → {end}</p>
            {hasCompare && <p className="small">So sánh: {compareStart} → {compareEnd}</p>}

            {loading ? "Đang tải..." : message ? message : renderChart()}
        </div>
    );
};

export default RevenueChart;
