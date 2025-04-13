import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <h1 className="mb-8 text-3xl font-bold">Welcome to Laravel!</h1>
            {auth.user ? <p>You're logged in!</p> : <p>You're not logged in.</p>}
        </>
    );
}
