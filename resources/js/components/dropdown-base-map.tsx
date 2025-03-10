import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';

export const BASE_MAPS: { name: string; url: string; attribution: string }[] = [
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

export default function DropdownBaseMap({ onBaseMapChange }: { onBaseMapChange: (tile: (typeof BASE_MAPS)[0]) => void }) {
    const [baseMap, setBaseMap] = useState(BASE_MAPS[0]);
    ``;
    useEffect(() => {
        onBaseMapChange(baseMap);
    }, [baseMap, onBaseMapChange]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div>
                    <Button variant="outline" className="w-full">
                        <span>Select Base Map</span>
                        <Separator orientation="vertical" />
                        <div className="max-w-10 truncate">
                            <span className="font-normal">{baseMap.name}</span>
                        </div>
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-1001 w-56">
                <DropdownMenuRadioGroup value={baseMap.name} onValueChange={(value) => setBaseMap(BASE_MAPS.find((t) => t.name === value)!)}>
                    {BASE_MAPS.map((layer) => (
                        <DropdownMenuRadioItem key={layer.name} value={layer.name}>
                            {layer.name}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
