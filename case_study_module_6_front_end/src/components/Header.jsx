import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(localStorage.getItem("user"));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg shadow-sm fixed-top"
             style={{ backgroundColor: "#ffffff", height: "72px" }}>
            <div className="container">

                {/* LOGO */}
                <NavLink
                    className="navbar-brand fw-bold"
                    to="/"
                    style={{ color: "#1ba0e2", fontSize: "22px" }}
                >
                    ✈ FLY FAST
                </NavLink>

                {/* TOGGLER */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* MENU */}
                <div className="collapse navbar-collapse" id="mainNavbar">
                    <ul className="navbar-nav ms-auto align-items-center">

                        {/* Vé máy bay */}
                        <li className="nav-item dropdown">
              <span
                  className="nav-link dropdown-toggle fw-semibold"
                  role="button"
                  data-bs-toggle="dropdown"
              >
                Vé máy bay
              </span>
                            <ul className="dropdown-menu">
                                <li><NavLink className="dropdown-item" to="/">Vé nội địa</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/">Vé quốc tế</NavLink></li>
                            </ul>
                        </li>

                        {/* Dịch vụ */}
                        <li className="nav-item dropdown">
              <span
                  className="nav-link dropdown-toggle fw-semibold"
                  role="button"
                  data-bs-toggle="dropdown"
              >
                Dịch vụ
              </span>
                            <ul className="dropdown-menu">
                                <li><NavLink className="dropdown-item" to="/baggage">Hành lý</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/">Chọn chỗ</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/">Suất ăn</NavLink></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link fw-semibold" to="/promotion">
                                Khuyến mãi
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link fw-semibold" to="/promotion">
                                Tin tức
                            </NavLink>
                        </li>

                        {/* AUTH */}
                        {!user ? (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link fw-semibold" to="/login">
                                        Đăng nhập
                                    </NavLink>
                                </li>

                                <li className="nav-item ms-2">
                                    <NavLink
                                        className="btn text-white fw-semibold px-3"
                                        style={{ backgroundColor: "#1ba0e2" }}
                                        to="/register"
                                    >
                                        Đăng ký
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item dropdown ms-2">
                <span
                    className="nav-link dropdown-toggle fw-semibold"
                    role="button"
                    data-bs-toggle="dropdown"
                >
                  Xin chào, {user}
                </span>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><NavLink className="dropdown-item" to="/profile">Tài khoản</NavLink></li>
                                    <li>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
