import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllNews, deleteNews } from '../services/NewsService';

// 1. Import Header, Footer & Layout
import Header from './Header';
import Footer from './Footer';
import AdminLayout from '../layouts/AdminLayout'; // Lưu ý đường dẫn import layout

const NewsManager = () => {
    const [newsList, setNewsList] = useState([]);

    const fetchNews = async () => {
        try {
            const data = await getAllNews();
            setNewsList(data);
        } catch (error) {
            toast.error("Lỗi tải dữ liệu!");
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
            try {
                await deleteNews(id);
                toast.success("Xóa thành công!");
                fetchNews(); // Load lại danh sách
            } catch (error) {
                toast.error("Xóa thất bại!");
            }
        }
    };

    return (
        // Bọc AdminLayout ở ngoài cùng để lấy Sidebar + Nền mây trời
        <AdminLayout>

            {/* --- HEADER --- */}
            {/* Đặt trong div để đảm bảo nó nằm trong luồng nội dung bên phải Sidebar */}
            <div className="mb-4 shadow-sm bg-white rounded-3 overflow-hidden">
                <Header />
            </div>

            <div className="container-fluid px-0">
                {/* Tiêu đề & Nút Thêm */}
                <div className="glass-card d-flex justify-content-between align-items-center mb-4 sticky-header">
                    <div>
                        <h2 className="fw-bold mb-1 text-dark">Quản Lý Tin Tức</h2>
                        <p className="text-muted mb-0">Đăng tải và chỉnh sửa bài viết, khuyến mãi</p>
                    </div>
                    <Link to="/admin/news/create" className="btn btn-success shadow-lg fw-bold">
                        <i className="bi bi-plus-circle me-2"></i>Thêm bài viết
                    </Link>
                </div>

                {/* Bảng danh sách tin tức */}
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
                            {newsList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">Chưa có bài viết nào.</td>
                                </tr>
                            ) : (
                                newsList.map((n, index) => (
                                    <tr key={n.newsId}>
                                        <td className="ps-4 fw-bold text-muted">{index + 1}</td>
                                        <td>
                                            <img
                                                src={n.thumbnail}
                                                alt=""
                                                className="rounded border bg-white p-1"
                                                style={{width: '60px', height: '40px', objectFit: 'cover'}}
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/60x40'}
                                            />
                                        </td>
                                        <td>
                                            <div className="fw-bold text-truncate" style={{maxWidth: '300px'}} title={n.title}>
                                                {n.title}
                                            </div>
                                        </td>
                                        <td>
                                                <span className={`badge border ${
                                                    n.category === 'NEWS' ? 'bg-primary bg-opacity-10 text-primary border-primary' :
                                                        n.category === 'PROMOTION' ? 'bg-warning bg-opacity-10 text-warning border-warning' :
                                                            'bg-danger bg-opacity-10 text-danger border-danger'
                                                }`}>
                                                    {n.category}
                                                </span>
                                        </td>
                                        <td>{new Date(n.publishedAt).toLocaleDateString('vi-VN')}</td>
                                        <td className="text-end pe-4">
                                            <Link to={`/admin/news/edit/${n.newsId}`} className="btn btn-light border btn-sm me-2 text-primary shadow-sm">
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>
                                            <button onClick={() => handleDelete(n.newsId)} className="btn btn-light border btn-sm text-danger shadow-sm">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <div className="mt-auto shadow-sm bg-white rounded-3 overflow-hidden">
                <Footer />
            </div>

        </AdminLayout>
    );
};

export default NewsManager;