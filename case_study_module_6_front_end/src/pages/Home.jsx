import { useState, useEffect } from "react";
import "../styles/home.css";
import { toast } from "react-toastify";
import { getAllNews } from "../services/NewsService";
import { Link, useNavigate } from "react-router-dom";
import ChatBox from "../components/chat/ChatBox.jsx";
import AdminFloatingChat from "../components/chat/AdminFloatingChat";
import { useAuth } from "../context/AuthContext";

const CHAT_ADMIN_TARGET = { customerAccountId: 1, customerUsername: "admin" };

function Home() {
    /* ================= CITY LIST ================= */
    const cities = [
        "Hà Nội (HAN)",
        "TP. Hồ Chí Minh (SGN)",
        "Đà Nẵng (DAD)",
        "Nha Trang (CXR)",
        "Phú Quốc (PQC)",
        "Cần Thơ (VCA)"
    ];

    /* MAP CITY → WEATHER API NAME (CHỈ PHỤC VỤ THỜI TIẾT) */
    const cityWeatherMap = {
        "Hà Nội (HAN)": "Hanoi",
        "TP. Hồ Chí Minh (SGN)": "Ho Chi Minh City",
        "Đà Nẵng (DAD)": "Da Nang",
        "Nha Trang (CXR)": "Nha Trang",
        "Phú Quốc (PQC)": "Phu Quoc",
        "Cần Thơ (VCA)": "Can Tho"
    };

    /* ================= STATE ================= */
    const [tripType, setTripType] = useState("ONE_WAY");
    const [showPassenger, setShowPassenger] = useState(false);


    const [form, setForm] = useState({
        from: "Đà Nẵng (DAD)",
        to: "TP. Hồ Chí Minh (SGN)",
        departureDate: "2025-12-18",
        returnDate: "",
        adult: 1,
        child: 0,
        infant: 0
    });

    /* ================= NEWS STATE ================= */
    const [newsList, setNewsList] = useState([]);
    useEffect(() => {
        const fetchNews = async () => {
            const data = await getAllNews();
            // Lấy 3 tin mới nhất
            if (data && Array.isArray(data)) {
                setNewsList(data.slice(0, 3));
            }
        };
        fetchNews();
    }, []);
    /* WEATHER STATE */
    const [weatherFrom, setWeatherFrom] = useState(null);
    const [weatherTo, setWeatherTo] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();
    const [openChat, setOpenChat] = useState(false);

    /* ================= HELPER ================= */
    const extractAirportCode = (cityStr) => {
        const match = cityStr.match(/\(([^)]+)\)/);
        return match ? match[1] : cityStr;
    };

    const handleSearchClick = () => {
        const searchData = {
            origin: extractAirportCode(form.from),
            destination: extractAirportCode(form.to),
            date: form.departureDate,
            returnDate: form.returnDate,
            tripType: tripType,
            passengers: {
                adult: form.adult,
                child: form.child,
                infant: form.infant
            }
        };
        navigate("/customer/booking", { state: searchData });
    };

    const admin = {
        id: 1,
        username: "admin"
    };

    /* ================= HANDLER ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const passengerText = () =>
        `${form.adult} NL, ${form.child} TE, ${form.infant} EB`;

    /* ================= DESTINATION SLIDER ================= */
    const destinations = [
        {
            name: "Đà Nẵng",
            img: "https://i.pinimg.com/1200x/32/f0/11/32f01197c72d5fc489fbfbb1e3d015b2.jpg",
            price: "Từ 899.000đ"
        },
        {
            name: "Phú Quốc",
            img: "https://i.pinimg.com/736x/e5/9c/35/e59c35cd8fcbd50a92675d3532d326b7.jpg",
            price: "Từ 1.299.000đ"
        },
        {
            name: "Nha Trang",
            img: "https://i.pinimg.com/736x/b9/95/a6/b995a625c2be0f26a7b7070eaaad530a.jpg",
            price: "Từ 999.000đ"
        },
        {
            name: "Hà Nội",
            img: "https://i.pinimg.com/1200x/39/e5/dc/39e5dc178fdf6d5649a356b2db5fba47.jpg",
            price: "Từ 799.000đ"
        },
        {
            name: "Đà lạt",
            img: "https://i.pinimg.com/736x/46/c4/33/46c433882688c09281f5a88d39571c1b.jpg",
            price: "Từ 999.000đ"
        }
    ];

    const promoCodes = [
        { code: "TVLKBANMOI10", desc: "✈️ Giảm 10.000 cho lần đặt đầu tiên" },
        { code: "TVLKBANMOI15", desc: "✈️ Giảm 15.000 cho khách mới" },
        { code: "TVLKBANMOI20", desc: "✈️ Giảm 20.000 cho lần đầu bay" },
        { code: "WELCOMEFLY", desc: "✈️ Ưu đãi chào mừng khách mới" },
        { code: "FIRSTTRIP", desc: "✈️ Giảm giá cho chuyến đi đầu tiên" }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    /* AUTO SLIDE */
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex(prev =>
                prev === destinations.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(timer);
    }, [activeIndex]);

    /* ================= WEATHER API ================= */
    const fetchWeather = async (city, date) => {
        try {
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=vi&appid=${apiKey}`
            );

            const data = await res.json();

            // ❗ BẮT BUỘC CHECK
            if (!data.list || !Array.isArray(data.list)) {
                console.error("Weather API response invalid:", data);
                return null;
            }

            return (
                data.list.find(item =>
                    item.dt_txt.startsWith(date)
                ) || data.list[0]
            );

        } catch (err) {
            console.error("Weather error:", err);
            return null;
        }
    };
    /* LOAD WEATHER WHEN CHANGE FORM */
    useEffect(() => {
        if (!form.departureDate) return;

        const loadWeather = async () => {
            const fromCity = cityWeatherMap[form.from];
            const toCity = cityWeatherMap[form.to];

            if (!fromCity || !toCity) return;

            const wf = await fetchWeather(fromCity, form.departureDate);
            const wt = await fetchWeather(toCity, form.departureDate);

            setWeatherFrom(wf);
            setWeatherTo(wt);
        };

        loadWeather();
    }, [form.from, form.to, form.departureDate, cityWeatherMap]);

    const handleCopy = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success(`🎉 Đã copy mã ưu đãi: ${code}`);
        } catch (err) {
            toast.error("❌ Không thể copy mã, vui lòng thử lại");
        }
    };

    /* ================= RENDER ================= */
    return (
        <>
            {/* ================= HERO + SEARCH ================= */}
            <section
                className="hero-bg"
                style={{
                    backgroundImage:
                        "url('https://i.pinimg.com/1200x/21/26/b8/2126b8191a87acf45b86cf5577bdeb69.jpg')"
                }}
            >
                <div className="hero-overlay">
                    <div className="container">

                        <h1 className="hero-title">
                            Đặt vé máy bay nhanh chóng, lên kế hoạch cho chuyến đi của bạn!
                        </h1>

                        {/* TRIP TYPE */}
                        <div className="trip-type">
                            <button
                                className={tripType === "ONE_WAY" ? "active" : ""}
                                onClick={() => setTripType("ONE_WAY")}
                            >
                                Một chiều
                            </button>
                            <button
                                className={tripType === "ROUND_TRIP" ? "active" : ""}
                                onClick={() => setTripType("ROUND_TRIP")}
                            >
                                Khứ hồi
                            </button>
                        </div>

                        {/* SEARCH FORM */}
                        <div className="search-row">

                            <div className="field">
                                <label>Từ</label>
                                <select name="from" value={form.from} onChange={handleChange}>
                                    {cities.map(c => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label>Đến</label>
                                <select name="to" value={form.to} onChange={handleChange}>
                                    {cities.map(c => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label>Ngày khởi hành</label>
                                <input
                                    type="date"
                                    name="departureDate"
                                    value={form.departureDate}
                                    onChange={handleChange}
                                />
                            </div>

                            {tripType === "ROUND_TRIP" && (
                                <div className="field">
                                    <label>Ngày về</label>
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={form.returnDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            <div className="field passenger-field">
                                <label>Hành khách</label>
                                <div
                                    className="passenger-input"
                                    onClick={() => setShowPassenger(!showPassenger)}
                                >
                                    {passengerText()}
                                    <span>▾</span>
                                </div>

                                {showPassenger && (
                                    <div className="passenger-panel">
                                        {["adult", "child", "infant"].map(type => (
                                            <div className="passenger-row" key={type}>
                                                <span>
                                                    {type === "adult" && "Người lớn"}
                                                    {type === "child" && "Trẻ em"}
                                                    {type === "infant" && "Em bé"}
                                                </span>
                                                <div className="counter">
                                                    <button
                                                        onClick={() =>
                                                            setForm(p => ({
                                                                ...p,
                                                                [type]: Math.max(0, p[type] - 1)
                                                            }))
                                                        }
                                                    >−</button>
                                                    <span>{form[type]}</span>
                                                    <button
                                                        onClick={() =>
                                                            setForm(p => ({
                                                                ...p,
                                                                [type]: p[type] + 1
                                                            }))
                                                        }
                                                    >+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="btn-search" onClick={handleSearchClick}>🔍</button>
                        </div>

                        {/* ===== WEATHER INFO (NEW) ===== */}
                        {weatherFrom && weatherTo && (
                            <div className="row g-3 mt-4">
                                <div className="col-md-6">
                                    <div className="weather-card">
                                        <h6 className="fw-bold mb-1">🌤 Thời tiết nơi đi</h6>
                                        <p className="mb-0">
                                            {Math.round(weatherFrom.main.temp)}°C •{" "}
                                            {weatherFrom.weather[0].description}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="weather-card">
                                        <h6 className="fw-bold mb-1">🌦 Thời tiết nơi đến</h6>
                                        <p className="mb-0">
                                            {Math.round(weatherTo.main.temp)}°C •{" "}
                                            {weatherTo.weather[0].description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            {/* ================= DESTINATION + PROMO ================= */}
            <section className="container my-5">
                <div className="row g-4">

                    <div className="col-md-6">
                        <h4 className="fw-bold mb-3">🌍 Gợi ý điểm đến nổi bật</h4>

                        <div className="destination-big-card">
                            <img
                                src={destinations[activeIndex].img}
                                alt={destinations[activeIndex].name}
                            />

                            <div className="destination-big-overlay">
                                <h4>{destinations[activeIndex].name}</h4>
                                <span>{destinations[activeIndex].price}</span>
                            </div>

                            <div className="destination-dots">
                                {destinations.map((_, i) => (
                                    <span
                                        key={i}
                                        className={i === activeIndex ? "dot active" : "dot"}
                                        onClick={() => setActiveIndex(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h4 className="fw-bold mb-3">🎁 Mã ưu đãi tặng bạn mới</h4>

                        <div className="promo-list">
                            {promoCodes.map((promo, i) => (
                                <div className="promo-item" key={promo.code}>
                                    <div className="promo-left">
                                        {promo.desc}
                                    </div>

                                    <div className="promo-code-box">
                                        <span className="promo-code">{promo.code}</span>
                                        <button
                                            className="btn btn-copy btn-info"
                                            onClick={() => handleCopy(promo.code)}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </section>
            {/* ================= PROMOTION ================= */}
            <section className="container my-5">
                <h4 className="fw-bold mb-4">🔥 Ưu đãi nổi bật</h4>

                <div className="row g-4">
                    {/* PROMO 1 */}
                    <div className="col-md-6">
                        <div className="card promo-card bg-danger text-white shadow h-100">
                            <div className="card-body">
                                <h5 className="fw-bold">Vé 0Đ – Bay thả ga</h5>
                                <p>Săn vé 0Đ cho các chặng nội địa</p>
                                <button className="btn btn-light btn-sm">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PROMO 2 */}
                    <div className="col-md-6">
                        <div className="card promo-card bg-warning shadow h-100">
                            <div className="card-body">
                                <h5 className="fw-bold">
                                    Giảm 30% vé khứ hồi
                                </h5>
                                <p>Ưu đãi đặc biệt cho chuyến bay quốc tế</p>
                                <button className="btn btn-dark btn-sm">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= NEWS SECTION (ĐÃ CẬP NHẬT LINK CHI TIẾT) ================= */}
            <section className="container my-5">
                <h4 className="fw-bold mb-4">📰 Tin tức & Cẩm nang du lịch</h4>

                {newsList.length === 0 ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-2">Đang tải tin tức...</p>
                    </div>
                ) : (
                    <div className="row g-4 text-center">
                        {newsList.map((n) => (
                            <div className="col-md-4" key={n.newsId}>
                                <div className="news-card h-100 shadow-sm">
                                    <div className="news-thumb">
                                        {/* 1. Bọc ảnh bằng Link để bấm vào ảnh cũng xem được */}
                                        <Link to={`/news/${n.newsId}`}>
                                            <img
                                                src={n.thumbnail}
                                                alt={n.title}
                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                                            />
                                        </Link>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="fw-bold text-truncate" title={n.title}>
                                            {/* 2. Bọc tiêu đề bằng Link */}
                                            <Link to={`/news/${n.newsId}`} className="text-decoration-none text-dark">
                                                {n.title}
                                            </Link>
                                        </h6>
                                        <p className="small text-muted mb-2 text-truncate">
                                            {n.summary || "Xem chi tiết bài viết..."}
                                        </p>
                                        <div className="mt-auto d-flex justify-content-between align-items-center small text-secondary">
                                            <span>
                                                <i className="bi bi-calendar3 me-1"></i>
                                                {n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('vi-VN') : ''}
                                            </span>
                                            {n.category && (
                                                <span className="badge bg-light text-dark border">
                                                    {n.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-4">
                    {/* 3. Thay thẻ button thành Link để chuyển sang trang danh sách tin tức */}
                    <Link to="/news" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
                        Xem tất cả tin tức <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                </div>
            </section>


            {/* ================= CHAT FLOATING ================= */}
            {user && (
                <>
                    {/* Nút mở chat */}
                    {!openChat && (
                        <button
                            onClick={() => setOpenChat(true)}
                            className="chat-floating-btn"
                            style={{
                                position: "fixed", bottom: 20, right: 20, width: 60, height: 60,
                                borderRadius: "50%", backgroundColor: "#0d6efd", color: "#fff",
                                fontSize: 24, border: "none", zIndex: 9999,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)", cursor: "pointer"
                            }}
                        >
                            💬
                        </button>
                    )}

                    {/* Khung chat thay đổi tùy theo Role */}
                    {openChat && (
                        user.role === 'ADMIN' ? (
                            <AdminFloatingChat onClose={() => setOpenChat(false)} />
                        ) : (
                            <ChatBox
                                customer={CHAT_ADMIN_TARGET}
                                onClose={() => setOpenChat(false)}
                            />
                        )
                    )}
                </>
            )}
        </>
    );
}

export default Home;
