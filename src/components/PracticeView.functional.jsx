import React from 'react';
import ChevronDownIcon from '../data/icons/ChevronDownIcon.jsx';
import ChevronUpIcon from '../data/icons/ChevronUpIcon.jsx';
import CheckIcon from '../data/icons/CheckIcon.jsx';
import XIcon from '../data/icons/XIcon.jsx';
import MinusIcon from '../data/icons/MinusIcon.jsx';
import CheckCircleIcon from '../data/icons/CheckCircleIcon.jsx';
import AwardIcon from '../data/icons/AwardIcon.jsx';

const PracticeView = ({ 
    currentSkills, 
    expandedSkill,
    toggleSkillExpansion,
    getSkillTypeIcon,
    getSkillTypeLabel,
    getStepEvaluation,
    handleStepEvaluation,
    skillCompletionTimes,
    formatDuration,
    visitedSkills,
    completeSkill,
    allSkillsCompleted,
    timeRemaining,
    formatTime,
    handleNewSkillSet,
    shareResults,
    resetTimer,
    hasSkillCriticalFailures,
    contentData
}) => {
    if (!currentSkills || currentSkills.length === 0) {
        return <div>No skills loaded for practice</div>;
    }

    return (
        <>
            {/* Skills List */}
            <div className="space-y-3 sm:space-y-4">
                {currentSkills.map((skill, index) => {
                    const isCompleted = skillCompletionTimes[skill.id] !== undefined;
                    const completionTime = skillCompletionTimes[skill.id];
                    const hasCriticalFailures = isCompleted && hasSkillCriticalFailures && hasSkillCriticalFailures(skill);
                    
                    return (
                        <div key={skill.id} data-skill-id={skill.id} className={`skill-card ${
                            expandedSkill === skill.id 
                                ? 'current-skill' 
                                : visitedSkills.has && visitedSkills.has(skill.id) 
                                    ? 'visited-skill' 
                                    : ''
                        }`}>
                            {/* Skill Header */}
                            <button
                                onClick={() => toggleSkillExpansion(skill.id)}
                                className="skill-card-header"
                            >
                                <div className="flex-center-gap-3 min-w-0 flex-1">
                                    <div className={
                                        isCompleted 
                                            ? hasCriticalFailures 
                                                ? 'skill-number-failed' 
                                                : 'skill-number-completed'
                                            : 'skill-number-practice'
                                    }>
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
                                            <span className="category-tag">{skill.category}</span>
                                            <div className="flex-center gap-1 text-blue-500">
                                                {getSkillTypeIcon(skill)}
                                                {getSkillTypeLabel(skill) && <span className="text-gray-500 hidden sm:inline">{getSkillTypeLabel(skill)}</span>}
                                            </div>
                                            {isCompleted && (
                                                <span className={hasCriticalFailures ? 'completion-badge-failure' : 'completion-badge-success'}>
                                                    Completed in {formatDuration(completionTime)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-center-gap-2 flex-shrink-0 ml-2">
                                    {expandedSkill === skill.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                </div>
                            </button>

                            {/* Expanded Steps */}
                            {expandedSkill === skill.id && (
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
                                                        <div className={`flex-center-justify w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
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
                                                                <div className="flex-center gap-1 mt-2">
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
                                                            className={`eval-button-good ${
                                                                evaluation === 'good' ? 'active' : 'inactive'
                                                            }`}
                                                            title="Good"
                                                        >
                                                            <CheckIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStepEvaluation(skill.id, stepIndex, 'skipped')}
                                                            className={`eval-button-skipped ${
                                                                evaluation === 'skipped' ? 'active' : 'inactive'
                                                            }`}
                                                            title="Skipped"
                                                        >
                                                            <MinusIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStepEvaluation(skill.id, stepIndex, 'wrong')}
                                                            className={`eval-button-wrong ${
                                                                evaluation === 'wrong' ? 'active' : 'inactive'
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
                                            className="w-full sm:w-auto btn-success flex-center-justify-gap-2 font-medium"
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
                    <div className="flex-center-gap-2 text-green-800 mb-4">
                        <AwardIcon />
                        <span className="font-bold text-lg sm:text-xl">Test Completed!</span>
                    </div>
                    
                    <div className="text-center mb-4">
                        <div className="text-lg font-semibold text-gray-800">Total Time Used</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatTime(30 * 60 - timeRemaining)}
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Individual Results</h4>
                        <div className="space-y-2">
                            {currentSkills.map((skill, index) => {
                                const completionTime = skillCompletionTimes[skill.id];
                                const hasFailed = hasSkillCriticalFailures && hasSkillCriticalFailures(skill);
                                return (
                                    <div key={skill.id} className="result-item">
                                        <div className="result-item-left">
                                            <div className={`result-dot ${
                                                hasFailed ? 'failed' : 'passed'
                                            }`}></div>
                                            <span className="result-item-title">
                                                {index + 1}. {skill.title}
                                            </span>
                                        </div>
                                        <div className="result-item-right">
                                            <div className="result-time">
                                                {formatDuration(completionTime)}
                                            </div>
                                            <div className={`result-status ${
                                                hasFailed ? 'failed' : 'passed'
                                            }`}>
                                                {hasFailed ? 'NEEDS REVIEW' : 'PASSED'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <div className={`flex flex-col items-center px-3 py-2 rounded-lg text-lg font-bold mt-4 mb-4 ${
                            currentSkills.filter(skill => hasSkillCriticalFailures && hasSkillCriticalFailures(skill)).length > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                        }`}>
                            <div>
                                {currentSkills.filter(skill => hasSkillCriticalFailures && hasSkillCriticalFailures(skill)).length > 0
                                    ? 'PRACTICE TEST NOT PASSED'
                                    : 'PRACTICE TEST PASSED'
                                }
                            </div>
                            <div className="text-base mt-1">
                                {currentSkills.filter(skill => hasSkillCriticalFailures && hasSkillCriticalFailures(skill)).length > 0
                                    ? 'Review Critical Steps'
                                    : 'Great Job!'
                                }
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleNewSkillSet}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={shareResults}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Share Results
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Box */}
            {!allSkillsCompleted && (
                <div className="mt-6 info-box info-box-blue">
                    <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">{contentData.practice.rules.title}</h4>
                    <ul className="text-sm space-y-1 list-disc ml-5 pl-0">
                        {contentData.practice.rules.items.map((rule, index) => (
                            <li key={index} className="pl-1">{rule}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default PracticeView;