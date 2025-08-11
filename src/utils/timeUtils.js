// Time formatting utilities

export const formatTime = (seconds) => {
    const isNegative = seconds < 0;
    const absoluteSeconds = Math.abs(seconds);
    const minutes = Math.floor(absoluteSeconds / 60);
    const remainingSeconds = absoluteSeconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    return isNegative ? `-${timeString}` : timeString;
};

export const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};