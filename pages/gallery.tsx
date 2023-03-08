import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useLoggedInContext } from '@/components/contexts/LoggedInContext';
import { useRouter } from 'next/router';

interface Props {
    files: string[];
}

const Gallery = (props: Props) => {
    const { logOut, loggedIn } = useLoggedInContext();
    const router = useRouter();

    useEffect(() => {
        if (!loggedIn) {
            router.push('/');
        }
    }, [loggedIn, router]);
    const logoutClick = () => logOut();
    return (
        <main>
            <div className="w-full flex justify-between p-4">
                <Link href={'/upload'} className="border p-2 rounded-md">
                    Upload
                </Link>
                <button className="border p-2 rounded-md" onClick={logoutClick}>
                    Logout
                </button>
            </div>{' '}
            <div className="grid grid-cols-1 md:grid-cols-3">
                {props.files.map((file) => {
                    return (
                        <div key={file} className="m-4">
                            <img src={file} alt="picture" />
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default Gallery;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const baseUrl = process.env.BUCKET_URL;

    const currentUrl = process.env.URL;

    const response = await fetch(currentUrl + '/api/get_all_files');

    const fileNames: { files: string[] } = await response.json();

    const files = fileNames.files ? fileNames.files.map((file) => baseUrl + file) : [];

    return {
        props: {
            files,
        },
    };
};
