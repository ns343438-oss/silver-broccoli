import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import NoticeDetail from '../components/NoticeDetail';
import EligibilityForm from '../components/EligibilityForm';
import ResultModal from '../components/ResultModal';
import SubscriptionModal from '../components/SubscriptionModal';
import { checkEligibility } from '../utils/MatchingLogic';
import { calculateScore } from '../utils/ScoringLogic';
import { getFavorites, toggleFavorite } from '../utils/FavoritesManager';

const Dashboard = () => {
    const [notices, setNotices] = useState([]);
    const [tempFilterRegion, setTempFilterRegion] = useState('');
    const [filterRegion, setFilterRegion] = useState('');
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [showEligibilityForm, setShowEligibilityForm] = useState(false);
    const [showSubscription, setShowSubscription] = useState(false);
    const [eligibilityResults, setEligibilityResults] = useState(null);

    const [targetGroup, setTargetGroup] = useState('');
    const [sortOrder, setSortOrder] = useState('Latest');

    // Favorites State
    const [favorites, setFavorites] = useState([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load & Favorites Sync
    useEffect(() => {
        setFavorites(getFavorites());
        fetchNotices();
    }, [filterRegion, targetGroup, sortOrder, showOnlyFavorites]);

    const handleToggleFavorite = (e, id) => {
        e.stopPropagation(); // Prevent opening detail modal
        const updated = toggleFavorite(id);
        setFavorites(updated);
    };

    const fetchNotices = async () => {
        setIsLoading(true);
        // Use static JSON data for GitHub Pages
        let url = import.meta.env.BASE_URL + 'data/notices.json';

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Client-side filtering
            let filteredData = data;

            // Region Filter (Fuzzy Search & Deterministic)
            if (filterRegion) {
                const cleanRegion = filterRegion.replace('구', '').trim();
                filteredData = filteredData.filter(item =>
                    (item.region && item.region.includes(cleanRegion)) ||
                    (item.address && item.address.includes(cleanRegion)) ||
                    (item.title && item.title.includes(cleanRegion))
                );
            }

            // Target Group Filter
            if (targetGroup) {
                // Future logic placeholder
            }

            // Favorites Filter
            if (showOnlyFavorites) {
                const currentFavs = getFavorites(); // Use fresh state
                filteredData = filteredData.filter(item => currentFavs.includes(item.id));
            }

            // Deterministic Score Generation
            const enrichedData = filteredData.map(n => ({
                ...n,
                score: calculateScore(n)
            }));

            // Sorting
            if (sortOrder === 'Score') {
                enrichedData.sort((a, b) => b.score - a.score);
            } else {
                enrichedData.sort((a, b) => b.id - a.id);
            }

            setNotices(enrichedData);
        } catch (error) {
            console.error("Failed to fetch notices", error);
        } finally {
            setIsLoading(false);
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
        'Seodaemun-gu': '서대대문구'
        // Add more as needed
    };

    const handleSearch = () => {
        setFilterRegion(tempFilterRegion);
    };

    const handleReset = () => {
        setTempFilterRegion('');
        setFilterRegion('');
        setTargetGroup('');
        setSortOrder('Latest');
        setShowOnlyFavorites(false);
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
        <div className="flex flex-col space-y-6">
            {/* Search & Filter Section (Gov Style Box) */}
            <div className="bg-white p-6 border-t-4 border-gov-navy shadow-sm flex flex-wrap gap-4 items-end justify-between">
                <div className="flex gap-4 items-end flex-wrap flex-1">

                    {/* Target Group */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-gov-navy">대상 선택</label>
                        <select
                            className="border border-gray-300 p-2 min-w-[120px] focus:outline-none focus:border-gov-blue bg-white"
                            value={targetGroup}
                            onChange={(e) => setTargetGroup(e.target.value)}
                        >
                            <option value="">전체 (All)</option>
                            <option value="Youth">청년 (19~39세)</option>
                            <option value="Newlywed">신혼부부</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-bold text-gov-navy">정렬 기준</label>
                        <select
                            className="border border-gray-300 p-2 min-w-[120px] focus:outline-none focus:border-gov-blue bg-white"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="Latest">최신순</option>
                            <option value="Score">가성비순 (점수)</option>
                        </select>
                    </div>

                    {/* Region Search */}
                    <div className="flex flex-col space-y-1 flex-1 max-w-md">
                        <label className="text-sm font-bold text-gov-navy">지역 검색</label>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="지역명 입력 (예: 강남, 마포)"
                                className="border border-gray-300 p-2 flex-grow focus:outline-none focus:border-gov-blue"
                                value={tempFilterRegion}
                                onChange={(e) => setTempFilterRegion(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-gov-navy text-white px-4 py-2 font-bold hover:bg-opacity-90 transition-colors"
                            >
                                검색
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                        className={`border px-4 py-2 transition-colors h-[42px] font-bold flex items-center gap-2 ${showOnlyFavorites ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                    >
                        <span>{showOnlyFavorites ? '❤️' : '🤍'}</span>
                        <span>관심 공고만</span>
                    </button>

                    <button
                        onClick={handleReset}
                        className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2 hover:bg-gray-200 transition-colors h-[42px]"
                    >
                        ↺ 초기화
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowSubscription(true)}
                        className="bg-gov-gold text-gov-navy font-bold py-3 px-6 shadow hover:bg-yellow-400 transition-colors flex items-center gap-2 rounded"
                    >
                        <span>🔔</span>
                        <span>알림 받기</span>
                    </button>

                    <button
                        onClick={() => setShowEligibilityForm(true)}
                        className="bg-gov-navy text-white font-bold py-3 px-6 shadow hover:bg-opacity-90 transition-colors flex items-center gap-2 rounded"
                    >
                        <span>📋</span>
                        <span>내 자격 확인하기</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Map Component */}
                <div className="w-full h-96 md:h-[600px] md:w-2/3 shadow-md rounded overflow-hidden z-0">
                    <MapComponent notices={notices} onMarkerClick={handleMarkerClick} />
                </div>

                {/* Notice List */}
                <div className="w-full md:w-1/3 bg-white p-4 rounded shadow h-96 md:h-[600px] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4 text-gov-navy">
                        {showOnlyFavorites ? '관심 공고 목록' : '공고 목록'} ({notices.length})
                    </h2>

                    {isLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex space-x-4 p-4 border-b">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <span className="text-4xl mb-2">🔍</span>
                            <p>{showOnlyFavorites ? '관심 등록한 공고가 없습니다.' : '검색 결과가 없습니다.'}</p>
                            <p className="text-sm">다른 지역이나 조건으로 검색해보세요.</p>
                            <button
                                onClick={handleReset}
                                className="mt-4 text-gov-blue underline text-sm"
                            >
                                전체 목록 보기
                            </button>
                        </div>
                    ) : (
                        <ul>
                            {notices.map((notice, idx) => {
                                // D-Day Calc
                                const end = new Date(notice.end || Date.now());
                                const now = new Date();
                                const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

                                // Status Badge Logic
                                const startDate = new Date(notice.start_date);
                                const endDate = new Date(notice.end_date);

                                let badgeText = "모집 중";
                                let badgeColor = "bg-green-100 text-green-800";

                                if (now < startDate) {
                                    badgeText = "모집 예정";
                                    badgeColor = "bg-yellow-100 text-yellow-800";
                                } else if (now > endDate) {
                                    badgeText = "신청 마감";
                                    badgeColor = "bg-gray-100 text-gray-800";
                                }

                                const isFav = favorites.includes(notice.id);

                                return (
                                    <li key={idx} className="border-b py-3 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors relative group"
                                        onClick={() => setSelectedNotice(notice)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-8">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeColor}`}>{badgeText}</span>
                                                </div>
                                                <h3 className="font-semibold text-gray-800 leading-tight">{notice.title}</h3>
                                            </div>
                                            <button
                                                className={`absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-colors z-10 ${isFav ? 'text-red-500' : 'text-gray-300'}`}
                                                onClick={(e) => handleToggleFavorite(e, notice.id)}
                                                title={isFav ? "관심 해제" : "관심 등록"}
                                            >
                                                {isFav ? '❤️' : '🤍'}
                                            </button>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600 flex justify-between items-center">
                                            <span>{REGION_KO[notice.region] || notice.region}</span>
                                            <div className="flex space-x-2">
                                                <span className={`text-xs px-2 py-1 rounded text-white ${notice.score >= 4 ? 'bg-green-500' : 'bg-yellow-500'} `}>
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
                    )}
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

            {showSubscription && (
                <SubscriptionModal onClose={() => setShowSubscription(false)} />
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
