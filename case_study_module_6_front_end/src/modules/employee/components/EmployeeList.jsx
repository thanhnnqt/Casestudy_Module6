import {useEffect, useState} from "react";
import {getEmployeeListBySearch} from "../service/employeeService.js";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DeleteEmployeeModal from "./DeleteEmployeeModal.jsx";
import {Link, useNavigate} from "react-router-dom";

const EmployeeList = () => {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [employeeDelete, setEmployeeDelete] = useState({});
    const [deleteFlag, setDeleteFlag] = useState(false);

    const [employeeList, setEmployeeList] = useState([]);
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchEmployees = async (pageIndex = page, search = false) => {
        const data = await getEmployeeListBySearch(
            search ? fullName : "",
            search ? phoneNumber : "",
            pageIndex,
            3
        );
        setEmployeeList(data.content || []);
        setTotalPages(data.totalPages || 0);
    };

    useEffect(() => {
        fetchEmployees(0);
        setPage(0);
    }, [deleteFlag]);

    const handleSearch = () => {
        setPage(0);
        fetchEmployees(0, true);
    };

    const handleReset = () => {
        setFullName("");
        setPhoneNumber("");
        setPage(0);
        fetchEmployees(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            fetchEmployees(newPage, fullName || phoneNumber);
        }
    };

    const handleEdit = (id) => navigate(`/employees/edit/${id}`);
    const reloadAfterDelete = () => setDeleteFlag(prev => !prev);
    const handleToggleModal = (e) => {
        setEmployeeDelete(e);
        setShowModal(!showModal);
    };
    const handleBack = () => navigate("/flights");

    return (
        <div className="container-fluid py-3">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="fw-bold text-primary mb-1">
                        <i className="bi bi-people-fill me-2"></i> Quản lý nhân viên
                    </h4>
                    <span className="text-muted small">Theo dõi và quản lý nhân sự</span>
                </div>
                <button className="btn btn-outline-dark btn-sm" onClick={handleBack}>
                    <i className="bi bi-arrow-left me-1"></i> Admin
                </button>
            </div>

            <div className="card-body d-flex align-items-center flex-wrap gap-2 mb-3">

                <div className="flex-shrink-0">
                    <Link
                        to="/employees/add"
                        className="btn btn-primary btn-sm d-flex align-items-center px-3"
                        title="Thêm nhân viên"
                    >
                        <i className="bi bi-plus-lg me-1"></i> Thêm
                    </Link>
                </div>

                {/* Search group */}
                <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-end flex-wrap">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Tên nhân viên"
                        style={{ width: "160px" }}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="SĐT"
                        style={{ width: "110px" }}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    <button
                        className="btn btn-outline-primary btn-sm"
                        title="Tìm kiếm"
                        onClick={handleSearch}
                    >
                        <i className="bi bi-search"></i>
                    </button>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        title="Đặt lại"
                        onClick={handleReset}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                </div>

            </div>


            {/* TABLE */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Ảnh</th>
                            <th>Họ tên</th>
                            <th className="text-center">Giới tính</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th className="text-center">Hành động</th>
                        </tr>
                        </thead>

                        <tbody>
                        {employeeList.length ? employeeList.map((e, i) => (
                            <tr key={e.id}>
                                <td className="text-center">{page * 5 + i + 1}</td>
                                <td className="text-center">
                                    <img src={e.imgURL} width={42} height={42}
                                         className="rounded" style={{objectFit: "cover"}} alt="avatar"/>
                                </td>
                                <td>{e.fullName}</td>
                                <td className="text-center">{e.gender}</td>
                                <td>{e.email}</td>
                                <td>{e.phoneNumber}</td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-outline-danger me-1"
                                            onClick={() => handleToggleModal(e)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleEdit(e.id)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center text-muted py-3">
                                    Không có nhân viên nào để hiển thị
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Simple Pagination with Ellipsis */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center gap-3 p-3">

                        {/* Previous Button */}
                        <button
                            className="btn btn-sm btn-outline-primary"
                            disabled={page === 0}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        {/* Ellipsis Before */}
                        {page > 0 && (
                            <span className="fw-semibold text-secondary">…</span>
                        )}

                        {/* Current Page */}
                        <span className="fw-bold text-primary">
            Trang {page + 1}/{totalPages}
        </span>

                        {/* Ellipsis After */}
                        {page < totalPages - 1 && (
                            <span className="fw-semibold text-secondary">…</span>
                        )}

                        {/* Next Button */}
                        <button
                            className="btn btn-sm btn-outline-primary"
                            disabled={page === totalPages - 1}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>

                    </div>
                )}

            </div>

            {/* MODAL DELETE */}
            {showModal && (
                <DeleteEmployeeModal
                    show={showModal}
                    handleToggleModal={handleToggleModal}
                    objectDelete={employeeDelete}
                    reloadAfterDelete={reloadAfterDelete}
                    list={employeeList}
                    setList={setEmployeeList}
                />
            )}
        </div>
    );
};

export default EmployeeList;
