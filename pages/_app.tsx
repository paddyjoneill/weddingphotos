import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { LoggedInContextProvider } from '@/components/contexts/LoggedInContext';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <LoggedInContextProvider>
            <Component {...pageProps} />
        </LoggedInContextProvider>
    );
}
