import { BASE_MAPS } from '@/components/dropdown-base-map';
import EditableMap from '@/components/editable-map';
import MapControls from '@/components/map-controls';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Map() {
    const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [baseMap, setBaseMap] = useState(BASE_MAPS[0]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => setCurrentPosition([coords.latitude, coords.longitude]),
            (err) => console.error('Geolocation error:', err),
        );
    }, []);

    return (
        <>
            <Head>
                <title>Map</title>
            </Head>

            {currentPosition ? (
                <div className="relative h-screen w-full">
                    <MapControls currentPosition={currentPosition} setSearchQuery={setSearchQuery} setBaseMap={setBaseMap} />
                    <EditableMap currentPosition={currentPosition} baseMap={baseMap} searchQuery={searchQuery} />
                </div>
            ) : (
                <p>Loading map...</p>
            )}
        </>
    );
}
