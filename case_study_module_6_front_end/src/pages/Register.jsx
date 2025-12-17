function Register() {
    return (
        <div className="container my-5" style={{ maxWidth: "520px" }}>
            <div className="card shadow border-0 rounded-4">
                <div className="card-body p-4">

                    <h4 className="fw-bold text-center mb-3">Đăng ký tài khoản</h4>
                    <p className="text-muted text-center mb-4">
                        Tạo tài khoản để nhận nhiều ưu đãi
                    </p>

                    <form>
                        <div className="mb-3">
                            <label className="form-label">Họ và tên</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập họ và tên"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Ít nhất 8 ký tự"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>

                        <button className="btn btn-success w-100 fw-bold">
                            Đăng ký
                        </button>

                        <div className="text-center mt-3">
                            <span className="text-muted">Đã có tài khoản?</span>{" "}
                            <a href="/login">Đăng nhập</a>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default Register;
