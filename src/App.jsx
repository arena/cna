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

const ShareIcon = () => (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
);

// Main App Component
const CNASkillsApp = () => {
    const [currentView, setCurrentView] = React.useState('practice'); // 'practice' or 'browser'
    const [skillsOrganization, setSkillsOrganization] = React.useState('number'); // 'number' or 'type'
    const [currentSkills, setCurrentSkills] = React.useState([]);
    const [expandedSkill, setExpandedSkill] = React.useState(null);
    const [timeRemaining, setTimeRemaining] = React.useState(30 * 60);
    const [isTimerRunning, setIsTimerRunning] = React.useState(false);
    const [stepEvaluations, setStepEvaluations] = React.useState({});
    const [skillCompletionTimes, setSkillCompletionTimes] = React.useState({});
    const [skillStartTimes, setSkillStartTimes] = React.useState({});
    const [visitedSkills, setVisitedSkills] = React.useState(new Set());
    
    // Individual skill practice mode state
    const [practiceMode, setPracticeMode] = React.useState(null); // skillId when in practice mode
    const [practiceTime, setPracticeTime] = React.useState(0);
    const [isPracticeRunning, setIsPracticeRunning] = React.useState(false);
    const [practiceStepEvaluations, setPracticeStepEvaluations] = React.useState({});
    const [practiceCompleted, setPracticeCompleted] = React.useState(false);

    // Initialize with random skills on mount
    React.useEffect(() => {
        setCurrentSkills(generateSkillSet(skillsData.skills));
    }, []);

    // Check if all skills are completed
    const allSkillsCompleted = currentSkills.length > 0 && currentSkills.every(skill => skillCompletionTimes[skill.id] !== undefined);

    // Timer effect
    React.useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeRemaining > 0 && !allSkillsCompleted) {
            interval = setInterval(() => {
                setTimeRemaining(timeRemaining => timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining === 0 || allSkillsCompleted) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeRemaining, allSkillsCompleted]);

    // Practice mode timer effect
    React.useEffect(() => {
        let interval = null;
        if (isPracticeRunning && !practiceCompleted) {
            interval = setInterval(() => {
                setPracticeTime(time => time + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPracticeRunning, practiceCompleted]);

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
        setStepEvaluations({});
        setSkillCompletionTimes({});
        setSkillStartTimes({});
        setVisitedSkills(new Set());
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

    // Practice mode functions
    const startPractice = (skillId) => {
        setPracticeMode(skillId);
        setPracticeTime(0);
        setIsPracticeRunning(true);
        setPracticeStepEvaluations({});
        setPracticeCompleted(false);
    };

    const resetPractice = () => {
        setPracticeTime(0);
        setIsPracticeRunning(true);
        setPracticeStepEvaluations({});
        setPracticeCompleted(false);
        
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

    const stopPractice = () => {
        setPracticeMode(null);
        setPracticeTime(0);
        setIsPracticeRunning(false);
        setPracticeStepEvaluations({});
        setPracticeCompleted(false);
    };

    const completePractice = () => {
        setIsPracticeRunning(false);
        setPracticeCompleted(true);
    };

    const handlePracticeStepEvaluation = (skillId, stepIndex, evaluation) => {
        // Auto-start practice timer on first step evaluation
        if (!isPracticeRunning && !practiceCompleted) {
            setIsPracticeRunning(true);
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

    const hasPracticeCriticalFailures = (skill) => {
        return skill.steps.some((step, stepIndex) => {
            if (!step.critical) return false;
            const evaluation = getPracticeStepEvaluation(skill.id, stepIndex);
            return evaluation === 'skipped' || evaluation === 'wrong';
        });
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

    const hasSkillCriticalFailures = (skill) => {
        return skill.steps.some((step, stepIndex) => {
            if (!step.critical) return false;
            const evaluation = getStepEvaluation(skill.id, stepIndex);
            return evaluation === 'skipped' || evaluation === 'wrong';
        });
    };

    const getSkillTypeIcon = (skill) => {
        if (skill.isWaterSkill) return <DropletsIcon />;
        if (skill.isMeasurementSkill) return <AwardIcon />;
        return null;
    };

    const getSkillCategoryIcon = (skill) => {
        const iconStyle = {
            width: '24px',
            height: '24px',
            color: '#2563eb', // blue-600
            filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(216deg) brightness(97%) contrast(97%)'
        };

        // Hand Hygiene
        if (skill.isAlwaysFirst) {
            return <img src="./icon-handwashing.svg" alt="Hand washing" style={iconStyle} />;
        }
        // Measurement skills
        if (skill.isMeasurementSkill) {
            // Urinary output
            if (skill.id === 'measures_urinary_output') {
                return <img src="./icon-output.svg" alt="Urinary output" style={iconStyle} />;
            }
            // All other vital signs (pulse, respirations, weight, BP)
            return <img src="./icon-vitals.svg" alt="Vital signs" style={iconStyle} />;
        }
        
        // Water skills
        if (skill.isWaterSkill) return <DropletsIcon />;
        
        // Mobility skills
        if (skill.category === "Mobility") {
            return (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                    <path d="m9 21-3-6 1.5-3.5L9 7l3 3.5L13.5 15l-3 6z"/>
                </svg>
            );
        }
        
        // Infection Control (PPE)
        if (skill.category === "Infection Control") {
            return (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M21 12a9 9 0 1 1-18 0"/>
                    <path d="M8 21l8-11"/>
                </svg>
            );
        }
        
        // Personal Care
        if (skill.category === "Personal Care") {
            return (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            );
        }
        
        // Default icon
        return (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        );
    };

    const getSkillTypeLabel = (skill) => {
        const types = [];
        if (skill.isWaterSkill) types.push("Water");
        if (skill.isMeasurementSkill) types.push("Measurement");
        return types.join(" • ");
    };

    const organizeSkillsByType = (skills) => {
        const organized = [];
        
        // 1. Hand Hygiene (always first)
        const handHygiene = skills.filter(skill => skill.isAlwaysFirst);
        if (handHygiene.length > 0) {
            organized.push({
                category: "Hand Hygiene",
                description: "Always performed first in any test",
                skills: handHygiene
            });
        }
        
        // 2. Measurement Skills (second skill in tests)
        const measurementSkills = skills.filter(skill => skill.isMeasurementSkill && !skill.isAlwaysFirst);
        if (measurementSkills.length > 0) {
            organized.push({
                category: "Measurement Skills",
                description: "One of these will be the second skill in practice tests",
                skills: measurementSkills
            });
        }
        
        // 3. Water Skills (excluding measurement skills)
        const waterSkills = skills.filter(skill => skill.isWaterSkill && !skill.isMeasurementSkill && !skill.isAlwaysFirst);
        if (waterSkills.length > 0) {
            organized.push({
                category: "Water Skills",
                description: "Personal care skills involving water",
                skills: waterSkills
            });
        }
        
        // 4. Mobility Skills
        const mobilitySkills = skills.filter(skill => skill.category === "Mobility");
        if (mobilitySkills.length > 0) {
            organized.push({
                category: "Mobility Skills",
                description: "Movement, positioning, and transfer skills",
                skills: mobilitySkills
            });
        }
        
        // 5. Infection Control
        const infectionControlSkills = skills.filter(skill => skill.category === "Infection Control");
        if (infectionControlSkills.length > 0) {
            organized.push({
                category: "Infection Control",
                description: "PPE and safety procedures",
                skills: infectionControlSkills
            });
        }
        
        // 6. Other Personal Care (non-water)
        const otherPersonalCare = skills.filter(skill => 
            skill.category === "Personal Care" && 
            !skill.isWaterSkill && 
            !skill.isMeasurementSkill &&
            !skill.isAlwaysFirst
        );
        if (otherPersonalCare.length > 0) {
            organized.push({
                category: "Personal Care",
                description: "Non-water personal care skills",
                skills: otherPersonalCare
            });
        }
        
        return organized;
    };

    const shareResults = async () => {
        const totalTime = formatDuration(30 * 60 - timeRemaining);
        const passedCount = currentSkills.filter(skill => !hasSkillCriticalFailures(skill)).length;
        const failedCount = currentSkills.filter(skill => hasSkillCriticalFailures(skill)).length;
        const overallStatus = failedCount > 0 ? 'PRACTICE TEST NOT PASSED - Review Critical Steps' : 'PRACTICE TEST PASSED - Great Job!';
        
        const skillDetails = currentSkills.map((skill, index) => {
            const completionTime = skillCompletionTimes[skill.id];
            const hasFailed = hasSkillCriticalFailures(skill);
            return `${index + 1}. ${skill.title}: ${formatDuration(completionTime)} ${hasFailed ? '(NEEDS REVIEW)' : '(PASSED)'}`;
        }).join('\n');

        const shareText = `🏥 CNA Skills Practice Test Results

📊 Overall: ${overallStatus}
⏱️ Total Time: ${totalTime} / 30:00
✅ Skills Passed: ${passedCount}
📝 Skills to Review: ${failedCount}

📋 Individual Results:
${skillDetails}

Practice at: ${window.location.href}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'CNA Skills Practice Results',
                    text: shareText
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    fallbackShare(shareText);
                }
            }
        } else {
            fallbackShare(shareText);
        }
    };

    const fallbackShare = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard!');
            }).catch(() => {
                promptShare(text);
            });
        } else {
            promptShare(text);
        }
    };

    const promptShare = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Results copied to clipboard!');
        } catch (err) {
            prompt('Copy your results:', text);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">CNA Skills Practice</h1>
                        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                            {currentView === 'practice' ? 'Practice set of 5 skills • 30 minute time limit' : 'All twenty-two CNA skills'}
                        </p>
                    </div>
                    {currentView === 'practice' && (
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
                        Practice Test
                    </button>
                    <button
                        onClick={() => setCurrentView('browser')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                            currentView === 'browser'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        All Skills
                    </button>
                </div>

                {/* Practice Test View */}
                {currentView === 'practice' && (
                    <>
                        {/* Skills List */}
                <div className="space-y-3 sm:space-y-4">
                    {currentSkills.map((skill, index) => {
                        const isCompleted = skillCompletionTimes[skill.id] !== undefined;
                        const completionTime = skillCompletionTimes[skill.id];
                        const hasCriticalFailures = isCompleted && hasSkillCriticalFailures(skill);
                        
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
                                            isCompleted 
                                                ? hasCriticalFailures 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {isCompleted 
                                                ? hasCriticalFailures 
                                                    ? <XIcon /> 
                                                    : <CheckCircleIcon />
                                                : index + 1
                                            }
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
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        hasCriticalFailures 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : 'bg-green-100 text-green-700'
                                                    }`}>
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
                                        {/* Supplies Needed Section */}
                                        {skill.suppliesNeeded && skill.suppliesNeeded.length > 0 && (
                                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                                                    Supplies Needed:
                                                </h4>
                                                <ul className="text-sm text-blue-700 space-y-1">
                                                    {skill.suppliesNeeded.map((supply, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <span className="text-blue-500 font-bold">•</span>
                                                            <span>{supply}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
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
                                                                            ? 'text-green-900 font-bold'
                                                                            : evaluation === 'wrong'
                                                                                ? 'text-red-900 font-bold'
                                                                                : 'text-gray-800 font-bold'
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

                {/* Results Summary - Show when all skills completed */}
                {allSkillsCompleted && (
                    <div className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800 mb-4">
                            <AwardIcon />
                            <span className="font-bold text-lg sm:text-xl">Test Completed!</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-700 mb-1">
                                    <ClockIcon />
                                    <span className="font-semibold">Total Time Used</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-800">
                                    {formatDuration(30 * 60 - timeRemaining)}
                                </span>
                                <span className="text-sm text-gray-600 ml-2">/ 30:00</span>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-700 mb-1">
                                    <AwardIcon />
                                    <span className="font-semibold">Skills Status</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium">
                                            {currentSkills.filter(skill => !hasSkillCriticalFailures(skill)).length} Passed
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-sm font-medium">
                                            {currentSkills.filter(skill => hasSkillCriticalFailures(skill)).length} To Review
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-800 mb-2">Individual Skill Times</h4>
                            <div className="space-y-2">
                                {currentSkills.map((skill, index) => {
                                    const completionTime = skillCompletionTimes[skill.id];
                                    const hasFailed = hasSkillCriticalFailures(skill);
                                    
                                    return (
                                        <div key={skill.id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">{index + 1}.</span>
                                                <span className="font-medium text-gray-800">{skill.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {hasFailed ? (
                                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">MISSED</span>
                                                ) : (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">PASSED</span>
                                                )}
                                                <span className={`font-mono font-medium ${hasFailed ? 'text-yellow-600' : 'text-gray-700'}`}>
                                                    {formatDuration(completionTime)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <div className={`inline-block px-4 py-2 rounded-lg font-bold text-lg mb-4 text-center ${
                                currentSkills.some(skill => hasSkillCriticalFailures(skill))
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {currentSkills.some(skill => hasSkillCriticalFailures(skill)) ? (
                                    <>
                                        PRACTICE TEST NOT PASSED
                                        <br className="sm:hidden" />
                                        <span className="hidden sm:inline"> - </span>
                                        Review Critical Steps
                                    </>
                                ) : (
                                    <>
                                        PRACTICE TEST PASSED
                                        <br className="sm:hidden" />
                                        <span className="hidden sm:inline"> - </span>
                                        Great Job!
                                    </>
                                )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={handleNewSkillSet}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                                    title="Try another practice test"
                                >
                                    <ShuffleIcon />
                                    Try Again
                                </button>
                                <button
                                    onClick={shareResults}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                    title="Share your test results"
                                >
                                    <ShareIcon />
                                    Share Results
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Box - Hide when test is completed */}
                {!allSkillsCompleted && (
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
                )}
                    </>
                )}

                {/* Skills Browser View */}
                {currentView === 'browser' && (
                    <>
                        {/* Organization Controls */}
                        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">Organize by:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSkillsOrganization('number')}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${
                                        skillsOrganization === 'number'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Skill Number
                                </button>
                                <button
                                    onClick={() => setSkillsOrganization('type')}
                                    className={`px-3 py-1 text-sm rounded transition-colors ${
                                        skillsOrganization === 'type'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    Skill Type
                                </button>
                            </div>
                        </div>

                        {/* Skills organized by number */}
                        {skillsOrganization === 'number' && (
                            <div className="space-y-3 sm:space-y-4">
                                {skillsData.skills
                                    .map((skill, index) => (
                            <div key={skill.id} data-skill-id={skill.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Skill Header */}
                                <button
                                    onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
                                    className="w-full p-3 sm:p-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-sm flex-shrink-0 bg-gray-100 text-gray-800">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">{skill.title}</h3>
                                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{skill.category}</span>
                                                <div className="flex items-center gap-1 text-blue-500">
                                                    {getSkillTypeIcon(skill)}
                                                    {getSkillTypeLabel(skill) && <span className="text-gray-500 hidden sm:inline">{getSkillTypeLabel(skill)}</span>}
                                                </div>
                                                {skill.estimatedTime && (
                                                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 font-medium">
                                                        Est: {formatDuration(skill.estimatedTime)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        {expandedSkill === skill.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                    </div>
                                </button>

                                {/* Expanded Content */}
                                {expandedSkill === skill.id && (
                                    <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
                                        {/* Supplies Needed Section */}
                                        {skill.suppliesNeeded && skill.suppliesNeeded.length > 0 && (
                                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                                                    Supplies Needed:
                                                </h4>
                                                <ul className="text-sm text-blue-700 space-y-1">
                                                    {skill.suppliesNeeded.map((supply, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <span className="text-blue-500 font-bold">•</span>
                                                            <span>{supply}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {/* Practice Mode */}
                                        {practiceMode === skill.id ? (
                                            <>
                                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-green-800 text-sm sm:text-base">
                                                            Practice Mode
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            <ClockIcon />
                                                            <span className="text-lg font-mono font-bold text-green-800">
                                                                {formatDuration(practiceTime)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={resetPractice}
                                                            className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                                                        >
                                                            Reset
                                                        </button>
                                                        <button
                                                            onClick={stopPractice}
                                                            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                                        >
                                                            Stop Practice
                                                        </button>
                                                    </div>
                                                </div>
                                                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Steps:</h4>
                                                <div className="space-y-2">
                                                    {skill.steps.map((step, stepIndex) => {
                                                        const evaluation = getPracticeStepEvaluation(skill.id, stepIndex);
                                                        
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
                                                                                    ? 'text-green-900 font-bold'
                                                                                    : evaluation === 'wrong'
                                                                                        ? 'text-red-900 font-bold'
                                                                                        : 'text-gray-800 font-bold'
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
                                                                        onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'good')}
                                                                        className={`p-2 sm:p-1 rounded transition-colors ${
                                                                            evaluation === 'good' ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                                                                        }`}
                                                                        title="Good"
                                                                    >
                                                                        <CheckIcon />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'skipped')}
                                                                        className={`p-2 sm:p-1 rounded transition-colors ${
                                                                            evaluation === 'skipped' ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-yellow-50 text-gray-400 hover:text-yellow-600'
                                                                        }`}
                                                                        title="Skipped"
                                                                    >
                                                                        <MinusIcon />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'wrong')}
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
                                                {/* Complete Practice Button */}
                                                <div className="mt-4 pt-3 border-t border-gray-200">
                                                    {practiceCompleted ? (
                                                        (() => {
                                                            const missedSteps = getPracticeMissedSteps(skill);
                                                            const hasCriticalFailures = hasPracticeCriticalFailures(skill);
                                                            const hasAnyMissedSteps = missedSteps.length > 0;

                                                            if (hasCriticalFailures) {
                                                                const criticalMissedSteps = missedSteps.filter(step => step.critical);
                                                                const criticalStepCount = criticalMissedSteps.length;
                                                                
                                                                return (
                                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                                        <div className="flex items-center gap-2 text-yellow-800 mb-2">
                                                                            <XIcon />
                                                                            <span className="font-bold">
                                                                                Critical Step{criticalStepCount > 1 ? 's' : ''} Missed
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-yellow-700 mb-2">
                                                                            Completed in {formatDuration(practiceTime)} 
                                                                            {skill.estimatedTime && (
                                                                                <span> (estimated {formatDuration(skill.estimatedTime)})</span>
                                                                            )}
                                                                        </p>
                                                                        <p className="text-sm text-yellow-700 mb-2">
                                                                            Review the critical step{criticalStepCount > 1 ? 's' : ''} that {criticalStepCount > 1 ? 'were' : 'was'} missed or performed incorrectly.
                                                                        </p>
                                                                        <button
                                                                            onClick={resetPractice}
                                                                            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
                                                                        >
                                                                            Try Again
                                                                        </button>
                                                                    </div>
                                                                );
                                                            } else if (hasAnyMissedSteps) {
                                                                return (
                                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                        <div className="flex items-center gap-2 text-blue-800 mb-2">
                                                                            <CheckCircleIcon />
                                                                            <span className="font-bold">Practice Completed</span>
                                                                        </div>
                                                                        <p className="text-sm text-blue-700 mb-2">
                                                                            Completed in {formatDuration(practiceTime)} 
                                                                            {skill.estimatedTime && (
                                                                                <span> (estimated {formatDuration(skill.estimatedTime)})</span>
                                                                            )}
                                                                        </p>
                                                                        <p className="text-sm text-blue-700 mb-2">
                                                                            Some steps need review - consider practicing again.
                                                                        </p>
                                                                        <button
                                                                            onClick={resetPractice}
                                                                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                                                        >
                                                                            Practice Again
                                                                        </button>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                                        <div className="flex items-center gap-2 text-green-800 mb-2">
                                                                            <CheckCircleIcon />
                                                                            <span className="font-bold">Excellent Work!</span>
                                                                        </div>
                                                                        <p className="text-sm text-green-700 mb-2">
                                                                            Completed in {formatDuration(practiceTime)} 
                                                                            {skill.estimatedTime && (
                                                                                <span> (estimated {formatDuration(skill.estimatedTime)})</span>
                                                                            )}
                                                                        </p>
                                                                        <p className="text-sm text-green-700 mb-2">
                                                                            All steps performed correctly!
                                                                        </p>
                                                                        <button
                                                                            onClick={resetPractice}
                                                                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                                                        >
                                                                            Practice Again
                                                                        </button>
                                                                    </div>
                                                                );
                                                            }
                                                        })()
                                                    ) : (
                                                        <button
                                                            onClick={completePractice}
                                                            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                                                        >
                                                            <CheckCircleIcon />
                                                            Complete Practice
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="mb-4 flex justify-between items-center">
                                                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Steps:</h4>
                                                    <button
                                                        onClick={() => startPractice(skill.id)}
                                                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs flex items-center gap-1"
                                                    >
                                                        <PlayIcon />
                                                        Practice
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {skill.steps.map((step, stepIndex) => (
                                                        <div
                                                            key={stepIndex}
                                                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                                                                step.critical 
                                                                    ? 'critical-step-default'
                                                                    : 'bg-white border-gray-200'
                                                            }`}
                                                        >
                                                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                                                                step.critical 
                                                                    ? 'critical-step-number-default'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                                {stepIndex + 1}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm ${
                                                                    step.critical 
                                                                        ? 'text-gray-800 font-bold'
                                                                        : 'text-gray-800'
                                                                } leading-relaxed`}>
                                                                    {step.description}
                                                                </p>
                                                                {step.critical && (
                                                                    <div className="flex items-center gap-1 mt-2">
                                                                        <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-200 text-gray-700">
                                                                            CRITICAL STEP
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                            </div>
                        )}

                        {/* Skills organized by type */}
                        {skillsOrganization === 'type' && (
                            <div className="space-y-6">
                                {organizeSkillsByType(skillsData.skills).map((group, groupIndex) => (
                                    <div key={groupIndex}>
                                        {/* Category Header */}
                                        <div className="mb-3">
                                            <h3 className="text-lg font-semibold text-gray-800">{group.category}</h3>
                                            <p className="text-sm text-gray-600">{group.description}</p>
                                        </div>
                                        
                                        {/* Skills in this category */}
                                        <div className="space-y-3">
                                            {group.skills.map((skill) => {
                                                const skillIndex = skillsData.skills.findIndex(s => s.id === skill.id);
                                                return (
                                                    <div key={skill.id} data-skill-id={skill.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                        {/* Skill Header */}
                                                        <button
                                                            onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
                                                            className="w-full p-3 sm:p-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 bg-blue-50 text-blue-600">
                                                                    {getSkillCategoryIcon(skill)}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">{skill.title}</h3>
                                                                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                                                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{skill.category}</span>
                                                                        <div className="flex items-center gap-1 text-blue-500">
                                                                            {getSkillTypeIcon(skill)}
                                                                            {getSkillTypeLabel(skill) && <span className="text-gray-500 hidden sm:inline">{getSkillTypeLabel(skill)}</span>}
                                                                        </div>
                                                                        {skill.estimatedTime && (
                                                                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 font-medium">
                                                                                Est: {formatDuration(skill.estimatedTime)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                                                {expandedSkill === skill.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                            </div>
                                                        </button>

                                                        {/* Expanded Content */}
                                                        {expandedSkill === skill.id && (
                                                            <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
                                                                {/* Supplies Needed Section */}
                                                                {skill.suppliesNeeded && skill.suppliesNeeded.length > 0 && (
                                                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                                        <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                                                                            Supplies Needed:
                                                                        </h4>
                                                                        <ul className="text-sm text-blue-700 space-y-1">
                                                                            {skill.suppliesNeeded.map((supply, index) => (
                                                                                <li key={index} className="flex items-start gap-2">
                                                                                    <span className="text-blue-500 font-bold">•</span>
                                                                                    <span>{supply}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {/* Practice Mode */}
                                                                {practiceMode === skill.id ? (
                                                                    <>
                                                                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <h4 className="font-semibold text-green-800 text-sm sm:text-base">
                                                                                    Practice Mode
                                                                                </h4>
                                                                                <div className="flex items-center gap-2">
                                                                                    <ClockIcon />
                                                                                    <span className="text-lg font-mono font-bold text-green-800">
                                                                                        {formatDuration(practiceTime)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    onClick={resetPractice}
                                                                                    className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                                                                                >
                                                                                    Reset
                                                                                </button>
                                                                                <button
                                                                                    onClick={stopPractice}
                                                                                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                                                                >
                                                                                    Stop Practice
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Steps:</h4>
                                                                        <div className="space-y-2">
                                                                            {skill.steps.map((step, stepIndex) => {
                                                                                const evaluation = getPracticeStepEvaluation(skill.id, stepIndex);
                                                                                
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
                                                                                                            ? 'text-green-900 font-bold'
                                                                                                            : evaluation === 'wrong'
                                                                                                                ? 'text-red-900 font-bold'
                                                                                                                : 'text-gray-800 font-bold'
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
                                                                                                onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'good')}
                                                                                                className={`p-2 sm:p-1 rounded transition-colors ${
                                                                                                    evaluation === 'good' ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                                                                                                }`}
                                                                                                title="Good"
                                                                                            >
                                                                                                <CheckIcon />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'skipped')}
                                                                                                className={`p-2 sm:p-1 rounded transition-colors ${
                                                                                                    evaluation === 'skipped' ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-yellow-50 text-gray-400 hover:text-yellow-600'
                                                                                                }`}
                                                                                                title="Skipped"
                                                                                            >
                                                                                                <MinusIcon />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'wrong')}
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
                                                                        {/* Complete Practice Button */}
                                                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                                                            {practiceCompleted ? (
                                                                                (() => {
                                                                                    const missedSteps = getPracticeMissedSteps(skill);
                                                                                    const hasCriticalFailures = hasPracticeCriticalFailures(skill);
                                                                                    const hasAnyMissedSteps = missedSteps.length > 0;

                                                                                    if (hasCriticalFailures) {
                                                                                        const criticalMissedSteps = missedSteps.filter(step => step.critical);
                                                                                        const criticalStepCount = criticalMissedSteps.length;
                                                                                        
                                                                                        return (
                                                                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                                                                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                                                                                                    <XIcon />
                                                                                                    <span className="font-bold">
                                                                                                        Critical Step{criticalStepCount > 1 ? 's' : ''} Missed
                                                                                                    </span>
                                                                                                </div>
                                                                                                <p className="text-sm text-yellow-700 mb-2">
                                                                                                    Completed in {formatDuration(practiceTime)} 
                                                                                                    {skill.estimatedTime && (
                                                                                                        <span> (estimated {formatDuration(skill.estimatedTime)})</span>
                                                                                                    )}
                                                                                                </p>
                                                                                                <p className="text-sm text-yellow-700 mb-2">
                                                                                                    Review the critical step{criticalStepCount > 1 ? 's' : ''} that {criticalStepCount > 1 ? 'were' : 'was'} missed or performed incorrectly.
                                                                                                </p>
                                                                                                <button
                                                                                                    onClick={resetPractice}
                                                                                                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
                                                                                                >
                                                                                                    Try Again
                                                                                                </button>
                                                                                            </div>
                                                                                        );
                                                                                    } else if (hasAnyMissedSteps) {
                                                                                        return (
                                                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                                                <div className="flex items-center gap-2 text-blue-800 mb-2">
                                                                                                    <CheckCircleIcon />
                                                                                                    <span className="font-bold">Practice Completed</span>
                                                                                                </div>
                                                                                                <p className="text-sm text-blue-700 mb-2">
                                                                                                    Completed in {formatDuration(practiceTime)} 
                                                                                                    {skill.estimatedTime && (
                                                                                                        <span> (estimated {formatDuration(skill.estimatedTime)})</span>
                                                                                                    )}
                                                                                                </p>
                                                                                                <p className="text-sm text-blue-700 mb-2">
                                                                                                    Some steps need review - consider practicing again.
                                                                                                </p>
                                                                                                <button
                                                                                                    onClick={resetPractice}
                                                                                                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                                                                                >
                                                                                                    Practice Again
                                                                                                </button>
                                                                                            </div>
                                                                                        );
                                                                                    } else {
                                                                                        return (
                                                                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                                                                <div className="flex items-center gap-2 text-green-800 mb-2">
                                                                                                    <CheckCircleIcon />
                                                                                                    <span className="font-bold">Excellent Work!</span>
                                                                                                </div>
                                                                                                <p className="text-sm text-green-700 mb-2">
                                                                                                    Completed in {formatDuration(practiceTime)} 
                                                                                                    {skill.estimatedTime && (
                                                                                                        <span> (estimated {formatDuration(skill.estimatedTime)})</span>
                                                                                                    )}
                                                                                                </p>
                                                                                                <p className="text-sm text-green-700 mb-2">
                                                                                                    All steps performed correctly!
                                                                                                </p>
                                                                                                <button
                                                                                                    onClick={resetPractice}
                                                                                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                                                                                >
                                                                                                    Practice Again
                                                                                                </button>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                })()
                                                                            ) : (
                                                                                <button
                                                                                    onClick={completePractice}
                                                                                    className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                                                                                >
                                                                                    <CheckCircleIcon />
                                                                                    Complete Practice
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="mb-4 flex justify-between items-center">
                                                                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Steps:</h4>
                                                                            <button
                                                                                onClick={() => startPractice(skill.id)}
                                                                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs flex items-center gap-1"
                                                                            >
                                                                                <PlayIcon />
                                                                                Practice
                                                                            </button>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {skill.steps.map((step, stepIndex) => (
                                                                                <div
                                                                                    key={stepIndex}
                                                                                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                                                                                        step.critical 
                                                                                            ? 'critical-step-default'
                                                                                            : 'bg-white border-gray-200'
                                                                                    }`}
                                                                                >
                                                                                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                                                                                        step.critical 
                                                                                            ? 'critical-step-number-default'
                                                                                            : 'bg-gray-100 text-gray-700'
                                                                                    }`}>
                                                                                        {stepIndex + 1}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className={`text-sm ${
                                                                                            step.critical 
                                                                                                ? 'text-gray-800 font-bold'
                                                                                                : 'text-gray-800'
                                                                                        } leading-relaxed`}>
                                                                                            {step.description}
                                                                                        </p>
                                                                                        {step.critical && (
                                                                                            <div className="flex items-center gap-1 mt-2">
                                                                                                <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-200 text-gray-700">
                                                                                                    CRITICAL STEP
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const App = CNASkillsApp;
export default App;