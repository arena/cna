import React from 'react';
import ChevronDownIcon from '../data/icons/ChevronDownIcon.jsx';
import ChevronUpIcon from '../data/icons/ChevronUpIcon.jsx';
import PlayIcon from '../data/icons/PlayIcon.jsx';
import PauseIcon from '../data/icons/PauseIcon.jsx';
import ClockIcon from '../data/icons/ClockIcon.jsx';
import CheckIcon from '../data/icons/CheckIcon.jsx';
import XIcon from '../data/icons/XIcon.jsx';
import MinusIcon from '../data/icons/MinusIcon.jsx';

const SkillsBrowserView = ({
    skillsOrganization,
    setSkillsOrganization,
    lengthSortAscending,
    setLengthSortAscending,
    expandedSkill,
    setExpandedSkill,
    getSkillTypeIcon,
    getSkillTypeLabel,
    getSkillCategoryIcon,
    organizeSkillsByType,
    contentData,
    skillsData,
    // Practice mode props
    practiceMode,
    practiceTime,
    isPracticeRunning,
    practiceCompleted,
    startPractice,
    resetPractice,
    stopPractice,
    completePractice,
    handlePracticeStepEvaluation,
    getPracticeStepEvaluation,
    getPracticeMissedSteps,
    hasPracticeCriticalFailures,
    formatDuration,
    setIsPracticeRunning
}) => {
    
    const renderSkillCard = (skill, inCategory = false, index = 0) => {
        const isInPractice = practiceMode === skill.id;
        const isExpanded = expandedSkill === skill.id;
        
        return (
            <div key={skill.id} data-skill-id={skill.id} className="skill-card">
                {/* Skill Header */}
                <button
                    onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
                    className="skill-card-header"
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Skill Number or Icon */}
                        <div className="skill-number-default">
                            {inCategory ? getSkillCategoryIcon(skill) : index + 1}
                        </div>
                        
                        {/* Skill Info */}
                        <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
                                {inCategory && skill.title === "Hand Hygiene (Hand Washing)" ? "Hand Washing" : skill.title}
                                {isInPractice && (
                                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                                        In Practice
                                    </span>
                                )}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                                {!inCategory && (
                                    <>
                                        <span className="category-tag">{skill.category}</span>
                                        <div className="flex items-center gap-1 text-blue-500">
                                            {getSkillTypeIcon(skill)}
                                            {getSkillTypeLabel(skill) && <span className="text-gray-500 hidden sm:inline">{getSkillTypeLabel(skill)}</span>}
                                        </div>
                                    </>
                                )}
                                {skill.estimatedTime && (
                                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 font-medium">
                                        Est: {formatDuration(skill.estimatedTime)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </div>
                </button>

                {/* Expanded Skill Content */}
                {isExpanded && (
                    <div className="skill-card-content">
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
                        {isInPractice && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-green-800 text-sm sm:text-base">
                                        Practice Mode
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsPracticeRunning(!isPracticeRunning)}
                                            className="p-2 rounded hover:bg-green-100 transition-colors"
                                            title={isPracticeRunning ? "Pause Timer" : "Start Timer"}
                                        >
                                            {isPracticeRunning ? <PauseIcon /> : <PlayIcon />}
                                        </button>
                                        <ClockIcon />
                                        <span className="text-lg font-mono font-bold text-green-800">
                                            {formatDuration(practiceTime)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Steps:</h4>
                            {!isInPractice && (
                                <button
                                    onClick={() => startPractice(skill.id)}
                                    className="btn-practice"
                                >
                                    Practice Skill
                                </button>
                            )}
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

                                const evaluation = isInPractice ? getPracticeStepEvaluation(skill.id, stepIndex) : null;
                                
                                return (
                                    <div
                                        key={stepIndex}
                                        className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 rounded-lg border ${
                                            step.critical 
                                                ? evaluation === 'good' 
                                                    ? 'bg-green-50 border-green-200' 
                                                    : evaluation === 'skipped'
                                                        ? 'bg-yellow-50 border-yellow-200'
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
                                                        : evaluation === 'skipped'
                                                            ? 'bg-yellow-100 text-yellow-800'
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
                                                            : evaluation === 'skipped'
                                                                ? 'text-yellow-900 font-bold'
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
                                                                : evaluation === 'skipped'
                                                                    ? 'bg-yellow-200 text-yellow-800'
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
                                        {isInPractice && (
                                            <div className="flex gap-1 justify-center sm:justify-start sm:ml-2 flex-shrink-0">
                                                <button
                                                    onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'good')}
                                                    className={`eval-button-good ${
                                                        evaluation === 'good' ? 'active' : 'inactive'
                                                    }`}
                                                    title="Good"
                                                >
                                                    <CheckIcon />
                                                </button>
                                                <button
                                                    onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'skipped')}
                                                    className={`eval-button-skipped ${
                                                        evaluation === 'skipped' ? 'active' : 'inactive'
                                                    }`}
                                                    title="Skipped"
                                                >
                                                    <MinusIcon />
                                                </button>
                                                <button
                                                    onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'wrong')}
                                                    className={`eval-button-wrong ${
                                                        evaluation === 'wrong' ? 'active' : 'inactive'
                                                    }`}
                                                    title="Wrong"
                                                >
                                                    <XIcon />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Practice Controls */}
                        {isInPractice && (
                            <div className="mt-4 pt-3 border-t border-gray-200">
                                {!practiceCompleted && (
                                    <button
                                        onClick={completePractice}
                                        className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                                    >
                                        Skill Complete
                                    </button>
                                )}
                            
                                {practiceCompleted && (
                                <div className={`border rounded-lg p-4 ${(() => {
                                    const criticalSteps = skill.steps.filter(step => step.critical);
                                    const criticalStepsMarked = criticalSteps.filter((step, stepIndex) => {
                                        const actualStepIndex = skill.steps.findIndex(s => s === step);
                                        const evaluation = getPracticeStepEvaluation(skill.id, actualStepIndex);
                                        return evaluation === 'skipped' || evaluation === 'wrong';
                                    });
                                    
                                    return criticalStepsMarked.length > 0 
                                        ? "bg-yellow-50 border-yellow-200" 
                                        : "bg-green-50 border-green-200";
                                })()}`}>
                                    <div className="text-center">
                                        <div className="text-green-800 font-bold mb-2">Practice Complete!</div>
                                        <div className="text-sm text-green-700 mb-3">
                                            Time: {formatDuration(practiceTime)}
                                        </div>
                                        
                                        {/* Results Summary */}
                                        {(() => {
                                            const totalSteps = skill.steps.length;
                                            const goodSteps = skill.steps.filter((step, stepIndex) => 
                                                getPracticeStepEvaluation(skill.id, stepIndex) === 'good'
                                            ).length;
                                            const skippedSteps = skill.steps.filter((step, stepIndex) => 
                                                getPracticeStepEvaluation(skill.id, stepIndex) === 'skipped'
                                            ).length;
                                            const wrongSteps = skill.steps.filter((step, stepIndex) => 
                                                getPracticeStepEvaluation(skill.id, stepIndex) === 'wrong'
                                            ).length;
                                            const missedSteps = getPracticeMissedSteps(skill);
                                            const hasCriticalFailures = hasPracticeCriticalFailures(skill);
                                            
                                            // Check for critical step issues
                                            const criticalSteps = skill.steps.filter(step => step.critical);
                                            const criticalStepsMarked = criticalSteps.filter((step, stepIndex) => {
                                                const actualStepIndex = skill.steps.findIndex(s => s === step);
                                                const evaluation = getPracticeStepEvaluation(skill.id, actualStepIndex);
                                                return evaluation === 'skipped' || evaluation === 'wrong';
                                            });
                                            
                                            let summaryText, summaryColor, boxColor;
                                            if (criticalStepsMarked.length > 0) {
                                                summaryText = "Critical steps missed.";
                                                summaryColor = "text-yellow-800";
                                                boxColor = "bg-yellow-50 border-yellow-200";
                                            } else if (criticalSteps.length > 0) {
                                                summaryText = "Critical steps completed.";
                                                summaryColor = "text-green-700";
                                                boxColor = "bg-green-50 border-green-200";
                                            } else {
                                                summaryText = "Practice complete.";
                                                summaryColor = "text-green-700";
                                                boxColor = "bg-green-50 border-green-200";
                                            }
                                            
                                            return (
                                                <>
                                                    <div className={`text-sm font-medium mb-3 ${summaryColor}`}>
                                                        {summaryText}
                                                    </div>
                                                    
                                                </>
                                            );
                                        })()}
                                        
                                        <button
                                            onClick={resetPractice}
                                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Practice Again
                                        </button>
                                    </div>
                                </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Organization Controls */}
            <div className="organization-controls">
                <span className="organization-label">{contentData.browser.organize_by}:</span>
                <div className="nav-button-container">
                    <button
                        onClick={() => setSkillsOrganization('number')}
                        className={skillsOrganization === 'number' ? 'nav-button-active' : 'nav-button-inactive'}
                    >
                        {contentData.browser.by_number}
                    </button>
                    <button
                        onClick={() => setSkillsOrganization('type')}
                        className={skillsOrganization === 'type' ? 'nav-button-active' : 'nav-button-inactive'}
                    >
                        {contentData.browser.by_type}
                    </button>
                    <button
                        onClick={() => {
                            if (skillsOrganization === 'length') {
                                setLengthSortAscending(!lengthSortAscending);
                            } else {
                                setSkillsOrganization('length');
                            }
                        }}
                        className={skillsOrganization === 'length' ? 'nav-button-active' : 'nav-button-inactive'}
                    >
                        {contentData.browser.by_length}
                        {skillsOrganization === 'length' && (
                            <span className="ml-1">
                                {lengthSortAscending ? '↑' : '↓'}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Skills Display */}
            {skillsOrganization === 'number' ? (
                <div className="space-y-3 sm:space-y-4">
                    {skillsData.skills.map((skill, index) => renderSkillCard(skill, false, index))}
                </div>
            ) : skillsOrganization === 'length' ? (
                <div className="space-y-3 sm:space-y-4">
                    {[...skillsData.skills]
                        .sort((a, b) => {
                            const timeA = a.estimatedTime || 0;
                            const timeB = b.estimatedTime || 0;
                            return lengthSortAscending ? timeA - timeB : timeB - timeA;
                        })
                        .map((skill, index) => {
                            const originalIndex = skillsData.skills.findIndex(s => s.id === skill.id);
                            return renderSkillCard(skill, true, originalIndex);
                        })
                    }
                </div>
            ) : (
                /* Organize by Type */
                <div className="space-y-6">
                    {organizeSkillsByType(skillsData.skills).map((category) => (
                        <div key={category.type} className="skill-card category-section">
                            {/* Category Header */}
                            <div className="category-header">
                                <div className="flex items-center gap-3">
                                    <div className="text-blue-600" style={{transform: 'scale(1.5)'}}>
                                        {category.icon}
                                    </div>
                                    <h3 className="category-title">
                                        {category.category}
                                    </h3>
                                    <span className="category-count">
                                        ({category.category === contentData.categories.hand_hygiene.title ? contentData.categories.hand_hygiene.special_text : `${category.skills.length} ${category.skills.length === 1 ? 'skill' : 'skills'}`})
                                    </span>
                                </div>
                            </div>
                            
                            {/* Category Skills */}
                            <div className="category-skills-container">
                                {category.skills.map((skill, skillIndex) => {
                                    // Find the original index of this skill in the full skills array
                                    const originalIndex = skillsData.skills.findIndex(s => s.id === skill.id);
                                    return renderSkillCard(skill, true, originalIndex);
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default SkillsBrowserView;