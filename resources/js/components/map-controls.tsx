import DropdownBaseMap, { BASE_MAPS } from './dropdown-base-map';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

export default function MapControls({
    currentPosition,
    setSearchQuery,
    setBaseMap,
}: {
    currentPosition: [number, number];
    setSearchQuery: (query: string) => void;
    setBaseMap: (tile: (typeof BASE_MAPS)[0]) => void;
}) {
    return (
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
                <DropdownBaseMap onBaseMapChange={setBaseMap} />
            </CardContent>
            <CardFooter>
                <p className="text-xs">© 2025 Velgis</p>
            </CardFooter>
        </Card>
    );
}
