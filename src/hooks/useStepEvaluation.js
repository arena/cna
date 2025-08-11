import { useState } from 'react';

// Hook for managing step evaluations in practice test mode
export const useStepEvaluation = () => {
    const [stepEvaluations, setStepEvaluations] = useState({});

    const handleStepEvaluation = (skillId, stepIndex, evaluation, onTimerStart) => {
        // Auto-start timer on first step evaluation if callback provided
        if (onTimerStart) {
            onTimerStart();
        }
        
        const stepKey = `${skillId}-${stepIndex}`;
        setStepEvaluations(prev => ({
            ...prev,
            [stepKey]: evaluation
        }));
    };

    const getStepEvaluation = (skillId, stepIndex) => {
        const stepKey = `${skillId}-${stepIndex}`;
        return stepEvaluations[stepKey] || null;
    };

    const resetEvaluations = () => {
        setStepEvaluations({});
    };

    return {
        stepEvaluations,
        handleStepEvaluation,
        getStepEvaluation,
        resetEvaluations
    };
};

// Hook for managing step evaluations in individual practice mode
export const usePracticeStepEvaluation = () => {
    const [practiceStepEvaluations, setPracticeStepEvaluations] = useState({});

    const handlePracticeStepEvaluation = (skillId, stepIndex, evaluation, onTimerStart) => {
        // Auto-start practice timer on first step evaluation if callback provided
        if (onTimerStart) {
            onTimerStart();
        }
        
        const stepKey = `${skillId}-${stepIndex}`;
        setPracticeStepEvaluations(prev => ({
            ...prev,
            [stepKey]: evaluation
        }));
    };

    const getPracticeStepEvaluation = (skillId, stepIndex) => {
        const stepKey = `${skillId}-${stepIndex}`;
        return practiceStepEvaluations[stepKey] || null;
    };

    const getPracticeMissedSteps = (skill) => {
        const missedSteps = [];
        skill.steps.forEach((step, stepIndex) => {
            const evaluation = getPracticeStepEvaluation(skill.id, stepIndex);
            if (evaluation === 'skipped' || evaluation === 'wrong') {
                missedSteps.push({
                    stepNumber: stepIndex + 1,
                    description: step.description,
                    critical: step.critical,
                    evaluation: evaluation
                });
            }
        });
        return missedSteps;
    };

    const resetPracticeEvaluations = () => {
        setPracticeStepEvaluations({});
    };

    return {
        practiceStepEvaluations,
        handlePracticeStepEvaluation,
        getPracticeStepEvaluation,
        getPracticeMissedSteps,
        resetPracticeEvaluations
    };
};