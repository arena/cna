import { useState, useEffect } from 'react';

// Hook for the main 30-minute practice timer
export const useTimer = (initialTime = 30 * 60) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Timer effect
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeRemaining > -900) {
            interval = setInterval(() => {
                setTimeRemaining(timeRemaining => timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining <= -900) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeRemaining]);

    const toggleTimer = () => {
        setIsTimerRunning(!isTimerRunning);
    };

    const resetTimer = () => {
        setTimeRemaining(initialTime);
        setIsTimerRunning(false);
    };

    const stopTimer = () => {
        setIsTimerRunning(false);
    };

    return {
        timeRemaining,
        isTimerRunning,
        toggleTimer,
        resetTimer,
        stopTimer,
        setIsTimerRunning
    };
};

// Hook for individual skill practice timer
export const usePracticeTimer = () => {
    const [practiceTime, setPracticeTime] = useState(0);
    const [isPracticeRunning, setIsPracticeRunning] = useState(false);
    const [practiceCompleted, setPracticeCompleted] = useState(false);

    // Practice mode timer effect
    useEffect(() => {
        let interval = null;
        if (isPracticeRunning && !practiceCompleted) {
            interval = setInterval(() => {
                setPracticeTime(time => time + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPracticeRunning, practiceCompleted]);

    const startPractice = () => {
        setPracticeTime(0);
        setIsPracticeRunning(true);
        setPracticeCompleted(false);
    };

    const resetPractice = () => {
        setPracticeTime(0);
        setIsPracticeRunning(true);
        setPracticeCompleted(false);
    };

    const stopPractice = () => {
        setIsPracticeRunning(false);
        setPracticeTime(0);
        setPracticeCompleted(false);
    };

    const completePractice = () => {
        setIsPracticeRunning(false);
        setPracticeCompleted(true);
    };

    return {
        practiceTime,
        isPracticeRunning,
        practiceCompleted,
        startPractice,
        resetPractice,
        stopPractice,
        completePractice,
        setIsPracticeRunning,
        setPracticeCompleted
    };
};