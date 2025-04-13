import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Geoman
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
    setShapes: React.Dispatch<React.SetStateAction<any[]>>;
    shapes: any[];
    center: [number, number] | null;
}

export default function Map({ setShapes, shapes, center }: MapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    function handleEdit(e: any) {
        const layer = e.layer as L.Polygon | L.Polyline | L.Marker | L.Circle | L.Rectangle;
        const id = (layer as any)._id || layer.toGeoJSON().properties?.id;
        if (id) {
            setShapes((prev) =>
                prev.map((shape) => (shape.properties.id === id ? { ...layer.toGeoJSON(), properties: { ...shape.properties, id } } : shape)),
            );
        }
    }

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                center: [51.505, -0.09],
                zoom: 13,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

            mapRef.current.zoomControl.setPosition('topright');

            mapRef.current.pm.addControls({
                position: 'topright',
                drawCircle: false,
                drawCircleMarker: false,
                drawText: false,
                editMode: true,
            });

            mapRef.current?.on('pm:create', (e) => {
                console.log(e);
                const layer = e.layer as L.Polygon | L.Polyline | L.Marker | L.Circle | L.Rectangle;
                const geoJSON = layer.toGeoJSON();
                const id = uuidv4();
                geoJSON.properties = { ...(geoJSON.properties || {}), id };
                (layer as any)._id = id;

                setShapes((prev) => [...prev, geoJSON]);
                layer.on('pm:edit', (e) => {
                    handleEdit(e);
                });
            });

            mapRef.current?.on('pm:remove', (e) => {
                const layer = e.layer as L.Polygon | L.Polyline | L.Marker | L.Circle | L.Rectangle;
                const id = (layer as any)._id || layer.toGeoJSON().properties?.id;

                if (id) setShapes((prev) => prev.filter((shape) => shape.properties?.id !== id));
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (mapRef.current && shapes.length > 0) {
            L.geoJSON(shapes, {
                onEachFeature: (feature, layer) => {
                    layer.on('pm:edit', (e) => {
                        handleEdit(e);
                    });
                },
            }).addTo(mapRef.current);
        }
    }, [shapes]);

    useEffect(() => {
        if (mapRef.current && center) {
            mapRef.current.setView(center, 13);
        }
    }, [center]);

    return <div ref={mapContainerRef} className="h-screen w-full" />;
}
