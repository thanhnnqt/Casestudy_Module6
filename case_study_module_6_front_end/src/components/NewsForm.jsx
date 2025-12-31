import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createNews, getNewsById, updateNews } from '../services/NewsService';
import Header from './Header';
import Footer from './Footer';

const NewsForm = () => {
    const { id } = useParams(); // Nếu có id là Sửa, không có là Thêm
    const navigate = useNavigate();

    const [news, setNews] = useState({
        title: '',
        summary: '',
        content: '',
        thumbnail: '',
        category: 'NEWS' // Mặc định
    });

    useEffect(() => {
        if (id) {
            const loadData = async () => {
                try {
                    const data = await getNewsById(id);
                    setNews(data);
                } catch (error) {
                    toast.error("Không tìm thấy bài viết!");
                }
            };
            loadData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNews({ ...news, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateNews(id, news);
                toast.success("Cập nhật thành công!");
            } else {
                await createNews(news);
                toast.success("Thêm mới thành công!");
            }
            navigate('/admin/news'); // Quay về trang quản lý
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5 pt-5 mb-5" style={{ maxWidth: '800px' }}>
                <div className="card shadow-sm border-0 mt-4">
                    <div className="card-header bg-white border-bottom py-3">
                        <h4 className="fw-bold m-0 text-primary">
                            {id ? "Cập Nhật Bài Viết" : "Thêm Bài Viết Mới"}
                        </h4>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            {/* Tiêu đề */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Tiêu đề bài viết</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={news.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Danh mục */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Danh mục</label>
                                <select className="form-select" name="category" value={news.category} onChange={handleChange}>
                                    <option value="NEWS">Tin Tức</option>
                                    <option value="PROMOTION">Khuyến Mãi</option>
                                    <option value="ANNOUNCEMENT">Thông Báo</option>
                                </select>
                            </div>

                            {/* Thumbnail */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Link ảnh đại diện (Thumbnail)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="thumbnail"
                                    value={news.thumbnail}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                                {news.thumbnail && (
                                    <img src={news.thumbnail} alt="Preview" className="mt-2 rounded" style={{ height: '100px' }} />
                                )}
                            </div>

                            {/* Tóm tắt */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Tóm tắt ngắn</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="summary"
                                    value={news.summary}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {/* Nội dung */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Nội dung chi tiết (HTML)</label>
                                <textarea
                                    className="form-control font-monospace"
                                    rows="10"
                                    name="content"
                                    value={news.content}
                                    onChange={handleChange}
                                    placeholder="Có thể nhập mã HTML như <p>, <b>, <ul>..."
                                    required
                                ></textarea>
                                <small className="text-muted">* Hỗ trợ định dạng HTML.</small>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <Link to="/admin/news" className="btn btn-secondary">Hủy bỏ</Link>
                                <button type="submit" className="btn btn-primary fw-bold">
                                    {id ? "Lưu thay đổi" : "Đăng bài viết"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NewsForm;