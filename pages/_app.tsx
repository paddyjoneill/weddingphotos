import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { LoggedInContextProvider } from '@/components/contexts/LoggedInContext';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
    const description = 'Share your pictures with us';
    const title = "Paddy and Jade's Wedding Photos";

    return (
        <LoggedInContextProvider>
            <Head>
                <meta name="Description" content={description} />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>{title}</title>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content="https://weddingphotos.vercel.app/holyisle.webp" />
            </Head>
            <Component {...pageProps} />
        </LoggedInContextProvider>
    );
}
