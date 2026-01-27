import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import NoticeDetail from '../components/NoticeDetail';

const Dashboard = () => {
    const [notices, setNotices] = useState([]);
    const [filterRegion, setFilterRegion] = useState('');
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        fetchNotices();
    }, [filterRegion]);

    const fetchNotices = async () => {
        let url = 'http://localhost:8000/notices';
        if (filterRegion) {
            url += `?region=${filterRegion}`;
        }
        try {
            const response = await fetch(url);
            const data = await response.json();
            // Mocking scores for frontend visualization if backend doesn't return them yet
            // In real integration, backend returns joined data
            const enrichedData = data.map(n => ({ ...n, score: (Math.random() * 5).toFixed(1) }));
            setNotices(enrichedData);
        } catch (error) {
            console.error("Failed to fetch notices", error);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-center">
                <h2 className="text-xl font-bold mr-4">필터</h2>
                <input
                    type="text"
                    placeholder="지역 (예: 마포구)"
                    className="border p-2 rounded"
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                />
                <select className="border p-2 rounded">
                    <option value="">모든 대상</option>
                    <option value="Youth">청년</option>
                    <option value="Newlywed">신혼부부</option>
                </select>
                <select className="border p-2 rounded">
                    <option value="Latest">최신순</option>
                    <option value="Score">가성비순 (점수)</option>
                </select>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-2/3 h-128">
                    <MapComponent notices={notices} />
                </div>
                <div className="w-full md:w-1/3 bg-white p-4 rounded shadow h-128 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">공고 목록 ({notices.length})</h2>
                    <ul>
                        {notices.map((notice, idx) => {
                            // D-Day Calc
                            const end = new Date(notice.end || Date.now());
                            const now = new Date();
                            const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                            const dDay = diff > 0 ? `D-${diff}` : "마감";
                            const dColor = diff > 0 ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-600";

                            // Status Badge Logic
                            const today = new Date();
                            const startDate = new Date(notice.start_date);
                            const endDate = new Date(notice.end_date);

                            let status = "모집 중";
                            let statusColor = "bg-green-100 text-green-800";

                            if (today < startDate) {
                                status = "모집 예정";
                                statusColor = "bg-yellow-100 text-yellow-800";
                            } else if (today > endDate) {
                                status = "신청 마감";
                                statusColor = "bg-gray-100 text-gray-800";
                            }

                            return (
                                <li key={idx} className="border-b py-3 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors"
                                    onClick={() => setSelectedNotice(notice)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColor}`}>{status}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${dColor}`}>{dDay}</span>
                                            </div>
                                            <h3 className="font-semibold text-gray-800 leading-tight">{notice.title}</h3>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 flex justify-between items-center">
                                        <span>{notice.region}</span>
                                        <div className="flex space-x-2">
                                            <span className={`text-xs px-2 py-1 rounded text-white ${notice.score >= 4 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                                ★ {notice.score}
                                            </span>
                                        </div>
                                    </div>
                                    {notice.price_diff_percent > 0 && (
                                        <p className="text-xs text-green-600 mt-1 font-medium">
                                            평균보다 {notice.price_diff_percent}% 저렴해요!
                                        </p>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

            {selectedNotice && (
                <NoticeDetail notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
            )}
        </div>
    );
};

export default Dashboard;
