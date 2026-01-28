
/**
 * Generates a deterministic score (1.0 - 5.0) based on notice data.
 * Replaces random generation to ensure stability on refresh.
 * 
 * @param {Object} notice - The housing notice object
 * @returns {number} Score fixed to 1 decimal place
 */
export const calculateScore = (notice) => {
    if (notice.score && notice.score > 0) return notice.score;

    // Deterministic Hash
    const str = (notice.title || '') + (notice.id || '') + (notice.region || '');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    // Normalize hash to 0-40 range
    const normalized = Math.abs(hash) % 41;

    // Map to 1.0 - 5.0
    // normalized / 10 = 0.0 ~ 4.0
    // + 1.0 = 1.0 ~ 5.0
    const score = (normalized / 10) + 1;

    return parseFloat(score.toFixed(1));
};

/**
 * Generates a price analysis status based on rent/deposit logic.
 * 
 * @param {Object} notice 
 * @returns {Object} { status: 'Cheap'|'Reasonable'|'Expensive', diff: number }
 */
export const analyzePrice = (notice) => {
    // Mock Logic: In real app, compare vs average regional market price
    // Here, use deterministic hash to simulate "Compare" logic if no real data

    // If real diff exists
    if (notice.price_diff_percent) {
        return {
            status: notice.price_diff_percent > 20 ? 'Cheap' : 'Reasonable',
            diff: notice.price_diff_percent
        };
    }

    // Deterministic fallback
    const score = calculateScore(notice);
    const diff = Math.floor((score - 1) * 10); // 0% to 40% cheaper based on score

    return {
        status: diff > 20 ? 'Cheap' : (diff > 10 ? 'Reasonable' : 'Average'),
        diff: diff
    };
};
