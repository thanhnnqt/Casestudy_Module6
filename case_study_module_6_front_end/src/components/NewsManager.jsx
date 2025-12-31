import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllNews, deleteNews } from '../services/NewsService';
import Header from './Header';
import Footer from './Footer';

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
        <>
            <Header />
            <div className="container mt-5 pt-5" style={{ minHeight: '80vh' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                    <h2 className="fw-bold">Quản Lý Tin Tức</h2>
                    <Link to="/admin/news/create" className="btn btn-success">
                        <i className="bi bi-plus-circle me-2"></i>Thêm bài viết
                    </Link>
                </div>

                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light text-secondary">
                            <tr>
                                <th className="ps-4">#</th>
                                <th>Hình ảnh</th>
                                <th style={{width: '40%'}}>Tiêu đề</th>
                                <th>Danh mục</th>
                                <th>Ngày đăng</th>
                                <th className="text-end pe-4">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {newsList.map((n, index) => (
                                <tr key={n.newsId}>
                                    <td className="ps-4 fw-bold text-muted">{index + 1}</td>
                                    <td>
                                        <img src={n.thumbnail} alt="" className="rounded" style={{width: '60px', height: '40px', objectFit: 'cover'}} />
                                    </td>
                                    <td>
                                        <div className="fw-bold text-truncate" style={{maxWidth: '300px'}} title={n.title}>{n.title}</div>
                                    </td>
                                    <td>
                                            <span className={`badge ${n.category === 'NEWS' ? 'bg-primary' : n.category === 'PROMOTION' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                                {n.category}
                                            </span>
                                    </td>
                                    <td>{new Date(n.publishedAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="text-end pe-4">
                                        <Link to={`/admin/news/edit/${n.newsId}`} className="btn btn-outline-primary btn-sm me-2">
                                            <i className="bi bi-pencil-square"></i>
                                        </Link>
                                        <button onClick={() => handleDelete(n.newsId)} className="btn btn-outline-danger btn-sm">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NewsManager;