import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createNews, getNewsById, updateNews } from '../services/NewsService';
import Header from './Header';
import Footer from './Footer';

// --- THÊM MỚI: Import axios để gọi API upload ---
import axios from "../modules/login/service/axiosConfig";

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

    // --- THÊM MỚI: State để hiển thị trạng thái đang upload ---
    const [uploading, setUploading] = useState(false);

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

    const handleContentChange = (value) => {
        setNews({ ...news, content: value });
    };

    // --- THÊM MỚI: Hàm xử lý khi chọn file ảnh ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true); // Bật loading
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Gọi API Backend (đã tạo ở bước trước)
            const res = await axios.post("/api/upload/image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Lấy link ảnh từ server trả về và gán vào news.thumbnail
            setNews(prev => ({ ...prev, thumbnail: res.data.url }));
            toast.success("Upload ảnh lên Cloudinary thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi upload ảnh! Vui lòng kiểm tra lại server.");
        } finally {
            setUploading(false); // Tắt loading
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- THÊM MỚI: Chặn submit nếu đang upload dở ---
        if (uploading) {
            toast.warning("Vui lòng đợi ảnh tải lên xong!");
            return;
        }

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

                                {/* Thumbnail - ĐÃ SỬA ĐỂ THÊM NÚT UPLOAD */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Ảnh đại diện</label>

                                    {/* 1. Ô Input File để chọn ảnh từ máy */}
                                    <input
                                        type="file"
                                        className="form-control mb-2"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />

                                    {/* Loading text */}
                                    {uploading && <div className="text-primary small mb-2">⏳ Đang tải ảnh lên Cloudinary...</div>}

                                    {/* 2. Ô Input Text cũ (Vẫn giữ để hiển thị link hoặc paste link thủ công) */}
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="thumbnail"
                                        value={news.thumbnail}
                                        onChange={handleChange}
                                        placeholder="Link ảnh sẽ hiện tại đây sau khi upload..."
                                        readOnly={uploading} // Khóa ô này khi đang upload
                                    />
                                    <small className="text-muted">Link ảnh sẽ tự động điền sau khi bạn chọn file.</small>
                                </div>
                            </div>

                            {/* Preview ảnh nếu có */}
                            {news.thumbnail && (
                                <div className="mb-3 text-center bg-light p-2 rounded">
                                    <p className="small fw-bold text-muted mb-1">Xem trước ảnh bìa:</p>
                                    <img src={news.thumbnail} alt="Preview" className="rounded border shadow-sm" style={{ height: '150px', objectFit: 'cover' }} />
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
                                <button type="submit" className="btn btn-primary fw-bold px-4" disabled={uploading}>
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