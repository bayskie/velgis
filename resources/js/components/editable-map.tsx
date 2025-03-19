import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import L, { DrawEvents, Icon } from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { useCallback, useState } from 'react';
import { FeatureGroup, MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import SearchLocation from './search-location';

type EditableMapProps = {
    currentPosition: [number, number];
    baseMap: { url: string; attribution: string };
    searchQuery: string;
};

type GeoJSONShape = {
    id: number;
    geoJSON: Feature<Geometry, GeoJsonProperties>;
};

export default function EditableMap({ currentPosition, baseMap, searchQuery }: EditableMapProps) {
    const [drawnShapes, setDrawnShapes] = useState<GeoJSONShape[]>([]);

    const markerIcon = new Icon({
        iconUrl: '/icons/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -41],
    });

    const getGeoJSON = (layer: L.Layer): GeoJSONShape | null => {
        const leafletId = (layer as any)._leaflet_id;
        if (!leafletId) return null;
        return {
            id: leafletId,
            geoJSON: (layer as unknown as L.Layer & { toGeoJSON: () => Feature<Geometry, GeoJsonProperties> }).toGeoJSON(),
        };
    };

    const _onCreated = useCallback((e: DrawEvents.Created) => {
        const newShape = getGeoJSON(e.layer);
        if (newShape) {
            setDrawnShapes((prev) => [...prev, newShape]);
        }
    }, []);

    const _onEdited = useCallback((e: DrawEvents.Edited) => {
        e.layers.eachLayer((layer) => {
            const updatedShape = getGeoJSON(layer);
            if (updatedShape) {
                setDrawnShapes((prev) => prev.map((shape) => (shape.id === updatedShape.id ? updatedShape : shape)));
            }
        });
    }, []);

    const _onDeleted = useCallback((e: DrawEvents.Deleted) => {
        const deletedIds = new Set<number>();
        e.layers.eachLayer((layer) => {
            const leafletId = (layer as any)._leaflet_id;
            deletedIds.add(leafletId);
        });

        setDrawnShapes((prev) => prev.filter((shape) => !deletedIds.has(shape.id)));
    }, []);

    console.log(drawnShapes);

    return (
        <MapContainer center={currentPosition} zoom={13} zoomControl={false} scrollWheelZoom={false} style={{ height: '100%' }}>
            <SearchLocation searchQuery={searchQuery} />
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={_onCreated}
                    onEdited={_onEdited}
                    onDeleted={_onDeleted}
                    draw={{
                        polyline: true,
                        polygon: true,
                        rectangle: true,
                        circle: true,
                        marker: {
                            icon: markerIcon,
                        },
                        circlemarker: true,
                    }}
                />
            </FeatureGroup>
            <TileLayer url={baseMap.url} attribution={baseMap.attribution} />
            <Marker position={currentPosition} icon={markerIcon}>
                <Popup>You are here!</Popup>
            </Marker>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
