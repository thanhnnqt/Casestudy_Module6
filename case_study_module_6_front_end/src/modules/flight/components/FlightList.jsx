import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllFlights } from "../service/flightService";
import { getAirports, getAirlines, getFlightNumberSuggestions } from "../service/masterDataService";
import { toast } from "react-toastify";
import { DateRangePicker } from 'react-date-range';
import { vi } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "./FlightList.css";

const FlightList = () => {
    const [flights, setFlights] = useState([]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const datePickerRef = useRef(null);

    // State Filter
    const [filters, setFilters] = useState({
        keyword: "", origin: "", destination: "", startDate: "", endDate: "", minPrice: "", maxPrice: ""
    });

    // State cho Range Slider (giá) - Max 20 triệu
    const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 });

    // State cho Date Range Picker
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    ]);

    // State Sắp xếp
    const [sortConfig, setSortConfig] = useState([]);

    const [suggestionAirlines, setSuggestionAirlines] = useState([]);
    const [suggestionFlightNums, setSuggestionFlightNums] = useState([]);
    const [suggestionCities, setSuggestionCities] = useState([]);

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };

        if (showDatePicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDatePicker]);

    // Logic gọi API
    const performSearch = useCallback(async (currentFilters, currentSorts) => {
        try {
            const sortParams = currentSorts.map(s => `${s.key},${s.direction}`);
            const params = { ...currentFilters, sort: sortParams };
            const data = await getAllFlights(params);
            setFlights(data || []);
        } catch (error) {
            console.error(error);
            setFlights([]);
        }
    }, []);

    // Initial Load
    useEffect(() => {
        const initData = async () => {
            try {
                try {
                    const airlines = await getAirlines();
                    setSuggestionAirlines(airlines || []);
                } catch (error) {
                    console.error("Error loading airlines:", error);
                }

                try {
                    const flightNums = await getFlightNumberSuggestions();
                    setSuggestionFlightNums(flightNums || []);
                } catch (error) {
                    console.error("Error loading flight numbers:", error);
                }

                try {
                    const airports = await getAirports();
                    setSuggestionCities([...new Set((airports || []).map(a => a.city))]);
                } catch (error) {
                    console.error("Error loading airports:", error);
                }

                performSearch({}, []);
            } catch (error) {
                console.error(error);
            }
        };
        initData();
    }, [performSearch]);

    const handleSearchBtn = () => {
        const { startDate, endDate } = filters;
        if ((startDate && !endDate) || (!startDate && endDate)) {
            toast.warning("Nhập đủ Từ ngày & Đến ngày");
            return;
        }
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            toast.warning("Ngày bắt đầu không được lớn hơn ngày kết thúc");
            return;
        }
        performSearch(filters, sortConfig);
    };

    // Sắp xếp đa cột
    const handleSort = (key) => {
        setSortConfig(prevSorts => {
            const newSorts = [...prevSorts];
            const existingIndex = newSorts.findIndex(item => item.key === key);

            if (existingIndex === -1) {
                newSorts.push({ key, direction: 'asc' });
            } else {
                const existingItem = newSorts[existingIndex];
                if (existingItem.direction === 'asc') {
                    newSorts[existingIndex] = { ...existingItem, direction: 'desc' };
                } else {
                    newSorts.splice(existingIndex, 1);
                }
            }

            performSearch(filters, newSorts);
            return newSorts;
        });
    };

    const renderSortIcon = (key) => {
        const item = sortConfig.find(s => s.key === key);
        if (!item) return <span className="text-muted ms-1" style={{fontSize: '0.8em'}}></span>;
        return item.direction === 'asc' ? <span className="ms-1">↑</span> : <span className="ms-1">↓</span>;
    };

    const renderSortIndex = (key) => {
        const index = sortConfig.findIndex(s => s.key === key);
        return index !== -1 && sortConfig.length > 1 ? <sup className="ms-1 text-warning fw-bold">{index + 1}</sup> : null;
    };

    const handleFilterChange = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });

    // Handle Price Range Change - Auto apply khi kéo xong
    const handlePriceRangeChange = (e, type) => {
        const value = parseInt(e.target.value);
        let newRange = { ...priceRange };

        if (type === 'min') {
            newRange.min = Math.min(value, priceRange.max);
        } else {
            newRange.max = Math.max(value, priceRange.min);
        }

        setPriceRange(newRange);
        setFilters(prev => ({
            ...prev,
            minPrice: newRange.min,
            maxPrice: newRange.max
        }));
    };

    // Handle Date Range Selection
    const handleDateRangeSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;

        setDateRange([ranges.selection]);

        if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            setFilters(prev => ({
                ...prev,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate)
            }));

            setTimeout(() => setShowDatePicker(false), 500);
        }
    };

    const renderStatusBadge = (st) => {
        const map = {
            'SCHEDULED': { class: 'bg-info text-dark', text: 'Theo lịch trình' },
            'DELAYED': { class: 'bg-warning text-dark', text: 'Bị hoãn' },
            'IN_FLIGHT': { class: 'bg-success', text: 'Đang bay' },
            'CANCELLED': { class: 'bg-danger', text: 'Đã hủy' },
            'COMPLETED': { class: 'bg-primary', text: 'Đã hạ cánh' }
        };
        const status = map[st] || { class: 'bg-secondary', text: st };
        return <span className={`badge ${status.class} py-2 px-3 rounded-pill`}>{status.text}</span>;
    };

    // Tính thống kê
    const stats = {
        total: flights.length,
        delayed: flights.filter(f => f.status === 'DELAYED').length,
        inFlight: flights.filter(f => f.status === 'IN_FLIGHT').length,
        completed: flights.filter(f => f.status === 'COMPLETED').length
    };

    const getProgressBarStyle = () => {
        const minPercent = (priceRange.min / 20000000) * 100;
        const maxPercent = (priceRange.max / 20000000) * 100;
        return {
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`
        };
    };

    const formatDateDisplay = () => {
        if (dateRange[0].startDate && dateRange[0].endDate) {
            return `${dateRange[0].startDate.toLocaleDateString('vi-VN')} - ${dateRange[0].endDate.toLocaleDateString('vi-VN')}`;
        }
        return 'Chọn khoảng ngày';
    };

    // Helper kiểm tra sort active
    const isSorted = (key) => sortConfig.some(s => s.key === key);

    return (
        <div className="flight-list-container">
            {/* Sky Background */}
            <div className="sky-container">
                <i className="bi bi-cloud-fill cloud" style={{top: '10%', fontSize: '120px', animationDuration: '45s', opacity: 0.4}}></i>
                <i className="bi bi-cloud-fill cloud" style={{top: '30%', fontSize: '80px', animationDuration: '35s', animationDelay: '-10s', opacity: 0.3}}></i>
                <i className="bi bi-cloud-fill cloud" style={{top: '60%', fontSize: '150px', animationDuration: '55s', animationDelay: '-5s', opacity: 0.2}}></i>
                <i className="bi bi-airplane-fill plane-vertical" style={{left: '10%', fontSize: '30px', animationDuration: '4s'}}></i>
                <i className="bi bi-airplane-fill plane-vertical" style={{left: '55%', fontSize: '45px', animationDuration: '5s', animationDelay: '0.5s'}}></i>
                <i className="bi bi-airplane-fill plane-vertical" style={{left: '85%', fontSize: '60px', animationDuration: '7s', animationDelay: '1s'}}></i>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
                <div className="d-flex justify-content-between align-items-start w-100">
                    <h4><i className="bi bi-airplane-engines"></i> <span>SkyAdmin</span></h4>
                    <button className="btn-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
                        <i className="bi bi-list"></i>
                    </button>
                </div>
                <div className="nav flex-column">
                    <a href="#" className="nav-link active"><i className="bi bi-grid-1x2-fill"></i> <span>Tổng quan</span></a>
                    <a href="#" className="nav-link"><i className="bi bi-ticket-perforated-fill"></i> <span>Đặt chỗ</span></a>
                    <a href="#" className="nav-link"><i className="bi bi-geo-alt-fill"></i> <span>Bản đồ bay</span></a>
                    <a href="#" className="nav-link"><i className="bi bi-pie-chart-fill"></i> <span>Báo cáo</span></a>
                </div>
                <div className="mt-auto">
                    <a href="#" className="nav-link text-danger"><i className="bi bi-box-arrow-left"></i> <span>Đăng xuất</span></a>
                </div>
            </div>

            {/* Main Content */}
            <div className="main">
                {/* Header */}
                <div className="glass-card d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1 text-dark">Trung tâm điều hành</h2>
                        <p className="text-muted mb-0">Giám sát lưu lượng bay thời gian thực</p>
                    </div>
                    <div className="d-flex gap-3">
                        <button className="btn btn-light rounded-circle shadow-sm" style={{width: '45px', height: '45px'}}>
                            <i className="bi bi-bell"></i>
                        </button>
                        <Link to="/flights/create" className="btn btn-gradient shadow-lg">
                            <i className="bi bi-plus-lg me-2"></i>Thêm chuyến
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="glass-card stat-card" style={{borderBottom: '5px solid #2ed573'}}>
                            <i className="bi bi-airplane-fill stat-icon text-success"></i>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Tổng chuyến bay</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card stat-card" style={{borderBottom: '5px solid #ff4757'}}>
                            <i className="bi bi-exclamation-triangle-fill stat-icon text-danger"></i>
                            <div className="stat-value">{stats.delayed}</div>
                            <div className="stat-label">Bị hoãn</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card stat-card" style={{borderBottom: '5px solid #ffa502'}}>
                            <i className="bi bi-megaphone-fill stat-icon text-warning"></i>
                            <div className="stat-value">{stats.inFlight}</div>
                            <div className="stat-label">Đang bay</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card stat-card" style={{borderBottom: '5px solid #1e90ff'}}>
                            <i className="bi bi-check-circle-fill stat-icon text-primary"></i>
                            <div className="stat-value">{stats.completed}</div>
                            <div className="stat-label">Đã hạ cánh</div>
                        </div>
                    </div>
                </div>

                {/* Filter Section (GIỮ NGUYÊN) */}
                <div className="glass-card p-3 mb-4" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <label className="form-label text-muted small fw-bold">TỪ KHÓA</label>
                            <div className="input-group">
                                <span className="input-group-text border-0 bg-transparent"><i className="bi bi-airplane"></i></span>
                                <input name="keyword" className="form-control custom-input" placeholder="Hãng / Số hiệu..."
                                       onChange={handleFilterChange} list="kwOpt"/>
                            </div>
                            <datalist id="kwOpt">
                                {suggestionAirlines.map(a => <option key={a.id} value={a.name}/>)}
                                {suggestionFlightNums.map((n,i) => <option key={i} value={n}/>)}
                            </datalist>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label text-muted small fw-bold">KHOẢNG GIÁ</label>
                            <div className="price-range-container">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-dark fw-bold small">{(priceRange.min / 1000000).toFixed(1)}tr</span>
                                    <span className="text-dark fw-bold small">{(priceRange.max / 1000000).toFixed(1)}tr</span>
                                </div>
                                <div className="range-slider-wrapper">
                                    <div className="slider-track">
                                        <div className="slider-range" style={getProgressBarStyle()}></div>
                                    </div>
                                    <input type="range" min="0" max="20000000" step="500000"
                                           value={priceRange.min} onChange={(e) => handlePriceRangeChange(e, 'min')}
                                           className="range-slider-input" />
                                    <input type="range" min="0" max="20000000" step="500000"
                                           value={priceRange.max} onChange={(e) => handlePriceRangeChange(e, 'max')}
                                           className="range-slider-input" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label text-muted small fw-bold">KHOẢNG NGÀY</label>
                            <div className="date-range-picker-container" ref={datePickerRef}>
                                <div className="custom-input d-flex align-items-center justify-content-between date-input-display"
                                     onClick={() => setShowDatePicker(!showDatePicker)}>
                                    <span className={dateRange[0].startDate && dateRange[0].endDate ? 'text-dark fw-medium' : 'text-muted'}>
                                        {formatDateDisplay()}
                                    </span>
                                    <i className="bi bi-calendar-range"></i>
                                </div>
                                {showDatePicker && (
                                    <div className="date-picker-dropdown-calendar">
                                        <DateRangePicker ranges={dateRange} onChange={handleDateRangeSelect}
                                                         months={2} direction="horizontal" locale={vi} showDateDisplay={false}
                                                         moveRangeOnFirstSelection={false} rangeColors={['#764ba2']}
                                                         className="custom-date-range-picker" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-2 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label text-muted small fw-bold">NƠI ĐI</label>
                            <div className="input-group">
                                <span className="input-group-text border-0 bg-transparent"><i className="bi bi-geo-alt"></i></span>
                                <input name="origin" className="form-control custom-input" placeholder="Nơi đi"
                                       onChange={handleFilterChange} list="cityOpt"/>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label text-muted small fw-bold">NƠI ĐẾN</label>
                            <div className="input-group">
                                <span className="input-group-text border-0 bg-transparent"><i className="bi bi-geo-alt-fill"></i></span>
                                <input name="destination" className="form-control custom-input" placeholder="Nơi đến"
                                       onChange={handleFilterChange} list="cityOpt"/>
                            </div>
                        </div>
                        <datalist id="cityOpt">{suggestionCities.map((c,i) => <option key={i} value={c}/>)}</datalist>

                        <div className="col-md-3">
                            <label className="form-label text-muted small fw-bold">TRẠNG THÁI</label>
                            <select name="status" className="form-select custom-input" onChange={handleFilterChange}>
                                <option value="">Tất cả</option>
                                <option value="SCHEDULED">Theo lịch trình</option>
                                <option value="DELAYED">Bị hoãn</option>
                                <option value="IN_FLIGHT">Đang bay</option>
                                <option value="COMPLETED">Đã hạ cánh</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-primary w-100 fw-bold shadow-sm custom-input"
                                    onClick={handleSearchBtn} style={{padding: '10px'}}>
                                <i className="bi bi-search me-1"></i> Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>

                {/* === START NEW CARD LAYOUT SECTION === */}

                {/* 1. Sort Toolbar (Thay thế Header Bảng) */}
                <div className="sort-toolbar shadow-sm">
                    <span className="sort-label"><i className="bi bi-sort-down-alt me-2"></i>Sắp xếp:</span>

                    <button className={`btn btn-sort ${isSorted('basePrice') ? 'active' : ''}`} onClick={() => handleSort('basePrice')}>
                        Giá vé {renderSortIcon('basePrice')} {renderSortIndex('basePrice')}
                    </button>

                    <button className={`btn btn-sort ${isSorted('departureTime') ? 'active' : ''}`} onClick={() => handleSort('departureTime')}>
                        Giờ bay {renderSortIcon('departureTime')} {renderSortIndex('departureTime')}
                    </button>

                    <button className={`btn btn-sort ${isSorted('aircraft.airline.name') ? 'active' : ''}`} onClick={() => handleSort('aircraft.airline.name')}>
                        Hãng {renderSortIcon('aircraft.airline.name')} {renderSortIndex('aircraft.airline.name')}
                    </button>

                    <button className={`btn btn-sort ${isSorted('status') ? 'active' : ''}`} onClick={() => handleSort('status')}>
                        Trạng thái {renderSortIcon('status')} {renderSortIndex('status')}
                    </button>
                </div>

                {/* 2. List of Cards */}
                <div className="flight-list-wrapper">
                    {/* Kết quả Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                        <h6 className="fw-bold mb-0" style={{color: '#444'}}>
                            Tìm thấy {flights.length} chuyến bay
                        </h6>
                        <span className="badge bg-danger rounded-pill px-3 py-2 live-badge shadow-sm">
                            LIVE <i className="bi bi-broadcast"></i>
                        </span>
                    </div>

                    {flights.length === 0 ? (
                        <div className="text-center py-5 glass-card">
                            <i className="bi bi-cloud-slash text-muted" style={{fontSize: '3rem'}}></i>
                            <p className="mt-3 text-muted fw-bold">Không tìm thấy chuyến bay nào phù hợp.</p>
                        </div>
                    ) : (
                        flights.map(f => (
                            <div key={f.id} className={`flight-card ${f.status === 'CANCELLED' ? 'opacity-75 grayscale' : ''}`}>
                                <div className="row align-items-center g-0">

                                    {/* Cột 1: Hãng bay (Logo, Tên, Mã) */}
                                    <div className="col-md-4 border-end pe-3">
                                        <div className="d-flex align-items-center gap-3">
                                            {/* Logo hình chữ nhật */}
                                            <img src={f.aircraft.airline.logoUrl} alt="Logo" className="fc-airline-logo" />
                                            <div>
                                                <div className="fc-airline-name">{f.aircraft.airline.name}</div>
                                                <div className="d-flex gap-2 align-items-center mt-1">
                                                    <span className="fc-plane-badge">{f.aircraft.name}</span>
                                                    <span className="text-muted small fw-bold">#{f.aircraft.airline.code}{f.flightNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột 2: Lịch trình (LAYOUT MỚI) */}
                                    <div className="col-md-5 px-4 border-end">
                                        <div className="d-flex align-items-center justify-content-between">

                                            {/* Điểm đi: Ngày -> Giờ -> Mã Sân Bay */}
                                            <div className="fc-time-group">
                                                {/* Thêm Ngày */}
                                                <span className="fc-date">
                                                {new Date(f.departureTime).toLocaleDateString('vi-VN')}
                                            </span>
                                                <div className="fc-time">
                                                    {new Date(f.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="fc-city-code">{f.departureAirport.code}</div>
                                                <div className="fc-city-name small text-muted mt-1" style={{fontSize: '0.8rem'}}>
                                                    {f.departureAirport.city}
                                                </div>
                                            </div>

                                            {/* Timeline ở giữa: Chỉ còn Duration + Line + Icon phải */}
                                            <div className="fc-timeline flex-grow-1 mx-4">
                                                {/* Tính thời gian bay (Giả định hoặc lấy thật nếu có field duration) */}
                                                <div className="fc-duration">
                                                    {/* Logic tính khoảng cách giờ đơn giản để hiển thị (ví dụ) */}
                                                    {(() => {
                                                        const diff = new Date(f.arrivalTime) - new Date(f.departureTime);
                                                        const hours = Math.floor(diff / 3600000);
                                                        const minutes = Math.round((diff % 3600000) / 60000);
                                                        return `${hours}g ${minutes > 0 ? minutes + 'p' : ''}`;
                                                    })()}
                                                </div>
                                                <div className="fc-line"></div>
                                                {/* Đã bỏ dòng "Bay thẳng" */}
                                            </div>

                                            {/* Điểm đến: Ngày -> Giờ -> Mã Sân Bay */}
                                            <div className="fc-time-group">
                                                {/* Thêm Ngày */}
                                                <span className="fc-date">
                                                {new Date(f.arrivalTime).toLocaleDateString('vi-VN')}
                                            </span>
                                                <div className="fc-time">
                                                    {new Date(f.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="fc-city-code">{f.arrivalAirport.code}</div>
                                                <div className="fc-city-name small text-muted mt-1" style={{fontSize: '0.8rem'}}>
                                                    {f.arrivalAirport.city}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Cột 3: Giá & Action */}
                                    <div className="col-md-3 ps-3">
                                        <div className="d-flex flex-column align-items-end h-100 justify-content-center gap-2">
                                            {/* Trạng thái */}
                                            <div>{renderStatusBadge(f.status)}</div>

                                            {/* Giá */}
                                            <div className="text-end">
                                                <div className="fc-price">
                                                    {f.basePrice.toLocaleString()} <span className="fc-price-unit">đ</span>
                                                </div>
                                                <small className="text-muted d-block text-end" style={{fontSize: '0.75rem'}}> Giá đã bao gồm thuế, phí</small>
                                            </div>

                                            {/* Nút sửa */}
                                            {f.status !== 'CANCELLED' && f.status !== 'COMPLETED' && (
                                                <Link to={`/flights/edit/${f.id}`} className="btn-edit-card mt-1">
                                                    <i className="bi bi-pencil-square me-1"></i> Chỉnh sửa
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlightList;