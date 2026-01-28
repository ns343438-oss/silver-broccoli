import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import NoticeDetail from '../components/NoticeDetail';
import EligibilityForm from '../components/EligibilityForm';
import ResultModal from '../components/ResultModal';
import { checkEligibility } from '../utils/MatchingLogic';

const Dashboard = () => {
    const [notices, setNotices] = useState([]);
    const [tempFilterRegion, setTempFilterRegion] = useState('');
    const [filterRegion, setFilterRegion] = useState('');
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [showEligibilityForm, setShowEligibilityForm] = useState(false);
    const [eligibilityResults, setEligibilityResults] = useState(null);

    useEffect(() => {
        fetchNotices();
    }, [filterRegion]);

    const fetchNotices = async () => {
        // Use static JSON data for GitHub Pages
        let url = import.meta.env.BASE_URL + 'data/notices.json';

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Client-side filtering
            let filteredData = data;
            if (filterRegion) {
                // Remove '구' from filter if present to match relaxed search or keep strict
                // Here we assume exact match or contains
                filteredData = data.filter(item => item.region && item.region.includes(filterRegion));
            }

            // Mocking scores for frontend visualization if backend doesn't return them yet
            // In real integration, backend returns joined data
            const enrichedData = filteredData.map(n => ({ ...n, score: n.score || (Math.random() * 5).toFixed(1) }));
            setNotices(enrichedData);
        } catch (error) {
            console.error("Failed to fetch notices", error);
        }
    };

    const handleEligibilitySubmit = (userProfile) => {
        const results = checkEligibility(userProfile, notices);
        setEligibilityResults(results);
        setShowEligibilityForm(false);
    };

    const REGION_KO = {
        'Seoul': '서울시',
        'Gangnam-gu': '강남구',
        'Songpa-gu': '송파구',
        'Gangdong-gu': '강동구',
        'Mapo-gu': '마포구',
        'Seodaemun-gu': '서대문구'
        // Add more as needed
    };

    const handleSearch = () => {
        setFilterRegion(tempFilterRegion);
    };

    const handleReset = () => {
        setTempFilterRegion('');
        setFilterRegion('');
        // fetchNotices will auto-trigger due to useEffect dependency on filterRegion
        // But if we want to ensure full reset including client-side filtering logic:
        fetchNotices();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleMarkerClick = (notice) => {
        setSelectedNotice(notice);
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center flex-wrap">
                    <h2 className="text-xl font-bold mr-4">필터</h2>
                    <select className="border p-2 rounded">
                        <option value="">모든 대상</option>
                        <option value="Youth">청년</option>
                        <option value="Newlywed">신혼부부</option>
                    </select>
                    <select className="border p-2 rounded">
                        <option value="Latest">최신순</option>
                        <option value="Score">가성비순 (점수)</option>
                    </select>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="지역 (예: 마포구)"
                            className="border p-2 rounded"
                            value={tempFilterRegion}
                            onChange={(e) => setTempFilterRegion(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold"
                        >
                            검색
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold"
                        >
                            초기화
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => setShowEligibilityForm(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow animate-pulse"
                    >
                        📋 내 자격 확인하기 (Click!)
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-2/3 h-128">
                    <MapComponent notices={notices} onMarkerClick={handleMarkerClick} />
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

                            // Status Badge Logic (Single Badge Priority)
                            const today = new Date();
                            const startDate = new Date(notice.start_date);
                            const endDate = new Date(notice.end_date);

                            let badgeText = "모집 중";
                            let badgeColor = "bg-green-100 text-green-800";

                            if (today < startDate) {
                                badgeText = "모집 예정";
                                badgeColor = "bg-yellow-100 text-yellow-800";
                            } else if (today > endDate) {
                                badgeText = "신청 마감";
                                badgeColor = "bg-gray-100 text-gray-800";
                            } else {
                                // Recruitment period - Show D-Day info in badge
                                badgeText = `모집 중 (${dDay})`;
                            }

                            return (
                                <li key={idx} className="border-b py-3 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors"
                                    onClick={() => setSelectedNotice(notice)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeColor}`}>{badgeText}</span>
                                            </div>
                                            <h3 className="font-semibold text-gray-800 leading-tight">{notice.title}</h3>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 flex justify-between items-center">
                                        <span>{REGION_KO[notice.region] || notice.region}</span>
                                        <div className="flex space-x-2">
                                            <span className={`text - xs px - 2 py - 1 rounded text - white ${notice.score >= 4 ? 'bg-green-500' : 'bg-yellow-500'} `}>
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

            {showEligibilityForm && (
                <EligibilityForm
                    onSubmit={handleEligibilitySubmit}
                    onClose={() => setShowEligibilityForm(false)}
                />
            )}

            {eligibilityResults && (
                <ResultModal
                    results={eligibilityResults}
                    onClose={() => setEligibilityResults(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
