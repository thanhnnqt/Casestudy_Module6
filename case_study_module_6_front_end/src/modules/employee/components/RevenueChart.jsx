import React, {useEffect, useState} from "react";
import {useLocation, Link} from "react-router-dom";
import * as XLSX from "xlsx";

import {
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    ResponsiveContainer
} from "recharts";
import {getCompareReport} from "../service/employeeService";

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

        // 1. Xác định ngữ nghĩa tiêu đề cột
        let nameCol = "Tên";
        let mainCol = "Kỳ chính";
        let compareCol = "Kỳ so sánh";
        let unitLabel = "VND";

        if (reportType === "Doanh thu") {
            nameCol = "Hạng mục";
            mainCol = "Doanh thu kỳ chính (VND)";
            compareCol = "Doanh thu kỳ so sánh (VND)";
            unitLabel = "VND";
        } else if (reportType === "Hiệu suất nhân viên") {
            nameCol = "Nhân viên";
            mainCol = "Số vé kỳ chính";
            compareCol = "Số vé kỳ so sánh";
            unitLabel = "Vé";
        } else if (reportType === "Theo hãng") {
            nameCol = "Hãng bay";
            mainCol = "Doanh thu kỳ chính (VND)";
            compareCol = "Doanh thu kỳ so sánh (VND)";
            unitLabel = "VND";
        }

        // 2. Map dữ liệu: Chỉ thêm cột so sánh nếu hasCompare là true
        const rows = labels.map((label, i) => {
            const row = {
                [nameCol]: label,
                [mainCol]: mainData[i]
            };

            // Chỉ thêm thuộc tính này vào object nếu đang ở chế độ so sánh
            if (hasCompare) {
                row[compareCol] = compareData[i] ?? 0;
            }

            return row;
        });

        // 3. Chuẩn bị mảng dữ liệu cho Worksheet (bao gồm cả header mô tả)
        const headerInfo = [
            [`BÁO CÁO: ${reportType.toUpperCase()}`],
            [`Kỳ chính: ${start} → ${end}`],
        ];

        if (hasCompare) {
            headerInfo.push([`So sánh: ${compareStart} → ${compareEnd}`]);
        }

        headerInfo.push([`Đơn vị: ${unitLabel}`], []); // Thêm dòng trống

        // Lấy tiêu đề cột từ object đầu tiên (sẽ tự động có 2 hoặc 3 cột tùy hasCompare)
        const tableHeaders = Object.keys(rows[0]);
        const tableData = rows.map(r => Object.values(r));

        // Kết hợp thông tin chung và bảng dữ liệu
        const finalData = [
            ...headerInfo,
            tableHeaders,
            ...tableData
        ];

        // 4. Tạo sheet và xuất file
        const worksheet = XLSX.utils.aoa_to_sheet(finalData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const fileName = `bao_cao_${reportType.replace(/\s/g, "_")}_${start}_${end}${hasCompare ? '_so_sanh' : ''}.xlsx`;

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
            ...(hasCompare && {compare: compareData[i]})
        }));

        if (chartType.includes("tròn")) {
            const totalMain = mainData.reduce((t, v) => t + v, 0);
            const pieDataMain = labels.map((l, i) => ({
                name: l,
                value: mainData[i],
                percent: ((mainData[i] / totalMain) * 100).toFixed(1)
            }));

            // Nếu có so sánh, tạo thêm tập dữ liệu cho kỳ 2
            let pieDataCompare = [];
            if (hasCompare) {
                const totalCompare = compareData.reduce((t, v) => t + v, 0);
                pieDataCompare = labels.map((l, i) => ({
                    name: l,
                    value: compareData[i],
                    percent: ((compareData[i] / totalCompare) * 100).toFixed(1)
                }));
            }

            return (
                <div className="row w-100">
                    {/* Biểu đồ kỳ chính */}
                    <div className={hasCompare ? "col-md-6" : "col-md-12"}>
                        <p className="text-center fw-bold small">Kỳ chính</p>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieDataMain}
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${percent}%`}
                                >
                                    {pieDataMain.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={formatValue} />
                                {!hasCompare && <Legend />}
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Biểu đồ kỳ so sánh (chỉ hiện khi hasCompare = true) */}
                    {hasCompare && (
                        <div className="col-md-6">
                            <p className="text-center fw-bold small">Kỳ so sánh</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieDataCompare}
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name}: ${percent}%`}
                                    >
                                        {pieDataCompare.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={formatValue} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Legend chung ở dưới nếu là so sánh */}
                    {hasCompare && (
                        <div className="col-12 d-flex justify-content-center mt-2">
                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                {labels.map((l, i) => (
                                    <div key={i} className="small d-flex align-items-center">
                                        <div style={{ width: 12, height: 12, backgroundColor: COLORS[i % COLORS.length], marginRight: 5 }}></div>
                                        {l}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (chartType.includes("đường")) {
            return (
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="4 4"/>
                        <XAxis dataKey="label"/>
                        <YAxis/>
                        <Tooltip formatter={formatValue}/>
                        <Legend/>
                        <Line dataKey="main" name="Kỳ chính" stroke="#005eff" strokeWidth={3}/>
                        {hasCompare &&
                            <Line dataKey="compare" name="Kỳ so sánh" stroke="#ff4d4f" strokeWidth={3}/>}
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        return (
            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={data}
                    margin={{top: 20, right: 40, left: 20, bottom: 20}}
                >
                    <CartesianGrid strokeDasharray="4 4"/>
                    <XAxis dataKey="label"/>
                    <YAxis
                        width={yAxisWidth}
                        allowDecimals={false}
                        tickFormatter={(v) =>
                            reportType === "Hiệu suất nhân viên"
                                ? v
                                : v.toLocaleString()
                        }
                    />
                    <Tooltip formatter={formatValue}/>
                    <Legend/>
                    <Bar dataKey="main" name="Kỳ chính" fill="#005eff"/>
                    {hasCompare &&
                        <Bar dataKey="compare" name="Kỳ so sánh" fill="#ff4d4f"/>}
                </BarChart>
            </ResponsiveContainer>

        );
    };

    return (
        <div className="container py-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-primary">{reportType}</h5>
            </div>


            <p className="small">Kỳ chính: {start} → {end}</p>
            {hasCompare && <p className="small">So sánh: {compareStart} → {compareEnd}</p>}

            {loading ? "Đang tải..." : message ? message : renderChart()}

            {/* Actions dưới biểu đồ */}
            {!loading && !message && (
                <div className="d-flex justify-content-center gap-3 chart-actions" style={{marginTop: "50px"}}>
                    <button
                        className="btn btn-success btn-sm px-4"
                        onClick={handleExportExcel}
                        disabled={!labels.length}
                    >
                        Xuất Excel
                    </button>

                    <Link to="/report" className="btn btn-secondary btn-sm px-4">
                        Quay lại
                    </Link>
                </div>
            )}

        </div>
    );
};

export default RevenueChart;
