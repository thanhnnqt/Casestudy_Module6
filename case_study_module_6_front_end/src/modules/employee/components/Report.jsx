import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Report.css";

const Report = () => {
    const timeOptions = [
        "Tuần này", "Tuần trước",
        "Tháng này", "Tháng trước",
        "Quý này", "Quý trước",
        "Năm này", "Năm trước"
    ];

    const [mainMode, setMainMode] = useState("period");
    const [compareMode, setCompareMode] = useState("period");

    return (
        <div className="report-container">
            <div className="report-panel">

                <h5 className="fw-bold text-center text-primary mb-3">
                    Thiết lập báo cáo thống kê
                </h5>

                <div className="report-scroll-area">

                    {/* 1. Loại báo cáo */}
                    <fieldset className="border rounded p-3 mb-3">
                        <legend className="small text-muted px-2">Loại báo cáo</legend>
                        <div className="row g-2">
                            <div className="col-md-6">
                                <select className="form-select form-select-sm">
                                    <option>Biểu đồ tròn</option>
                                    <option>Biểu đồ cột</option>
                                    <option>Biểu đồ đường</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <select className="form-select form-select-sm">
                                    <option>Doanh thu</option>
                                    <option>Hiệu suất nhân viên</option>
                                    <option>Theo hãng</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* 2. Thời gian chính */}
                    <fieldset className="border rounded p-3 mb-3">
                        <legend className="small text-muted px-2">Thời gian chính</legend>

                        <div className="form-check small mb-1">
                            <input type="radio" className="form-check-input"
                                   checked={mainMode === "period"}
                                   onChange={() => setMainMode("period")} />
                            <label className="ms-1">Theo mốc</label>
                        </div>

                        {mainMode === "period" && (
                            <select className="form-select form-select-sm w-auto">
                                {timeOptions.filter(t => t.includes("này")).map((t, i) => (
                                    <option key={i}>{t}</option>
                                ))}
                            </select>
                        )}

                        <div className="form-check small mt-2 mb-1">
                            <input type="radio" className="form-check-input"
                                   checked={mainMode === "range"}
                                   onChange={() => setMainMode("range")} />
                            <label className="ms-1">Từ - đến</label>
                        </div>

                        {mainMode === "range" && (
                            <div className="d-flex gap-2 w-75">
                                <input type="date" className="form-control form-control-sm" />
                                <input type="date" className="form-control form-control-sm" />
                            </div>
                        )}
                    </fieldset>

                    {/* 3. So sánh */}
                    <fieldset className="border rounded p-3 mb-3">
                        <legend className="small text-muted px-2">So sánh</legend>

                        <div className="form-check small mb-1">
                            <input type="radio" className="form-check-input"
                                   checked={compareMode === "period"}
                                   onChange={() => setCompareMode("period")} />
                            <label className="ms-1">Theo mốc</label>
                        </div>

                        {compareMode === "period" && (
                            <select className="form-select form-select-sm w-auto">
                                {timeOptions.filter(t => t.includes("trước")).map((t, i) => (
                                    <option key={i}>{t}</option>
                                ))}
                            </select>
                        )}

                        <div className="form-check small mt-2 mb-1">
                            <input type="radio" className="form-check-input"
                                   checked={compareMode === "range"}
                                   onChange={() => setCompareMode("range")} />
                            <label className="ms-1">Từ - đến</label>
                        </div>

                        {compareMode === "range" && (
                            <div className="d-flex gap-2 w-75">
                                <input type="date" className="form-control form-control-sm" />
                                <input type="date" className="form-control form-control-sm" />
                            </div>
                        )}
                    </fieldset>

                    <div className="text-center">
                        <Link to="/revenue-chart" className="btn btn-primary btn-sm px-4">
                            Xem báo cáo
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Report;
