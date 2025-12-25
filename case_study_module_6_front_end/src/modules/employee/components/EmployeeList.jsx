import {useEffect, useState} from "react";
import {
    getEmployeeList,
    getEmployeeListBySearch
} from "../service/employeeService.js";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DeleteEmployeeModal from "./DeleteEmployeeModal.jsx";
import {Link, useNavigate} from "react-router-dom";
import "./EmployeeList.css";

const EmployeeList = () => {

    const navigate = useNavigate();

    // ===== STATE =====
    const [showModal, setShowModal] = useState(false);
    const [employeeDelete, setEmployeeDelete] = useState({});
    const [deleteFlag, setDeleteFlag] = useState(false);

    const [employeeList, setEmployeeList] = useState([]);

    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // FETCH LIST
    const fetchEmployees = async (pageIndex = page, search = false) => {
        const data = await getEmployeeListBySearch(
            search ? fullName : "",
            search ? phoneNumber : "",
            pageIndex,
            2
        );

        setEmployeeList(data.content || []);
        setTotalPages(data.totalPages || 0);
    };

// LOAD BAN ĐẦU + KHI XÓA
    useEffect(() => {
        fetchEmployees(0, false);
        setPage(0);
    }, [deleteFlag]);

// SEARCH
    const handleSearch = () => {
        setPage(0);
        fetchEmployees(0, true);
    };

// RESET
    const handleReset = () => {
        setFullName("");
        setPhoneNumber("");
        setPage(0);
        fetchEmployees(0, false);
    };

// PAGINATION CLICK
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            // vẫn giữ đúng logic search hiện tại nếu search rồi
            fetchEmployees(newPage, fullName || phoneNumber);
        }
    };

    const handleEdit = (id) => navigate(`/employees/edit/${id}`);
    const reloadAfterDelete = () => setDeleteFlag(prev => !prev);
    const handleToggleModal = (e) => {
        setEmployeeDelete(e);
        setShowModal(!showModal);
    };
    const handleBackToAdmin = () => navigate("/flights");

    return (
        <div className="employee-list-container">
            <div className="container-fluid py-4 mt-5">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold text-primary mb-1">
                            <i className="bi bi-people-fill me-2"></i>
                            Danh sách nhân viên
                        </h3>
                        <small className="text-muted">Quản lý nhân viên</small>
                    </div>

                    <button className="btn btn-outline-secondary btn-sm" onClick={handleBackToAdmin}>
                        <i className="bi bi-arrow-left me-1"></i> Quay về Admin
                    </button>
                </div>

                {/* SEARCH BAR */}
                <div className="card mb-4">
                    <div className="card-body d-flex justify-content-between align-items-center gap-3">

                        {/* LEFT: Add Button */}
                        <Link to="/employees/add" className="btn btn-primary">
                            <i className="bi bi-plus-lg me-1"></i> Thêm nhân viên
                        </Link>

                        {/* RIGHT: Search Controls */}
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="text"
                                className="form-control"
                                style={{maxWidth: "250px"}}
                                placeholder="Tìm theo họ tên"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            <input
                                type="text"
                                className="form-control"
                                style={{maxWidth: "200px"}}
                                placeholder="Tìm theo số điện thoại"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />

                            <button className="btn btn-outline-primary" onClick={handleSearch}>
                                <i className="bi bi-search"></i>
                            </button>

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    handleReset()
                                }}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>
                </div>


                {/* TABLE */}
                <div className="card">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                            <tr>
                                <th className="text-center">STT</th>
                                <th className="text-center">Ảnh</th>
                                <th>Họ tên</th>
                                <th className="text-center">Giới tính</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employeeList.length ? employeeList.map((e, i) => (
                                <tr key={e.id}>
                                    <td className="text-center">{page * 5 + i + 1}</td>
                                    <td className="text-center">
                                        <img src={e.imgURL} width={48} height={48}
                                             style={{objectFit: "cover", borderRadius: 6}} alt="avatar"/>
                                    </td>
                                    <td>{e.fullName}</td>
                                    <td className="text-center">{e.gender}</td>
                                    <td>{e.email}</td>
                                    <td>{e.phoneNumber}</td>
                                    <td className="text-center">
                                        <button className="btn btn-outline-danger btn-sm me-1"
                                                onClick={() => handleToggleModal(e)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                        <button className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleEdit(e.id)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted py-4">Không có nhân viên nào để hiển thị!</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <nav className="p-3 d-flex justify-content-center">
                            <ul className="pagination mb-0">
                                <li className={`page-item ${page === 0 && "disabled"}`}>
                                    <button className="page-link"
                                            onClick={() => handlePageChange(page - 1)}>
                                        Trước
                                    </button>
                                </li>

                                {[...Array(totalPages).keys()].map(p => (
                                    <li key={p}
                                        className={`page-item ${p === page ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(p)}>
                                            {p + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${page === totalPages - 1 && "disabled"}`}>
                                    <button className="page-link"
                                            onClick={() => handlePageChange(page + 1)}>
                                        Sau
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>

                {showModal && (
                    <DeleteEmployeeModal
                        show={showModal}
                        handleToggleModal={handleToggleModal}
                        objectDelete={employeeDelete}
                        reloadAfterDelete={reloadAfterDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default EmployeeList;
