import { describe, it, expect } from 'vitest';
import { calculateScore, analyzePrice } from '../utils/ScoringLogic';

describe('ScoringLogic', () => {
    describe('calculateScore', () => {
        it('should return a deterministic score for the same input', () => {
            const notice = { title: "Test A", id: 1, region: "Seoul" };
            const score1 = calculateScore(notice);
            const score2 = calculateScore(notice);
            expect(score1).toBe(score2);
        });

        it('should return a valid range (1.0 - 5.0)', () => {
            const notice = { title: "Test B", id: 2, region: "Gangnam" };
            const score = calculateScore(notice);
            expect(score).toBeGreaterThanOrEqual(1.0);
            expect(score).toBeLessThanOrEqual(5.0);
        });

        it('should reuse existing score if present', () => {
            const notice = { score: 4.5 };
            expect(calculateScore(notice)).toBe(4.5);
        })
    });

    describe('analyzePrice', () => {
        it('should return Cheap if price_diff > 20%', () => {
            const notice = { price_diff_percent: 25 };
            const result = analyzePrice(notice);
            expect(result.status).toBe('Cheap');
        });

        it('should return Reasonable if price_diff <= 20%', () => {
            const notice = { price_diff_percent: 15 };
            const result = analyzePrice(notice);
            expect(result.status).toBe('Reasonable');
        });

        it('should fallback to deterministic logic if no price_diff', () => {
            const notice = { title: "Test Fallback", id: 99 };
            const result = analyzePrice(notice);
            expect(result).toHaveProperty('status');
            expect(result).toHaveProperty('diff');
        });
    });
});
