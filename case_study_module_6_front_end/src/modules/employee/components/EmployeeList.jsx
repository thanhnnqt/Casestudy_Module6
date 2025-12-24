import {useEffect, useState} from "react";
import {getEmployeeList} from "../service/employeeService.js";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DeleteEmployeeModal from "./DeleteEmployeeModal.jsx";
import {Link, useNavigate} from "react-router-dom";


const EmployeeList = () => {
    const [showModal, setShowModal] = useState(false);
    const [employeeDelete, setEmployeeDelete] = useState({});
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [employeeList, setEmployeeList] = useState([]);
    const navigate = useNavigate();

    const reloadAfterDelete = () => {
        setShowModal(prev => !prev);
        setDeleteFlag(prev => !prev);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getEmployeeList();
            setEmployeeList(data);
        }
        fetchData();
    }, [deleteFlag]);

    const handleToggleModal = (product) => {
        setShowModal(prev => !prev);
        setEmployeeDelete(product);
    };

    const handleEdit = (id) => {
        navigate(`/employees/edit/${id}`);
        console.log(id)
    }
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bi bi-people-fill me-2"></i>
                        Danh sách nhân viên bán vé
                    </h3>
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Quản lý thông tin và tài khoản nhân viên hệ thống
                    </small>
                </div>
                <span className="badge bg-secondary-subtle text-secondary fw-semibold px-3 py-2">
            <i className="bi bi-shield-lock me-1"></i>
            Admin
        </span>
            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">

                    <Link to={"/employees/add"} className="btn btn-primary px-4 fw-semibold">
                        <i className="bi bi-plus-lg me-1"></i>
                        Thêm nhân viên
                    </Link>

                    <div className="d-flex align-items-center gap-2">
                        <select className="form-select form-select-sm">
                            <option>Mã nhân viên</option>
                            <option>Họ tên</option>
                        </select>

                        <input type="text"
                               className="form-control form-control-sm"
                               placeholder="Nhập từ khóa tìm kiếm"/>

                        <button className="btn btn-outline-primary btn-sm px-3">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>

                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr className="text-muted">
                            <th className="text-center">STT</th>
                            <th className="text-center">Mã NV</th>
                            <th className="text-center">Họ tên</th>
                            <th className="text-center">Ngày sinh</th>
                            <th className="text-center">Giới tính</th>
                            <th className="text-center">Tài khoản</th>
                            <th className="text-center">Điện thoại</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                        </thead>

                        <tbody>
                        {employeeList.map((employee, i) => (
                            <tr key={employee.id}>
                                <td className={'text-center'}>
                                    {i + 1}
                                </td>
                                <td className={'text-center'}>
                                    {employee.employeeCode}
                                </td>
                                <td className={'text-center'}>
                                    {employee.fullName}
                                </td>
                                <td className={'text-center'}>
                                    {employee.dob}
                                </td>
                                <td className={'text-center'}>
                                    {employee.gender}
                                </td>
                                <td className={'text-center'}>
                                    {employee.email}
                                </td>
                                <td className={'text-center'}>
                                    {employee.phoneNumber}
                                </td>
                                <td className={'text-center'}>
                                    <button className={'btn btn-outline-danger me-1'} onClick={() => {
                                        handleToggleModal(employee)
                                    }}><i className="bi bi-trash"></i>
                                    </button>
                                    <button className={'btn btn-outline-primary'} onClick={() => {
                                        handleEdit(employee.id)
                                    }}><i
                                        className="bi bi-pencil-square"></i></button>
                                </td>
                            </tr>
                        ))}
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
    )
}

export default EmployeeList;