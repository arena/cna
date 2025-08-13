import React from 'react';

const AIEvaluator = ({ skillsData, contentData, getSkillCategoryIcon }) => {
    // AI Evaluator state
    const [isListening, setIsListening] = React.useState(false);
    const [speechRecognition, setSpeechRecognition] = React.useState(null);
    const [transcript, setTranscript] = React.useState('');
    const [aiEvalSkill, setAiEvalSkill] = React.useState(null);
    const [aiStepEvaluations, setAiStepEvaluations] = React.useState({});
    const [detectedMatches, setDetectedMatches] = React.useState([]);
    const [aiEvalStartTime, setAiEvalStartTime] = React.useState(null);
    const [aiEvalEndTime, setAiEvalEndTime] = React.useState(null);
    const [showTestButtons, setShowTestButtons] = React.useState(false);

    // Initialize Speech Recognition API
    React.useEffect(() => {
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

    // AI Evaluator functions
    const startListening = () => {
        if (speechRecognition && !isListening) {
            speechRecognition.start();
            // Start timing the AI eval session
            if (!aiEvalStartTime) {
                setAiEvalStartTime(Date.now());
            }
        }
    };

    const stopListening = () => {
        if (speechRecognition && isListening) {
            speechRecognition.stop();
        }
    };

    const clearAiEvaluation = () => {
        setAiStepEvaluations({});
        setDetectedMatches([]);
        setTranscript('');
        setAiEvalStartTime(null);
        setAiEvalEndTime(null);
    };

    // Simple word matching function
    const matchesStep = (spokenText, stepText) => {
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

    // Process transcript for AI evaluation
    React.useEffect(() => {
        if (transcript && aiEvalSkill) {
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
                // Record end time and stop listening when skill is complete
                setAiEvalEndTime(Date.now());
                stopListening();
            }
        }
    }, [transcript, aiEvalSkill, aiStepEvaluations, stopListening]);

    // Auto-scroll to newly completed steps
    React.useEffect(() => {
        if (aiEvalSkill && Object.keys(aiStepEvaluations).length > 0) {
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
        }
    }, [aiStepEvaluations, aiEvalSkill]);

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header and Skill Selection */}
            <div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <p className="text-gray-700 text-sm">
                        <strong>{contentData.ai_eval.how_it_works_intro}</strong>{contentData.ai_eval.how_it_works_body}
                    </p>
                </div>

                <h3 className="text-lg font-semibold mb-4">{contentData.ai_eval.choose_skill}</h3>
                <div className="grid grid-cols-1 gap-2">
                    {skillsData.skills.map((skill, index) => (
                        <div key={skill.id}>
                            <button
                                onClick={() => {
                                    setAiEvalSkill(skill);
                                    clearAiEvaluation();
                                }}
                                className={`w-full p-3 border-2 text-left transition-colors ${
                                    aiEvalSkill?.id === skill.id
                                        ? 'bg-blue-50 border-blue-500 text-blue-800 rounded-t-lg border-b-0'
                                        : 'bg-white border-gray-200 hover:bg-gray-50 rounded-lg'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-bold ${
                                        aiEvalSkill?.id === skill.id 
                                            ? 'bg-blue-600' 
                                            : 'bg-gray-400'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <div className={`flex flex-1 items-center justify-between ${
                                        aiEvalSkill?.id === skill.id ? 'text-gray-800 font-semibold' : 'text-gray-700'
                                    }`}>
                                        <span>{skill.title}</span>
                                    </div>
                                    {aiEvalSkill?.id === skill.id ? (
                                        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                            <span>{skill.steps.length} {contentData.ai_eval.steps_text}</span>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    clearAiEvaluation();
                                                }}
                                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors cursor-pointer"
                                            >
                                                {contentData.ai_eval.reset}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-500 mt-1">{skill.steps.length} {contentData.ai_eval.steps_text}</div>
                                    )}
                                </div>
                            </button>
                            
                            {/* Expanded Practice Section */}
                            {aiEvalSkill?.id === skill.id && (
                                <div className="bg-blue-50 rounded-b-lg border-l-2 border-r-2 border-b-2 border-blue-500 p-4 mt-0">
                                    {/* Voice Recognition Controls */}
                                    <div className="mb-6 p-4 bg-white rounded-lg ml-7">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium">{contentData.ai_eval.voice_recognition}</span>
                                            {speechRecognition ? (
                                                <span className="text-green-600 text-xs flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    {contentData.ai_eval.ready}
                                                </span>
                                            ) : (
                                                <div className="flex gap-1">
                                                    {/* Test buttons only in development */}
                                                    {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' || showTestButtons) ? (
                                                    <>
                                                    <button 
                                                        onClick={() => {
                                                            // Simulate A+ grade - mark most steps as completed
                                                            const newEvals = {};
                                                            const numSteps = skill.steps.length;
                                                            const stepsToComplete = Math.floor(numSteps * 0.9); // 90% completion
                                                            
                                                            for (let i = 0; i < stepsToComplete; i++) {
                                                                newEvals[`${skill.id}-${i}`] = 'satisfactory';
                                                            }
                                                            
                                                            setAiStepEvaluations(newEvals);
                                                            setAiEvalStartTime(Date.now() - 120000); // 2 minutes ago
                                                            setAiEvalEndTime(Date.now());
                                                        }}
                                                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                                    >
                                                        A+
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            // Simulate B grade - mark some steps as completed
                                                            const newEvals = {};
                                                            const numSteps = skill.steps.length;
                                                            const stepsToComplete = Math.floor(numSteps * 0.7); // 70% completion
                                                            
                                                            for (let i = 0; i < stepsToComplete; i++) {
                                                                newEvals[`${skill.id}-${i}`] = 'satisfactory';
                                                            }
                                                            
                                                            // Mark remaining as skipped
                                                            for (let i = stepsToComplete; i < numSteps; i++) {
                                                                newEvals[`${skill.id}-${i}`] = 'skipped';
                                                            }
                                                            
                                                            setAiStepEvaluations(newEvals);
                                                            setAiEvalStartTime(Date.now() - 180000); // 3 minutes ago
                                                            setAiEvalEndTime(Date.now());
                                                        }}
                                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    >
                                                        B
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            // Simulate F grade - mark few steps as completed
                                                            const newEvals = {};
                                                            const numSteps = skill.steps.length;
                                                            const stepsToComplete = Math.floor(numSteps * 0.3); // 30% completion
                                                            
                                                            for (let i = 0; i < stepsToComplete; i++) {
                                                                newEvals[`${skill.id}-${i}`] = 'satisfactory';
                                                            }
                                                            
                                                            // Mark remaining as skipped
                                                            for (let i = stepsToComplete; i < numSteps; i++) {
                                                                newEvals[`${skill.id}-${i}`] = 'skipped';
                                                            }
                                                            
                                                            setAiStepEvaluations(newEvals);
                                                            setAiEvalStartTime(Date.now() - 300000); // 5 minutes ago
                                                            setAiEvalEndTime(Date.now());
                                                        }}
                                                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                                    >
                                                        F
                                                    </button>
                                                    </>
                                                    ) : (
                                                        <span className="text-red-600 text-xs flex items-center gap-1">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                            {contentData.ai_eval.not_supported}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {speechRecognition && (
                                            <button
                                                onClick={isListening ? stopListening : startListening}
                                                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                                                    isListening
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                {isListening ? contentData.ai_eval.stop_listening : contentData.ai_eval.start_listening}
                                            </button>
                                        )}
                                        {/* Live Transcript */}
                                        {isListening && transcript && (
                                            <div className="mt-3 p-3 bg-white rounded border">
                                                <div className="text-xs text-gray-500 mb-1">{contentData.ai_eval.hearing}</div>
                                                <div className="text-sm text-gray-700">{transcript}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Hidden testing toggle */}
                                    {!speechRecognition && !window.location.hostname.includes('localhost') && window.location.hostname !== '127.0.0.1' && (
                                        <div className="text-center mb-4">
                                            <button
                                                onClick={() => setShowTestButtons(prev => !prev)}
                                                className="text-xs text-gray-400 hover:text-gray-600"
                                            >
                                                ·
                                            </button>
                                        </div>
                                    )}

                                    {/* Steps List */}
                                    <div className="space-y-2 ml-7">
                                        {skill.steps.map((step, stepIndex) => {
                                            const stepKey = `${skill.id}-${stepIndex}`;
                                            const isCompleted = aiStepEvaluations[stepKey] === 'satisfactory';
                                            const isSkipped = aiStepEvaluations[stepKey] === 'skipped';
                                            
                                            // Check if this step was just detected
                                            const wasJustDetected = detectedMatches.some(match => 
                                                match.stepIndex === stepIndex && 
                                                Date.now() - (detectedMatches.find(m => m.stepIndex === stepIndex)?.timestamp || 0) < 3000
                                            );
                                            
                                            // Check if this step should be highlighted as missed
                                            const allStepsEvaluated = skill.steps.every((_, i) => 
                                                aiStepEvaluations[`${skill.id}-${i}`]
                                            );
                                            const isMissed = allStepsEvaluated && !isCompleted && !isSkipped;

                                            return (
                                                <div
                                                    key={stepIndex}
                                                    id={`step-${stepIndex}`}
                                                    className={`p-3 rounded border ${
                                                        isCompleted
                                                            ? 'bg-green-50 border-green-200'
                                                            : isSkipped || isMissed
                                                                ? 'bg-yellow-50 border-yellow-200'
                                                                : 'bg-gray-50 border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-white text-sm font-bold flex-shrink-0 ${
                                                                isCompleted
                                                                    ? 'bg-green-600'
                                                                    : isSkipped || isMissed
                                                                        ? 'bg-yellow-600'
                                                                        : 'bg-gray-400'
                                                            }`}>
                                                                {stepIndex + 1}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className={`text-sm ${
                                                                    isCompleted || isSkipped || isMissed
                                                                        ? 'text-gray-800 font-medium'
                                                                        : 'text-gray-600'
                                                                }`}>
                                                                    {step.description || step.text}
                                                                </div>
                                                                {step.isCritical && (
                                                                    <div className="text-xs text-red-600 font-medium mt-1">
                                                                        Critical Step
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {(isCompleted || isSkipped || wasJustDetected || isMissed) && (
                                                            <div className={`text-xs font-medium px-2 py-1 rounded ${
                                                                isCompleted
                                                                    ? 'text-green-700'
                                                                    : isSkipped
                                                                        ? 'text-yellow-700'
                                                                        : wasJustDetected
                                                                            ? 'text-blue-700'
                                                                            : isMissed
                                                                                ? 'text-yellow-700'
                                                                                : 'text-gray-500'
                                                            }`}>
                                                                {isCompleted 
                                                                    ? contentData.ai_eval.completed 
                                                                    : isSkipped 
                                                                        ? contentData.ai_eval.skipped
                                                                        : wasJustDetected
                                                                            ? contentData.ai_eval.just_detected
                                                                            : isMissed
                                                                                ? 'Missed'
                                                                                : '👂 Waiting patiently'
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Results Summary */}
                                    {aiEvalEndTime && (() => {
                                        const totalSteps = skill.steps.length;
                                        const completedSteps = Object.keys(aiStepEvaluations).filter(key => 
                                            key.startsWith(skill.id) && aiStepEvaluations[key] === 'satisfactory'
                                        ).length;
                                        const _skippedSteps = Object.keys(aiStepEvaluations).filter(key => 
                                            key.startsWith(skill.id) && aiStepEvaluations[key] === 'skipped'
                                        ).length;
                                        
                                        const completionRate = completedSteps / totalSteps;
                                        const timeElapsed = Math.floor((aiEvalEndTime - aiEvalStartTime) / 1000);
                                        const timeString = formatDuration(timeElapsed);
                                        
                                        let summary, summaryColor;
                                        if (completionRate === 1) {
                                            summary = "Perfect! All steps completed.";
                                            summaryColor = "text-green-800";
                                        } else if (completionRate >= 0.8) {
                                            summary = "Great job! Most steps completed.";
                                            summaryColor = "text-green-700";
                                        } else if (completionRate >= 0.6) {
                                            summary = "Good effort. Some steps were missed.";
                                            summaryColor = "text-yellow-700";
                                        } else {
                                            summary = "Keep practicing. Many steps were missed.";
                                            summaryColor = "text-red-700";
                                        }
                                        
                                        return (
                                            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 space-y-4 ml-7 mt-4">
                                                <div className="text-center">
                                                    <div className="text-green-800 font-bold text-lg mb-2">{contentData.ai_eval.skill_complete}</div>
                                                    <div className={`text-lg font-medium ${summaryColor}`}>{summary}</div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="text-center p-3 bg-white rounded-lg">
                                                        <div className="text-2xl font-bold text-green-600">{completedSteps}</div>
                                                        <div className="text-gray-600">Steps Completed</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-lg">
                                                        <div className="text-2xl font-bold text-blue-600">{timeString}</div>
                                                        <div className="text-gray-600">Time Taken</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="text-center space-y-2">
                                                    <button
                                                        onClick={() => {
                                                            const shareUrl = `${window.location.origin}${window.location.pathname}#ai-eval`;
                                                            const shareText = contentData.ai_eval.share_text_template.replace('{skill}', skill.title);
                                                            
                                                            if (navigator.share) {
                                                                navigator.share({
                                                                    title: 'CNA Skills Practice',
                                                                    text: shareText,
                                                                    url: shareUrl
                                                                });
                                                            } else {
                                                                navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                                                                    alert('Link copied to clipboard!');
                                                                });
                                                            }
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                                                        </svg>
                                                        {contentData.ai_eval.share_progress}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIEvaluator;