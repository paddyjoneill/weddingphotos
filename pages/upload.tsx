import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLoggedInContext } from '@/components/contexts/LoggedInContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Upload = () => {
    const { logOut, loggedIn } = useLoggedInContext();
    const router = useRouter();

    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadingMessage, setUploadingMessage] = useState<string>('');

    useEffect(() => {
        if (!loggedIn) {
            router.push('/');
        }
    }, [loggedIn, router]);

    const logoutClick = () => logOut();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setFiles(event.target.files);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadClick = async () => {
        if (!files) return;

        setUploading(true);

        const noOfFiles = files.length;

        let skipped = 0;

        for (let i = 0; i < noOfFiles; i++) {
            setUploadingMessage(`Uploading file ${i + 1} of ${noOfFiles}`);

            const filename = encodeURIComponent(files[i].name);
            const filetype = encodeURIComponent(files[i].type);

            const res = await fetch(`/api/upload-url?file=${filename}&fileType=${filetype}`);
            if (res.ok) {
                const url = await res.json();

                const upload = await fetch(url, {
                    method: 'PUT',
                    body: files[i],
                    mode: 'cors',
                });

                if (!upload.ok) console.log('something went wrong');
            }
            if (res.status === 409) {
                skipped += 1;
            }
        }

        setUploadingMessage(skipped === 0 ? `All files uploaded` : `All files uploaded - ${skipped} files skipped`);
        setUploading(false);
        setFiles(null);
        if (fileInputRef.current !== null) fileInputRef.current.value = '';
    };

    return (
        <main className="w-full h-full">
            <div className="w-full flex justify-between p-4">
                <Link href={'/gallery'} className="border p-2 rounded-md">
                    Gallery
                </Link>
                <button className="border p-2 rounded-md" onClick={logoutClick}>
                    Logout
                </button>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 className="mb-8">Upload Wedding Pictures</h1>
                <input
                    className="mb-8 border file:border file:p-2 file:rounded-md file:border-gray-200 file:bg-white w-80 rounded-md file:mr-4"
                    type="file"
                    multiple={true}
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                    ref={fileInputRef}
                />
                <button onClick={uploadClick} className="border p-2 rounded-md w-80" disabled={uploading}>
                    Upload
                </button>
                <p className="mt-8">{uploadingMessage}</p>
            </div>
        </main>
    );
};

export default Upload;
