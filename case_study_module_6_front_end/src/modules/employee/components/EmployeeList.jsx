import {useEffect, useState} from "react";
import {
    getEmployeeList,
    getEmployeeListBySearch
} from "../service/employeeService.js";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
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

    const [field, setField] = useState("employeeCode");
    const [keyword, setKeyword] = useState("");

    // ===== EFFECT =====
    useEffect(() => {
        const fetchData = async () => {
            const data = await getEmployeeList();

            // SẮP XẾP GIẢM DẦN
            const sorted = [...data].sort((a, b) => b.id - a.id);

            setEmployeeList(sorted);
        };
        fetchData();
    }, [deleteFlag]);

    // ===== HANDLERS =====
    const reloadAfterDelete = () => {
        setShowModal(false);
        setDeleteFlag(prev => !prev);
    };

    const handleToggleModal = (employee) => {
        setShowModal(prev => !prev);
        setEmployeeDelete(employee);
    };

    const handleEdit = (id) => {
        navigate(`/employees/edit/${id}`);
    };

    const handleSearch = async () => {
        const data = await getEmployeeListBySearch(field, keyword);
        setEmployeeList(data);
    };

    const handleBackToAdmin = () => {
        navigate("/flights");
    };

    // ===== RENDER =====
    return (
        <div className="employee-list-container">
        <div className="container-fluid py-4 mt-5">

            {/* ===== HEADER ===== */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bi bi-people-fill me-2"></i>
                        Danh sách nhân viên
                    </h3>
                    <small className="text-muted">
                        Quản lý thông tin và tài khoản nhân viên hệ thống
                    </small>
                </div>

                <div className="d-flex align-items-center gap-2">
        <span className="badge bg-secondary px-3 py-2">
            <i className="bi bi-shield-lock me-1"></i> Admin
        </span>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleBackToAdmin}
                    >
                        <i className="bi bi-arrow-left me-1"></i>
                        Quay về Admin
                    </button>
                </div>
            </div>


            {/* ===== ACTION BAR ===== */}
            <div className="card mb-4">
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">

                    <Link to="/employees/add" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-1"></i>
                        Thêm nhân viên
                    </Link>

                    <div className="d-flex gap-2">
                        <select
                            className="form-select"
                            value={field}
                            onChange={(e) => setField(e.target.value)}
                        >
                            <option value="employeeCode">Mã nhân viên</option>
                            <option value="fullName">Họ tên</option>
                        </select>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập từ khóa"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />

                        <button className="btn btn-outline-primary" onClick={handleSearch}>
                            <i className="bi bi-search"></i>
                        </button>
                    </div>

                </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th className="text-center">STT</th>
                            <th className="text-center">Ảnh</th>
                            <th className="text-center">Mã NV</th>
                            <th>Họ tên</th>
                            <th className="text-center">Giới tính</th>
                            <th>Email</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                        </thead>

                        <tbody>
                        {employeeList.length > 0 ? employeeList.map((e, i) => (
                            <tr key={e.id}>
                                <td className="text-center">{i + 1}</td>

                                <td className="text-center">
                                    {e.imgURL ? (
                                        <img
                                            src={e.imgURL}
                                            alt="avatar"
                                            width={48}
                                            height={48}
                                            style={{objectFit: "cover", borderRadius: 6}}
                                        />
                                    ) : "—"}
                                </td>

                                <td className="text-center">NV{i+1}</td>
                                <td>{e.fullName}</td>
                                <td className="text-center">{e.gender}</td>
                                <td>{e.email}</td>

                                <td className="text-center">
                                    <button
                                        className="btn btn-outline-danger btn-sm me-1"
                                        onClick={() => handleToggleModal(e)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>

                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => handleEdit(e.id)}
                                    >
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center text-muted py-4">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
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
