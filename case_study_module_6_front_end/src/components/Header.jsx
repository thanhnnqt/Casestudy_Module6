import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        setOpen(false);
        logout();
        navigate("/");
    };

    // 👇 đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 👇 đóng dropdown khi user đổi (login / logout)
    useEffect(() => {
        setOpen(false);
    }, [user]);

    return (
        <nav
            className="navbar navbar-expand-lg shadow-sm fixed-top"
            style={{
                backgroundColor: "#ffffff",
                height: "72px",
                zIndex: 1050
            }}
        >
            <div className="container">

                {/* LOGO */}
                <NavLink
                    className="navbar-brand fw-bold"
                    to="/"
                    style={{ color: "#1ba0e2", fontSize: "22px" }}
                >
                    ✈ FLY FAST
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mainNavbar">
                    <ul className="navbar-nav ms-auto align-items-center">

                        {/* MENU */}
                        <li className="nav-item dropdown">
                            <NavLink className="nav-link fw-semibold" to="/flights/booking">
                                Vé máy bay
                            </NavLink>
                        </li>

                        {/*<li className="nav-item">*/}
                        {/*    <NavLink className="nav-link fw-semibold" to="/promotion">*/}
                        {/*        Khuyến mãi*/}
                        {/*    </NavLink>*/}
                        {/*</li>*/}

                        <li className="nav-item">
                            <NavLink className="nav-link fw-semibold" to="/flights">
                                Chuyến bay
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
                            <li
                                className="nav-item position-relative ms-2"
                                ref={dropdownRef}
                            >
                                {/* TOGGLE */}
                                <button
                                    className="nav-link fw-semibold btn btn-link text-decoration-none"
                                    onClick={() => setOpen(!open)}>
                                    <strong style={{ color: "#1ba0e2" }}>
                                        <span className="d-none d-sm-inline">Xin chào </span>
                                        {user.fullName || user.email}
                                    </strong>
                                </button>

                                {/* DROPDOWN */}
                                {open && (
                                    <ul
                                        className="dropdown-menu show dropdown-menu-end"
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            right: 0
                                        }}
                                    >
                                        <li>
                                            <NavLink
                                                className="dropdown-item"
                                                to="/profile"
                                                onClick={() => setOpen(false)}
                                            >
                                                Tài khoản
                                            </NavLink>
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={handleLogout}
                                            >
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
