
import React, { useState } from 'react';

const EligibilityForm = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        income: '',
        assets: '',
        homelessDuration: '0',
        hasNewborn: false,
        email: '',
        agreed: false
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error on input
        if (error) setError(null);
    };

    const validate = () => {
        // E01: Numeric Check
        if (isNaN(formData.income) || isNaN(formData.assets)) {
            setError("E01: 형님, 소득/재산 정보는 숫자만 입력 가능합니다. 다시 확인해주십시오!");
            return false;
        }

        // E02: Required Check
        if (!formData.income || !formData.assets || !formData.email) {
            setError("E02: 필수 정보(소득, 자산, 이메일)가 빠져있습니다. 모든 항목을 채워주십시오.");
            return false;
        }

        // Email format check simulation (Simple)
        if (!formData.email.includes('@')) {
            setError("E04: 이메일 발송에 실패했습니다. 메일 주소 형식을 확인해주십시오.");
            return false;
        }

        // Privacy Agreement Check
        if (!formData.agreed) {
            setError("개인정보 수집 및 이용에 동의해야 맞춤형 공고를 추천받을 수 있습니다.");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...formData,
                income: Number(formData.income),
                assets: Number(formData.assets),
                homelessDuration: Number(formData.homelessDuration)
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">자격 진단 및 매칭</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 text-sm font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">가구당 월평균 소득 (원)</label>
                        <input
                            type="number"
                            name="income"
                            value={formData.income}
                            onChange={handleChange}
                            placeholder="예: 3500000"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">총자산 가액 (부동산+차량+금융, 원)</label>
                        <input
                            type="number"
                            name="assets"
                            value={formData.assets}
                            onChange={handleChange}
                            placeholder="예: 250000000"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">무주택 기간 (년)</label>
                        <select
                            name="homelessDuration"
                            value={formData.homelessDuration}
                            onChange={handleChange}
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="0">1년 미만</option>
                            <option value="1">1년 이상 ~ 3년 미만</option>
                            <option value="3">3년 이상 ~ 5년 미만</option>
                            <option value="5">5년 이상</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                        <input
                            type="checkbox"
                            id="hasNewborn"
                            name="hasNewborn"
                            checked={formData.hasNewborn}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                        <label htmlFor="hasNewborn" className="text-sm font-bold text-gray-800 cursor-pointer">
                            신생아 유무 (2년 이내 출산/예정)
                            <span className="block text-xs text-blue-600 font-normal">※ 체크 시 우선 공급 대상으로 분류됩니다!</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">연락처 (이메일)</label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="hong@example.com"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="bg-gray-100 p-3 rounded text-xs text-gray-600 h-24 overflow-y-auto mb-2 border">
                        <p className="font-bold mb-1">[개인정보 수집 및 이용 동의]</p>
                        <p>1. 수집 목적: 맞춤형 임대주택 공고 추천 및 알림 발송</p>
                        <p>2. 수집 항목: 소득, 자산, 무주택 기간, 신생아 유무, 이메일</p>
                        <p>3. 보유 기간: 회원 탈퇴 시 또는 서비스 종료 시까지</p>
                        <p className="mt-1">※ 귀하는 동의를 거부할 권리가 있으나, 거부 시 서비스 이용이 제한될 수 있습니다.</p>
                    </div>

                    <div className="flex items-center space-x-2 pb-2">
                        <input
                            type="checkbox"
                            id="agreed"
                            name="agreed"
                            checked={formData.agreed}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="agreed" className="text-sm text-gray-700 cursor-pointer">
                            [필수] 위 내용을 확인하였으며 개인정보 수집에 동의합니다.
                        </label>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition shadow-lg transform active:scale-95"
                        >
                            매칭 시작하기 🚀
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EligibilityForm;
