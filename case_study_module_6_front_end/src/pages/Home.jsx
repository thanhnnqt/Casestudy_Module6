import { useState } from "react";
import "../styles/home.css";

function Home() {
    const cities = [
        "Hà Nội",
        "TP. Hồ Chí Minh",
        "Đà Nẵng",
        "Nha Trang",
        "Phú Quốc",
        "Cần Thơ"
    ];

    // ===== STATE =====
    const [tripType, setTripType] = useState("ONE_WAY"); // ONE_WAY | ROUND_TRIP

    const [form, setForm] = useState({
        from: "",
        to: "",
        departureDate: "",
        returnDate: "",
        adult: 1,
        child: 0,
        infant: 0
    });

    // ===== HANDLERS =====
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTripTypeChange = (type) => {
        setTripType(type);

        // Nếu chuyển về 1 chiều → reset ngày về
        if (type === "ONE_WAY") {
            setForm(prev => ({ ...prev, returnDate: "" }));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();

        // Validate khứ hồi
        if (
            tripType === "ROUND_TRIP" &&
            form.returnDate &&
            form.returnDate < form.departureDate
        ) {
            alert("Ngày về phải sau ngày đi");
            return;
        }

        console.log("Search components:", {
            ...form,
            tripType
        });

        // TODO: navigate("/flights", { state: { ...form, tripType } })
    };

    const passengerText = () =>
        `${form.adult} NL, ${form.child} TE, ${form.infant} EB`;

    // ===== RENDER =====
    return (
        <>
            {/* ================= HERO + SEARCH ================= */}
            <section
                className="hero-bg"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1529070538774-1843cb3265df')"
                }}
            >
                <div className="hero-overlay">
                    <div className="container">

                        {/* HERO TEXT */}
                        <div className="mb-3">
                            <h2 className="fw-bold text-white mb-1">
                                Bay dễ dàng – Giá tốt mỗi ngày
                            </h2>
                            <p className="text-white-50 mb-0">
                                Đặt vé máy bay nhanh chóng, an toàn và tiết kiệm
                            </p>
                        </div>

                        {/* SEARCH CARD */}
                        <div className="card search-card shadow border-0">
                            <div className="card-body p-3">

                                {/* TRIP TYPE */}
                                <div className="mb-3 d-flex gap-2">
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${
                                            tripType === "ONE_WAY"
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() => handleTripTypeChange("ONE_WAY")}
                                    >
                                        Một chiều
                                    </button>

                                    <button
                                        type="button"
                                        className={`btn btn-sm ${
                                            tripType === "ROUND_TRIP"
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() => handleTripTypeChange("ROUND_TRIP")}
                                    >
                                        Khứ hồi
                                    </button>
                                </div>

                                <form onSubmit={handleSearch}>
                                    <div className="row g-2 align-items-end">

                                        {/* FROM */}
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold small">
                                                Điểm đi
                                            </label>
                                            <select
                                                className="form-select rounded-3"
                                                name="from"
                                                value={form.from}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Chọn điểm đi</option>
                                                {cities.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* TO */}
                                        <div className="col-md-3">
                                            <label className="form-label fw-semibold small">
                                                Điểm đến
                                            </label>
                                            <select
                                                className="form-select rounded-3"
                                                name="to"
                                                value={form.to}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Chọn điểm đến</option>
                                                {cities.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* DEPART */}
                                        <div className="col-md-2">
                                            <label className="form-label fw-semibold small">
                                                Ngày đi
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control rounded-3"
                                                name="departureDate"
                                                value={form.departureDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* RETURN */}
                                        {tripType === "ROUND_TRIP" && (
                                            <div className="col-md-2">
                                                <label className="form-label fw-semibold small">
                                                    Ngày về
                                                </label>
                                                <input
                                                    type="date"
                                                    className="form-control rounded-3"
                                                    name="returnDate"
                                                    value={form.returnDate}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        )}

                                        {/* PASSENGER */}
                                        <div className="col-md-2">
                                            <label className="form-label fw-semibold small">
                                                Hành khách
                                            </label>

                                            <div className="dropdown">
                                                <button
                                                    type="button"
                                                    className="form-control text-start rounded-3 dropdown-toggle"
                                                    data-bs-toggle="dropdown"
                                                >
                                                    {passengerText()}
                                                </button>

                                                <div
                                                    className="dropdown-menu p-2 shadow"
                                                    style={{ minWidth: 240 }}
                                                >
                                                    {[
                                                        { label: "Người lớn", name: "adult", min: 1, max: 9 },
                                                        { label: "Trẻ em", name: "child", min: 0, max: 5 },
                                                        { label: "Em bé", name: "infant", min: 0, max: 3 }
                                                    ].map(p => (
                                                        <div
                                                            key={p.name}
                                                            className="d-flex justify-content-between align-items-center mb-1"
                                                        >
                                                            <span className="small">{p.label}</span>
                                                            <select
                                                                className="form-select form-select-sm w-50"
                                                                name={p.name}
                                                                value={form[p.name]}
                                                                onChange={handleChange}
                                                            >
                                                                {Array.from(
                                                                    { length: p.max - p.min + 1 },
                                                                    (_, i) => p.min + i
                                                                ).map(n => (
                                                                    <option key={n} value={n}>{n}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BUTTON */}
                                    <div className="text-end mt-3">
                                        <button
                                            type="submit"
                                            className="btn btn-info px-4 py-2 fw-bold rounded-3"
                                        >
                                            Tìm chuyến bay
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ================= DESTINATION SUGGEST ================= */}
            <section className="destination-section my-5">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0">🌍 Gợi ý điểm đến nổi bật</h4>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                    document.getElementById("destTrack")
                                        .scrollBy({ left: -260, behavior: "smooth" })
                                }
                            >
                                &laquo;
                            </button>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                    document.getElementById("destTrack")
                                        .scrollBy({ left: 260, behavior: "smooth" })
                                }
                            >
                                &raquo;
                            </button>
                        </div>
                    </div>

                    <div className="destination-slider">
                        <div className="destination-track" id="destTrack">
                            {[
                                {
                                    name: "Đà Nẵng",
                                    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                                    price: "Từ 899.000đ"
                                },
                                {
                                    name: "Phú Quốc",
                                    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
                                    price: "Từ 1.299.000đ"
                                },
                                {
                                    name: "Nha Trang",
                                    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                                    price: "Từ 999.000đ"
                                },
                                {
                                    name: "Hà Nội",
                                    img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f",
                                    price: "Từ 799.000đ"
                                },
                                {
                                    name: "TP. Hồ Chí Minh",
                                    img: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d",
                                    price: "Từ 699.000đ"
                                }
                            ].map((d, i) => (
                                <div className="destination-card" key={i}>
                                    <img src={d.img} alt={d.name} />
                                    <div className="destination-info">
                                        <h6 className="fw-bold mb-1">{d.name}</h6>
                                        <span className="text-primary small">
                                {d.price}
                            </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= PROMOTION ================= */}
            <section className="container my-5">
                <h4 className="fw-bold mb-4">Ưu đãi nổi bật</h4>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card promo-card bg-danger text-white shadow">
                            <div className="card-body">
                                <h5 className="fw-bold">
                                    🔥 Vé 0Đ – Bay thả ga
                                </h5>
                                <p>Săn vé 0Đ cho các chặng nội địa.</p>
                                <button className="btn btn-light btn-sm">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card promo-card bg-warning shadow">
                            <div className="card-body">
                                <h5 className="fw-bold">
                                    ✈️ Giảm 30% vé khứ hồi
                                </h5>
                                <p>
                                    Ưu đãi đặc biệt cho chuyến bay quốc tế.
                                </p>
                                <button className="btn btn-dark btn-sm">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= NEWS ================= */}
            <section className="container my-5">
                <h4 className="fw-bold mb-4">
                    Tin tức & Cẩm nang du lịch
                </h4>

                <div className="row g-4">
                    {[
                        {
                            img:
                                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
                            title: "Kinh nghiệm săn vé máy bay giá rẻ",
                            desc:
                                "Mẹo giúp bạn tiết kiệm chi phí khi đặt vé."
                        },
                        {
                            img:
                                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                            title: "Top điểm du lịch hè 2025",
                            desc:
                                "Những điểm đến được yêu thích nhất."
                        },
                        {
                            img:
                                "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
                            title: "Du lịch tiết kiệm cho gia đình",
                            desc:
                                "Gợi ý chuyến bay phù hợp cho gia đình."
                        }
                    ].map((n, i) => (
                        <div className="col-md-4" key={i}>
                            <div className="card news-card h-100 shadow-sm">
                                <img
                                    src={n.img}
                                    className="card-img-top"
                                    alt="news"/>
                                <div className="card-body">
                                    <h6 className="fw-bold">{n.title}</h6>
                                    <p className="text-muted small">
                                        {n.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default Home;
