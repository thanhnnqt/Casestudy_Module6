function Footer() {
    return (
        <footer
            className="footer-full"
            style={{ backgroundColor: "#0d6efd", color: "white" }}
        >
            {/* CONTAINER CHỈ GIỮ NỘI DUNG */}
            <div className="container py-3">

                <div className="row">

                    {/* BRAND */}
                    <div className="col-md-4 mb-2">
                        <h6 className="fw-bold mb-1">✈ FLY FAST</h6>
                        <p className="small mb-0">
                            Nền tảng đặt vé máy bay nhanh chóng, tiện lợi và tiết kiệm.
                        </p>
                    </div>

                    {/* LINKS */}
                    <div className="col-md-4 mb-2">
                        <h6 className="fw-bold mb-1">Liên kết</h6>
                        <ul className="list-unstyled mb-0 small">
                            <li><a href="/" className="text-white text-decoration-none">Trang chủ</a></li>
                            <li><a href="/promotion" className="text-white text-decoration-none">Khuyến mãi</a></li>
                            <li><a href="/baggage" className="text-white text-decoration-none">Hành lý</a></li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div className="col-md-4 mb-2">
                        <h6 className="fw-bold mb-1">Liên hệ</h6>
                        <p className="small mb-0">📍 TP. Đà Nẵng</p>
                        <p className="small mb-0">📞 0354 278 740</p>
                        <p className="small mb-0">✉ support@flyfast.vn</p>
                    </div>
                </div>

                <hr className="border-light my-2" />

                <div className="text-center small">
                    © 2025 FLY FAST
                </div>

            </div>
        </footer>
    );
}

export default Footer;
