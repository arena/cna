// AI Evaluator utility functions

// Simple word matching function for speech recognition
export const matchesStep = (spokenText, stepText) => {
    const spoken = spokenText.toLowerCase();
    const step = stepText.toLowerCase();
    
    // Extract key words from step (ignore common words)
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'client', 'candidate'];
    const stepWords = step.split(' ').filter(word => 
        word.length > 2 && !commonWords.includes(word)
    );
    
    // Count how many key words from the step are found in spoken text
    const matchedWords = stepWords.filter(word => spoken.includes(word));
    const matchRatio = matchedWords.length / stepWords.length;
    
    return { matched: matchRatio >= 0.3, ratio: matchRatio, words: matchedWords };
};

// Process transcript and detect step matches
export const processTranscriptForMatches = (transcript, aiEvalSkill, aiStepEvaluations, setAiStepEvaluations, setDetectedMatches) => {
    if (!transcript || !aiEvalSkill) return;

    const newMatches = [];
    
    // Check each step for matches
    aiEvalSkill.steps.forEach((step, index) => {
        const stepKey = `${aiEvalSkill.id}-${index}`;
        const stepText = step.description || step.text;
        const match = matchesStep(transcript, stepText);
        
        if (match.matched && !aiStepEvaluations[stepKey]) {
            setAiStepEvaluations(prev => ({
                ...prev,
                [stepKey]: 'satisfactory'
            }));
            
            newMatches.push({
                stepIndex: index,
                stepText: stepText,
                confidence: match.ratio,
                matchedWords: match.words
            });
        }
    });
    
    if (newMatches.length > 0) {
        setDetectedMatches(prev => [...prev, ...newMatches]);
    }
    
    // Check for "skill complete" phrase
    const lowercaseTranscript = transcript.toLowerCase();
    if (lowercaseTranscript.includes('skill complete') || 
        lowercaseTranscript.includes('skill completed')) {
        
        // Mark any undetected steps as skipped
        aiEvalSkill.steps.forEach((step, index) => {
            const stepKey = `${aiEvalSkill.id}-${index}`;
            if (!aiStepEvaluations[stepKey]) {
                setAiStepEvaluations(prev => ({
                    ...prev,
                    [stepKey]: 'skipped'
                }));
            }
        });

        setDetectedMatches(prev => [...prev, { 
            type: 'completion', 
            message: 'Skill completion detected!' 
        }]);
        
        return true; // Indicates skill completion was detected
    }
    
    return false;
};

// Auto-scroll to newly completed steps
export const scrollToLatestCompletedStep = (aiEvalSkill, aiStepEvaluations) => {
    if (!aiEvalSkill || Object.keys(aiStepEvaluations).length === 0) return;

    // Find the highest index step that has been completed
    const completedSteps = Object.keys(aiStepEvaluations).filter(key => 
        key.startsWith(aiEvalSkill.id) && aiStepEvaluations[key] === 'satisfactory'
    );
    
    if (completedSteps.length > 0) {
        // Extract step indices and find the highest one
        const stepIndices = completedSteps.map(key => parseInt(key.split('-')[1]));
        const latestCompletedIndex = Math.max(...stepIndices);
        
        // Scroll to the latest completed step
        setTimeout(() => {
            const stepElement = document.getElementById(`step-${latestCompletedIndex}`);
            if (stepElement) {
                stepElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }, 300); // Small delay to ensure DOM is updated
    }
};