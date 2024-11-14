// src/utils/time.utils.ts
export const formatTime = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const calculateTimeComponents = (seconds: number): { hours: number; minutes: number; secs: number } => {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return { hours, minutes, secs };
};