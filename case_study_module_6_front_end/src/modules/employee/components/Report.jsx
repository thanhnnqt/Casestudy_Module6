import React, {useState} from "react";
import {Link} from "react-router-dom";

const Report = () => {
    const timeOptions = [
        "Tuần này", "Tuần trước",
        "Tháng này", "Tháng trước",
        "Quý này", "Quý trước",
        "Năm nay", "Năm trước"
    ];

    const [mainMode, setMainMode] = useState("period");
    const [compareMode, setCompareMode] = useState("period");

    return (
        <div className="container py-3">
            <div className="mx-auto bg-white shadow-sm rounded p-4"
                 style={{maxWidth: "1000px"}}>

                <h5 className="fw-bold text-center text-primary mb-3">
                    Thống Kê Báo Cáo
                </h5>

                {/* Kiểu + Loại */}
                <div className="row g-3 mb-3">
                    <div className="col-md-6">
                        <label className="form-label small fw-semibold">Chọn kiểu</label>
                        <select className="form-select form-select-sm">
                            <option>Biểu đồ tròn</option>
                            <option>Biểu đồ cột</option>
                            <option>Biểu đồ đường</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-semibold">Chọn loại</label>
                        <select className="form-select form-select-sm">
                            <option>Doanh thu</option>
                            <option>Nhân viên</option>
                            <option>Chuyến bay</option>
                        </select>
                    </div>
                </div>

                {/* Thời gian chính */}
                <div className="bg-light p-3 rounded mb-3">
                    <div className="fw-semibold small mb-2">Thời gian</div>

                    <div className="form-check small">
                        <input className="form-check-input"
                               type="radio"
                               checked={mainMode === "period"}
                               onChange={() => setMainMode("period")}/>
                        <label className="form-check-label ms-1">Theo mốc thời gian</label>
                    </div>

                    {mainMode === "period" && (
                        <select className="form-select form-select-sm mt-2"
                                style={{width: "65%"}}>
                            {timeOptions.map((t, i) => (
                                <option key={i}>{t}</option>
                            ))}
                        </select>
                    )}

                    <div className="form-check small mt-2">
                        <input className="form-check-input"
                               type="radio"
                               checked={mainMode === "range"}
                               onChange={() => setMainMode("range")}/>
                        <label className="form-check-label ms-1">Từ - Đến</label>
                    </div>

                    {mainMode === "range" && (
                        <div className="d-flex gap-2 mt-2"
                             style={{width: "75%"}}>
                            <input type="date" className="form-control form-control-sm"/>
                            <input type="date" className="form-control form-control-sm"/>
                        </div>
                    )}
                </div>

                {/* So sánh */}
                <div className="bg-light p-3 rounded mb-3">
                    <div className="fw-semibold small mb-2">So sánh với</div>

                    <div className="form-check small">
                        <input className="form-check-input"
                               type="radio"
                               checked={compareMode === "period"}
                               onChange={() => setCompareMode("period")}/>
                        <label className="form-check-label ms-1">Theo mốc thời gian</label>
                    </div>

                    {compareMode === "period" && (
                        <select className="form-select form-select-sm mt-2"
                                style={{width: "65%"}}>
                            {timeOptions.filter(i => i.includes("trước")).map((t, i) => (
                                <option key={i}>{t}</option>
                            ))}
                        </select>
                    )}

                    <div className="form-check small mt-2">
                        <input className="form-check-input"
                               type="radio"
                               checked={compareMode === "range"}
                               onChange={() => setCompareMode("range")}/>
                        <label className="form-check-label ms-1">Từ - Đến</label>
                    </div>

                    {compareMode === "range" && (
                        <div className="d-flex gap-2 mt-2"
                             style={{width: "75%"}}>
                            <input type="date" className="form-control form-control-sm"/>
                            <input type="date" className="form-control form-control-sm"/>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="text-center">
                    <Link to={"/revenue-chart"} className="btn btn-primary px-4 fw-bold btn-sm">
                        Xem
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Report;
