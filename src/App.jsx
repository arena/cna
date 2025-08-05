import React from 'react';
import skillsData from './data/skills_data.json';
import './App.css';

// Simple icons using SVG
const ClockIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
    </svg>
);

const PlayIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="5,3 19,12 5,21"/>
    </svg>
);

const PauseIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
    </svg>
);

const RotateIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 4v6h6"/>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
);

const ShuffleIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16,3 21,3 21,8"/>
        <line x1="4" y1="20" x2="21" y2="3"/>
        <polyline points="21,16 21,21 16,21"/>
        <line x1="15" y1="15" x2="21" y2="21"/>
        <line x1="4" y1="4" x2="9" y2="9"/>
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6,9 12,15 18,9"/>
    </svg>
);

const ChevronUpIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="18,15 12,9 6,15"/>
    </svg>
);

const CheckIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,6 9,17 4,12"/>
    </svg>
);

const XIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

const MinusIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22,11.08V12a10,10,0,1,1-5.93-9.14"/>
        <polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
);

const DropletsIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7,16.3c2.2,0,4-1.83,4-4.05,0-1.16-0.57-2.26-1.71-3.19S7.29,6.75,7,6.3,5.43,8.84,4.29,9.06C3.14,10.04,2.57,11.14,2.57,12.3A4.07,4.07,0,0,0,7,16.3Z"/>
        <path d="M12.56,6.6A10.97,10.97,0,0,0,14,3.02c.5-.94,1.5-.94,2,0a10.97,10.97,0,0,0,1.44,3.58,8.28,8.28,0,0,1,1.77,5.58,8,8,0,0,1-16,0,8.28,8.28,0,0,1,1.77-5.58Z"/>
    </svg>
);

const AwardIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"/>
    </svg>
);

// Main App Component
const CNASkillsApp = () => {
    const [currentSkills, setCurrentSkills] = React.useState([]);
    const [expandedSkill, setExpandedSkill] = React.useState(null);
    const [timeRemaining, setTimeRemaining] = React.useState(30 * 60);
    const [isTimerRunning, setIsTimerRunning] = React.useState(false);
    const [stepEvaluations, setStepEvaluations] = React.useState({});
    const [skillCompletionTimes, setSkillCompletionTimes] = React.useState({});
    const [skillStartTimes, setSkillStartTimes] = React.useState({});
    const [visitedSkills, setVisitedSkills] = React.useState(new Set());

    // Initialize with random skills on mount
    React.useEffect(() => {
        setCurrentSkills(generateSkillSet(skillsData.skills));
    }, []);

    // Timer effect
    React.useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(timeRemaining => timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeRemaining]);

    // Function to generate new skill set according to CNA rules
    const generateSkillSet = (allSkills) => {
        const newSkills = [];
        
        // 1. Always start with Hand Hygiene
        const handHygiene = allSkills.find(skill => skill.isAlwaysFirst);
        if (handHygiene) newSkills.push(handHygiene);
        
        // 2. Second skill is a measurement skill
        const measurementSkills = allSkills.filter(skill => skill.isMeasurementSkill && !skill.isAlwaysFirst);
        if (measurementSkills.length > 0) {
            const randomMeasurement = measurementSkills[Math.floor(Math.random() * measurementSkills.length)];
            newSkills.push(randomMeasurement);
        }
        
        // 3. Third skill is a random personal care water skill (no measurement skills)
        const personalCareWaterSkills = allSkills.filter(skill => 
            skill.category === "Personal Care" && 
            skill.isWaterSkill && 
            !skill.isMeasurementSkill &&
            !skill.isAlwaysFirst
        );
        if (personalCareWaterSkills.length > 0) {
            const randomWaterSkill = personalCareWaterSkills[Math.floor(Math.random() * personalCareWaterSkills.length)];
            newSkills.push(randomWaterSkill);
        }
        
        // 4. Fourth skill is random non-water, non-measurement skill
        const nonWaterNonMeasurementSkills = allSkills.filter(skill => 
            !skill.isWaterSkill && 
            !skill.isMeasurementSkill &&
            !skill.isAlwaysFirst && 
            !newSkills.includes(skill)
        );
        if (nonWaterNonMeasurementSkills.length > 0) {
            const randomNonWater1 = nonWaterNonMeasurementSkills[Math.floor(Math.random() * nonWaterNonMeasurementSkills.length)];
            newSkills.push(randomNonWater1);
        }
        
        // 5. Fifth skill is another random non-water, non-measurement skill
        const remainingNonWaterNonMeasurementSkills = nonWaterNonMeasurementSkills.filter(skill => !newSkills.includes(skill));
        if (remainingNonWaterNonMeasurementSkills.length > 0) {
            const randomNonWater2 = remainingNonWaterNonMeasurementSkills[Math.floor(Math.random() * remainingNonWaterNonMeasurementSkills.length)];
            newSkills.push(randomNonWater2);
        }
        
        return newSkills;
    };

    const handleNewSkillSet = () => {
        setCurrentSkills(generateSkillSet(skillsData.skills));
        setExpandedSkill(null);
        setTimeRemaining(30 * 60);
        setIsTimerRunning(false);
        setStepEvaluations({});
        setSkillCompletionTimes({});
        setSkillStartTimes({});
        setVisitedSkills(new Set());
    };

    const toggleTimer = () => {
        setIsTimerRunning(!isTimerRunning);
    };

    const resetTimer = () => {
        setTimeRemaining(30 * 60);
        setIsTimerRunning(false);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const toggleSkillExpansion = (skillId) => {
        if (expandedSkill !== skillId) {
            const currentTime = 30 * 60 - timeRemaining;
            setSkillStartTimes(prev => ({
                ...prev,
                [skillId]: currentTime
            }));
            
            // Mark skill as visited when expanded
            setVisitedSkills(prev => new Set(prev).add(skillId));
            
            // Scroll to top of newly expanded skill
            setTimeout(() => {
                const skillElement = document.querySelector(`[data-skill-id="${skillId}"]`);
                if (skillElement) {
                    skillElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 100);
        }
        setExpandedSkill(expandedSkill === skillId ? null : skillId);
    };

    const completeSkill = (skillId) => {
        const currentTime = 30 * 60 - timeRemaining;
        const startTime = skillStartTimes[skillId] || 0;
        const duration = currentTime - startTime;
        
        setSkillCompletionTimes(prev => ({
            ...prev,
            [skillId]: duration
        }));

        const currentIndex = currentSkills.findIndex(skill => skill.id === skillId);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < currentSkills.length) {
            const nextSkillId = currentSkills[nextIndex].id;
            setSkillStartTimes(prev => ({
                ...prev,
                [nextSkillId]: currentTime
            }));
            
            // Open next skill but don't close current one
            setExpandedSkill(nextSkillId);
            
            // Scroll to show the completed skill at the top
            setTimeout(() => {
                const completedSkillElement = document.querySelector(`[data-skill-id="${skillId}"]`);
                if (completedSkillElement) {
                    completedSkillElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 200);
        } else {
            setExpandedSkill(null);
        }
    };

    const handleStepEvaluation = (skillId, stepIndex, evaluation) => {
        // Auto-start timer on first step evaluation
        if (!isTimerRunning) {
            setIsTimerRunning(true);
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

    const getSkillTypeIcon = (skill) => {
        if (skill.isWaterSkill) return <DropletsIcon />;
        if (skill.isMeasurementSkill) return <AwardIcon />;
        return null;
    };

    const getSkillTypeLabel = (skill) => {
        const types = [];
        if (skill.isWaterSkill) types.push("Water");
        if (skill.isMeasurementSkill) types.push("Measurement");
        return types.join(" • ");
    };

    return (
        <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">CNA Skills Practice</h1>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Practice set of 5 skills • 30 minute time limit</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        {/* Timer */}
                        <div className="flex items-center justify-between sm:justify-start gap-2 bg-gray-100 rounded-lg p-3 order-2 sm:order-1">
                            <div className="flex items-center gap-2">
                                <ClockIcon />
                                <span className={`text-lg sm:text-xl font-mono font-bold ${timeRemaining <= 300 ? 'text-red-600' : 'text-gray-800'}`}>
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
                </div>

                {/* Skills List */}
                <div className="space-y-3 sm:space-y-4">
                    {currentSkills.map((skill, index) => {
                        const isCompleted = skillCompletionTimes[skill.id] !== undefined;
                        const completionTime = skillCompletionTimes[skill.id];
                        
                        return (
                            <div key={skill.id} data-skill-id={skill.id} className={`border border-gray-200 rounded-lg overflow-hidden ${
                                expandedSkill === skill.id 
                                    ? 'current-skill' 
                                    : visitedSkills.has(skill.id) 
                                        ? 'visited-skill' 
                                        : ''
                            }`}>
                                {/* Skill Header */}
                                <button
                                    onClick={() => toggleSkillExpansion(skill.id)}
                                    className="w-full p-3 sm:p-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-sm flex-shrink-0 ${
                                            isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {isCompleted ? <CheckCircleIcon /> : index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">{skill.title}</h3>
                                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{skill.category}</span>
                                                <div className="flex items-center gap-1 text-blue-500">
                                                    {getSkillTypeIcon(skill)}
                                                    {getSkillTypeLabel(skill) && <span className="text-gray-500 hidden sm:inline">{getSkillTypeLabel(skill)}</span>}
                                                </div>
                                                {isCompleted && (
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                                        Completed in {formatDuration(completionTime)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        {expandedSkill === skill.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                    </div>
                                </button>

                                {/* Expanded Steps */}
                                {expandedSkill === skill.id && (
                                    <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Steps:</h4>
                                        <div className="space-y-2">
                                            {skill.steps.map((step, stepIndex) => {
                                                const evaluation = getStepEvaluation(skill.id, stepIndex);
                                                
                                                return (
                                                    <div
                                                        key={stepIndex}
                                                        className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 rounded-lg border ${
                                                            step.critical 
                                                                ? evaluation === 'good' 
                                                                    ? 'bg-green-50 border-green-200' 
                                                                    : evaluation === 'wrong' 
                                                                        ? 'bg-red-50 border-red-200'
                                                                        : 'critical-step-default'
                                                                : 'bg-white border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                                                                step.critical 
                                                                    ? evaluation === 'good'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : evaluation === 'wrong'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : 'critical-step-number-default'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {stepIndex + 1}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm ${
                                                                    step.critical 
                                                                        ? evaluation === 'good'
                                                                            ? 'text-green-900'
                                                                            : evaluation === 'wrong'
                                                                                ? 'text-red-900'
                                                                                : 'text-gray-800'
                                                                        : 'text-gray-800'
                                                                } leading-relaxed`}>
                                                                    {step.description}
                                                                </p>
                                                                {step.critical && (
                                                                    <div className="flex items-center gap-1 mt-2">
                                                                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                                                                            evaluation === 'good'
                                                                                ? 'bg-green-200 text-green-800'
                                                                                : evaluation === 'wrong'
                                                                                    ? 'bg-red-200 text-red-800'
                                                                                    : 'bg-yellow-200 text-gray-700'
                                                                        }`}>
                                                                            CRITICAL STEP
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Evaluation buttons */}
                                                        <div className="flex gap-1 justify-center sm:justify-start sm:ml-2 flex-shrink-0">
                                                            <button
                                                                onClick={() => handleStepEvaluation(skill.id, stepIndex, 'good')}
                                                                className={`p-2 sm:p-1 rounded transition-colors ${
                                                                    evaluation === 'good' ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                                                                }`}
                                                                title="Good"
                                                            >
                                                                <CheckIcon />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStepEvaluation(skill.id, stepIndex, 'skipped')}
                                                                className={`p-2 sm:p-1 rounded transition-colors ${
                                                                    evaluation === 'skipped' ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-yellow-50 text-gray-400 hover:text-yellow-600'
                                                                }`}
                                                                title="Skipped"
                                                            >
                                                                <MinusIcon />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStepEvaluation(skill.id, stepIndex, 'wrong')}
                                                                className={`p-2 sm:p-1 rounded transition-colors ${
                                                                    evaluation === 'wrong' ? 'bg-red-100 text-red-700' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                                                                }`}
                                                                title="Wrong"
                                                            >
                                                                <XIcon />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {/* Complete Skill Button */}
                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                            <button
                                                onClick={() => completeSkill(skill.id)}
                                                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                                            >
                                                <CheckCircleIcon />
                                                Complete Skill
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                        <ClockIcon />
                        <span className="font-semibold text-sm sm:text-base">Test Information</span>
                    </div>
                    <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                        <li>• Total time limit: 30 minutes for all 5 skills</li>
                        <li>• Hand Hygiene is always performed first</li>
                        <li>• Critical steps must be performed correctly</li>
                        <li>• Tap any skill above to view detailed steps</li>
                        <li>• Use buttons to mark each step: ✓ Good, - Skipped, ✗ Wrong</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const App = CNASkillsApp;
export default App;