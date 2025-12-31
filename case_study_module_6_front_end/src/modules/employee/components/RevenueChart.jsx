import React, {useEffect, useState} from "react";
import {useLocation, Link} from "react-router-dom";
import {
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from "recharts";
import {
    getRevenue,
    getSalesPerformance,
    getAirlineRevenue
} from "../service/employeeService.js"; // đúng service

const COLORS = ["#005eff", "#00c49f", "#ff7300", "#ff4d4f", "#aa00ff"];

const RevenueChart = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const chartType = params.get("chart");
    const reportType = params.get("type");
    const start = params.get("start");
    const end = params.get("end");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            let result = [];

            if (reportType === "Doanh thu") {
                result = await getRevenue(start, end);
            } else if (reportType === "Hiệu suất nhân viên") {
                result = await getSalesPerformance(start, end);
            } else if (reportType === "Theo hãng") {
                result = await getAirlineRevenue(start, end);
            }

            if (!Array.isArray(result)) {
                console.error("API không trả về list:", result);
                result = [];
            }

            setData(result);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            setData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getChartComponent = () => {
        if (!data || data.length === 0) return null;

        const labelsKey =
            data[0]?.date ? "date" :
                data[0]?.employeeName ? "employeeName" :
                    "airline";

        switch (chartType) {
            case "Biểu đồ cột":
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="4 4" opacity={0.2}/>
                            <XAxis dataKey={labelsKey}/>
                            <YAxis tickFormatter={(v) => `${v / 1_000_000}M`}/>
                            <Tooltip formatter={(v) => v.toLocaleString() + " ₫"}/>
                            <Bar dataKey="revenue" fill="#005eff" radius={[10, 10, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                );

            case "Biểu đồ tròn":
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="revenue"
                                nameKey={labelsKey}
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                label
                            >
                                {data.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => v.toLocaleString() + " ₫"}/>
                        </PieChart>
                    </ResponsiveContainer>
                );

            case "Biểu đồ đường":
                return (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="5 5"/>
                            <XAxis dataKey={labelsKey}/>
                            <YAxis tickFormatter={(v) => `${v / 1_000_000}M`}/>
                            <Tooltip formatter={(v) => v.toLocaleString() + " ₫"}/>
                            <Legend/>
                            <Line type="monotone" dataKey="revenue" stroke="#005eff" strokeWidth={3}/>
                        </LineChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container py-3">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-primary">{reportType}</h4>
                <Link to="/report" className="btn btn-outline-secondary btn-sm">Quay lại</Link>
            </div>

            <div className="text-muted small mb-2">
                Từ: <strong>{start}</strong> → Đến: <strong>{end}</strong>
            </div>

            {loading ? (
                <div className="text-center py-4">Đang tải dữ liệu...</div>
            ) : data.length === 0 ? (
                <div className="text-center text-danger fw-semibold py-4">
                    Không có dữ liệu thống kê
                </div>
            ) : (
                <>
                    {/* Chart */}
                    <div className="card p-3 mb-4 shadow-sm">
                        {getChartComponent()}
                    </div>

                    {/* Table */}
                    <div className="card p-3 shadow-sm">
                        <h6 className="fw-bold mb-3">Chi tiết dữ liệu</h6>

                        <div className="table-responsive">
                            <table className="table table-bordered table-hover text-center small">
                                <thead className="table-light">
                                <tr>
                                    {data[0].date && <th>Ngày</th>}
                                    {data[0].employeeName && <th>Nhân viên</th>}
                                    {data[0].airline && <th>Hãng</th>}
                                    <th>Doanh thu</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        {item.date && <td>{item.date}</td>}
                                        {item.employeeName && <td>{item.employeeName}</td>}
                                        {item.airline && <td>{item.airline}</td>}
                                        <td className="fw-bold text-success">
                                            {item.revenue?.toLocaleString()} ₫
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RevenueChart;
