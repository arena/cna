import React from 'react';
import AIEvaluator from './components/AIEvaluator';
import PracticeView from './components/PracticeView.functional';
import SkillsBrowserView from './components/SkillsBrowserView';
import AboutView from './components/AboutView';
import skillsData from './data/skills_data.json';
import contentData from './content.yml';
import ClockIcon from './data/icons/ClockIcon.jsx';
import PlayIcon from './data/icons/PlayIcon.jsx';
import PauseIcon from './data/icons/PauseIcon.jsx';
import RotateIcon from './data/icons/RotateIcon.jsx';
import ShuffleIcon from './data/icons/ShuffleIcon.jsx';
import { formatTime, formatDuration } from './utils/timeUtils.js';
import { hasSkillCriticalFailures, organizeSkillsByType } from './utils/skillUtils.js';
import { getSkillTypeIcon, getSkillCategoryIcon, getSkillTypeLabel } from './utils/iconUtils.jsx';
import { shareResults } from './utils/shareUtils.js';
import { useTimer, usePracticeTimer } from './hooks/useTimer.js';
import { useSkillManagement } from './hooks/useSkillManagement.js';
import { useStepEvaluation, usePracticeStepEvaluation } from './hooks/useStepEvaluation.js';
import { useSpeechRecognition } from './hooks/useSpeechRecognition.js';
import { useAIEvaluator } from './hooks/useAIEvaluator.js';
import './App.css';
import './components.css';


// Main App Component
const CNASkillsApp = () => {
    const [currentView, setCurrentView] = React.useState('practice'); // 'practice', 'browser', 'ai-eval', or 'about'
    const [skillsOrganization, setSkillsOrganization] = React.useState('number'); // 'number' or 'type'
    const [expandedSkill, setExpandedSkill] = React.useState(null); // for skills browser view
    
    // Custom hooks for state management
    const { timeRemaining, isTimerRunning, toggleTimer, resetTimer, setIsTimerRunning } = useTimer();
    const { currentSkills, expandedSkill: practiceExpandedSkill, skillCompletionTimes, skillStartTimes, visitedSkills, allSkillsCompleted, 
            handleNewSkillSet, toggleSkillExpansion, completeSkill, resetSkillsState } = useSkillManagement(skillsData);
    const { stepEvaluations, handleStepEvaluation, getStepEvaluation, resetEvaluations } = useStepEvaluation();
    
    // Individual skill practice mode hooks
    const [practiceMode, setPracticeMode] = React.useState(null); // skillId when in practice mode
    const { practiceTime, isPracticeRunning, practiceCompleted, startPractice, resetPractice, stopPractice, 
            completePractice, setIsPracticeRunning, setPracticeCompleted } = usePracticeTimer();
    const { practiceStepEvaluations, handlePracticeStepEvaluation, getPracticeStepEvaluation, 
            getPracticeMissedSteps, resetPracticeEvaluations } = usePracticeStepEvaluation();
    
    // AI Evaluator hooks
    const { isListening, speechRecognition, transcript, startListening, stopListening, clearTranscript } = useSpeechRecognition();
    const [aiEvalSkill, setAiEvalSkill] = React.useState(null);
    const [showTestButtons, setShowTestButtons] = React.useState(false);
    const { aiStepEvaluations, detectedMatches, aiEvalStartTime, aiEvalEndTime, 
            clearAiEvaluation: clearAiEvaluationHook, startEvaluation,
            setAiStepEvaluations, setDetectedMatches, setAiEvalStartTime, setAiEvalEndTime } = useAIEvaluator(transcript, aiEvalSkill, stopListening);

    // Stop timer when all skills are completed
    React.useEffect(() => {
        if (allSkillsCompleted && isTimerRunning) {
            setIsTimerRunning(false);
        }
    }, [allSkillsCompleted, isTimerRunning, setIsTimerRunning]);


    const handleNewSkillSetWithReset = () => {
        handleNewSkillSet();
        resetTimer();
        resetEvaluations();
        resetSkillsState();
    };

    const resetTimerWithState = () => {
        resetTimer();
        resetEvaluations();
        resetSkillsState();
    };

    // AI Evaluator functions
    const startListeningWithTiming = () => {
        startListening(startEvaluation);
    };

    const clearAiEvaluation = () => {
        clearAiEvaluationHook();
        clearTranscript();
    };


    // Practice mode functions
    const startPracticeMode = (skillId) => {
        setPracticeMode(skillId);
        startPractice();
        resetPracticeEvaluations();
    };

    const resetPracticeMode = () => {
        resetPractice();
        resetPracticeEvaluations();
        
        // Scroll to the top of the skill being practiced
        setTimeout(() => {
            const skillElement = document.querySelector(`[data-skill-id="${practiceMode}"]`);
            if (skillElement) {
                skillElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }
        }, 100);
    };

    const stopPracticeMode = () => {
        setPracticeMode(null);
        stopPractice();
        resetPracticeEvaluations();
    };

    const handlePracticeStepEvaluationWrapper = (skillId, stepIndex, evaluation) => {
        handlePracticeStepEvaluation(skillId, stepIndex, evaluation, () => {
            // Auto-start practice timer on first step evaluation
            if (!isPracticeRunning && !practiceCompleted) {
                setIsPracticeRunning(true);
            }
        });
    };

    const hasPracticeCriticalFailures = (skill) => {
        return hasSkillCriticalFailures(skill, getPracticeStepEvaluation);
    };

    const toggleSkillExpansionWrapper = (skillId) => {
        toggleSkillExpansion(skillId, timeRemaining);
    };

    const completeSkillWrapper = (skillId) => {
        completeSkill(skillId, timeRemaining);
    };

    const handleStepEvaluationWrapper = (skillId, stepIndex, evaluation) => {
        handleStepEvaluation(skillId, stepIndex, evaluation, () => {
            // Auto-start timer on first step evaluation
            if (!isTimerRunning) {
                setIsTimerRunning(true);
            }
        });
    };

    // Create wrapper functions that provide the necessary context
    const hasSkillCriticalFailuresWrapper = (skill) => {
        return hasSkillCriticalFailures(skill, getStepEvaluation);
    };

    const shareResultsWrapper = async () => {
        await shareResults(
            currentSkills,
            skillCompletionTimes, 
            timeRemaining,
            formatTime,
            formatDuration,
            hasSkillCriticalFailuresWrapper,
            contentData
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{contentData.app.name}</h1>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                            {currentView === 'practice' 
                                ? contentData.app.taglines.practice
                                : currentView === 'browser'
                                    ? contentData.app.taglines.browser
                                    : contentData.app.taglines.about
                            }
                        </p>
                    </div>
                    {currentView === 'practice' && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                            {/* Timer */}
                            <div className="flex items-center justify-between sm:justify-start gap-2 bg-gray-100 rounded-lg p-3 order-2 sm:order-1">
                                <div className="flex items-center gap-2">
                                    <ClockIcon />
                                    <span className={`text-lg sm:text-xl font-mono font-bold ${timeRemaining <= 300 || timeRemaining < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={toggleTimer}
                                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                                        title={isTimerRunning ? "Pause Timer" : "Start Timer"}
                                    >
                                        {isTimerRunning ? <PauseIcon /> : <PlayIcon />}
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                                        title="Reset Timer"
                                    >
                                        <RotateIcon />
                                    </button>
                                </div>
                            </div>
                            {/* New Skill Set Button */}
                            <button
                                onClick={handleNewSkillSet}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
                            >
                                <ShuffleIcon />
                                <span className="text-sm sm:text-base">New Skill Set</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setCurrentView('practice')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                            currentView === 'practice'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {contentData.navigation.practice}
                    </button>
                    <button
                        onClick={() => setCurrentView('browser')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                            currentView === 'browser'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {contentData.navigation.skills}
                    </button>
                    <button
                        onClick={() => setCurrentView('ai-eval')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                            currentView === 'ai-eval'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {contentData.navigation.ai_eval}
                    </button>
                    <button
                        onClick={() => setCurrentView('about')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                            currentView === 'about'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {contentData.navigation.about}
                    </button>
                </div>

                {/* Practice Test View */}
                {currentView === 'practice' && (
                    <PracticeView 
                        currentSkills={currentSkills}
                        expandedSkill={practiceExpandedSkill}
                        toggleSkillExpansion={toggleSkillExpansionWrapper}
                        getSkillTypeIcon={getSkillTypeIcon}
                        getSkillTypeLabel={getSkillTypeLabel}
                        getStepEvaluation={getStepEvaluation}
                        handleStepEvaluation={handleStepEvaluationWrapper}
                        skillCompletionTimes={skillCompletionTimes}
                        formatDuration={formatDuration}
                        visitedSkills={visitedSkills}
                        completeSkill={completeSkillWrapper}
                        allSkillsCompleted={allSkillsCompleted}
                        timeRemaining={timeRemaining}
                        formatTime={formatTime}
                        handleNewSkillSet={handleNewSkillSetWithReset}
                        shareResults={shareResultsWrapper}
                        resetTimer={resetTimerWithState}
                        hasSkillCriticalFailures={hasSkillCriticalFailuresWrapper}
                    />
                )}

                {/* Skills Browser View */}
                {currentView === 'browser' && (
                    <SkillsBrowserView
                        skillsOrganization={skillsOrganization}
                        setSkillsOrganization={setSkillsOrganization}
                        expandedSkill={expandedSkill}
                        setExpandedSkill={setExpandedSkill}
                        getSkillTypeIcon={getSkillTypeIcon}
                        getSkillTypeLabel={getSkillTypeLabel}
                        getSkillCategoryIcon={getSkillCategoryIcon}
                        organizeSkillsByType={organizeSkillsByType}
                        contentData={contentData}
                        skillsData={skillsData}
                        // Pass practice mode state and functions
                        practiceMode={practiceMode}
                        practiceTime={practiceTime}
                        isPracticeRunning={isPracticeRunning}
                        practiceCompleted={practiceCompleted}
                        practiceStepEvaluations={practiceStepEvaluations}
                        startPractice={startPracticeMode}
                        resetPractice={resetPracticeMode}
                        stopPractice={stopPracticeMode}
                        completePractice={completePractice}
                        handlePracticeStepEvaluation={handlePracticeStepEvaluationWrapper}
                        getPracticeStepEvaluation={getPracticeStepEvaluation}
                        getPracticeMissedSteps={getPracticeMissedSteps}
                        hasPracticeCriticalFailures={hasPracticeCriticalFailures}
                        formatDuration={formatDuration}
                        setIsPracticeRunning={setIsPracticeRunning}
                    />
                )}

                {/* AI Eval View */}
                {currentView === 'ai-eval' && (
                    <AIEvaluator 
                        skillsData={skillsData}
                        contentData={contentData}
                        getSkillCategoryIcon={getSkillCategoryIcon}
                        // Pass AI evaluator state and functions
                        aiEvalSkill={aiEvalSkill}
                        setAiEvalSkill={setAiEvalSkill}
                        isListening={isListening}
                        speechRecognition={speechRecognition}
                        transcript={transcript}
                        startListening={startListeningWithTiming}
                        stopListening={stopListening}
                        clearAiEvaluation={clearAiEvaluation}
                        aiStepEvaluations={aiStepEvaluations}
                        detectedMatches={detectedMatches}
                        aiEvalStartTime={aiEvalStartTime}
                        aiEvalEndTime={aiEvalEndTime}
                        showTestButtons={showTestButtons}
                        setShowTestButtons={setShowTestButtons}
                        setAiStepEvaluations={setAiStepEvaluations}
                    />
                )}


                {/* About View */}
                {currentView === 'about' && (
                    <AboutView contentData={contentData} />
                )}
            </div>
        </div>
    );
};

const App = CNASkillsApp;
export default App;