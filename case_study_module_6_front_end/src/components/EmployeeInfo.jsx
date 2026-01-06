import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// 1. Import useAuth để lấy thông tin chuẩn
import { useAuth } from "../context/AuthContext";
import { getEmployeeById, changePassword } from '../services/employeeService';
import "../modules/flight/components/FlightList.css";

const EmployeeInfo = () => {
    // 2. Lấy user từ Context (Giống Profile.jsx)
    const { user } = useAuth();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        id: '', fullName: 'Đang tải...', address: '', phoneNumber: '',
        identificationId: '', email: '', dob: '', gender: '',
        imgURL: '', account: { username: '' }
    });

    const [showModal, setShowModal] = useState(false);
    const [passForm, setPassForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- BỎ HÀM decodeJwt THỦ CÔNG ĐI ---

    useEffect(() => {
        const fetchProfile = async () => {
            // 3. Kiểm tra user từ Context
            if (!user) {
                // Nếu chưa có user (có thể do reload trang chưa kịp load context), chờ một chút hoặc return
                return;
            }

            // Kiểm tra role cho chắc chắn
            if (user.role !== "EMPLOYEE" && user.role !== "ADMIN") {
                // Nếu không phải nhân viên/admin thì không cho xem (tùy logic bạn)
                return;
            }

            // 4. Lấy ID chuẩn từ user.profileId (Giống Profile.jsx)
            const employeeId = user.profileId;

            console.log("ID Nhân viên từ Context:", employeeId);

            if (employeeId) {
                try {
                    const data = await getEmployeeById(employeeId);
                    console.log("Dữ liệu API trả về:", data);

                    setEmployee({
                        ...data,
                        fullName: data.fullName || data.full_name,
                        imgURL: data.imgURL || data.imgUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                        dob: data.dob || data.dateOfBirth,
                        phoneNumber: data.phoneNumber || data.phone_number,
                        identificationId: data.identificationId || data.identification_id,
                        account: data.account || { username: user.username } // Fallback username từ context
                    });
                } catch (error) {
                    console.error("Lỗi gọi API:", error);
                    toast.error("Không thể tải thông tin nhân viên.");
                }
            } else {
                toast.error("Không tìm thấy ID nhân viên hợp lệ.");
            }
        };

        fetchProfile();
    }, [user]); // Chạy lại khi user thay đổi (lúc mới load trang)

    const handleChangePass = (e) => {
        setPassForm({ ...passForm, [e.target.name]: e.target.value });
    };

    const handleSubmitPass = async (e) => {
        e.preventDefault();
        if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!"); return;
        }
        if (passForm.newPassword !== passForm.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!"); return;
        }
        if (passForm.newPassword.length < 6) {
            toast.warning("Mật khẩu mới phải có ít nhất 6 ký tự!"); return;
        }

        setIsSubmitting(true);
        try {
            await changePassword({
                oldPassword: passForm.currentPassword,
                newPassword: passForm.newPassword
            });

            toast.success("Đổi mật khẩu thành công!");
            setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowModal(false);
        } catch (error) {
            console.error("Lỗi đổi mật khẩu:", error);
            if (error.response && error.response.data) {
                toast.error(typeof error.response.data === 'string'
                    ? error.response.data
                    : "Đổi mật khẩu thất bại!");
            } else {
                toast.error("Lỗi kết nối server!");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <div className="sky-container" style={{ position: 'fixed', zIndex: 0 }}>
                <i className="bi bi-cloud-fill cloud" style={{ top: '10%', fontSize: '100px', opacity: 0.2 }}></i>
            </div>

            <div className="d-flex justify-content-center pt-5 position-relative" style={{ zIndex: 1 }}>
                <div className="card border-0 shadow-lg overflow-hidden" style={{ maxWidth: '1000px', width: '95%', borderRadius: '15px' }}>
                    <div className="card-header bg-primary text-white p-4 d-flex justify-content-between align-items-center">
                        <h3 className="mb-0 fw-bold"><i className="bi bi-person-badge-fill me-2"></i> Hồ Sơ Nhân Viên</h3>
                        <button className="btn btn-warning fw-bold shadow-sm" onClick={() => setShowModal(true)}>
                            <i className="bi bi-key-fill me-2"></i>Đổi mật khẩu
                        </button>
                    </div>
                    <div className="row g-0">
                        <div className="col-md-4 bg-light d-flex flex-column align-items-center justify-content-center p-5 border-end">
                            <div className="mb-3 position-relative">
                                <img src={employee.imgURL} alt="Avatar" className="rounded-circle shadow border border-5 border-white" style={{ width: '160px', height: '160px', objectFit: 'cover' }}
                                     onError={(e) => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }} />
                            </div>
                            <h4 className="fw-bold mb-1 text-center">{employee.fullName}</h4>
                            <span className="text-muted">@{employee.account?.username}</span>
                            <span className="badge bg-primary mt-2 px-3">{employee.gender || '---'}</span>
                        </div>
                        <div className="col-md-8 p-5 bg-white">
                            <h5 className="text-primary fw-bold border-bottom pb-2 mb-4">Thông Tin Chi Tiết</h5>
                            <div className="row g-4">
                                <div className="col-md-6"><label className="text-muted small fw-bold">CCCD</label><div className="fs-5">{employee.identificationId || '---'}</div></div>
                                <div className="col-md-6"><label className="text-muted small fw-bold">Ngày sinh</label><div className="fs-5">{employee.dob}</div></div>
                                <div className="col-md-6"><label className="text-muted small fw-bold">Email</label><div className="fs-5">{employee.email}</div></div>
                                <div className="col-md-6"><label className="text-muted small fw-bold">SĐT</label><div className="fs-5">{employee.phoneNumber}</div></div>
                                <div className="col-12"><label className="text-muted small fw-bold">Địa chỉ</label><div className="p-3 bg-light rounded border-start border-4 border-primary mt-1">{employee.address}</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Đổi mật khẩu */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: '400px', animation: 'fadeIn 0.3s' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Đổi Mật Khẩu</h5>
                            <button className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <form onSubmit={handleSubmitPass}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Mật khẩu hiện tại</label>
                                <input type="password" name="currentPassword" className="form-control"
                                       value={passForm.currentPassword} onChange={handleChangePass} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Mật khẩu mới</label>
                                <input type="password" name="newPassword" className="form-control"
                                       value={passForm.newPassword} onChange={handleChangePass} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Xác nhận mật khẩu mới</label>
                                <input type="password" name="confirmPassword" className="form-control"
                                       value={passForm.confirmPassword} onChange={handleChangePass} />
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeInfo;