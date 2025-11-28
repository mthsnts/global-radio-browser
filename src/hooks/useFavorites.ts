import { useState, useEffect } from 'react';
import type { RadioStation } from '../types';

export function useFavorites() {
    const [favorites, setFavorites] = useState<RadioStation[]>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
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
