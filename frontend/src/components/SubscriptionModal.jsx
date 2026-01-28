import React, { useState } from 'react';

const SubscriptionModal = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [targetGroup, setTargetGroup] = useState('All');
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const REGIONS = [
        '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
        '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구',
        '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !agreed) {
            alert('이메일 입력 및 개인정보 동의는 필수입니다.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API Call
        setTimeout(() => {
            const subscriptionData = {
                email,
                regions: selectedRegions.length === 0 ? ['All'] : selectedRegions,
                targetGroup,
                date: new Date().toISOString()
            };

            console.log('Subscription Request:', subscriptionData);

            // LocalStorage MVP
            const existing = JSON.parse(localStorage.getItem('sb_subscriptions') || '[]');
            localStorage.setItem('sb_subscriptions', JSON.stringify([...existing, subscriptionData]));

            alert('구독이 완료되었습니다! 📩\n새로운 공고가 등록되면 메일로 알려드립니다.');
            setIsSubmitting(false);
            onClose();
        }, 800);
    };

    const toggleRegion = (region) => {
        if (selectedRegions.includes(region)) {
            setSelectedRegions(selectedRegions.filter(r => r !== region));
        } else {
            if (selectedRegions.length >= 3) {
                alert('지역은 최대 3개까지 선택 가능합니다.');
                return;
            }
            setSelectedRegions([...selectedRegions, region]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gov-navy text-white p-5 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span>🔔</span> 공고 알림 신청
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl">&times;</button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Introduction */}
                    <div className="bg-blue-50 p-4 rounded text-sm text-blue-800 leading-relaxed">
                        원하는 지역과 조건의 새로운 임대주택 공고가 올라오면<br />
                        가장 먼저 이메일로 알려드립니다. (스팸 안 보냄 🙅‍♂️)
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">이메일 주소 <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            required
                            placeholder="example@email.com"
                            className="w-full border p-3 rounded focus:outline-none focus:border-gov-blue focus:ring-1 focus:ring-gov-blue"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Region Select */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            관심 지역 (최대 3개, 미선택 시 전체)
                        </label>
                        <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto border p-2 rounded bg-gray-50">
                            {REGIONS.map(region => (
                                <button
                                    type="button"
                                    key={region}
                                    onClick={() => toggleRegion(region)}
                                    className={`text-xs py-1.5 rounded transition-colors ${selectedRegions.includes(region)
                                            ? 'bg-gov-blue text-white font-bold'
                                            : 'bg-white border text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            선택된 지역: {selectedRegions.length > 0 ? selectedRegions.join(', ') : "전체 지역"}
                        </p>
                    </div>

                    {/* Target Group */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">대상 유형</label>
                        <select
                            className="w-full border p-3 rounded bg-white"
                            value={targetGroup}
                            onChange={(e) => setTargetGroup(e.target.value)}
                        >
                            <option value="All">전체 (상관없음)</option>
                            <option value="Youth">청년 (19~39세)</option>
                            <option value="Newlywed">신혼부부/예비신혼</option>
                            <option value="Elderly">고령자 (65세 이상)</option>
                        </select>
                    </div>

                    {/* Privacy Policy */}
                    <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded">
                        <input
                            type="checkbox"
                            id="privacy-agree"
                            className="mt-1"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="privacy-agree" className="text-xs text-gray-600 leading-snug cursor-pointer">
                            [필수] 개인정보 수집 및 이용에 동의합니다.<br />
                            <span className="text-gray-400 font-light">수집된 이메일은 알림 발송용으로만 사용되며, 구독 취소 시 즉시 파기됩니다.</span>
                        </label>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded text-white font-bold text-lg shadow transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gov-navy hover:bg-opacity-90'
                                }`}
                        >
                            {isSubmitting ? '처리 중...' : '알림 신청하기 ✨'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubscriptionModal;
