import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill'; // IMPORT EDITOR
import 'react-quill/dist/quill.snow.css'; // IMPORT CSS CỦA EDITOR
import { createNews, getNewsById, updateNews } from '../services/NewsService';
import Header from './Header';
import Footer from './Footer';

const NewsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [news, setNews] = useState({
        title: '',
        summary: '',
        content: '',
        thumbnail: '',
        category: 'NEWS'
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

    // Xử lý thay đổi các ô input thường (Title, Summary...)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNews({ ...news, [name]: value });
    };

    // Xử lý riêng cho Editor (Nội dung bài viết)
    const handleContentChange = (value) => {
        setNews({ ...news, content: value });
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
            navigate('/admin/news');
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    // Cấu hình thanh công cụ cho Editor
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <>
            <Header />
            <div className="container mt-5 pt-5 mb-5" style={{ maxWidth: '900px' }}>
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
                                    placeholder="Nhập tiêu đề..."
                                />
                            </div>

                            <div className="row">
                                {/* Danh mục */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Danh mục</label>
                                    <select className="form-select" name="category" value={news.category} onChange={handleChange}>
                                        <option value="NEWS">Tin Tức</option>
                                        <option value="PROMOTION">Khuyến Mãi</option>
                                        <option value="ANNOUNCEMENT">Thông Báo</option>
                                    </select>
                                </div>

                                {/* Thumbnail */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Link ảnh đại diện</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="thumbnail"
                                        value={news.thumbnail}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>

                            {/* Preview ảnh nếu có */}
                            {news.thumbnail && (
                                <div className="mb-3">
                                    <img src={news.thumbnail} alt="Preview" className="rounded border p-1" style={{ height: '120px', objectFit: 'cover' }} />
                                </div>
                            )}

                            {/* Tóm tắt */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Tóm tắt ngắn</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="summary"
                                    value={news.summary}
                                    onChange={handleChange}
                                    placeholder="Mô tả ngắn gọn về bài viết..."
                                ></textarea>
                            </div>

                            {/* NỘI DUNG - SỬ DỤNG REACT QUILL */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Nội dung chi tiết</label>
                                <div style={{ height: '300px', marginBottom: '50px' }}>
                                    <ReactQuill
                                        theme="snow"
                                        value={news.content}
                                        onChange={handleContentChange}
                                        modules={modules}
                                        style={{ height: '250px' }}
                                        placeholder="Soạn thảo nội dung bài viết tại đây..."
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 border-top pt-3">
                                <Link to="/admin/news" className="btn btn-secondary px-4">Hủy bỏ</Link>
                                <button type="submit" className="btn btn-primary fw-bold px-4">
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