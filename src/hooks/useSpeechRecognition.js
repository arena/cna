import { useState, useEffect } from 'react';

// Hook for managing Speech Recognition API for AI Evaluator
export const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [speechRecognition, setSpeechRecognition] = useState(null);
    const [transcript, setTranscript] = useState('');

    // Initialize Speech Recognition API
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            
            recognition.onstart = () => {
                setIsListening(true);
                setTranscript('');
            };
            
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + ' ' + finalTranscript);
                }
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            
            recognition.onend = () => {
                setIsListening(false);
            };
            
            setSpeechRecognition(recognition);
        }
    }, []);

    const startListening = (onStart) => {
        if (speechRecognition && !isListening) {
            speechRecognition.start();
            // Execute callback when starting (e.g., start timing the AI eval session)
            if (onStart) {
                onStart();
            }
        }
    };

    const stopListening = () => {
        if (speechRecognition && isListening) {
            speechRecognition.stop();
        }
    };

    const clearTranscript = () => {
        setTranscript('');
    };

    return {
        isListening,
        speechRecognition,
        transcript,
        startListening,
        stopListening,
        clearTranscript
    };
};