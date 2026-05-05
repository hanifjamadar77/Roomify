import React, {useEffect, useRef, useState} from 'react';
import {useOutletContext} from "react-router";
import {CheckCircle2, ImageIcon, UploadIcon} from "lucide-react";
import {
    PROGRESS_INCREMENT,
    PROGRESS_INTERVAL_MS,
    REDIRECT_DELAY_MS,
} from "../lib/constant";

type UploadProps = {
    onComplete?: (base64Data: string) => void;
};

const Upload = ({onComplete}: UploadProps) => {
    const [file, setFile] = useState<File | null> (null);
    const [isDragging , setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const authContext = useOutletContext<AuthContext | null>();
    const isSignedIn = authContext?.isSignedIn ?? false;

    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }

            if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
            }
        };
    }, []);

    const processFile = (files: FileList | null) => {
        if (!isSignedIn || !files?.length) {
            return;
        }

        const selectedFile = files[0];
        const reader = new FileReader();

        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
        }

        setFile(selectedFile);
        setProgress(0);

        reader.onload = () => {
            const base64Data = reader.result;

            if (typeof base64Data !== "string") {
                setFile(null);
                return;
            }

            progressIntervalRef.current = setInterval(() => {
                setProgress((currentProgress) => {
                    const nextProgress = Math.min(currentProgress + PROGRESS_INCREMENT, 100);

                    if (nextProgress === 100 && progressIntervalRef.current) {
                        clearInterval(progressIntervalRef.current);
                        progressIntervalRef.current = null;

                        redirectTimeoutRef.current = setTimeout(() => {
                            onComplete?.(base64Data);
                        }, REDIRECT_DELAY_MS);
                    }

                    return nextProgress;
                });
            }, PROGRESS_INTERVAL_MS);
        };

        reader.onerror = () => {
            setFile(null);
            setProgress(0);
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        processFile(event.target.files);
        event.target.value = "";
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isSignedIn) {
            return;
        }

        setIsDragging(true);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isSignedIn) {
            return;
        }

        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isSignedIn) {
            return;
        }

        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        if (!isSignedIn) {
            return;
        }

        processFile(event.dataTransfer.files);
    };

    return (
        <div className={"upload"}>
            {!file ? (
                <div
                    className={`dropzone ${isDragging ? "is-dragging" : ""}`}
                    aria-disabled={!isSignedIn}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input type="file"
                    className={"drop-input"}
                           accept=".jpg,.jpeg,.png"
                           disabled={!isSignedIn}
                           onChange={handleChange}
                    />

                    <div className={"drop-content"}>
                        <div className={"drop-icon"}>
                            <UploadIcon size = {20}/>
                        </div>
                        <p>
                            {isSignedIn ? (
                                "Click to upload or just drag and drop"
                            ) : ("Sign in or sign up with puter to upload")}
                        </p>

                        <p className={"help"}> Maximum file size 50 MB.</p>
                    </div>
                </div>
            ) : (
                <div className={"upload-status"}>
                    <div className={"status-content"}>
                        <div className={"status-icon"}>
                            {progress === 100 ? (
                                <CheckCircle2 className={"check"}/>
                            ) : (
                                <ImageIcon className={"image"}/>
                            )}
                        </div>

                        <h3>{file.name}</h3>

                        <div className={"progress"}>
                            <div className={"bar"} style={{width:`${progress}%`}} />

                            <p className={"status-text"}>
                                {progress < 100 ? "Analyzing Floor Plan..." : "Redirecting..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;
