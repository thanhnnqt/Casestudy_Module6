import React, { useState, useEffect } from "react";

const BookingDetailModal = ({ outboundFlight, inboundFlight, tripType, onClose, onConfirm, initialSeatClass }) => {
    // --- STATE ---
    const [quantity, setQuantity] = useState(1);

    // Chọn 1 hạng ghế chung cho tất cả
    const [seatClassOut, setSeatClassOut] = useState(initialSeatClass || "ECONOMY");
    const [seatClassIn, setSeatClassIn] = useState(initialSeatClass || "ECONOMY");

    // Reset về hạng ghế mặc định (ưu tiên hạng ghế từ Home page, sau đó là hạng đầu tiên trong danh sách) khi mở modal
    useEffect(() => {
        if (initialSeatClass) {
            setSeatClassOut(initialSeatClass);
            setSeatClassIn(initialSeatClass);
        } else {
            if (outboundFlight?.seatDetails?.length > 0) {
                setSeatClassOut(outboundFlight.seatDetails[0].seatClass);
            }
            if (inboundFlight?.seatDetails?.length > 0) {
                setSeatClassIn(inboundFlight.seatDetails[0].seatClass);
            }
        }
    }, [outboundFlight, inboundFlight, initialSeatClass]);

    if (!outboundFlight) return null;

    // --- HELPER LẤY GIÁ ---
    const getPrice = (flight, seatClass) => {
        if (!flight) return 0;
        const detail = flight.seatDetails.find(s => s.seatClass === seatClass);
        return detail ? detail.price : 0;
    };

    const priceOut = getPrice(outboundFlight, seatClassOut);
    const priceIn = inboundFlight ? getPrice(inboundFlight, seatClassIn) : 0;

    // Tổng tiền = (Giá vé đi + Giá vé về) * Số lượng khách
    const finalTotal = (priceOut + priceIn) * quantity;

    // --- HELPER RENDER OPTIONS (QUAN TRỌNG) ---
    // 1. Chỉ hiện hạng ghế có trong seatDetails
    // 2. Disable nếu không đủ chỗ cho số lượng khách đang chọn
    const renderSeatOptions = (flight) => {
        return flight.seatDetails.map((seat) => (
            <option
                key={seat.id}
                value={seat.seatClass}
                disabled={seat.availableSeats < quantity} // Chặn nếu không đủ ghế
            >
                {seat.seatClass} {seat.availableSeats < quantity ? '(Không đủ ghế)' : ''}
                {/* Có thể hiện thêm giá tiền nếu muốn: - {seat.price.toLocaleString()}đ */}
            </option>
        ));
    };

    return (
        <div className="modal-backdrop-custom d-flex justify-content-center align-items-center"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>

            <div className="bg-white rounded-4 shadow-lg p-0 overflow-hidden animate__animated animate__fadeInDown"
                style={{ width: '900px', maxWidth: '95%' }}>

                {/* HEADER */}
                <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold"><i className="bi bi-ticket-perforated-fill me-2"></i>Thông tin chuyến bay & Đặt chỗ</h5>
                    <button className="btn-close btn-close-white" onClick={onClose}></button>
                </div>

                {/* BODY */}
                <div className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                    {/* 1. CHỌN SỐ LƯỢNG */}
                    <div className="mb-4 d-flex align-items-center gap-3 p-3 bg-light rounded border border-primary-subtle">
                        <label className="fw-bold text-dark mb-0">Số lượng hành khách:</label>
                        <select
                            className="form-select w-auto fw-bold text-primary border-primary"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} người</option>)}
                        </select>
                        <small className="text-muted fst-italic ms-2">(Bao gồm Người lớn & Trẻ em)</small>
                    </div>

                    {/* 2. BẢNG CHI TIẾT */}
                    <table className="table table-bordered align-middle table-hover">
                        <thead className="table-secondary text-secondary">
                            <tr className="text-center small text-uppercase">
                                <th style={{ width: '40%' }}>Hành trình</th>
                                <th style={{ width: '30%' }}>Hạng vé (Áp dụng tất cả)</th>
                                <th style={{ width: '15%' }}>Đơn giá</th>
                                <th style={{ width: '15%' }}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>

                            {/* DÒNG 1: CHIỀU ĐI */}
                            <tr>
                                <td>
                                    <div className="badge bg-primary mb-2">CHIỀU ĐI</div>
                                    <div className="fw-bold text-dark mb-1">
                                        {outboundFlight.departureAirport.city} <i className="bi bi-arrow-right text-muted mx-1"></i> {outboundFlight.arrivalAirport.city}
                                    </div>
                                    <div className="small text-muted">
                                        <img src={outboundFlight.aircraft.airline.logoUrl} alt="" style={{ height: '18px', marginRight: '5px' }} />
                                        {outboundFlight.flightNumber} • {outboundFlight.departureTime.replace('T', ' ')}
                                    </div>
                                </td>
                                <td>
                                    <select
                                        className="form-select fw-bold text-primary"
                                        value={seatClassOut}
                                        onChange={(e) => setSeatClassOut(e.target.value)}
                                    >
                                        {renderSeatOptions(outboundFlight)}
                                    </select>
                                </td>
                                <td className="text-end">{priceOut.toLocaleString()} đ</td>
                                <td className="text-end fw-bold text-primary">{(priceOut * quantity).toLocaleString()} đ</td>
                            </tr>

                            {/* DÒNG 2: CHIỀU VỀ (NẾU CÓ) */}
                            {tripType === "ROUND_TRIP" && inboundFlight && (
                                <tr>
                                    <td>
                                        <div className="badge bg-success mb-2">CHIỀU VỀ</div>
                                        <div className="fw-bold text-dark mb-1">
                                            {inboundFlight.departureAirport.city} <i className="bi bi-arrow-right text-muted mx-1"></i> {inboundFlight.arrivalAirport.city}
                                        </div>
                                        <div className="small text-muted">
                                            <img src={inboundFlight.aircraft.airline.logoUrl} alt="" style={{ height: '18px', marginRight: '5px' }} />
                                            {inboundFlight.flightNumber} • {inboundFlight.departureTime.replace('T', ' ')}
                                        </div>
                                    </td>
                                    <td>
                                        <select
                                            className="form-select fw-bold text-success"
                                            value={seatClassIn}
                                            onChange={(e) => setSeatClassIn(e.target.value)}
                                        >
                                            {renderSeatOptions(inboundFlight)}
                                        </select>
                                    </td>
                                    <td className="text-end">{priceIn.toLocaleString()} đ</td>
                                    <td className="text-end fw-bold text-success">{(priceIn * quantity).toLocaleString()} đ</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-light">
                            <tr>
                                <td colSpan="3" className="text-end fw-bold fs-5 pt-3 text-muted">TỔNG CỘNG ({quantity} khách):</td>
                                <td className="text-end fw-bold fs-3 text-danger pt-3">
                                    {finalTotal.toLocaleString()} đ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-3 bg-white border-top d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-secondary px-4 fw-bold" onClick={onClose}>
                        Đóng lại
                    </button>
                    <button
                        className="btn btn-warning px-5 fw-bold text-dark shadow-sm"
                        onClick={() => onConfirm({ quantity, seatClassOut, seatClassIn, finalTotal })}
                    >
                        TIẾP TỤC NHẬP THÔNG TIN <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;