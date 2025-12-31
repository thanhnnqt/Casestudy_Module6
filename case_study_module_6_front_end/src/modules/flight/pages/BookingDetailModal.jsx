import React, { useState, useEffect } from "react";

const BookingDetailModal = ({ outboundFlight, inboundFlight, tripType, onClose, onConfirm }) => {
    // --- STATE ---
    if (!outboundFlight) return null;
    const [quantity, setQuantity] = useState(1);
    const [seatClassOut, setSeatClassOut] = useState("ECONOMY");
    const [seatClassIn, setSeatClassIn] = useState("ECONOMY");

    // --- HELPER LẤY GIÁ ---
    const getPrice = (flight, seatClass) => {
        if (!flight) return 0;
        const detail = flight.seatDetails.find(s => s.seatClass === seatClass);
        return detail ? detail.price : 0;
    };

    const priceOut = getPrice(outboundFlight, seatClassOut);
    const priceIn = inboundFlight ? getPrice(inboundFlight, seatClassIn) : 0;

    const totalPriceOut = priceOut * quantity;
    const totalPriceIn = priceIn * quantity;
    const finalTotal = totalPriceOut + totalPriceIn;

    return (
        <div className="modal-backdrop-custom d-flex justify-content-center align-items-center">
            <div className="bg-white rounded-4 shadow-lg p-0 overflow-hidden" style={{width: '900px', maxWidth: '95%'}}>
                <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold"><i className="bi bi-ticket-perforated-fill me-2"></i>Thông tin chuyến bay & Đặt chỗ</h5>
                    <button className="btn-close btn-close-white" onClick={onClose}></button>
                </div>

                <div className="p-4" style={{maxHeight: '70vh', overflowY: 'auto'}}>

                    {/* KHU VỰC CHỌN SỐ LƯỢNG */}
                    <div className="mb-4 d-flex align-items-center gap-3 p-3 bg-light rounded border">
                        <label className="fw-bold text-dark">Số lượng hành khách (Vé):</label>
                        <select
                            className="form-select w-auto fw-bold text-primary"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        >
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} người</option>)}
                        </select>
                        <small className="text-muted ms-2">(Bao gồm Người lớn & Trẻ em)</small>
                    </div>

                    {/* BẢNG CHI TIẾT */}
                    <table className="table table-bordered align-middle">
                        <thead className="table-secondary">
                        <tr className="text-center small">
                            <th style={{width: '35%'}}>Hành trình</th>
                            <th>Hạng vé</th>
                            <th>Giá vé (VNĐ)</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* DÒNG 1: CHIỀU ĐI */}
                        <tr>
                            <td>
                                <div className="fw-bold text-primary mb-1">
                                    {outboundFlight.departureAirport.city} <i className="bi bi-arrow-right"></i> {outboundFlight.arrivalAirport.city}
                                </div>
                                <small className="d-block text-muted">
                                    {outboundFlight.aircraft.airline.name} ({outboundFlight.flightNumber})
                                </small>
                                <small className="text-dark fw-bold">
                                    {outboundFlight.departureTime.replace('T', ' ')}
                                </small>
                            </td>
                            <td>
                                <select
                                    className="form-select form-select-sm"
                                    value={seatClassOut}
                                    onChange={(e) => setSeatClassOut(e.target.value)}
                                >
                                    <option value="ECONOMY">Phổ thông</option>
                                    <option value="BUSINESS">Thương gia</option>
                                </select>
                            </td>
                            <td className="text-end">{priceOut.toLocaleString()}</td>
                            <td className="text-center fw-bold">{quantity}</td>
                            <td className="text-end fw-bold text-dark">{totalPriceOut.toLocaleString()}</td>
                        </tr>

                        {/* DÒNG 2: CHIỀU VỀ (NẾU CÓ) */}
                        {tripType === "ROUND_TRIP" && inboundFlight && (
                            <tr>
                                <td>
                                    <div className="fw-bold text-primary mb-1">
                                        {inboundFlight.departureAirport.city} <i className="bi bi-arrow-right"></i> {inboundFlight.arrivalAirport.city}
                                    </div>
                                    <small className="d-block text-muted">
                                        {inboundFlight.aircraft.airline.name} ({inboundFlight.flightNumber})
                                    </small>
                                    <small className="text-dark fw-bold">
                                        {inboundFlight.departureTime.replace('T', ' ')}
                                    </small>
                                </td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={seatClassIn}
                                        onChange={(e) => setSeatClassIn(e.target.value)}
                                    >
                                        <option value="ECONOMY">Phổ thông</option>
                                        <option value="BUSINESS">Thương gia</option>
                                    </select>
                                </td>
                                <td className="text-end">{priceIn.toLocaleString()}</td>
                                <td className="text-center fw-bold">{quantity}</td>
                                <td className="text-end fw-bold text-dark">{totalPriceIn.toLocaleString()}</td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot className="table-light">
                        <tr>
                            <td colSpan="4" className="text-end fw-bold fs-5 pt-3">TỔNG CỘNG:</td>
                            <td className="text-end fw-bold fs-4 text-danger pt-3">
                                {finalTotal.toLocaleString()} đ
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="p-3 bg-light border-top d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary px-4" onClick={onClose}>Hủy</button>
                    <button
                        className="btn btn-success px-5 fw-bold"
                        onClick={() => onConfirm({ quantity, seatClassOut, seatClassIn, finalTotal })}
                    >
                        Xác nhận & Nhập thông tin <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;