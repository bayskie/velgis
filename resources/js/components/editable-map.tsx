import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { useCallback } from 'react';
import { FeatureGroup, MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import SearchLocation from './search-location';

type EditableMapProps = {
    currentPosition: [number, number];
    baseMap: any;
    searchQuery: string;
};

export default function EditableMap({ currentPosition, baseMap, searchQuery }: EditableMapProps) {
    const _onCreate = useCallback((e: any) => console.log({ onCreate: e }), []);
    const _onEditPath = useCallback((e: any) => console.log({ onEditPath: e }), []);
    const _onDeleted = useCallback((e: any) => console.log({ onDeleted: e }), []);

    return (
        <MapContainer center={currentPosition} zoom={13} zoomControl={false} style={{ height: '100%' }}>
            <SearchLocation searchQuery={searchQuery} />
            <FeatureGroup>
                <EditControl position="topright" onEdited={_onEditPath} onCreated={_onCreate} onDeleted={_onDeleted} draw={{ rectangle: false }} />
                <ZoomControl position="bottomright" />
            </FeatureGroup>
            <TileLayer url={baseMap.url} attribution={baseMap.attribution} />
            <Marker position={currentPosition}>
                <Popup>You are here!</Popup>
            </Marker>
        </MapContainer>
    );
}
