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

    // --- STATE VIEW MODE ---
    const [viewMode, setViewMode] = useState('card');

    // --- STATE PAGINATION (ĐÃ SỬA: PageSize là state) ---
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10); // Mặc định 10

    // State Filter
    const [filters, setFilters] = useState({
        keyword: "", origin: "", destination: "", startDate: "", endDate: "",
        minPrice: "", maxPrice: "", status: ""
    });

    const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
    const [sortConfig, setSortConfig] = useState([]);

    const [suggestionAirlines, setSuggestionAirlines] = useState([]);
    const [suggestionFlightNums, setSuggestionFlightNums] = useState([]);
    const [suggestionCities, setSuggestionCities] = useState([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatePicker(false);
            }
        };
        if (showDatePicker) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDatePicker]);

    // Logic gọi API (Nhận thêm tham số size để update liền tay)
    const performSearch = useCallback(async (currentFilters, currentSorts, page = 0, size = pageSize) => {
        try {
            const sortParams = currentSorts.map(s => `${s.key},${s.direction}`);
            const params = {
                ...currentFilters,
                sort: sortParams,
                page: page,
                size: size // Dùng size truyền vào
            };

            Object.keys(params).forEach(key => (params[key] === "" || params[key] === null) && delete params[key]);

            const data = await getAllFlights(params);

            if (data && data.content) {
                setFlights(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            } else if (Array.isArray(data)) {
                setFlights(data);
                setTotalPages(1);
            } else {
                setFlights([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (error) {
            console.error(error);
            setFlights([]);
        }
    }, [pageSize]); // Phụ thuộc pageSize để useCallback cập nhật khi state đổi

    // Initial Load
    useEffect(() => {
        const initData = async () => {
            try {
                const airlines = await getAirlines(); setSuggestionAirlines(airlines || []);
                const flightNums = await getFlightNumberSuggestions(); setSuggestionFlightNums(flightNums || []);
                const airports = await getAirports(); setSuggestionCities([...new Set((airports || []).map(a => a.city))]);
                performSearch({}, [], 0, pageSize);
            } catch (error) { console.error(error); }
        };
        initData();
    }, []); // Chạy 1 lần đầu

    // Xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
            performSearch(filters, sortConfig, newPage, pageSize);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Xử lý thay đổi số lượng hiển thị (Page Size)
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(0); // Reset về trang 1
        performSearch(filters, sortConfig, 0, newSize); // Gọi ngay với size mới
    };

    const handleSearchBtn = () => {
        const { startDate, endDate } = filters;
        if ((startDate && !endDate) || (!startDate && endDate)) { toast.warning("Nhập đủ Từ ngày & Đến ngày"); return; }
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) { toast.warning("Ngày bắt đầu không được lớn hơn ngày kết thúc"); return; }
        setCurrentPage(0);
        performSearch(filters, sortConfig, 0, pageSize);
    };

    const handleSort = (key) => {
        setSortConfig(prevSorts => {
            const newSorts = [...prevSorts];
            const existingIndex = newSorts.findIndex(item => item.key === key);
            if (existingIndex === -1) newSorts.push({ key, direction: 'asc' });
            else {
                const existingItem = newSorts[existingIndex];
                if (existingItem.direction === 'asc') newSorts[existingIndex] = { ...existingItem, direction: 'desc' };
                else newSorts.splice(existingIndex, 1);
            }
            performSearch(filters, newSorts, 0, pageSize);
            setCurrentPage(0);
            return newSorts;
        });
    };

    // Helper functions (Giữ nguyên)
    const renderSortIcon = (key) => {
        const item = sortConfig.find(s => s.key === key);
        if (!item) return <span className="text-muted ms-1"></span>;
        return item.direction === 'asc' ? <span className="ms-1">↑</span> : <span className="ms-1">↓</span>;
    };
    const renderSortIndex = (key) => {
        const index = sortConfig.findIndex(s => s.key === key);
        return index !== -1 && sortConfig.length > 1 ? <sup className="ms-1 text-warning fw-bold">{index + 1}</sup> : null;
    };
    const handleFilterChange = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });
    const handlePriceRangeChange = (e, type) => {
        const value = parseInt(e.target.value);
        let newRange = { ...priceRange };
        if (type === 'min') newRange.min = Math.min(value, priceRange.max);
        else newRange.max = Math.max(value, priceRange.min);
        setPriceRange(newRange);
        setFilters(prev => ({ ...prev, minPrice: newRange.min, maxPrice: newRange.max }));
    };
    const handleDateRangeSelect = (ranges) => {
        const { startDate, endDate } = ranges.selection;
        setDateRange([ranges.selection]);
        if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
            const formatDate = (date) => new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            setFilters(prev => ({ ...prev, startDate: formatDate(startDate), endDate: formatDate(endDate) }));
            setTimeout(() => setShowDatePicker(false), 500);
        }
    };
    const renderStatusBadge = (st) => {
        const map = {
            'SCHEDULED': { class: 'bg-info text-dark', text: 'Theo lịch' },
            'DELAYED': { class: 'bg-warning text-dark', text: 'Hoãn' },
            'IN_FLIGHT': { class: 'bg-success', text: 'Đang bay' },
            'CANCELLED': { class: 'bg-danger', text: 'Đã hủy' },
            'COMPLETED': { class: 'bg-primary', text: 'Hạ cánh' }
        };
        const status = map[st] || { class: 'bg-secondary', text: st };
        return <span className={`badge ${status.class} rounded-pill`}>{status.text}</span>;
    };
    const stats = {
        total: flights.length,
        delayed: flights.filter(f => f.status === 'DELAYED').length,
        inFlight: flights.filter(f => f.status === 'IN_FLIGHT').length,
        completed: flights.filter(f => f.status === 'COMPLETED').length
    };
    const getProgressBarStyle = () => {
        const minPercent = (priceRange.min / 20000000) * 100;
        const maxPercent = (priceRange.max / 20000000) * 100;
        return { left: `${minPercent}%`, right: `${100 - maxPercent}%` };
    };
    const formatDateDisplay = () => {
        if (dateRange[0].startDate && dateRange[0].endDate) {
            return `${dateRange[0].startDate.toLocaleDateString('vi-VN')} - ${dateRange[0].endDate.toLocaleDateString('vi-VN')}`;
        }
        return 'Chọn khoảng ngày';
    };
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
                    <button className="btn-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}><i className="bi bi-list"></i></button>
                </div>
                <div className="nav flex-column">
                    <a href="#" className="nav-link active"><i className="bi bi-grid-1x2-fill"></i> <span>Tổng quan</span></a>
                    <a href="#" className="nav-link"><i className="bi bi-ticket-perforated-fill"></i> <span>Đặt chỗ</span></a>
                </div>
                <div className="nav flex-column mt-3">
                    <div className="nav-section-title px-3 text-uppercase text-muted small fw-bold">
                        <i className="bi bi-person-fill me-2"></i> Nhân viên
                    </div>
                    <Link to="/employees" className="nav-link ps-4">
                        <i className="bi bi-list-ul me-2"></i> <span>Danh sách nhân viên</span>
                    </Link>
                </div>
                <div className="mt-auto"><a href="#" className="nav-link text-danger"><i className="bi bi-box-arrow-left"></i> <span>Đăng xuất</span></a></div>
            </div>

            {/* Main Content */}
            <div className="main">
                {/* Header */}
                <div className="glass-card d-flex justify-content-between align-items-center mb-4 sticky-header">
                    <div>
                        <h2 className="fw-bold mb-1 text-dark">Trung tâm điều hành</h2>
                        <p className="text-muted mb-0">Giám sát lưu lượng bay thời gian thực</p>
                    </div>
                    <div className="d-flex gap-3">
                        <Link to="/flights/create" className="btn btn-gradient shadow-lg">
                            <i className="bi bi-plus-lg me-2"></i>Thêm chuyến
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-3"><div className="glass-card stat-card" style={{borderBottom: '5px solid #2ed573'}}><i className="bi bi-airplane-fill stat-icon text-success"></i><div className="stat-value">{stats.total}</div><div className="stat-label">Hiển thị</div></div></div>
                    <div className="col-md-3"><div className="glass-card stat-card" style={{borderBottom: '5px solid #ff4757'}}><i className="bi bi-exclamation-triangle-fill stat-icon text-danger"></i><div className="stat-value">{stats.delayed}</div><div className="stat-label">Bị hoãn</div></div></div>
                    <div className="col-md-3"><div className="glass-card stat-card" style={{borderBottom: '5px solid #ffa502'}}><i className="bi bi-megaphone-fill stat-icon text-warning"></i><div className="stat-value">{stats.inFlight}</div><div className="stat-label">Đang bay</div></div></div>
                    <div className="col-md-3"><div className="glass-card stat-card" style={{borderBottom: '5px solid #1e90ff'}}><i className="bi bi-check-circle-fill stat-icon text-primary"></i><div className="stat-value">{stats.completed}</div><div className="stat-label">Đã hạ cánh</div></div></div>
                </div>

                {/* Filter Section */}
                <div className="glass-card p-3 mb-4" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="row g-3 mb-3">
                        <div className="col-md-4"><label className="form-label text-muted small fw-bold">TỪ KHÓA</label><input name="keyword" className="form-control custom-input" placeholder="Hãng / Số hiệu..." onChange={handleFilterChange} list="kwOpt"/><datalist id="kwOpt">{suggestionAirlines.map(a => <option key={a.id} value={a.name}/>)}{suggestionFlightNums.map((n,i) => <option key={i} value={n}/>)}</datalist></div>
                        <div className="col-md-4"><label className="form-label text-muted small fw-bold">KHOẢNG GIÁ</label><div className="price-range-container"><div className="d-flex justify-content-between mb-1"><span className="text-dark fw-bold small">{(priceRange.min/1000000).toFixed(1)}tr</span><span className="text-dark fw-bold small">{(priceRange.max/1000000).toFixed(1)}tr</span></div><div className="range-slider-wrapper"><div className="slider-track"><div className="slider-range" style={getProgressBarStyle()}></div></div><input type="range" min="0" max="20000000" step="500000" value={priceRange.min} onChange={(e) => handlePriceRangeChange(e, 'min')} className="range-slider-input" /><input type="range" min="0" max="20000000" step="500000" value={priceRange.max} onChange={(e) => handlePriceRangeChange(e, 'max')} className="range-slider-input" /></div></div></div>
                        <div className="col-md-4"><label className="form-label text-muted small fw-bold">KHOẢNG NGÀY</label><div className="date-range-picker-container" ref={datePickerRef}><div className="custom-input d-flex align-items-center justify-content-between date-input-display" onClick={() => setShowDatePicker(!showDatePicker)}><span>{formatDateDisplay()}</span><i className="bi bi-calendar-range"></i></div>{showDatePicker && (<div className="date-picker-dropdown-calendar"><DateRangePicker ranges={dateRange} onChange={handleDateRangeSelect} months={2} direction="horizontal" locale={vi} showDateDisplay={false} moveRangeOnFirstSelection={false} rangeColors={['#764ba2']} className="custom-date-range-picker" /></div>)}</div></div>
                    </div>
                    <div className="row g-2 align-items-end">
                        <div className="col-md-3"><label className="form-label text-muted small fw-bold">NƠI ĐI</label><input name="origin" className="form-control custom-input" placeholder="Nơi đi" onChange={handleFilterChange} list="cityOpt"/></div>
                        <div className="col-md-3"><label className="form-label text-muted small fw-bold">NƠI ĐẾN</label><input name="destination" className="form-control custom-input" placeholder="Nơi đến" onChange={handleFilterChange} list="cityOpt"/></div>
                        <datalist id="cityOpt">{suggestionCities.map((c,i) => <option key={i} value={c}/>)}</datalist>
                        <div className="col-md-3">
                            <label className="form-label text-muted small fw-bold">TRẠNG THÁI</label>
                            <select name="status" className="form-select custom-input" onChange={handleFilterChange}>
                                <option value="">Tất cả</option>
                                <option value="SCHEDULED">SCHEDULED</option>
                                <option value="DELAYED">DELAYED</option>
                                <option value="IN_FLIGHT">IN_FLIGHT</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>
                        <div className="col-md-3"><button className="btn btn-primary w-100 fw-bold shadow-sm custom-input" onClick={handleSearchBtn}><i className="bi bi-search me-1"></i> Tìm kiếm</button></div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="sort-toolbar shadow-sm d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="sort-label"><i className="bi bi-sort-down-alt me-2"></i>Sắp xếp:</span>
                        <button className={`btn btn-sort ${isSorted('departureTime') ? 'active' : ''}`} onClick={() => handleSort('departureTime')}>Giờ bay {renderSortIcon('departureTime')} {renderSortIndex('departureTime')}</button>
                        <button className={`btn btn-sort ${isSorted('aircraft.airline.name') ? 'active' : ''}`} onClick={() => handleSort('aircraft.airline.name')}>Hãng {renderSortIcon('aircraft.airline.name')} {renderSortIndex('aircraft.airline.name')}</button>
                        <button className={`btn btn-sort ${isSorted('status') ? 'active' : ''}`} onClick={() => handleSort('status')}>Trạng thái {renderSortIcon('status')} {renderSortIndex('status')}</button>
                    </div>
                    <div className="view-mode-group">
                        <button className={`btn btn-view-mode ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')} title="Dạng bảng"><i className="bi bi-table"></i></button>
                        <button className={`btn btn-view-mode ${viewMode === 'card' ? 'active' : ''}`} onClick={() => setViewMode('card')} title="Dạng thẻ"><i className="bi bi-card-list"></i></button>
                    </div>
                </div>

                {/* FLIGHT LIST WRAPPER */}
                <div className="flight-list-wrapper">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                        <h6 className="fw-bold mb-0 text-secondary" style={{ fontSize: '0.95rem' }}>
                            Trang {currentPage + 1} / {totalPages > 0 ? totalPages : 1} ({totalElements} kết quả)
                        </h6>
                        <span className="badge bg-danger rounded-pill px-3 py-2 live-badge shadow-sm" style={{fontSize: '0.7rem'}}>LIVE <i className="bi bi-broadcast"></i></span>
                    </div>

                    {flights.length === 0 ? (
                        <div className="text-center py-5 glass-card"><i className="bi bi-cloud-slash text-muted" style={{ fontSize: '3rem' }}></i><p className="mt-3 text-muted fw-bold">Không tìm thấy chuyến bay nào phù hợp.</p></div>
                    ) : (
                        viewMode === 'card' ? (
                            flights.map(f => (
                                <div key={f.id} className={`flight-card ${f.status === 'CANCELLED' ? 'opacity-75 bg-light' : ''}`}>
                                    <div className="row align-items-center g-0">
                                        <div className="col-md-4 border-end pe-3">
                                            <div className="d-flex align-items-center gap-3">
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
                                        <div className="col-md-5 px-4 border-end">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="fc-time-group">
                                                    <span className="fc-date">{new Date(f.departureTime).toLocaleDateString('vi-VN')}</span>
                                                    <div className="fc-time">{new Date(f.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                                    <div className="fc-city-code">{f.departureAirport.code}</div>
                                                    <div className="fc-city-name">{f.departureAirport.city}</div>
                                                </div>
                                                <div className="fc-timeline flex-grow-1 mx-4">
                                                    <div className="fc-duration">
                                                        {(() => {
                                                            const diff = new Date(f.arrivalTime) - new Date(f.departureTime);
                                                            const hours = Math.floor(diff / 3600000);
                                                            const minutes = Math.round((diff % 3600000) / 60000);
                                                            return `${hours}g ${minutes > 0 ? minutes + 'p' : ''}`;
                                                        })()}
                                                    </div>
                                                    <div className="fc-line"></div>
                                                </div>
                                                <div className="fc-time-group">
                                                    <span className="fc-date">{new Date(f.arrivalTime).toLocaleDateString('vi-VN')}</span>
                                                    <div className="fc-time">{new Date(f.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                                    <div className="fc-city-code">{f.arrivalAirport.code}</div>
                                                    <div className="fc-city-name">{f.arrivalAirport.city}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 ps-3">
                                            <div className="d-flex flex-column h-100 justify-content-center">
                                                <div className="mb-2 text-end">{renderStatusBadge(f.status)}</div>
                                                <div className="seat-details-box bg-light rounded p-2 border">
                                                    {f.seatDetails && f.seatDetails.length > 0 ? (
                                                        f.seatDetails.map((seat) => (
                                                            <div key={seat.id} className="seat-detail-row">
                                                                <span className="seat-class-name small text-uppercase">{seat.seatClass === 'FIRST_CLASS' ? 'First' : seat.seatClass}</span>
                                                                <div className="text-end">
                                                                    <span className="seat-price d-block">{seat.price.toLocaleString()}đ</span>
                                                                    <span className="seat-avail">Còn {seat.availableSeats}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : <small className="text-muted">Chưa cấu hình giá</small>}
                                                </div>
                                                {f.status !== 'CANCELLED' && f.status !== 'COMPLETED' && (
                                                    <div className="text-end mt-2">
                                                        <Link to={`/flights/edit/${f.id}`} className="btn-edit-card"><i className="bi bi-pencil-square me-1"></i> Sửa</Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-0 overflow-hidden">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0 flight-table">
                                        <thead className="bg-light text-secondary small">
                                        <tr>
                                            <th className="ps-4">Chuyến bay</th>
                                            <th>Hành trình</th>
                                            <th>Thời gian</th>
                                            <th>Máy bay</th>
                                            <th>Trạng thái</th>
                                            <th>Chi tiết Giá & Ghế</th>
                                            <th className="text-end pe-4">Thao tác</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {flights.map(f => (
                                            <tr key={f.id} className={f.status === 'CANCELLED' ? 'table-secondary opacity-75' : ''}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img src={f.aircraft.airline.logoUrl} alt="Logo" style={{width: '30px', height: '30px', objectFit:'contain'}} />
                                                        <div>
                                                            <div className="fw-bold text-dark">{f.flightNumber}</div>
                                                            <small className="text-muted" style={{fontSize: '0.75rem'}}>{f.aircraft.airline.name}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-bold">{f.departureAirport.code} <i className="bi bi-arrow-right text-muted mx-1"></i> {f.arrivalAirport.code}</span>
                                                        <small className="text-muted">{f.departureAirport.city} - {f.arrivalAirport.city}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-bold">{new Date(f.departureTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</span>
                                                        <small className="text-muted">{new Date(f.departureTime).toLocaleDateString('vi-VN')}</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <small className="fw-bold d-block">{f.aircraft.name}</small>
                                                    <small className="text-muted" style={{fontSize: '0.7rem'}}>{f.aircraft.registrationCode}</small>
                                                </td>
                                                <td>{renderStatusBadge(f.status)}</td>
                                                <td>
                                                    <div style={{minWidth: '180px'}}>
                                                        {f.seatDetails && f.seatDetails.length > 0 ? (
                                                            f.seatDetails.map(s => (
                                                                <div key={s.id} className="d-flex justify-content-between small border-bottom border-secondary-subtle py-1">
                                                                    <span className="text-muted">{s.seatClass === 'FIRST_CLASS' ? 'First' : s.seatClass}</span>
                                                                    <span className="fw-bold text-primary">{s.price.toLocaleString()}đ</span>
                                                                </div>
                                                            ))
                                                        ) : <small className="text-muted">--</small>}
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    {f.status !== 'CANCELLED' && f.status !== 'COMPLETED' ? (
                                                        <Link to={`/flights/edit/${f.id}`} className="btn btn-sm btn-outline-primary border-0 rounded-circle">
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Link>
                                                    ) : <span className="text-muted small">--</span>}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    )}

                    {/* --- PAGINATION BAR (ĐÃ BỔ SUNG CÁC NÚT ĐIỀU HƯỚNG & SELECT SIZE) --- */}
                    {totalPages > 0 && (
                        <div className="d-flex justify-content-between align-items-center gap-3 mt-4 pt-3 border-top border-light-subtle">

                            {/* 1. SELECT PAGE SIZE (Bên trái) */}
                            <div className="d-flex align-items-center">
                                <span className="text-muted small me-2">Hiển thị:</span>
                                <select
                                    className="form-select form-select-sm"
                                    style={{width: '70px', cursor: 'pointer'}}
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>

                            {/* 2. NAVIGATION BUTTONS (Ở giữa) */}
                            <div className="d-flex align-items-center gap-2">
                                {/* First Page */}
                                <button
                                    className="btn btn-light rounded-circle shadow-sm border"
                                    onClick={() => handlePageChange(0)}
                                    disabled={currentPage === 0}
                                    title="Trang đầu"
                                    style={{width: '35px', height: '35px'}}
                                >
                                    <i className="bi bi-chevron-double-left text-secondary"></i>
                                </button>

                                {/* Prev Page */}
                                <button
                                    className="btn btn-light rounded-circle shadow-sm border"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    title="Trang trước"
                                    style={{width: '35px', height: '35px'}}
                                >
                                    <i className="bi bi-chevron-left text-primary"></i>
                                </button>

                                {/* Page Info */}
                                <span className="fw-bold text-dark px-3 py-1 rounded bg-white shadow-sm border mx-2">
                                    {currentPage + 1} / {totalPages}
                                </span>

                                {/* Next Page */}
                                <button
                                    className="btn btn-light rounded-circle shadow-sm border"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                    title="Trang sau"
                                    style={{width: '35px', height: '35px'}}
                                >
                                    <i className="bi bi-chevron-right text-primary"></i>
                                </button>

                                {/* Last Page */}
                                <button
                                    className="btn btn-light rounded-circle shadow-sm border"
                                    onClick={() => handlePageChange(totalPages - 1)}
                                    disabled={currentPage === totalPages - 1}
                                    title="Trang cuối"
                                    style={{width: '35px', height: '35px'}}
                                >
                                    <i className="bi bi-chevron-double-right text-secondary"></i>
                                </button>
                            </div>

                            {/* 3. INFO (Bên phải - Để cân đối layout) */}
                            <div className="text-muted small">
                                Tổng: <strong>{totalElements}</strong> kết quả
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlightList;