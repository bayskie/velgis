import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropsWithChildren } from 'react';

export default function AuthLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl">{title}</CardTitle>
                            <CardDescription className="text-center">{description}</CardDescription>
                        </CardHeader>
                        <CardContent>{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
