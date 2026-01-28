import React from 'react';

const NoticeDetail = ({ notice, onClose }) => {
    if (!notice) return null;

    const dDay = () => {
        const end = new Date(notice.end_date || Date.now());
        const now = new Date();
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return diff > 0 ? `D-${diff}` : "마감됨";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{notice.platform}</span>
                        <h2 className="text-2xl font-bold text-gray-800 mt-1">{notice.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded">
                            <span className="text-xs text-blue-600 font-bold block">신청 마감일</span>
                            <span className="text-lg font-semibold text-blue-900">{dDay()} ({new Date(notice.end_date).toLocaleDateString()})</span>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                            <span className="text-xs text-green-600 font-bold block">가성비 점수</span>
                            <span className="text-lg font-semibold text-green-900">★ {notice.score} / 5.0</span>
                        </div>
                    </div>

                    {/* AI Analysis Summary */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                            <span className="bg-purple-100 text-purple-600 p-1 rounded mr-2">AI</span>
                            핵심 자격 요건
                        </h3>
                        <div className="bg-gray-100 p-4 rounded text-sm text-gray-700 leading-relaxed">
                            <p className="mb-2"><strong>대상:</strong> {notice.summary_qualifications || "전체"}</p>
                            <p className="mb-2"><strong>소득 기준:</strong> {notice.summary_income || "공고문 참조"}</p>
                            <p><strong>자산 기준:</strong> {notice.summary_assets || "공고문 참조"}</p>
                        </div>
                    </div>

                    {/* Price Analysis - Show only if data exists */}
                    {(notice.rent > 0 || notice.deposit > 0) ? (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">가격 분석</h3>
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500 mb-1">공고 임대료</div>
                                    <div className="h-4 bg-gray-200 rounded overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500 mb-1">주변 시세 (500m)</div>
                                    <div className="h-4 bg-gray-200 rounded overflow-hidden">
                                        <div className="h-full bg-red-400" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-right">
                                * 이 공고는 주변 시세 대비 약 <span className="font-bold text-green-600">{notice.price_diff_percent}%</span> 저렴합니다.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">가격 분석</h3>
                            <p className="text-sm text-gray-500">💰 상세 임대료 정보가 없어 가격 분석을 제공하지 않습니다.</p>
                        </div>
                    )}

                    {/* Address */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">위치</h3>
                        <p className="text-gray-800">{notice.address}</p>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 text-right">
                    <a
                        href={notice.link && notice.link.includes('mock') ? `https://www.google.com/search?q=${encodeURIComponent(notice.title)}` : notice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        {notice.link && notice.link.includes('mock') ? '공고 검색하기 (Google)' : '원문 공고 보러가기'}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;
