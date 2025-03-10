import L from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

type SearchLocationProps = {
    searchQuery: string;
};

export default function SearchLocation({ searchQuery }: SearchLocationProps) {
    const map = useMap();

    useEffect(() => {
        if (!searchQuery) return;

        const fetchLocation = async () => {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
            const data = await response.json();
            if (data.length) {
                const { lat, lon, display_name } = data[0];
                const position: [number, number] = [parseFloat(lat), parseFloat(lon)];
                map.setView(position, 13);
                L.marker(position).addTo(map).bindPopup(display_name).openPopup();
            }
        };

        const timeoutId = setTimeout(fetchLocation, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, map]);

    return null;
}
