import { useState, useEffect } from 'react';
import type { RadioStation } from '../types';

export function useFavorites() {
    const [favorites, setFavorites] = useState<RadioStation[]>(() => {
        try {
            const saved = localStorage.getItem('favorites');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            // Storage can be unavailable (private mode) or hold corrupted data; start empty instead of crashing.
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } catch {
            // Ignore: favorites still work for this session.
        }
    }, [favorites]);

    const addFavorite = (station: RadioStation) => {
        setFavorites((prev) => {
            if (prev.some((s) => s.stationuuid === station.stationuuid)) return prev;
            return [...prev, station];
        });
    };

    const removeFavorite = (stationUuid: string) => {
        setFavorites((prev) => prev.filter((s) => s.stationuuid !== stationUuid));
    };

    const isFavorite = (stationUuid: string) => {
        return favorites.some((s) => s.stationuuid === stationUuid);
    };

    const toggleFavorite = (station: RadioStation) => {
        if (isFavorite(station.stationuuid)) {
            removeFavorite(station.stationuuid);
        } else {
            addFavorite(station);
        }
    };

    return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
