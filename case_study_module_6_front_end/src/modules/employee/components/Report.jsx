import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Report.css";

const Report = () => {
    const periodOptionsMain = ["Tuần này", "Tháng này", "Quý này", "Năm này"];
    const periodOptionsCompare = ["Tuần trước", "Tháng trước", "Quý trước", "Năm trước"];

    const navigate = useNavigate();

    const [mainMode, setMainMode] = useState("period");
    const [compareMode, setCompareMode] = useState("period");

    const [chartType, setChartType] = useState("Biểu đồ tròn");
    const [reportType, setReportType] = useState("Doanh thu");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [selectedPeriod, setSelectedPeriod] = useState("Tuần này");
    const [selectedComparePeriod, setSelectedComparePeriod] = useState("Tuần trước");

    const getDateRange = (period) => {
        const now = new Date();
        let start, end;

        switch(period) {
            case "Tuần này":
                start = new Date(now.setDate(now.getDate() - now.getDay() + 1));
                end = new Date();
                break;
            case "Tuần trước":
                start = new Date(now.setDate(now.getDate() - now.getDay() - 6));
                end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
                break;
            case "Tháng này":
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date();
                break;
            case "Tháng trước":
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                end = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case "Quý này":
                { const quarter = Math.floor((now.getMonth()) / 3);
                start = new Date(now.getFullYear(), quarter * 3, 1);
                end = new Date();
                break; }
            case "Quý trước":
                { const prevQuarter = Math.floor((now.getMonth()) / 3) - 1;
                start = new Date(now.getFullYear(), prevQuarter * 3, 1);
                end = new Date(now.getFullYear(), prevQuarter * 3 + 3, 0);
                break; }
            case "Năm này":
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date();
                break;
            case "Năm trước":
                start = new Date(now.getFullYear() - 1, 0, 1);
                end = new Date(now.getFullYear() - 1, 11, 31);
                break;
            default:
                start = end = new Date();
        }

        return {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0]
        };
    };

    const handleViewReport = () => {
        let mainStart, mainEnd, compareStart = null, compareEnd = null;

        if (mainMode === "period") {
            ({start: mainStart, end: mainEnd} = getDateRange(selectedPeriod));
        } else {
            if (!startDate || !endDate) {
                alert("Vui lòng chọn đúng ngày Từ - Đến!");
                return;
            }
            mainStart = startDate;
            mainEnd = endDate;
        }

        if (compareMode === "period") {
            ({start: compareStart, end: compareEnd} = getDateRange(selectedComparePeriod));
        }

        const query = new URLSearchParams({
            chart: chartType,
            type: reportType,
            start: mainStart,
            end: mainEnd
        });

        if (compareStart && compareEnd) {
            query.append("compareStart", compareStart);
            query.append("compareEnd", compareEnd);
        }

        navigate(`/revenue-chart?${query.toString()}`);
    };

    return (
        <div className="report-container">
            <div className="report-panel">
                <h5 className="fw-bold text-center text-primary mb-3">Thiết lập báo cáo thống kê</h5>

                <div className="report-scroll-area">

                    {/* 1. Loại báo cáo */}
                    <fieldset className="border rounded p-3 mb-3">
                        <legend className="small text-muted px-2">Loại báo cáo</legend>
                        <div className="row g-2">
                            <div className="col-md-6">
                                <select
                                    className="form-select form-select-sm"
                                    value={chartType}
                                    onChange={(e) => setChartType(e.target.value)}>
                                    <option>Biểu đồ tròn</option>
                                    <option>Biểu đồ cột</option>
                                    <option>Biểu đồ đường</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <select
                                    className="form-select form-select-sm"
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}>
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
                            <input type="radio"
                                   className="form-check-input"
                                   checked={mainMode === "period"}
                                   onChange={() => setMainMode("period")}/>
                            <label className="ms-1">Theo mốc</label>
                        </div>

                        {mainMode === "period" &&
                            <select className="form-select form-select-sm w-auto"
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}>
                                {periodOptionsMain.map((t, i) => <option key={i}>{t}</option>)}
                            </select>
                        }

                        <div className="form-check small mt-2 mb-1">
                            <input type="radio"
                                   className="form-check-input"
                                   checked={mainMode === "range"}
                                   onChange={() => setMainMode("range")}/>
                            <label className="ms-1">Từ - đến</label>
                        </div>

                        {mainMode === "range" &&
                            <div className="d-flex gap-2 w-75">
                                <input type="date" className="form-control form-control-sm"
                                       value={startDate}
                                       onChange={(e) => setStartDate(e.target.value)}/>
                                <input type="date" className="form-control form-control-sm"
                                       value={endDate}
                                       onChange={(e) => setEndDate(e.target.value)}/>
                            </div>
                        }
                    </fieldset>

                    {/* 3. So sánh */}
                    <fieldset className="border rounded p-3 mb-3">
                        <legend className="small text-muted px-2">So sánh</legend>

                        <div className="form-check small mb-1">
                            <input type="radio"
                                   className="form-check-input"
                                   checked={compareMode === "period"}
                                   onChange={() => setCompareMode("period")}/>
                            <label className="ms-1">Theo mốc</label>
                        </div>

                        {compareMode === "period" &&
                            <select className="form-select form-select-sm w-auto"
                                    value={selectedComparePeriod}
                                    onChange={(e) => setSelectedComparePeriod(e.target.value)}>
                                {periodOptionsCompare.map((t, i) => <option key={i}>{t}</option>)}
                            </select>
                        }

                        <div className="form-check small mt-2 mb-1">
                            <input type="radio"
                                   className="form-check-input"
                                   checked={compareMode === "range"}
                                   onChange={() => setCompareMode("range")}/>
                            <label className="ms-1">Từ - đến</label>
                        </div>

                        {compareMode === "range" &&
                            <div className="d-flex gap-2 w-75">
                                <input type="date" className="form-control form-control-sm"/>
                                <input type="date" className="form-control form-control-sm"/>
                            </div>
                        }
                    </fieldset>

                    <div className="text-center">
                        <button className="btn btn-primary btn-sm px-4"
                                onClick={handleViewReport}>
                            Xem báo cáo
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Report;
