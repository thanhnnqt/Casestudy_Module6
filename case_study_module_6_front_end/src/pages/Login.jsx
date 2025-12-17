function Login() {
    return (
        <div className="container my-5 d-flex justify-content-center">
            <div
                className="card shadow border-0"
                style={{ maxWidth: "420px", width: "100%" }}
            >
                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">Đăng nhập</h4>

                    <form>
                        {/* Tài khoản */}
                        <div className="mb-3">
                            <label className="form-label">Tài khoản</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tài khoản"
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        {/* Ghi nhớ + Quên mật khẩu */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="remember"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="remember"
                                >
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>

                            <a href="#" className="text-decoration-none">
                                Quên mật khẩu?
                            </a>
                        </div>

                        {/* Nút đăng nhập */}
                        <button className="btn btn-outline-dark w-100 fw-bold mb-3">
                            Đăng nhập
                        </button>

                        {/* Hoặc */}
                        <div className="text-center text-muted mb-3">
                            -------- Hoặc --------
                        </div>

                        {/* Gmail */}
                        <button
                            type="button"
                            className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                        >
                            <span className="fw-bold">G+</span>
                            Đăng nhập bằng Gmail
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
