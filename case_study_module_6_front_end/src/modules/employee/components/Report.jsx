import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./Report.css";

const Report = () => {

    const periodOptionsMain = ["Tuần này", "Tháng này", "Quý này", "Năm này"];
    const periodOptionsCompare = ["Tuần trước", "Tháng trước", "Quý trước", "Năm trước"];

    const navigate = useNavigate();

    const [mainMode, setMainMode] = useState("period");
    const [compareMode, setCompareMode] = useState("period");

    const [enableCompare, setEnableCompare] = useState(false); // ⭐ MẤU CHỐT

    const [chartType, setChartType] = useState("Biểu đồ cột");
    const [reportType, setReportType] = useState("Doanh thu");

    const [mainStartDate, setMainStartDate] = useState("");
    const [mainEndDate, setMainEndDate] = useState("");

    const [compareStartDate, setCompareStartDate] = useState("");
    const [compareEndDate, setCompareEndDate] = useState("");

    const [selectedPeriod, setSelectedPeriod] = useState("Tuần này");
    const [selectedComparePeriod, setSelectedComparePeriod] = useState("Tuần trước");

    const toYMD = (d) => d.toISOString().split("T")[0];

    const getMonday = (date) => {
        const day = date.getDay();
        const diff = (day === 0 ? -6 : 1 - day);
        const monday = new Date(date);
        monday.setDate(date.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    };

    const getDateRange = (period) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (period) {
            case "Tuần này": {
                const monday = getMonday(today);
                return {start: toYMD(monday), end: toYMD(today)};
            }
            case "Tuần trước": {
                const monday = getMonday(today);
                const start = new Date(monday);
                start.setDate(monday.getDate() - 7);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);
                return {start: toYMD(start), end: toYMD(end)};
            }
            case "Tháng này": {
                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                return {start: toYMD(start), end: toYMD(today)};
            }
            case "Tháng trước": {
                const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const end = new Date(today.getFullYear(), today.getMonth(), 0);
                return {start: toYMD(start), end: toYMD(end)};
            }
            case "Quý này": {
                const q = Math.floor(today.getMonth() / 3);
                const start = new Date(today.getFullYear(), q * 3, 1);
                return {start: toYMD(start), end: toYMD(today)};
            }
            case "Quý trước": {
                const q = Math.floor(today.getMonth() / 3) - 1;
                const start = new Date(today.getFullYear(), q * 3, 1);
                const end = new Date(today.getFullYear(), q * 3 + 3, 0);
                return {start: toYMD(start), end: toYMD(end)};
            }
            case "Năm này":
                return {start: `${today.getFullYear()}-01-01`, end: toYMD(today)};
            case "Năm trước":
                return {
                    start: `${today.getFullYear() - 1}-01-01`,
                    end: `${today.getFullYear() - 1}-12-31`
                };
            default:
                return {start: toYMD(today), end: toYMD(today)};
        }
    };

    const handleViewReport = () => {

        const mainRange = mainMode === "period"
            ? getDateRange(selectedPeriod)
            : {start: mainStartDate, end: mainEndDate};

        if (!enableCompare) {
            navigate(
                `/revenue-chart?chart=${chartType}&type=${reportType}` +
                `&start=${mainRange.start}&end=${mainRange.end}`
            );
            return;
        }

        const compareRange = compareMode === "period"
            ? getDateRange(selectedComparePeriod)
            : {start: compareStartDate, end: compareEndDate};

        navigate(
            `/revenue-chart?chart=${chartType}&type=${reportType}` +
            `&start=${mainRange.start}&end=${mainRange.end}` +
            `&compareStart=${compareRange.start}&compareEnd=${compareRange.end}`
        );
    };

    return (
        <div className="container report-wrapper d-flex justify-content-center align-items-center">
            <div className="report-card p-3 border rounded shadow-sm w-100" style={{maxWidth: 520}}>

                <h5 className="fw-bold text-center text-primary mb-3">
                    Báo cáo thống kê
                </h5>

                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <label className="small mb-1">Loại biểu đồ</label>
                        <select className="form-select form-select-sm"
                                value={chartType}
                                onChange={(e) => setChartType(e.target.value)}>
                            <option>Biểu đồ cột</option>
                            <option>Biểu đồ tròn</option>
                            <option>Biểu đồ đường</option>
                        </select>
                    </div>

                    <div className="col-6">
                        <label className="small mb-1">Tiêu chí thống kê</label>
                        <select className="form-select form-select-sm"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}>
                            <option>Doanh thu</option>
                            <option>Hiệu suất nhân viên</option>
                            <option>Theo hãng</option>
                        </select>
                    </div>
                </div>

                <fieldset className="border rounded p-3 mb-3">
                    <legend className="small text-muted px-2">Thời gian chính</legend>

                    <div className="form-check small mb-1">
                        <input type="radio" className="form-check-input"
                               checked={mainMode === "period"}
                               onChange={() => setMainMode("period")}/>
                        <label className="ms-1">Mốc thời gian</label>
                    </div>

                    {mainMode === "period" && (
                        <select className="form-select form-select-sm"
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}>
                            {periodOptionsMain.map((v, i) => <option key={i}>{v}</option>)}
                        </select>
                    )}

                    <div className="form-check small mt-2 mb-1">
                        <input type="radio" className="form-check-input"
                               checked={mainMode === "range"}
                               onChange={() => setMainMode("range")}/>
                        <label className="ms-1">Chọn khoảng</label>
                    </div>

                    {mainMode === "range" && (
                        <div className="d-flex gap-2">
                            <input type="date" className="form-control form-control-sm"
                                   value={mainStartDate}
                                   onChange={(e) => setMainStartDate(e.target.value)}/>
                            <input type="date" className="form-control form-control-sm"
                                   value={mainEndDate}
                                   onChange={(e) => setMainEndDate(e.target.value)}/>
                        </div>
                    )}
                </fieldset>

                <fieldset className="border rounded p-3 mb-3">
                    <div className="form-check small mb-2">
                        <input type="checkbox" className="form-check-input"
                               checked={enableCompare}
                               onChange={() => setEnableCompare(!enableCompare)}/>
                        <label className="ms-1">So sánh</label>
                    </div>

                    <div style={{
                        opacity: enableCompare ? 1 : 0.5,
                        pointerEvents: enableCompare ? "auto" : "none"
                    }}>
                        <div className="form-check small mb-1">
                            <input type="radio" className="form-check-input"
                                   checked={compareMode === "period"}
                                   onChange={() => setCompareMode("period")}/>
                            <label className="ms-1">Mốc thời gian</label>
                        </div>

                        {compareMode === "period" && (
                            <select className="form-select form-select-sm"
                                    value={selectedComparePeriod}
                                    onChange={(e) => setSelectedComparePeriod(e.target.value)}>
                                {periodOptionsCompare.map((v, i) => <option key={i}>{v}</option>)}
                            </select>
                        )}

                        <div className="form-check small mt-2 mb-1">
                            <input type="radio" className="form-check-input"
                                   checked={compareMode === "range"}
                                   onChange={() => setCompareMode("range")}/>
                            <label className="ms-1">Chọn khoảng</label>
                        </div>

                        {compareMode === "range" && (
                            <div className="d-flex gap-2">
                                <input type="date" className="form-control form-control-sm"
                                       value={compareStartDate}
                                       onChange={(e) => setCompareStartDate(e.target.value)}/>
                                <input type="date" className="form-control form-control-sm"
                                       value={compareEndDate}
                                       onChange={(e) => setCompareEndDate(e.target.value)}/>
                            </div>
                        )}
                    </div>
                </fieldset>

                <div className="text-center">
                    <button
                        className="btn btn-primary btn-sm px-4 me-2"
                        onClick={handleViewReport}
                    >
                        Xem báo cáo
                    </button>

                    <Link
                        to="/flights"
                        className="btn btn-secondary btn-sm px-4"
                    >
                        Quay lại
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Report;
