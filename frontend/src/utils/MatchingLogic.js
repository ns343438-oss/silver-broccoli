
/**
 * Eligibility Matching Logic
 * 
 * Rules:
 * 1. Newborn Priority: If hasNewborn is true, notices with 'newborn', 'newlywed' tags get boost.
 * 2. Income Check: User income must be below threshold (default 70% avg ~ 400만원).
 * 3. Asset Check: User assets must be below threshold (default 3.61억).
 */

export const checkEligibility = (userProfile, notices) => {
    const { income, assets, homelessDuration, hasNewborn } = userProfile;

    // Thresholds (Simplified for MVP)
    const MAX_INCOME = 4500000; // 4.5 Million KRW
    const MAX_ASSETS = 361000000; // 361 Million KRW

    let matchedNotices = [];
    let log = [];

    // Basic Validation Check
    if (income > MAX_INCOME) {
        log.push(`소득(${income / 10000}만)이 기준(${MAX_INCOME / 10000}만)을 초과하여 일부 공고만 지원 가능합니다.`);
    }
    if (assets > MAX_ASSETS) {
        log.push(`자산(${assets / 100000000}억)이 기준(${MAX_ASSETS / 100000000}억)을 초과합니다.`);
    }

    matchedNotices = notices.map(notice => {
        let score = 0;
        let reasons = [];

        // 1. Newborn/Newlywed Prio
        if (hasNewborn) {
            if (notice.target_group && (notice.target_group.includes('Newlywed') || notice.target_group.includes('Newborn') || notice.title.includes('신혼') || notice.title.includes('신생아'))) {
                score += 50;
                reasons.push("🍼 신생아/신혼 특공 우대");
            }
        }

        // 2. Youth Prio
        if (notice.target_group === 'Youth') {
            // General score if not specifically conflicting
            score += 10;
        }

        // 3. Location Match (Simplified - mock)
        // In real app, match user prefer region

        // 4. Basic Income/Asset Filter (Soft filter for score)
        if (income <= MAX_INCOME && assets <= MAX_ASSETS) {
            score += 20;
            reasons.push("💰 소득/자산 기준 충족");
        } else {
            // Penalty but not exclusion for now (to show options)
            score -= 10;
            reasons.push("⚠️ 소득/자산 기준 초과 가능성");
        }

        // 5. Homeless Duration Score
        if (homelessDuration >= 3) {
            score += 10;
            reasons.push("🏠 무주택 기간 가점");
        }

        // Base presence score
        score += 10;

        return {
            ...notice,
            matchScore: score,
            matchReasons: reasons
        };
    });

    // Filter out very low scores and sort
    const results = matchedNotices
        .filter(n => n.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

    return {
        count: results.length,
        results: results,
        logs: log
    };
};
