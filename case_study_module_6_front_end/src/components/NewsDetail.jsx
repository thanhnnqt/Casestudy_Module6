import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNewsById } from '../services/NewsService';
import Header from './Header'; // Kiểm tra lại đường dẫn import
import Footer from './Footer'; // Kiểm tra lại đường dẫn import

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await getNewsById(id);
                setNews(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    return (
        <>
            <Header />

            {/* --- SỬA Ở ĐÂY: Thêm paddingTop: '100px' --- */}
            <div className="bg-white" style={{ minHeight: '100vh', paddingTop: '100px' }}>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải chi tiết bài viết...</p>
                    </div>
                ) : !news ? (
                    <div className="text-center py-5">
                        <h3>😕 Không tìm thấy bài viết!</h3>
                        <Link to="/news" className="btn btn-primary mt-3">Quay lại danh sách</Link>
                    </div>
                ) : (
                    <div className="container my-5" style={{ maxWidth: '900px' }}>
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb" className="mb-4">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang chủ</Link></li>
                                <li className="breadcrumb-item"><Link to="/news" className="text-decoration-none">Tin tức</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">{news.title}</li>
                            </ol>
                        </nav>

                        {/* Title & Meta */}
                        <h1 className="fw-bold mb-3 display-5">{news.title}</h1>
                        <div className="d-flex align-items-center text-muted mb-4 gap-3 border-bottom pb-3">
                            <span><i className="bi bi-calendar3 me-2"></i>{new Date(news.publishedAt).toLocaleDateString('vi-VN')}</span>
                            <span className="badge bg-light text-dark border">{news.category}</span>
                        </div>

                        {/* Summary Box */}
                        <div className="p-4 bg-light border-start border-4 border-primary rounded mb-4 fst-italic text-secondary">
                            {news.summary}
                        </div>

                        {/* Thumbnail */}
                        <img
                            src={news.thumbnail}
                            alt={news.title}
                            className="img-fluid rounded-3 w-100 mb-5 shadow-sm"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/800x400'}
                        />

                        {/* Content */}
                        <div className="news-content fs-5" style={{ lineHeight: '1.8', textAlign: 'justify', color: '#333' }}>
                            <div dangerouslySetInnerHTML={{ __html: news.content }} />
                        </div>

                        <hr className="my-5" />

                        {/* Navigation Buttons */}
                        <div className="d-flex justify-content-between pb-5">
                            <Link to="/news" className="btn btn-outline-secondary rounded-pill px-4">
                                <i className="bi bi-arrow-left me-2"></i>Quay lại danh sách
                            </Link>

                            <Link
                                to="/"
                                className="btn btn-primary rounded-pill px-4"
                                onClick={() => {
                                    // Cách 1: Cuộn trình duyệt (Mặc định)
                                    window.scrollTo(0, 0);

                                    // Cách 2: Cuộn các container chính trong Layout của bạn
                                    // (Thanh cuộn thường nằm ở class .main hoặc .flight-list-container)
                                    const scrollableClasses = ['.main', '.flight-list-container', '.container-fluid', '#root'];

                                    scrollableClasses.forEach(selector => {
                                        const element = document.querySelector(selector);
                                        if (element) {
                                            element.scrollTop = 0; // Đưa thanh cuộn về 0
                                        }
                                    });
                                }}
                            >
                                Đặt vé ngay <i className="bi bi-airplane-fill ms-2"></i>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default NewsDetail;