import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Report.css";

const Report = () => {
    const navigate = useNavigate();

    // ===== REPORT TYPE =====
    const [reportType, setReportType] = useState("Doanh thu");

    // ===== TIME =====
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [viewMode, setViewMode] = useState("Tháng");
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );

    const years = [currentYear, currentYear - 1];
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    /* =========================
       HANDLE VIEW REPORT
       ========================= */
    const handleViewReport = () => {
        let start, end;

        if (viewMode === "Tháng") {
            start = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
            end = new Date(selectedYear, selectedMonth, 0)
                .toISOString()
                .split("T")[0];
        } else {
            start = `${selectedYear}-01-01`;
            end = `${selectedYear}-12-31`;
        }

        // ===== NGẦM ĐỊNH BIỂU ĐỒ =====
        const chart =
            reportType === "Doanh thu"
                ? "Biểu đồ cột"
                : "Biểu đồ tròn";

        navigate(
            `/revenue-chart?chart=${chart}` +
            `&type=${reportType}` +
            `&start=${start}&end=${end}&view=${viewMode}`
        );
    };

    return (
        <div className="container report-page-container d-flex justify-content-center align-items-center">
            <div className="report-card p-4 border rounded shadow-sm">
                <h5 className="fw-bold text-center text-primary mb-4">
                    BÁO CÁO THỐNG KÊ
                </h5>

                <div className="row g-4">
                    {/* ===== LEFT: REPORT TYPE ===== */}
                    <div className="col-md-5 border-end">
                        <label className="fw-bold small mb-3 text-secondary text-uppercase">
                            1. Loại báo cáo
                        </label>

                        <div className="mb-3">
                            <label className="small mb-1">Tiêu chí thống kê</label>
                            <select
                                className="form-select"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <option>Doanh thu</option>
                                <option>Hiệu suất nhân viên</option>
                                <option>Theo hãng</option>
                            </select>
                        </div>

                        <div className="text-muted small mt-2">
                            {reportType === "Doanh thu" && "• Biểu đồ cột theo thời gian"}
                            {reportType === "Hiệu suất nhân viên" && "• Biểu đồ tròn theo tỷ lệ"}
                            {reportType === "Theo hãng" && "• Biểu đồ tròn theo tỷ lệ"}
                        </div>
                    </div>

                    {/* ===== RIGHT: TIME CONFIG ===== */}
                    <div className="col-md-7">
                        <label className="fw-bold small mb-3 text-secondary text-uppercase">
                            2. Thời gian báo cáo
                        </label>

                        <div className="p-3 bg-light rounded border">
                            <div className="row g-2 mb-3">
                                <div className="col-5">
                                    <label className="small mb-1">Chọn năm</label>
                                    <select
                                        className="form-select"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                Năm {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-7">
                                    <label className="small mb-1">Chế độ xem</label>
                                    <div className="d-flex gap-1">
                                        {["Tháng", "Quý", "Năm"].map((mode) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                className={`btn btn-sm flex-fill ${
                                                    viewMode === mode
                                                        ? "btn-primary"
                                                        : "btn-outline-primary"
                                                }`}
                                                onClick={() => setViewMode(mode)}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {viewMode === "Tháng" && (
                                <div className="mt-3 pt-3 border-top">
                                    <div className="month-grid">
                                        {months.map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                className={`btn btn-sm ${
                                                    selectedMonth === m
                                                        ? "btn-primary"
                                                        : "btn-light border"
                                                }`}
                                                onClick={() => setSelectedMonth(m)}
                                            >
                                                T{m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                    <button
                        className="btn btn-primary px-5 me-3"
                        onClick={handleViewReport}
                    >
                        Xem báo cáo
                    </button>
                    <Link to="/flights" className="btn btn-outline-secondary px-4">
                        Quay lại
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Report;
