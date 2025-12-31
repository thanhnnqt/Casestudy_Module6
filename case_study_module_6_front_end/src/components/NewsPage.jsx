import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllNews } from '../services/NewsService';
import "../modules/flight/components/FlightList.css";
import Header from './Header'; // Kiểm tra lại đường dẫn import
import Footer from './Footer'; // Kiểm tra lại đường dẫn import

const NewsPage = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllNews();
                setNewsList(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const groupNews = {
        NEWS: newsList.filter(item => item.category === 'NEWS'),
        PROMOTION: newsList.filter(item => item.category === 'PROMOTION'),
        ANNOUNCEMENT: newsList.filter(item => item.category === 'ANNOUNCEMENT')
    };

    const NewsSection = ({ title, icon, data, colorClass }) => {
        if (!data || data.length === 0) return null;

        return (
            <div className="mb-5">
                <div className={`d-flex align-items-center mb-3 pb-2 border-bottom ${colorClass}`}>
                    <h3 className="fw-bold m-0">
                        {icon} {title}
                    </h3>
                    <span className="ms-3 badge bg-secondary rounded-pill">{data.length}</span>
                </div>

                <div className="row g-4">
                    {data.map((n) => (
                        <div className="col-md-4" key={n.newsId}>
                            <div className="card h-100 shadow-sm border-0 hover-shadow">
                                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                    <Link to={`/news/${n.newsId}`}>
                                        <img
                                            src={n.thumbnail}
                                            className="card-img-top h-100 w-100"
                                            style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                                            alt={n.title}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/400x250'}
                                        />
                                    </Link>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-2 text-muted small">
                                        <i className="bi bi-calendar3 me-1"></i>
                                        {new Date(n.publishedAt).toLocaleDateString('vi-VN')}
                                    </div>
                                    <h5 className="card-title fw-bold">
                                        <Link to={`/news/${n.newsId}`} className="text-decoration-none text-dark stretched-link">
                                            {n.title}
                                        </Link>
                                    </h5>
                                    <p className="card-text text-muted small text-truncate-3">
                                        {n.summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />

            {/* --- SỬA Ở ĐÂY: Thêm paddingTop: '100px' để đẩy nội dung xuống dưới Header --- */}
            <div className="bg-light" style={{ minHeight: '100vh', paddingBottom: '40px', paddingTop: '100px' }}>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Đang tải tin tức...</p>
                    </div>
                ) : (
                    <div className="container">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold display-6">📰 Tổng Hợp Tin Tức</h2>
                            <p className="text-muted">Cập nhật những thông tin mới nhất về chuyến bay và ưu đãi</p>
                        </div>

                        <NewsSection
                            title="Tin Tức Chung"
                            icon={<i className="bi bi-newspaper me-2 text-primary"></i>}
                            data={groupNews.NEWS}
                            colorClass="border-primary"
                        />

                        <NewsSection
                            title="Chương Trình Khuyến Mãi"
                            icon={<i className="bi bi-gift-fill me-2 text-warning"></i>}
                            data={groupNews.PROMOTION}
                            colorClass="border-warning"
                        />

                        <NewsSection
                            title="Thông Báo Quan Trọng"
                            icon={<i className="bi bi-megaphone-fill me-2 text-danger"></i>}
                            data={groupNews.ANNOUNCEMENT}
                            colorClass="border-danger"
                        />

                        {newsList.length === 0 && (
                            <div className="text-center py-5">
                                <p className="text-muted">Hiện tại chưa có bài viết nào.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default NewsPage;