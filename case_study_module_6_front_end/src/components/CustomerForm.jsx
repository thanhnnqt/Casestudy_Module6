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
        customerCode: '',
        fullName: '',
        dateOfBirth: '',
        gender: 'NAM',
        phoneNumber: '',
        identityCard: '',
        address: ''
    });

    // State lưu lỗi validation
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

    // Hàm validate chi tiết
    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const birthDate = new Date(customer.dateOfBirth);

        // 1. Mã khách hàng (Bắt buộc)
        if (!customer.customerCode.trim()) {
            newErrors.customerCode = "Vui lòng nhập mã khách hàng.";
        } else if (!/^KH\d{3,}$/.test(customer.customerCode)) {
            // Ví dụ: Bắt buộc định dạng KH + số (KH001). Bạn có thể bỏ dòng này nếu không cần.
            // newErrors.customerCode = "Mã khách hàng phải đúng định dạng (VD: KH001)";
        }

        // 2. Họ và tên (Tiếng Việt, không ký tự đặc biệt, viết hoa chữ cái đầu mỗi từ là tốt nhất nhưng ở đây chỉ check ký tự)
        const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
        if (!customer.fullName.trim()) {
            newErrors.fullName = "Vui lòng nhập họ và tên.";
        } else if (!nameRegex.test(customer.fullName)) {
            newErrors.fullName = "Tên không được chứa số hoặc ký tự đặc biệt.";
        }

        // 3. Ngày sinh (Không được lớn hơn ngày hiện tại)
        if (!customer.dateOfBirth) {
            newErrors.dateOfBirth = "Vui lòng chọn ngày sinh.";
        } else if (birthDate >= today) {
            newErrors.dateOfBirth = "Ngày sinh không được vượt quá ngày hiện tại.";
        }

        // 4. Số điện thoại (10 số, bắt đầu bằng 03, 05, 07, 08, 09 - Chuẩn VN)
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!customer.phoneNumber.trim()) {
            newErrors.phoneNumber = "Vui lòng nhập số điện thoại.";
        } else if (!phoneRegex.test(customer.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ (VD: 0901234567).";
        }

        // 5. CCCD/CMND (9 hoặc 12 số)
        const idCardRegex = /^(\d{9}|\d{12})$/;
        if (!customer.identityCard.trim()) {
            newErrors.identityCard = "Vui lòng nhập CMND/CCCD.";
        } else if (!idCardRegex.test(customer.identityCard)) {
            newErrors.identityCard = "CMND/CCCD phải là 9 hoặc 12 chữ số.";
        }

        // 6. Địa chỉ (Bắt buộc)
        if (!customer.address.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ.";
        }

        setErrors(newErrors);
        // Trả về true nếu không có lỗi (Object keys length === 0)
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });

        // Xóa lỗi ngay khi người dùng bắt đầu sửa
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // GỌI HÀM VALIDATE TRƯỚC KHI GỬI
        if (!validateForm()) {
            toast.warning("Vui lòng kiểm tra lại thông tin nhập liệu!");
            return;
        }

        try {
            if (isEditMode) {
                await updateCustomer(id, customer);
                toast.success('Cập nhật thông tin thành công!');
            } else {
                await createCustomer(customer);
                toast.success('Thêm mới khách hàng thành công!');
            }
            navigate('/customers');
        } catch (error) {
            const errorMsg = error.response?.data || 'Có lỗi xảy ra, vui lòng thử lại!';
            toast.error(errorMsg);
        }
    };

    return (
        <div className="flight-list-container">
            {/* Background Bầu trời */}
            <div className="sky-container">
                <i className="bi bi-cloud-fill cloud" style={{ top: '10%', fontSize: '120px', animationDuration: '45s', opacity: 0.4 }}></i>
                <i className="bi bi-cloud-fill cloud" style={{ top: '60%', fontSize: '150px', animationDuration: '55s', animationDelay: '-5s', opacity: 0.2 }}></i>
            </div>


            {/* Main Content */}
            <div className="main d-flex flex-column justify-content-center align-items-center" style={{minHeight: '100vh'}}>

                <div className="glass-card p-5 shadow-lg" style={{ maxWidth: '900px', width: '100%' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h3 className="fw-bold text-dark m-0">
                            <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2 text-primary`}></i>
                            {isEditMode ? 'Cập Nhật Hồ Sơ' : 'Thêm Khách Hàng Mới'}
                        </h3>
                        <Link to="/customers" className="btn btn-outline-secondary rounded-pill btn-sm">
                            <i className="bi bi-x-lg"></i> Đóng
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            {/* Cột trái */}
                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">MÃ KHÁCH HÀNG <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-qr-code"></i></span>
                                    <input
                                        type="text"
                                        className={`form-control custom-input bg-light ${errors.customerCode ? 'is-invalid' : ''}`}
                                        name="customerCode"
                                        value={customer.customerCode}
                                        onChange={handleChange}
                                        disabled={isEditMode}
                                        placeholder="VD: KH001"
                                    />
                                </div>
                                {errors.customerCode && <div className="text-danger small mt-1 ms-1">{errors.customerCode}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">HỌ VÀ TÊN <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-person"></i></span>
                                    <input
                                        type="text"
                                        className={`form-control custom-input bg-light ${errors.fullName ? 'is-invalid' : ''}`}
                                        name="fullName"
                                        value={customer.fullName}
                                        onChange={handleChange}
                                        placeholder="Nhập họ tên đầy đủ"
                                    />
                                </div>
                                {errors.fullName && <div className="text-danger small mt-1 ms-1">{errors.fullName}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">NGÀY SINH <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-calendar-event"></i></span>
                                    <input
                                        type="date"
                                        className={`form-control custom-input bg-light ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                                        name="dateOfBirth"
                                        value={customer.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.dateOfBirth && <div className="text-danger small mt-1 ms-1">{errors.dateOfBirth}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">GIỚI TÍNH</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-gender-ambiguous"></i></span>
                                    <select
                                        className="form-select custom-input bg-light"
                                        name="gender"
                                        value={customer.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="NAM">Nam</option>
                                        <option value="NU">Nữ</option>
                                        <option value="KHAC">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">SỐ ĐIỆN THOẠI <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-telephone"></i></span>
                                    <input
                                        type="text"
                                        className={`form-control custom-input bg-light ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                        name="phoneNumber"
                                        value={customer.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="09xx..."
                                    />
                                </div>
                                {errors.phoneNumber && <div className="text-danger small mt-1 ms-1">{errors.phoneNumber}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted small fw-bold">CMND/CCCD <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-card-heading"></i></span>
                                    <input
                                        type="text"
                                        className={`form-control custom-input bg-light ${errors.identityCard ? 'is-invalid' : ''}`}
                                        name="identityCard"
                                        value={customer.identityCard}
                                        onChange={handleChange}
                                        placeholder="9 hoặc 12 số"
                                    />
                                </div>
                                {errors.identityCard && <div className="text-danger small mt-1 ms-1">{errors.identityCard}</div>}
                            </div>

                            <div className="col-12">
                                <label className="form-label text-muted small fw-bold">ĐỊA CHỈ <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-light"><i className="bi bi-geo-alt"></i></span>
                                    <textarea
                                        className={`form-control custom-input bg-light ${errors.address ? 'is-invalid' : ''}`}
                                        name="address"
                                        rows="2"
                                        value={customer.address}
                                        onChange={handleChange}
                                        placeholder="Địa chỉ liên hệ..."
                                    ></textarea>
                                </div>
                                {errors.address && <div className="text-danger small mt-1 ms-1">{errors.address}</div>}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-5">
                            <Link to="/customers" className="btn btn-light rounded-pill px-4 fw-bold">
                                Hủy bỏ
                            </Link>
                            <button type="submit" className="btn btn-gradient rounded-pill px-5 shadow fw-bold text-white">
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