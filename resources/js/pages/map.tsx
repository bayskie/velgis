import MapComponent from '@/components/map';
import ShapesDialog from '@/components/shapes-dialog';
import { Input } from '@/components/ui/input';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

type MapProps = {
    shapes: any[];
};

export default function Map({ shapes: _shapes }: MapProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [shapes, setShapes] = useState<any[]>(_shapes);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

    const handleSearch = async () => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const results = await response.json();
        if (results[0]) {
            setMapCenter([parseFloat(results[0].lat), parseFloat(results[0].lon)]);
        }
    };

    return (
        <>
            <Head title="Map" />
            <div className="flex h-screen w-screen">
                <div className="w-[300px] overflow-y-auto border-r border-gray-300 p-4">
                    <h2 className="mb-2 text-xl font-semibold">Velgis</h2>
                    <p className="mb-4 text-sm text-gray-700">This is a sidebar for tools or shape data.</p>
                    <Input
                        placeholder="Search shape"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="mb-2"
                    />
                    <ShapesDialog shapes={shapes} />
                </div>
                <div className="z-1 flex-grow">
                    <MapComponent setShapes={setShapes} shapes={shapes} center={mapCenter} />
                </div>
            </div>
        </>
    );
}
