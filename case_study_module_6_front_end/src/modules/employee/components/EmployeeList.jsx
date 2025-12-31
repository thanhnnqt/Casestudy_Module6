import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Import Portal cho Modal
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmployeeListBySearch, deleteEmployee } from "../service/employeeService.js"; // Đảm bảo bạn có hàm deleteEmployee

// Import Layout và CSS chung
import AdminLayout from "../../../layouts/AdminLayout";
import "../../flight/components/FlightList.css";

const EmployeeList = () => {
    const navigate = useNavigate();

    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [employeeList, setEmployeeList] = useState([]);
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 5; // Số lượng hiển thị mỗi trang

    // --- STATE MODAL XÓA ---
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // --- FETCH DATA ---
    const fetchEmployees = async (pageIndex = page) => {
        try {
            const data = await getEmployeeListBySearch(fullName, phoneNumber, pageIndex, pageSize);
            setEmployeeList(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            toast.error("Lỗi tải danh sách nhân viên");
        }
    };

    useEffect(() => {
        fetchEmployees(0);
        setPage(0);
    }, []);

    // --- HANDLERS ---
    const handleSearch = () => {
        setPage(0);
        fetchEmployees(0);
    };

    const handleReset = () => {
        setFullName("");
        setPhoneNumber("");
        setPage(0);
        getEmployeeListBySearch("", "", 0, pageSize).then(data => {
            setEmployeeList(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            fetchEmployees(newPage);
        }
    };

    // --- LOGIC MODAL ---
    const openDeleteModal = (employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
    };

    const closeDeleteModal = () => {
        setShowModal(false);
        setSelectedEmployee(null);
    };

    const confirmDelete = async () => {
        if (!selectedEmployee) return;
        try {
            await deleteEmployee(selectedEmployee.id);
            toast.success(`Đã xóa nhân viên: ${selectedEmployee.fullName}`);
            fetchEmployees(0);
        } catch (error) {
            toast.error("Xóa thất bại!");
        } finally {
            closeDeleteModal();
        }
    };

    return (
        <AdminLayout>
            {/* 1. HEADER */}
            <div className="glass-card d-flex justify-content-between align-items-center mb-4 sticky-header">
                <div>
                    <h2 className="fw-bold mb-1 text-dark">Quản lý nhân viên</h2>
                    <p className="text-muted mb-0">Theo dõi và quản lý hồ sơ nhân sự</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/employees/create" className="btn btn-primary shadow-lg fw-bold rounded-pill px-4">
                        <i className="bi bi-person-plus-fill me-2"></i>Thêm mới
                    </Link>
                </div>
            </div>

            {/* 2. STATS CARDS */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="glass-card stat-card h-100 d-flex align-items-center justify-content-between p-3" style={{borderLeft: '5px solid #1ba0e2'}}>
                        <div>
                            <div className="stat-label text-start">Tổng nhân viên</div>
                            <div className="stat-value text-start text-primary">{totalElements}</div>
                        </div>
                        <i className="bi bi-people-fill fs-1 text-primary opacity-25"></i>
                    </div>
                </div>
            </div>

            {/* 3. FILTER SECTION */}
            <div className="glass-card p-4 mb-4" style={{ position: 'relative', zIndex: 10 }}>
                <label className="form-label text-muted small fw-bold text-uppercase mb-3">Bộ lọc tìm kiếm</label>
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Tên nhân viên..."
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0"><i className="bi bi-telephone text-muted"></i></span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Số điện thoại..."
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-5 d-flex gap-2">
                        <button className="btn btn-primary fw-bold px-4" onClick={handleSearch}>
                            Tìm kiếm
                        </button>
                        <button className="btn btn-light border fw-bold px-3" onClick={handleReset} title="Làm mới">
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. TABLE SECTION */}
            <div className="glass-card p-0 overflow-hidden shadow-sm mb-5">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle flight-table">
                        <thead className="bg-light text-secondary">
                        <tr>
                            <th className="ps-4">#</th>
                            <th className="text-center">Ảnh đại diện</th>
                            <th>Họ và tên</th>
                            <th className="text-center">Giới tính</th>
                            <th>Email</th>
                            <th className="text-center">Số điện thoại</th>
                            <th className="text-end pe-4">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employeeList.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 d-block mb-2 opacity-50"></i>
                                    Không tìm thấy nhân viên nào.
                                </td>
                            </tr>
                        ) : (
                            employeeList.map((e, index) => (
                                <tr key={e.id}>
                                    <td className="ps-4 fw-bold text-muted">{page * pageSize + index + 1}</td>
                                    <td className="text-center">
                                        <img
                                            src={e.imgURL || "https://via.placeholder.com/42"}
                                            width={42} height={42}
                                            className="rounded-circle border p-1 bg-white"
                                            style={{objectFit: "cover"}}
                                            alt="avatar"
                                            onError={(evt) => evt.target.src = "https://via.placeholder.com/42"}
                                        />
                                    </td>
                                    <td>
                                        <span className="fw-bold text-dark">{e.fullName}</span>
                                    </td>
                                    <td className="text-center">
                                            <span className={`badge ${e.gender === 'Nam' ? 'bg-primary' : e.gender === 'Nữ' ? 'bg-danger' : 'bg-secondary'} bg-opacity-10 text-dark border`}>
                                                {e.gender}
                                            </span>
                                    </td>
                                    <td className="text-muted small">{e.email}</td>
                                    <td className="text-center font-monospace text-primary">{e.phoneNumber}</td>
                                    <td className="text-end pe-4">
                                        <button
                                            className="btn btn-light border btn-sm me-2 text-primary shadow-sm rounded-circle"
                                            onClick={() => navigate(`/employees/edit/${e.id}`)}
                                            title="Sửa" style={{width: '32px', height: '32px'}}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-light border btn-sm text-danger shadow-sm rounded-circle"
                                            onClick={() => openDeleteModal(e)}
                                            title="Xóa" style={{width: '32px', height: '32px'}}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 5. PAGINATION */}
                {totalPages > 0 && (
                    <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light bg-opacity-25">
                        <div className="text-muted small">
                            Hiển thị <strong>{employeeList.length}</strong> kết quả
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-light rounded-circle shadow-sm border" onClick={() => handlePageChange(page - 1)} disabled={page === 0} style={{width: '35px', height: '35px'}}>
                                <i className="bi bi-chevron-left text-primary"></i>
                            </button>
                            <span className="fw-bold text-dark px-3 py-1 rounded bg-white shadow-sm border mx-2">
                                {page + 1} / {totalPages}
                            </span>
                            <button className="btn btn-light rounded-circle shadow-sm border" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} style={{width: '35px', height: '35px'}}>
                                <i className="bi bi-chevron-right text-primary"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 6. MODAL XÓA (PORTAL) */}
            {showModal && createPortal(
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 10000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={closeDeleteModal}
                >
                    <div
                        className="bg-white rounded-4 shadow-lg overflow-hidden"
                        style={{ width: '90%', maxWidth: '400px', animation: 'zoomIn 0.2s ease-out' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 text-center border-bottom bg-light bg-opacity-50">
                            <div className="mb-3 mx-auto bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                                <i className="bi bi-exclamation-triangle-fill text-danger fs-2"></i>
                            </div>
                            <h5 className="fw-bold text-dark mb-1">Xác nhận xóa?</h5>
                            <p className="text-muted small mb-0">Bạn có chắc muốn xóa nhân viên này không?</p>
                        </div>

                        {selectedEmployee && (
                            <div className="p-3 bg-white text-center border-bottom">
                                <div className="fw-bold text-primary">{selectedEmployee.fullName}</div>
                                <div className="small text-muted">{selectedEmployee.phoneNumber}</div>
                            </div>
                        )}

                        <div className="p-3 bg-light d-flex justify-content-center gap-2">
                            <button className="btn btn-light border px-4 rounded-pill fw-bold" onClick={closeDeleteModal}>Hủy bỏ</button>
                            <button className="btn btn-danger px-4 rounded-pill fw-bold shadow-sm" onClick={confirmDelete}>Xóa ngay</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            <style>{`@keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </AdminLayout>
    );
};

export default EmployeeList;