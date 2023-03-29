import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useLoggedInContext } from '@/components/contexts/LoggedInContext';
import { useRouter } from 'next/router';
import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';

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

    const picturesPerPage = 18;
    const noOfPages = props.files.length / picturesPerPage;

    const [currentPage, setCurrentPage] = useState<number>(1);

    const previousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const nextPage = () => {
        if (currentPage < noOfPages) setCurrentPage(currentPage + 1);
    };

    const logoutClick = () => logOut();

    const files = props.files.slice((currentPage - 1) * picturesPerPage, currentPage * picturesPerPage);

    return (
        <main>
            <div className="w-full flex justify-between p-4">
                <Link href={'/upload'} className="border p-2 rounded-md">
                    Upload
                </Link>
                <button className="border p-2 rounded-md" onClick={logoutClick}>
                    Logout
                </button>
            </div>
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 p-4">
                {files.map((file) => {
                    return (
                        <div key={file} className="mb-4">
                            <img src={file} alt="picture" />
                        </div>
                    );
                })}
            </div>
            {noOfPages > 1 ? (
                <div className="w-full flex justify-center items-center">
                    <button className="border p-2 rounded-md mx-4" onClick={previousPage}>
                        Previous Page
                    </button>
                    <p className="">Current Page: {currentPage}</p>
                    <button className="border p-2 rounded-md mx-4" onClick={nextPage}>
                        Next Page
                    </button>
                </div>
            ) : null}
        </main>
    );
};

export default Gallery;

export const getServerSideProps: GetServerSideProps = async () => {
    const baseUrl = process.env.BUCKET_URL;

    const s3 = new S3Client({});

    const bucket = process.env.RESIZED_BUCKET_NAME as string;

    const locommand = new ListObjectsCommand({ Bucket: bucket });
    const response = await s3.send(locommand);
    const files = response.Contents?.map((obj) => baseUrl! + obj.Key);

    return {
        props: {
            files: files ?? [],
        },
    };
};
