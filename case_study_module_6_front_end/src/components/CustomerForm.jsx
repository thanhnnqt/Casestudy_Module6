import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createCustomer, getCustomerById, updateCustomer } from '../services/CustomerService';
import "../modules/flight/components/FlightList.css";

const CustomerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [customer, setCustomer] = useState({
        // customerCode: '', // Không cần state này nữa khi thêm mới, nhưng giữ để hiển thị khi Edit
        fullName: '',
        dateOfBirth: '',
        gender: 'NAM',
        phoneNumber: '',
        email: '',
        identityCard: '',
        address: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            const loadData = async () => {
                try {
                    const data = await getCustomerById(id);
                    setCustomer(data);
                } catch (error) {
                    toast.error('Không tìm thấy thông tin khách hàng!');
                    navigate('/customers');
                }
            };
            loadData();
        }
    }, [id, isEditMode, navigate]);

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const birthDate = new Date(customer.dateOfBirth);

        // --- ĐÃ XÓA VALIDATE MÃ KHÁCH HÀNG ---
        // Vì mã này backend tự sinh

        const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
        if (!customer.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên.";
        else if (!nameRegex.test(customer.fullName)) newErrors.fullName = "Tên không hợp lệ.";

        if (!customer.dateOfBirth) newErrors.dateOfBirth = "Vui lòng chọn ngày sinh.";
        else if (birthDate >= today) newErrors.dateOfBirth = "Ngày sinh không được vượt quá ngày hiện tại.";

        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!customer.phoneNumber.trim()) newErrors.phoneNumber = "Vui lòng nhập số điện thoại.";
        else if (!phoneRegex.test(customer.phoneNumber)) newErrors.phoneNumber = "SĐT không đúng định dạng VN.";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (customer.email && !emailRegex.test(customer.email)) {
            newErrors.email = "Email không đúng định dạng.";
        }

        const idCardRegex = /^(\d{9}|\d{12})$/;
        if (!customer.identityCard.trim()) newErrors.identityCard = "Vui lòng nhập CMND/CCCD.";
        else if (!idCardRegex.test(customer.identityCard)) newErrors.identityCard = "CMND/CCCD phải là 9 hoặc 12 số.";

        if (!customer.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.warning("Vui lòng kiểm tra lại thông tin!");
            return;
        }
        try {
            if (isEditMode) {
                await updateCustomer(id, customer);
                toast.success('Cập nhật thành công!');
            } else {
                await createCustomer(customer);
                toast.success('Thêm mới thành công!');
            }
            navigate('/customers');
        } catch (error) {
            const errorMsg = error.response?.data || 'Có lỗi xảy ra!';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="p-4 bg-white d-flex justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="card border-0 shadow-lg" style={{ maxWidth: '900px', width: '100%', height: 'fit-content' }}>
                <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                    <h3 className="fw-bold text-dark m-0">
                        <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2 text-primary`}></i>
                        {isEditMode ? 'Cập Nhật Hồ Sơ' : 'Thêm Khách Hàng Mới'}
                    </h3>
                    <Link to="/customers" className="btn btn-light rounded-pill btn-sm border">
                        <i className="bi bi-x-lg"></i> Đóng
                    </Link>
                </div>

                <div className="card-body p-5">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">

                            {/* --- BỎ Ô NHẬP MÃ KHÁCH HÀNG Ở ĐÂY --- */}
                            {/* Nếu là chế độ Edit, có thể hiển thị mã để xem (readonly), còn thêm mới thì ẩn luôn */}
                            {isEditMode && (
                                <div className="col-12">
                                    <div className="alert alert-light border d-flex align-items-center">
                                        <i className="bi bi-qr-code me-2 text-primary"></i>
                                        <strong>Mã khách hàng:</strong>
                                        <span className="ms-2 badge bg-primary">{customer.customerCode}</span>
                                    </div>
                                </div>
                            )}

                            {/* Các trường còn lại giữ nguyên */}
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">HỌ VÀ TÊN <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control bg-light ${errors.fullName ? 'is-invalid' : ''}`}
                                    name="fullName"
                                    value={customer.fullName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ tên đầy đủ"
                                />
                                {errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">NGÀY SINH <span className="text-danger">*</span></label>
                                <input
                                    type="date"
                                    className={`form-control bg-light ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                                    name="dateOfBirth"
                                    value={customer.dateOfBirth}
                                    onChange={handleChange}
                                />
                                {errors.dateOfBirth && <div className="text-danger small mt-1">{errors.dateOfBirth}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">GIỚI TÍNH</label>
                                <select
                                    className="form-select bg-light"
                                    name="gender"
                                    value={customer.gender}
                                    onChange={handleChange}
                                >
                                    <option value="NAM">Nam</option>
                                    <option value="NU">Nữ</option>
                                    <option value="KHAC">Khác</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">SỐ ĐIỆN THOẠI <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control bg-light ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                    name="phoneNumber"
                                    value={customer.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="09xx..."
                                />
                                {errors.phoneNumber && <div className="text-danger small mt-1">{errors.phoneNumber}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">EMAIL</label>
                                <input
                                    type="email"
                                    className={`form-control bg-light ${errors.email ? 'is-invalid' : ''}`}
                                    name="email"
                                    value={customer.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.com"
                                />
                                {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">CMND/CCCD <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control bg-light ${errors.identityCard ? 'is-invalid' : ''}`}
                                    name="identityCard"
                                    value={customer.identityCard}
                                    onChange={handleChange}
                                    placeholder="Số thẻ căn cước"
                                />
                                {errors.identityCard && <div className="text-danger small mt-1">{errors.identityCard}</div>}
                            </div>

                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold">ĐỊA CHỈ <span className="text-danger">*</span></label>
                                <textarea
                                    className={`form-control bg-light ${errors.address ? 'is-invalid' : ''}`}
                                    name="address"
                                    rows="2"
                                    value={customer.address}
                                    onChange={handleChange}
                                    placeholder="Địa chỉ liên hệ..."
                                ></textarea>
                                {errors.address && <div className="text-danger small mt-1">{errors.address}</div>}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-5">
                            <Link to="/customers" className="btn btn-light rounded-pill px-4 fw-bold border">
                                Hủy bỏ
                            </Link>
                            <button type="submit" className="btn btn-primary rounded-pill px-5 shadow fw-bold">
                                {isEditMode ? 'Lưu Thay Đổi' : 'Xác Nhận Thêm'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerForm;