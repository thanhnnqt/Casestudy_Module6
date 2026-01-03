import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // Import Portal
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllNews, deleteNews } from '../services/NewsService';
import Header from './Header';
import Footer from './Footer';
import AdminLayout from '../layouts/AdminLayout';

const NewsManager = () => {
    // --- STATE & LOGIC (GIỮ NGUYÊN) ---
    const [newsList, setNewsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState(null);

    const fetchNews = async () => {
        try {
            const data = await getAllNews();
            const sortedData = data.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            setNewsList(sortedData);
        } catch (error) { toast.error("Lỗi tải dữ liệu!"); }
    };

    useEffect(() => { fetchNews(); }, []);

    const openDeleteModal = (id) => { setSelectedNewsId(id); setShowDeleteModal(true); };
    const closeDeleteModal = () => { setShowDeleteModal(false); setSelectedNewsId(null); };
    const confirmDelete = async () => {
        if (!selectedNewsId) return;
        try {
            await deleteNews(selectedNewsId);
            toast.success("Xóa bài viết thành công!");
            fetchNews();
        } catch (error) { toast.error("Xóa thất bại!"); }
        finally { closeDeleteModal(); }
    };

    const totalElements = newsList.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const startIndex = currentPage * pageSize;
    const currentNews = newsList.slice(startIndex, startIndex + pageSize);
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };

    return (
        <AdminLayout>
            <div style={{ position: 'relative', zIndex: 999 }}>
                <Header />
            </div>

            <div className="container-fluid px-0" style={{ marginTop: '100px', minHeight: '80vh' }}>
                {/* Header Trang */}
                <div className="glass-card d-flex justify-content-between align-items-center mb-4 sticky-header">
                    <div>
                        <h2 className="fw-bold mb-1 text-dark">Quản Lý Tin Tức</h2>
                        <p className="text-muted mb-0">Đăng tải và chỉnh sửa bài viết, khuyến mãi</p>
                    </div>
                    <Link to="/admin/news/create" className="btn btn-success shadow-lg fw-bold">
                        <i className="bi bi-plus-circle me-2"></i>Thêm bài viết
                    </Link>
                </div>

                {/* Bảng dữ liệu */}
                <div className="glass-card p-0 overflow-hidden shadow-sm mb-5">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light text-secondary">
                            <tr>
                                <th className="ps-4">#</th>
                                <th>Hình ảnh</th>
                                <th style={{width: '35%'}}>Tiêu đề</th>
                                <th>Danh mục</th>
                                <th>Ngày đăng</th>
                                <th className="text-end pe-4">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentNews.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-5 text-muted">Chưa có bài viết nào.</td></tr>
                            ) : (
                                currentNews.map((n, index) => (
                                    <tr key={n.newsId}>
                                        <td className="ps-4 fw-bold text-muted">{startIndex + index + 1}</td>
                                        <td>
                                            <img src={n.thumbnail} alt="" className="rounded border bg-white p-1" style={{width: '60px', height: '40px', objectFit: 'cover'}} onError={(e) => e.target.src = 'https://via.placeholder.com/60x40'} />
                                        </td>
                                        <td><div className="fw-bold text-truncate" style={{maxWidth: '300px'}} title={n.title}>{n.title}</div></td>
                                        <td>
                                                <span className={`badge border ${n.category === 'NEWS' ? 'bg-primary bg-opacity-10 text-primary border-primary' : n.category === 'PROMOTION' ? 'bg-warning bg-opacity-10 text-warning border-warning' : 'bg-danger bg-opacity-10 text-danger border-danger'}`}>
                                                    {n.category}
                                                </span>
                                        </td>
                                        <td>{new Date(n.publishedAt).toLocaleDateString('vi-VN')}</td>
                                        <td className="text-end pe-4">
                                            <Link to={`/admin/news/edit/${n.newsId}`} className="btn btn-light border btn-sm me-2 text-primary shadow-sm"><i className="bi bi-pencil-square"></i></Link>
                                            <button onClick={() => openDeleteModal(n.newsId)} className="btn btn-light border btn-sm text-danger shadow-sm"><i className="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 0 && (
                        <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light bg-opacity-25">
                            <div className="text-muted small">Hiển thị <strong>{currentNews.length}</strong> / <strong>{totalElements}</strong> bài viết</div>
                            <div className="d-flex align-items-center gap-2">
                                <button className="btn btn-light rounded-circle shadow-sm border" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} style={{width: '35px', height: '35px'}}><i className="bi bi-chevron-left text-primary"></i></button>
                                <span className="fw-bold text-dark px-3 py-1 rounded bg-white shadow-sm border mx-2">{currentPage + 1} / {totalPages}</span>
                                <button className="btn btn-light rounded-circle shadow-sm border" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} style={{width: '35px', height: '35px'}}><i className="bi bi-chevron-right text-primary"></i></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto shadow-sm bg-white rounded-3 overflow-hidden">
                <Footer />
            </div>

            {/* --- MODAL XÓA (Sử dụng Flexbox để căn giữa tuyệt đối) --- */}
            {showDeleteModal && createPortal(
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Backdrop tối màu
                        zIndex: 10000, // Cao hơn mọi thứ
                        display: 'flex', // Dùng Flexbox
                        alignItems: 'center', // Căn giữa dọc
                        justifyContent: 'center', // Căn giữa ngang
                        backdropFilter: 'blur(4px)' // Hiệu ứng mờ nền phía sau
                    }}
                    onClick={closeDeleteModal} // Bấm ra ngoài thì đóng
                >
                    {/* Modal Content */}
                    <div
                        className="bg-white rounded-4 shadow-lg overflow-hidden"
                        style={{
                            width: '90%',
                            maxWidth: '450px',
                            animation: 'zoomIn 0.2s ease-out' // Hiệu ứng hiện ra
                        }}
                        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click đóng modal khi bấm vào nội dung
                    >
                        <div className="p-4 text-center border-bottom bg-light bg-opacity-50">
                            <i className="bi bi-exclamation-circle text-danger display-1 mb-3"></i>
                            <h4 className="fw-bold text-danger">Xác nhận xóa?</h4>
                        </div>

                        <div className="p-4 text-center">
                            <p className="mb-1 fs-5">Bạn có chắc chắn muốn xóa bài viết này?</p>
                            <p className="text-muted small">Hành động này không thể hoàn tác.</p>
                        </div>

                        <div className="p-3 bg-light d-flex justify-content-center gap-3">
                            <button
                                className="btn btn-light border px-4 rounded-pill fw-bold"
                                onClick={closeDeleteModal}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className="btn btn-danger px-4 rounded-pill fw-bold shadow-sm"
                                onClick={confirmDelete}
                            >
                                Đồng ý xóa
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Thêm style animation nhỏ cho mượt */}
            <style>
                {`
                    @keyframes zoomIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}
            </style>
        </AdminLayout>
    );
};

export default NewsManager;