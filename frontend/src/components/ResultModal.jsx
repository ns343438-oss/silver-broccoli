
import React from 'react';

const ResultModal = ({ results, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">자격 분석 결과</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                        <p className="font-bold text-green-700">분석 완료!</p>
                        <p className="text-sm text-green-600">형님, 조건에 맞는 알짜 공고 <span className="font-bold text-lg">{results.count}</span>건을 찾아냈습니다.</p>
                        {results.logs.map((log, idx) => (
                            <p key={idx} className="text-xs text-orange-600 mt-1">※ {log}</p>
                        ))}
                    </div>

                    <h3 className="font-bold text-lg mb-3">추천 공고 TOP 5</h3>
                    <ul className="space-y-3">
                        {results.results.slice(0, 5).map((notice, idx) => (
                            <li key={idx} className="border rounded p-3 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{notice.title}</h4>
                                        <p className="text-sm text-gray-600">{notice.region} | {notice.target_group}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">
                                            적합도 {notice.matchScore}점
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {notice.matchReasons.map((reason, rIdx) => (
                                        <span key={rIdx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border">
                                            {reason}
                                        </span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {results.count === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            아쉽게도 현재 조건에 딱 맞는 공고가 없습니다.<br />
                            하지만 계속 주시하다 보면 기회가 올 겁니다, 형님!
                        </div>
                    )}

                    <div className="mt-8 pt-4 border-t text-center">
                        <p className="text-sm text-gray-500 mb-2">
                            이메일 발송 시뮬레이션: <span className="text-blue-600 font-bold">성공 (E-Mail Sent)</span>
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-800 text-white py-3 rounded hover:bg-black transition font-bold"
                        >
                            확인했습니다
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
