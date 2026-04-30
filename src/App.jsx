import React from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import AIEvaluator from './components/AIEvaluator';
import PracticeView from './components/PracticeView.functional';
import SkillsBrowserView from './components/SkillsBrowserView';
import AboutView from './components/AboutView';
import CustomSkillModal from './components/CustomSkillModal';
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
    const location = useLocation();
    const navigate = useNavigate();
    const currentView = location.pathname === '/' ? 'practice' :
                       location.pathname === '/practice' ? 'practice' :
                       location.pathname === '/skills' ? 'browser' :
                       location.pathname === '/voice' ? 'ai-eval' :
                       location.pathname === '/about' ? 'about' : 'practice';
    const [skillsOrganization, setSkillsOrganization] = React.useState('number'); // 'number', 'type', or 'length'
    const [lengthSortAscending, setLengthSortAscending] = React.useState(false);
    const [expandedSkill, setExpandedSkill] = React.useState(null); // for skills browser view
    const [showCustomModal, setShowCustomModal] = React.useState(false);
    
    // Custom hooks for state management
    const { timeRemaining, isTimerRunning, toggleTimer, resetTimer, setIsTimerRunning } = useTimer();
    const { currentSkills, expandedSkill: practiceExpandedSkill, skillCompletionTimes, skillStartTimes, visitedSkills, allSkillsCompleted,
            handleNewSkillSet, setCustomSkillSet, toggleSkillExpansion, completeSkill, resetSkillsState } = useSkillManagement(skillsData);
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

    // Load skills from URL parameters on initial load (practice view)
    React.useEffect(() => {
        if (currentView === 'practice') {
            const params = new URLSearchParams(location.search);
            const skillsParam = params.get('skills');
            if (skillsParam && currentSkills.length === 0) {
                // Parse skill IDs from URL - they're strings like "hand_hygiene"
                const skillIds = skillsParam.split(',').map(id => id.trim());
                if (skillIds.length > 0) {
                    // Find skills that match the IDs
                    const selectedSkills = skillIds.map(id =>
                        skillsData.skills.find(skill => skill.id === id)
                    ).filter(skill => skill !== undefined);

                    if (selectedSkills.length > 0) {
                        setCustomSkillSet(selectedSkills);
                        resetTimer();
                        resetEvaluations();
                    }
                }
            }
        }
    }, [currentView, location.search, currentSkills.length, setCustomSkillSet, resetTimer, resetEvaluations]);

    // Load expanded skill from URL parameters (skills view)
    React.useEffect(() => {
        if (currentView === 'browser') {
            const params = new URLSearchParams(location.search);
            const skillParam = params.get('skill');
            if (skillParam) {
                setExpandedSkill(skillParam);
                // Scroll to the expanded skill after a short delay
                setTimeout(() => {
                    const skillElement = document.querySelector(`[data-skill-id="${skillParam}"]`);
                    if (skillElement) {
                        skillElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                    }
                }, 100);
            }
        }
    }, [currentView, location.search]);

    // Load selected skill from URL parameters (voice view)
    React.useEffect(() => {
        if (currentView === 'ai-eval') {
            const params = new URLSearchParams(location.search);
            const skillParam = params.get('skill');
            if (skillParam && skillParam !== aiEvalSkill?.id) {
                const selectedSkill = skillsData.skills.find(skill => skill.id === skillParam);
                if (selectedSkill) {
                    setAiEvalSkill(selectedSkill);
                    // Scroll to the selected skill after a short delay
                    setTimeout(() => {
                        const skillElement = document.querySelector(`[data-skill-id="${skillParam}"]`);
                        if (skillElement) {
                            skillElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                                inline: 'nearest'
                            });
                        }
                    }, 100);
                }
            }
        }
    }, [currentView, location.search]);

    // Update URL when expanded skill changes (skills view)
    React.useEffect(() => {
        if (currentView === 'browser' && expandedSkill) {
            navigate(`/skills?skill=${expandedSkill}`, { replace: true });
            // Scroll to the expanded skill
            setTimeout(() => {
                const skillElement = document.querySelector(`[data-skill-id="${expandedSkill}"]`);
                if (skillElement) {
                    skillElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 100);
        } else if (currentView === 'browser' && !expandedSkill) {
            navigate('/skills', { replace: true });
        }
    }, [expandedSkill, currentView, navigate]);


    // Update URL when skills change
    React.useEffect(() => {
        if (currentView === 'practice' && currentSkills.length > 0) {
            const skillIds = currentSkills.map(skill => skill.id).join(',');
            navigate(`/practice?skills=${skillIds}`, { replace: true });
        }
    }, [currentSkills, currentView, navigate]);

    const handleCustomSkillSet = (selectedSkills) => {
        console.log('Custom skills selected:', selectedSkills); // Debug
        setCustomSkillSet(selectedSkills);
        resetTimer();
        resetEvaluations();
        setShowCustomModal(false);
        // Don't auto-expand any skill - let user choose
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

    // Wrapper for manual skill selection
    const handleManualAiEvalSkillSelection = (skill) => {
        setAiEvalSkill(skill);
        navigate(`/voice?skill=${skill.id}`, { replace: true });
        // Scroll to the selected skill
        setTimeout(() => {
            const skillElement = document.querySelector(`[data-skill-id="${skill.id}"]`);
            if (skillElement) {
                skillElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        }, 100);
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
        <div className="max-w-4xl mx-auto p-3 sm:p-6">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                {/* App Title */}
                <div className="mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{contentData.app.name}</h1>
                </div>

                {/* Navigation Tabs */}
                <div className="tab-container">
                    <Link
                        to="/practice"
                        className={`tab-button ${
                            currentView === 'practice' ? 'active' : 'inactive'
                        }`}
                    >
                        {contentData.navigation.practice}
                    </Link>
                    <Link
                        to="/skills"
                        className={`tab-button ${
                            currentView === 'browser' ? 'active' : 'inactive'
                        }`}
                    >
                        {contentData.navigation.skills}
                    </Link>
                    <Link
                        to="/voice"
                        className={`tab-button ${
                            currentView === 'ai-eval' ? 'active' : 'inactive'
                        }`}
                    >
                        {contentData.navigation.ai_eval}
                    </Link>
                    <Link
                        to="/about"
                        className={`tab-button ${
                            currentView === 'about' ? 'active' : 'inactive'
                        }`}
                    >
                        {contentData.navigation.about}
                    </Link>
                </div>

                {/* View-specific Header Content */}
                <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ${currentView !== 'ai-eval' ? 'mb-6' : ''}`}>
                    <div>
                        {currentView !== 'ai-eval' && (
                            <p className="text-gray-600 text-sm sm:text-base">
                                {currentView === 'practice' 
                                    ? contentData.app.taglines.practice
                                    : currentView === 'browser'
                                        ? contentData.app.taglines.browser
                                        : contentData.app.taglines.about
                                }
                            </p>
                        )}
                    </div>
                    {currentView === 'practice' && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                            {/* Timer */}
                            <div className="timer-display flex-between sm:flex-center-gap-2 order-2 sm:order-1">
                                <div className="flex-center-gap-2">
                                    <ClockIcon />
                                    <span className={`timer-value ${timeRemaining <= 300 || timeRemaining < 0 ? 'warning' : ''}`}>
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                                <div className="timer-controls">
                                    <button
                                        onClick={toggleTimer}
                                        className="timer-button"
                                        title={isTimerRunning ? "Pause Timer" : "Start Timer"}
                                    >
                                        {isTimerRunning ? <PauseIcon /> : <PlayIcon />}
                                    </button>
                                    <button
                                        onClick={resetTimer}
                                        className="timer-button"
                                        title="Reset Timer"
                                    >
                                        <RotateIcon />
                                    </button>
                                </div>
                            </div>
                            {/* Practice Set Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
                                <button
                                    onClick={handleNewSkillSet}
                                    className="btn-primary flex-center-justify-gap-2"
                                >
                                    <ShuffleIcon />
                                    <span className="text-sm sm:text-base">Random Set</span>
                                </button>
                                <button
                                    onClick={() => setShowCustomModal(true)}
                                    className="btn-secondary flex-center-justify-gap-2"
                                >
                                    <span>✋</span>
                                    <span className="text-sm sm:text-base">Custom Set</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<Navigate to="/practice" replace />} />
                    <Route path="/practice" element={
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
                            contentData={contentData}
                        />
                    } />
                    <Route path="/skills" element={
                        <SkillsBrowserView
                            skillsOrganization={skillsOrganization}
                            setSkillsOrganization={setSkillsOrganization}
                            lengthSortAscending={lengthSortAscending}
                            setLengthSortAscending={setLengthSortAscending}
                            expandedSkill={expandedSkill}
                            setExpandedSkill={setExpandedSkill}
                            getSkillTypeIcon={getSkillTypeIcon}
                            getSkillTypeLabel={getSkillTypeLabel}
                            getSkillCategoryIcon={getSkillCategoryIcon}
                            organizeSkillsByType={organizeSkillsByType}
                            contentData={contentData}
                            skillsData={skillsData}
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
                    } />
                    <Route path="/voice" element={
                        <AIEvaluator
                            skillsData={skillsData}
                            contentData={contentData}
                            getSkillCategoryIcon={getSkillCategoryIcon}
                            aiEvalSkill={aiEvalSkill}
                            setAiEvalSkill={handleManualAiEvalSkillSelection}
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
                    } />
                    <Route path="/about" element={<AboutView contentData={contentData} />} />
                </Routes>
            </div>

            {/* Custom Skill Selection Modal */}
            <CustomSkillModal
                isOpen={showCustomModal}
                onClose={() => setShowCustomModal(false)}
                skillsData={skillsData}
                onStartPractice={handleCustomSkillSet}
            />
        </div>
    );
};

const App = CNASkillsApp;
export default App;