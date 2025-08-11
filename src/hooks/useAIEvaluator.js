import { useState, useEffect } from 'react';
import { processTranscriptForMatches, scrollToLatestCompletedStep } from '../utils/aiEvaluatorUtils.js';

// Hook for AI Evaluator functionality
export const useAIEvaluator = (transcript, aiEvalSkill, stopListening) => {
    const [aiStepEvaluations, setAiStepEvaluations] = useState({});
    const [detectedMatches, setDetectedMatches] = useState([]);
    const [aiEvalStartTime, setAiEvalStartTime] = useState(null);
    const [aiEvalEndTime, setAiEvalEndTime] = useState(null);

    // Process transcript for AI evaluation
    useEffect(() => {
        const skillCompleted = processTranscriptForMatches(
            transcript, 
            aiEvalSkill, 
            aiStepEvaluations, 
            setAiStepEvaluations, 
            setDetectedMatches
        );
        
        if (skillCompleted) {
            // Record end time and stop listening when skill is complete
            setAiEvalEndTime(Date.now());
            stopListening();
        }
    }, [transcript, aiEvalSkill, aiStepEvaluations, stopListening]);

    // Auto-scroll to newly completed steps
    useEffect(() => {
        scrollToLatestCompletedStep(aiEvalSkill, aiStepEvaluations);
    }, [aiStepEvaluations, aiEvalSkill]);

    const clearAiEvaluation = () => {
        setAiStepEvaluations({});
        setDetectedMatches([]);
        setAiEvalStartTime(null);
        setAiEvalEndTime(null);
    };

    const startEvaluation = () => {
        if (!aiEvalStartTime) {
            setAiEvalStartTime(Date.now());
        }
    };

    return {
        aiStepEvaluations,
        detectedMatches,
        aiEvalStartTime,
        aiEvalEndTime,
        clearAiEvaluation,
        startEvaluation,
        setAiStepEvaluations,
        setDetectedMatches,
        setAiEvalStartTime,
        setAiEvalEndTime
    };
};