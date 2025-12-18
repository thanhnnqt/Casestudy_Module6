import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFlights, searchFlight, cancelFlight } from "../service/flightService";
import { toast } from "react-toastify";

const AIRLINE_LOGOS = {
    "PACIFIC AIRLINES": "https://danangairport.vn/files/media/202501/pacific.jpg",
    "BAMBOO AIRWAYS": "https://danangairport.vn/files/media/202411/6b1deea9-2644-4164-bfef-e28b69b0f4a4.jpg",
    "JEJU AIR": "https://danangairport.vn/files/media/202411/17ed00d1-5fe4-4a85-b847-01b5fed39345.jpg",
    "VIETJET AIR": "https://danangairport.vn/files/media/202411/VJ.jpg",
    "VIETNAM AIRLINES": "https://danangairport.vn/files/media/202411/d8a44873-4441-4663-8b0b-415a687e7f89.jpg",
    "AIR ASIA": "https://danangairport.vn/files/media/202411/AK.jpg",
    "SINGAPORE AIRLINES": "https://danangairport.vn/files/media/202411/b6354f97-8558-4983-94f5-44f5c5fc7fff.jpg"
};

const FlightList = () => {
    const [flights, setFlights] = useState([]);

    // State bộ lọc
    const [searchAirline, setSearchAirline] = useState("");
    const [searchOrigin, setSearchOrigin] = useState("");      // Mới
    const [searchDestination, setSearchDestination] = useState(""); // Mới
    const [searchDate, setSearchDate] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getAllFlights();
                setFlights(data);
            } catch (error) {
                toast.error("Lỗi tải dữ liệu ban đầu");
            }
        };
        loadData();
    }, []);

    const handleSearch = async () => {
        try {
            // Truyền đủ 5 tham số
            const data = await searchFlight(searchAirline, searchOrigin, searchDestination, searchDate, maxPrice);
            setFlights(data);
        } catch (error) {
            toast.error("Lỗi khi tìm kiếm");
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn hủy chuyến bay này?")) {
            const isSuccess = await cancelFlight(id);
            if (isSuccess) {
                toast.success("Hủy chuyến thành công");
                handleSearch();
            } else {
                toast.error("Không thể hủy chuyến bay này");
            }
        }
    }

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString('vi-VN');
    }

    const renderStatusBadge = (status) => {
        let badgeClass = "bg-secondary";
        let label = status;
        switch (status) {
            case "SCHEDULED": badgeClass = "bg-success"; label = "Sắp bay"; break;
            case "DELAYED": badgeClass = "bg-warning text-dark"; label = "Hoãn"; break;
            case "CANCELLED": badgeClass = "bg-danger"; label = "Đã hủy"; break;
            case "COMPLETED": badgeClass = "bg-secondary"; label = "Hoàn thành"; break;
            case "IN_FLIGHT": badgeClass = "bg-primary"; label = "Đang bay"; break;
            default: break;
        }
        return <span className={`badge ${badgeClass}`}>{label}</span>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary mb-4">Quản Lý Chuyến Bay</h2>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    {/* Hàng 1: Hãng + Ngày + Giá */}
                    <div className="row g-2 mb-2">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Hãng bay:</label>
                            <input className="form-control" placeholder="Tên hãng..." value={searchAirline} onChange={(e) => setSearchAirline(e.target.value)}/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Ngày khởi hành:</label>
                            <input type="date" className="form-control" value={searchDate} onChange={(e) => setSearchDate(e.target.value)}/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Giá tối đa:</label>
                            <input type="number" className="form-control" placeholder="Giá..." value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}/>
                        </div>
                    </div>

                    {/* Hàng 2: Nơi đi + Nơi đến + Nút tìm */}
                    <div className="row g-2 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Nơi đi:</label>
                            <input className="form-control" placeholder="Sân bay đi..." value={searchOrigin} onChange={(e) => setSearchOrigin(e.target.value)}/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Nơi đến:</label>
                            <input className="form-control" placeholder="Sân bay đến..." value={searchDestination} onChange={(e) => setSearchDestination(e.target.value)}/>
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-primary w-100" onClick={handleSearch}>Tìm kiếm</button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <Link to="/flights/create" className="btn btn-success">Thêm mới chuyến bay</Link>
                    </div>
                </div>
            </div>

            <div className="table-responsive shadow rounded">
                <table className="table table-hover table-striped mb-0 align-middle">
                    <thead className="table-dark text-center">
                    <tr>
                        <th>STT</th>
                        <th>Mã CB</th>
                        <th className="text-start">Hãng Hàng Không</th>
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
                            <td className="text-start">
                                <div className="d-flex align-items-center">
                                    <img src={AIRLINE_LOGOS[item.airline] || "https://via.placeholder.com/40"} alt="logo" style={{ width: "40px", height: "40px", objectFit: "contain", marginRight: "10px" }}/>
                                    <span>{item.airline}</span>
                                </div>
                            </td>
                            <td>{item.origin} <br/> &#8594; {item.destination}</td>
                            <td>{formatDateTime(item.departureTime)}</td>
                            <td>{formatDateTime(item.arrivalTime)}</td>
                            <td className="fw-bold text-success">{item.price ? item.price.toLocaleString() : 0} VNĐ</td>
                            <td>{renderStatusBadge(item.status)}</td>
                            <td>
                                {item.status !== 'CANCELLED' && (
                                    <div className="d-flex justify-content-center gap-2">
                                        <Link to={`/flights/edit/${item.id}`} className="btn btn-warning btn-sm">Sửa</Link>
                                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Hủy</button>
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