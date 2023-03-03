import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLoggedInContext } from '@/components/contexts/LoggedInContext';

function Home() {
    const [password, setPassword] = useState<string>('');

    const { logIn, loggedIn } = useLoggedInContext();

    const router = useRouter();

    useEffect(() => {
        if (loggedIn) {
            router.push('/upload');
        }
    }, [loggedIn, router]);

    const onClick = () => {
        logIn(password);
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    return (
        <main className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col m-8">
                <h1 className="text-center font-semibold text-xl">Paddy and Jade&apos;s Wedding Pictures</h1>
                <img className="max-w-full" src="/holyisle.webp" alt="Holy Isle" />
                <input className="border mb-4 p-2" placeholder="password" type="password" onChange={onChange} />
                <button className="border p-2 rounded-md" onClick={onClick}>
                    Login
                </button>
            </div>
        </main>
    );
}

export default Home;
