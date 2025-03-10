import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Head } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { FeatureGroup, MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

type OpenStreetMapResponse = {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}[];

function SearchLocation({ searchQuery }: { searchQuery: string }) {
    const map = useMap();

    useEffect(() => {
        if (!searchQuery) return;

        const fetchLocation = async () => {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
            const data: OpenStreetMapResponse = await response.json();
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

function DropdownBaseMapType({ onTileChange }: { onTileChange: (tile: { name: string; url: string; attribution: string }) => void }) {
    const baseMaps = [
        { name: 'OpenStreetMap', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap contributors' },
        { name: 'Carto Light', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attribution: '© CartoDB' },
        { name: 'Carto Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '© CartoDB' },
        {
            name: 'Esri World Street Map',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            attribution: '© Esri',
        },
        { name: 'Google Satellite', url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', attribution: '© Google Maps' },
    ];

    const [baseMap, setBaseMap] = useState(baseMaps[0]);

    useEffect(() => {
        onTileChange(baseMap);
    }, [baseMap, onTileChange]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <Button variant="outline" className="w-full">
                        <span>Select Base Map</span>
                        <Separator orientation={'vertical'} />
                        <div className="max-w-10 truncate">
                            <span className="font-normal">{baseMap.name}</span>
                        </div>
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-1001 w-56">
                <DropdownMenuRadioGroup value={baseMap.name} onValueChange={(value) => setBaseMap(baseMaps.find((t) => t.name === value)!)}>
                    {baseMaps.map((layer) => (
                        <DropdownMenuRadioItem key={layer.name} value={layer.name}>
                            {layer.name}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function Map() {
    const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [baseMap, setBaseMap] = useState({
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
    });

    const _onCreate = (e: any) => {
        console.log({ onCreate: e });
    };

    const _onEditPath = (e: any) => {
        console.log({ onEditPath: e });
    };

    const _onDeleted = (e: any) => {
        console.log({ onDeleted: e });
    };

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
                    <Card className="absolute top-0 left-0 z-1000 m-4">
                        <CardHeader>
                            <CardTitle>VELGIS</CardTitle>
                            <CardDescription>
                                <p className="text-sm italic">* control your map</p>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <p className="mb-4 text-sm">You are at {currentPosition.join(', ')}</p>
                            <Input type="text" placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
                            <DropdownBaseMapType onTileChange={setBaseMap} />
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs">© 2025 Velgis</p>
                        </CardFooter>
                    </Card>

                    <MapContainer center={currentPosition} zoom={13} zoomControl={false} scrollWheelZoom={false} style={{ height: '100%' }}>
                        <FeatureGroup>
                            <EditControl
                                position="topright"
                                onEdited={_onEditPath}
                                onCreated={_onCreate}
                                onDeleted={_onDeleted}
                                draw={{
                                    rectangle: false,
                                }}
                            />
                            <ZoomControl position="bottomright" />
                        </FeatureGroup>
                        <TileLayer url={baseMap.url} attribution={baseMap.attribution} />

                        <Marker position={currentPosition}>
                            <Popup>You are here!</Popup>
                        </Marker>

                        <SearchLocation searchQuery={searchQuery} />
                    </MapContainer>
                </div>
            ) : (
                <p>Loading map...</p>
            )}
        </>
    );
}
