import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLoggedInContext } from '@/components/contexts/LoggedInContext';
import { useRouter } from 'next/router';

const Upload = () => {
    const { logOut, loggedIn } = useLoggedInContext();
    const router = useRouter();

    const [files, setFiles] = useState<FileList | null>(null);

    useEffect(() => {
        if (!loggedIn) {
            router.push('/');
        }
    }, [loggedIn, router]);

    const onClick = () => logOut();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const filez = event.target.files;
        setFiles(filez);
    };

    const uploadClick = async () => {
        if (!files) return;

        const noOfFiles = files.length;

        for (let i = 0; i < noOfFiles; i++) {
            const filename = encodeURIComponent(files[i].name);
            const filetype = encodeURIComponent(files[i].type);

            const res = await fetch(`/api/upload-url?file=${filename}&fileType=${filetype}`);
            const url = await res.json();

            const upload = await fetch(url, {
                method: 'PUT',
                body: files[i],
                mode: 'cors',
            });

            if (!upload.ok) console.log('something went wrong');
        }
    };

    return (
        <main className="w-full h-full">
            <div className="w-full flex justify-end p-4">
                <button className="border p-2 rounded-md" onClick={onClick}>
                    Logout
                </button>
            </div>
            <div className="w-full flex flex-col items-center">
                <h1 className="mb-8">Upload Wedding Pictures</h1>
                <input
                    className="mb-8 border file:border file:p-2 file:rounded-md file:bg-white w-80"
                    type="file"
                    multiple={true}
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                />
                <button onClick={uploadClick} className="border p-2 rounded-md w-80">
                    Upload
                </button>
            </div>
        </main>
    );
};

export default Upload;
