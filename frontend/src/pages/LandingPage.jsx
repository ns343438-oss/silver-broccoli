import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Map as MapIcon, ChevronRight, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800">
            {/* Section 1: Hero */}
            <section className="bg-gov-navy text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 break-keep leading-tight">
                        복잡한 공공임대,<br />
                        형님의 조건에 딱 맞는 집만<br />
                        골라드립니다.
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto break-keep">
                        SH·LH 공고 확인부터 나만의 당첨 확률 분석까지,<br className="hidden sm:block" />
                        e-나라집 하나로 끝내세요.
                    </p>
                    <button 
                        onClick={() => navigate('/seoul')}
                        className="bg-white text-gov-navy font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                    >
                        지금 내 자격 분석하기
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </section>

            {/* Section 2: Key Features */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gov-navy mb-4">왜 e-나라집인가요?</h2>
                        <p className="text-gray-600">공공임대 주택 정보, 더 이상 헤매지 마세요.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <Bell className="w-6 h-6 text-gov-navy" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gov-navy">실시간 통합 알림</h3>
                            <p className="text-gray-600 leading-relaxed break-keep">
                                SH와 LH의 최신 공고를 놓치지 않고 실시간으로 업데이트하여 전달합니다.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <CheckCircle className="w-6 h-6 text-gov-navy" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gov-navy">맞춤형 자격 분석</h3>
                            <p className="text-gray-600 leading-relaxed break-keep">
                                재산, 소득은 물론 '신생아 특공 가점'까지 반영한 정밀한 매칭 엔진을 경험하세요.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <MapIcon className="w-6 h-6 text-gov-navy" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gov-navy">지도 기반 탐색</h3>
                            <p className="text-gray-600 leading-relaxed break-keep">
                                복잡한 리스트 대신, 실제 주소 기반의 지도로 우리 동네 공고를 한눈에 확인하세요.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Trust & Action */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8 flex justify-center">
                        <ShieldCheck className="w-16 h-16 text-gov-blue opacity-80" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gov-navy mb-6 break-keep">
                        결정론적 스코어링 로직으로<br />
                        언제나 일관된 분석 결과를 약속합니다.
                    </h2>
                    <p className="text-gray-600 mb-10 max-w-xl mx-auto">
                        투명하고 정확한 알고리즘이 형님의 소중한 기회를 찾아드립니다.
                    </p>
                    
                    <button 
                        onClick={() => navigate('/seoul')} // Alternatively triggers subscription modal if context allows, keeping simpe for now
                        className="bg-yellow-400 text-gov-navy font-bold py-4 px-10 rounded-lg text-lg shadow hover:bg-yellow-500 transition-colors"
                    >
                        스마트 구독 신청하기
                    </button>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
