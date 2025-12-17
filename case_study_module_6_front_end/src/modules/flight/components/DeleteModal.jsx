import React from "react";
import { cancelFlight } from "../service/flightService.js";
import { toast } from "react-toastify";

const DeleteModal = ({ show, onClose, flightId, onSuccess }) => {
    if (!show) return null;

    const handleConfirm = async () => {
        try {
            await cancelFlight(flightId);
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data || "Không thể hủy chuyến bay này");
            onClose();
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Xác Nhận Hủy Chuyến</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>Bạn có chắc chắn muốn hủy chuyến bay này không? Hành động này sẽ chuyển trạng thái sang <strong>CANCELLED</strong>.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
                        <button type="button" className="btn btn-danger" onClick={handleConfirm}>Xác nhận Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;