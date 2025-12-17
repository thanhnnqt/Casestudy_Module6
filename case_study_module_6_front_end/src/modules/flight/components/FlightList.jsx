import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFlights, searchFlight, cancelFlight } from "../service/flightService.js";
import { toast } from "react-toastify";

const FlightList = () => {
    const [flights, setFlights] = useState([]);


    const [searchAirline, setSearchAirline] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [maxPrice, setMaxPrice] = useState("");


    useEffect(() => {
        const loadData = async () => {
            try {

                const data = await getAllFlights();
                setFlights(data);
            } catch (error) {
                toast.error("Lỗi tải dữ liệu ban đầu" + error);
            }
        };

        loadData();
    }, []);


    const handleSearch = async () => {
        try {
            const data = await searchFlight(searchAirline, searchDate, maxPrice);
            setFlights(data);
        } catch (error) {
            toast.error("Lỗi khi tìm kiếm:" + error);
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn hủy chuyến bay này?")) {
            const isSuccess = await cancelFlight(id);
            if (isSuccess) {
                toast.success("Hủy chuyến thành công");
                // Sau khi xóa, load lại danh sách hiện tại (giữ nguyên kết quả tìm kiếm nếu có)
                handleSearch();
            } else {
                toast.error("Không thể hủy chuyến bay này (Đã hoàn thành hoặc lỗi)");
            }
        }
    }

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString('vi-VN');
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Quản Lý Chuyến Bay</h2>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-2 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Hãng bay:</label>
                            <input
                                className="form-control"
                                placeholder="Nhập tên hãng..."
                                value={searchAirline}
                                onChange={(e) => setSearchAirline(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Ngày khởi hành:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Giá tối đa:</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Nhập giá..."
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-primary w-100" onClick={handleSearch}>
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <Link to="/flights/create" className="btn btn-success">
                            Thêm mới chuyến bay
                        </Link>
                    </div>
                </div>
            </div>

            <div className="table-responsive shadow rounded">
                <table className="table table-hover table-striped mb-0 align-middle">
                    <thead className="table-dark text-center">
                    <tr>
                        <th>STT</th>
                        <th>Mã CB</th>
                        <th className="text-start">Hãng</th>
                        <th>Hành trình</th>
                        <th>Khởi hành</th>
                        <th>Hạ cánh</th>
                        <th>Giá vé</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {flights.map((item, index) => (
                        <tr key={item.id} className={item.status === 'CANCELLED' ? 'table-secondary text-muted' : ''}>
                            <td>{index + 1}</td>
                            <td className="fw-bold text-primary">{item.flightCode}</td>
                            <td className="text-start">{item.airline}</td>
                            <td>{item.origin} <br/> &#8594; {item.destination}</td>
                            <td>{formatDateTime(item.departureTime)}</td>
                            <td>{formatDateTime(item.arrivalTime)}</td>
                            <td className="fw-bold text-success">
                                {item.price ? item.price.toLocaleString() : 0} VNĐ
                            </td>
                            <td>
                                <span className={`badge ${
                                    item.status === 'SCHEDULED' ? 'bg-success' :
                                        item.status === 'CANCELLED' ? 'bg-danger' : 'bg-warning'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td>
                                {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                                    <div className="d-flex justify-content-center gap-2">
                                        <Link to={`/flights/edit/${item.id}`} className="btn btn-warning btn-sm">
                                            Sửa
                                        </Link>
                                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">
                                            Hủy
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    {flights.length === 0 && (
                        <tr><td colSpan="9" className="py-4 text-muted">Không tìm thấy dữ liệu.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FlightList;