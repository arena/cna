import React from 'react';
import AIEvaluator from './components/AIEvaluator';
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
                                                // Skip tips in practice test view
                                                if (step.tip) {
                                                    return null;
                                                }

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
                                                        // Handle tips differently
                                                        if (step.tip) {
                                                            return (
                                                                <div
                                                                    key={stepIndex}
                                                                    className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50 border-blue-200"
                                                                >
                                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 bg-blue-100 text-blue-700">
                                                                        💡
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                                                            <span className="font-bold">Tip:</span> {step.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

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
                                                {/* Skill Complete Button */}
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
                                                            Skill Complete
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
                                                    {skill.steps.map((step, stepIndex) => {
                                                        // Handle tips differently
                                                        if (step.tip) {
                                                            return (
                                                                <div
                                                                    key={stepIndex}
                                                                    className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50 border-blue-200"
                                                                >
                                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 bg-blue-100 text-blue-700">
                                                                        💡
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                                                            <span className="font-bold">Tip:</span> {step.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        return (
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
                                                        );
                                                    })}
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
                                                                                // Handle tips differently
                                                                                if (step.tip) {
                                                                                    return (
                                                                                        <div
                                                                                            key={stepIndex}
                                                                                            className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50 border-blue-200"
                                                                                        >
                                                                                            <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 bg-blue-100 text-blue-700">
                                                                                                💡
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                                                                                    <span className="font-bold">Tip:</span> {step.description}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                }

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
                                                                        {/* Skill Complete Button */}
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
                                                                                    Skill Complete
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
                                                                            {skill.steps.map((step, stepIndex) => {
                                                                                // Handle tips differently
                                                                                if (step.tip) {
                                                                                    return (
                                                                                        <div
                                                                                            key={stepIndex}
                                                                                            className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50 border-blue-200"
                                                                                        >
                                                                                            <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 bg-blue-100 text-blue-700">
                                                                                                💡
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                                                                                    <span className="font-bold">Tip:</span> {step.description}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                }

                                                                                return (
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
                                                                                );
                                                                            })}
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
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{contentData.about.title}</h2>
                            
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.who.title}</h3>
                                    <p className="text-sm leading-relaxed mb-3">
                                        {contentData.about.sections.who.text}
                                    </p>
                                    <p className="text-sm text-gray-700 mb-3">
                                        {contentData.about.sections.who.share_prompt}
                                    </p>
                                    <button
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: contentData.share.app.title,
                                                    text: contentData.share.app.description,
                                                    url: window.location.href
                                                });
                                            } else {
                                                navigator.clipboard.writeText(window.location.href).then(() => {
                                                    alert('Link copied to clipboard!');
                                                }).catch(() => {
                                                    prompt('Copy this link to share:', window.location.href);
                                                });
                                            }
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        <ShareIcon />
                                        Share App
                                    </button>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.why.title}</h3>
                                    <p className="text-sm leading-relaxed">
                                        {contentData.about.sections.why.text}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.usage.title}</h3>
                                    <ul className="text-sm space-y-1 ml-4">
                                        {contentData.about.sections.usage.items.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span><strong>{item.title}:</strong> {item.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.pricing.title}</h3>
                                    <p className="text-sm leading-relaxed">
                                        {contentData.about.sections.pricing.text}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.feedback.title}</h3>
                                    <p className="text-sm leading-relaxed mb-3">
                                        {contentData.about.sections.feedback.text}
                                    </p>
                                    <a
                                        href={contentData.links.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                    >
                                        📝 GitHub Repo
                                    </a>
                                </div>

                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h3 className="font-semibold text-yellow-800 mb-2">{contentData.about.sections.disclaimer.title}</h3>
                                    <p className="text-sm leading-relaxed text-yellow-800">
                                        {contentData.about.sections.disclaimer.text}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        <span className="italic">{contentData.about.sections.footer.text}</span> 💙
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const App = CNASkillsApp;
export default App;