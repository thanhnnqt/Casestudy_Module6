import {deleteEmployee} from "../service/employeeService.js";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Button, Modal} from "react-bootstrap";


const DeleteEmployeeModal = ({
                                 show,
                                 handleToggleModal,
                                 objectDelete,
                                 reloadAfterDelete
                             }) => {

    const navigate = useNavigate();

    const handleDeleteEmployee = async () => {
        const isDeleteSucceed = await deleteEmployee(objectDelete?.id);

        if (isDeleteSucceed) {
            toast.success("Xóa nhân viên thành công!", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000
            });
            navigate("/employees");
        } else {
            toast.error("Xóa nhân viên không thành công!", {
                position: "top-right",
                theme: "colored",
                autoClose: 3000
            });
        }
        reloadAfterDelete();
    };

    return (
        <Modal
            show={show}
            onHide={handleToggleModal}
            centered
            backdrop="static"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-semibold text-danger d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-triangle-fill fs-4"></i>
                    Xác nhận xóa nhân viên
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="pt-2">
                <div className="border rounded-3 p-3 bg-light">
                    <p className="mb-2 text-muted">
                        Bạn đang chuẩn bị xóa nhân viên sau:
                    </p>

                    <ul className="list-unstyled mb-0">
                        <li className="mb-1">
                            <span className="text-secondary">Mã nhân viên:</span>
                            <span className="fw-semibold text-danger ms-2">
                                NV{objectDelete?.id}
                            </span>
                        </li>
                        <li>
                            <span className="text-secondary">Họ và tên:</span>
                            <span className="fw-semibold text-danger ms-2">
                                {objectDelete?.fullName}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="alert alert-warning mt-3 mb-0 small">
                    <i className="bi bi-info-circle me-1"></i>
                    Hành động này <strong>không thể hoàn tác</strong>.
                </div>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0">
                <Button
                    variant="outline-secondary"
                    onClick={handleToggleModal}
                >
                    Hủy
                </Button>

                <Button
                    variant="danger"
                    className="px-4"
                    onClick={handleDeleteEmployee}
                >
                    <i className="bi bi-trash-fill me-1"></i>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteEmployeeModal;
