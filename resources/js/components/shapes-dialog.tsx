import { router } from '@inertiajs/react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

type ShapesDialogProps = {
    shapes: any[];
};

export default function ShapesDialog({ shapes }: ShapesDialogProps) {
    const handleSave = () => {
        console.log({ shapes });
        router.post(route('map.bulkUpsert'), { shapes });
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full" variant={'outline'}>
                        View Shapes
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Shapes Data</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="flex h-[60vh] w-full flex-col gap-1 rounded-md">
                        <div className="flex flex-col gap-2.5">
                            {shapes.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No shapes data available.</p>
                            ) : (
                                shapes.map((shape, idx) => (
                                    <div key={idx}>
                                        <pre className="rounded bg-gray-50 p-2 text-sm whitespace-pre-wrap text-gray-800">
                                            {JSON.stringify(shape, null, 2)}
                                        </pre>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
