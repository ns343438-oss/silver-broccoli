const STORAGE_KEY = 'sb_favorites';

export const getFavorites = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse favorites", e);
        return [];
    }
};

export const addFavorite = (noticeId) => {
    const current = getFavorites();
    if (!current.includes(noticeId)) {
        const updated = [...current, noticeId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    }
    return current;
};

export const removeFavorite = (noticeId) => {
    const current = getFavorites();
    const updated = current.filter(id => id !== noticeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};

export const isFavorite = (noticeId) => {
    const current = getFavorites();
    return current.includes(noticeId);
};

export const toggleFavorite = (noticeId) => {
    if (isFavorite(noticeId)) {
        return removeFavorite(noticeId);
    } else {
        return addFavorite(noticeId);
    }
};
