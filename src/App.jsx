import React from 'react';
import AIEvaluator from './components/AIEvaluator';
// import PracticeView from './components/PracticeView.simple';
import SkillsBrowserView from './components/SkillsBrowserView.simple';
import AboutView from './components/AboutView';
import skillsData from './data/skills_data.json';
import contentData from './content.yml';
import GlovesIcon from './data/icons/GlovesIcon.jsx';
import StockingsIcon from './data/icons/StockingsIcon.jsx';
import MobilityIcon from './data/icons/MobilityIcon.jsx';
import CareIcon from './data/icons/CareIcon.jsx';
import WaterIcon from './data/icons/WaterIcon.jsx';
import ClockIcon from './data/icons/ClockIcon.jsx';
import PlayIcon from './data/icons/PlayIcon.jsx';
import PauseIcon from './data/icons/PauseIcon.jsx';
import RotateIcon from './data/icons/RotateIcon.jsx';
import ShuffleIcon from './data/icons/ShuffleIcon.jsx';
import ChevronDownIcon from './data/icons/ChevronDownIcon.jsx';
import ChevronUpIcon from './data/icons/ChevronUpIcon.jsx';
import CheckIcon from './data/icons/CheckIcon.jsx';
import XIcon from './data/icons/XIcon.jsx';
import MinusIcon from './data/icons/MinusIcon.jsx';
import CheckCircleIcon from './data/icons/CheckCircleIcon.jsx';
import DropletsIcon from './data/icons/DropletsIcon.jsx';
import AwardIcon from './data/icons/AwardIcon.jsx';
import ShareIcon from './data/icons/ShareIcon.jsx';
import './App.css';


// Main App Component
const CNASkillsApp = () => {
    const [currentView, setCurrentView] = React.useState('practice'); // 'practice', 'browser', 'ai-eval', or 'about'
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

    // Initialize with random skills on mount
    React.useEffect(() => {
        setCurrentSkills(generateSkillSet(skillsData.skills));
    }, []);

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


    // Check if all skills are completed
    const allSkillsCompleted = currentSkills.length > 0 && currentSkills.every(skill => skillCompletionTimes[skill.id] !== undefined);

    // Timer effect
    React.useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeRemaining > -900 && !allSkillsCompleted) {
            interval = setInterval(() => {
                setTimeRemaining(timeRemaining => timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining <= -900 || allSkillsCompleted) {
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
    }, [transcript, aiEvalSkill, aiStepEvaluations]);

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

    const formatTime = (seconds) => {
        const isNegative = seconds < 0;
        const absoluteSeconds = Math.abs(seconds);
        const minutes = Math.floor(absoluteSeconds / 60);
        const remainingSeconds = absoluteSeconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        return isNegative ? `-${timeString}` : timeString;
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
        if (skill.isWaterSkill) return <WaterIcon />;
        
        // Mobility skills
        if (skill.category === "Mobility") {
            // Stocking skills
            if (skill.id === 'applies_antiembolic_stockings' || skill.title?.toLowerCase().includes('stocking')) {
                return <StockingsIcon />;
            }
            
            // Other mobility skills
            return <MobilityIcon />;
        }
        
        // Infection Control (PPE)
        if (skill.category === "Infection Control") {
            if (skill.title?.toLowerCase().includes('gloves')) {
                return <GlovesIcon />;
            }
            return <CareIcon />;
        }
        
        // Personal Care
        if (skill.category === "Personal Care") {
            return <CareIcon />;
        }
        
        // Default icon
        return <CareIcon />;
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

        const shareText = `${contentData.share.results.header}

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
                    title: contentData.share.results.title,
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
                    <div className="text-center p-8">
                        <h2 className="text-xl font-bold mb-4">Practice Mode</h2>
                        <p className="text-gray-600 mb-4">Practice view is temporarily simplified while we debug the extracted component.</p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                The practice functionality is being refactored. You can still use the Skills Browser to practice individual skills, 
                                or the AI Evaluator for voice-guided practice.
                            </p>
                        </div>
                    </div>
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
                    />
                )}

                {/* AI Eval View */}
                {currentView === 'ai-eval' && (
                    <AIEvaluator 
                        skillsData={skillsData}
                        contentData={contentData}
                        getSkillCategoryIcon={getSkillCategoryIcon}
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