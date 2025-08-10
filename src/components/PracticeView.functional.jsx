import React from 'react';
import ChevronDownIcon from '../data/icons/ChevronDownIcon.jsx';
import ChevronUpIcon from '../data/icons/ChevronUpIcon.jsx';
import CheckIcon from '../data/icons/CheckIcon.jsx';
import XIcon from '../data/icons/XIcon.jsx';
import MinusIcon from '../data/icons/MinusIcon.jsx';
import CheckCircleIcon from '../data/icons/CheckCircleIcon.jsx';
import ClockIcon from '../data/icons/ClockIcon.jsx';
import ShuffleIcon from '../data/icons/ShuffleIcon.jsx';
import RotateIcon from '../data/icons/RotateIcon.jsx';

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
    resetTimer
}) => {
    if (!currentSkills || currentSkills.length === 0) {
        return <div>No skills loaded for practice</div>;
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {currentSkills.map((skill) => {
                const isExpanded = expandedSkill === skill.id;
                const isCompleted = skillCompletionTimes && skillCompletionTimes[skill.id] !== undefined;
                const isVisited = visitedSkills && Array.isArray(visitedSkills) && visitedSkills.includes(skill.id);

                return (
                    <div key={skill.id} className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
                        {/* Skill Header */}
                        <div
                            onClick={() => toggleSkillExpansion(skill.id)}
                            className={`p-4 cursor-pointer transition-colors ${
                                isCompleted 
                                    ? 'bg-green-50 border-green-200' 
                                    : isVisited 
                                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                                        : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    {/* Skill Number */}
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${
                                        isCompleted 
                                            ? 'bg-green-600' 
                                            : isVisited 
                                                ? 'bg-blue-600' 
                                                : 'bg-gray-400'
                                    }`}>
                                        {isCompleted ? <CheckIcon /> : skill.number}
                                    </div>
                                    
                                    {/* Skill Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold text-base sm:text-lg leading-tight ${
                                            isCompleted ? 'text-green-800' : 'text-gray-800'
                                        }`}>
                                            {skill.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                                {getSkillTypeIcon && getSkillTypeIcon(skill)}
                                                <span>{getSkillTypeLabel ? getSkillTypeLabel(skill) : 'Unknown'}</span>
                                            </div>
                                            <span className="text-gray-400 text-xs">•</span>
                                            <span className="text-xs text-gray-600">
                                                {skill.steps.length} steps
                                            </span>
                                            {skill.estimatedTime && (
                                                <>
                                                    <span className="text-gray-400 text-xs">•</span>
                                                    <span className="text-xs text-gray-600">
                                                        {Math.floor(skill.estimatedTime / 60)}:{(skill.estimatedTime % 60).toString().padStart(2, '0')}
                                                    </span>
                                                </>
                                            )}
                                            {skillCompletionTimes && skillCompletionTimes[skill.id] && formatDuration && (
                                                <>
                                                    <span className="text-gray-400 text-xs">•</span>
                                                    <span className="text-xs text-green-600 font-medium">
                                                        {formatDuration(skillCompletionTimes[skill.id])}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Expand/Collapse Icon */}
                                <div className="ml-2 flex-shrink-0">
                                    {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                </div>
                            </div>
                        </div>

                        {/* Expanded Skill Content */}
                        {isExpanded && (
                            <div className={`border-t-2 ${
                                isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
                            }`}>
                                <div className="p-4 space-y-4">
                                    {/* Steps List */}
                                    <div className="space-y-2">
                                        {skill.steps.map((step, stepIndex) => {
                                            const evaluation = getStepEvaluation ? getStepEvaluation(skill.id, step.id) : null;
                                            const isCritical = step.critical;
                                            
                                            return (
                                                <div
                                                    key={step.id}
                                                    className={`p-3 rounded-lg border-2 transition-colors ${
                                                        isCritical
                                                            ? evaluation === 'good'
                                                                ? 'bg-green-50 border-green-300'
                                                                : evaluation === 'skipped'
                                                                    ? 'bg-yellow-50 border-yellow-300'
                                                                    : evaluation === 'wrong'
                                                                        ? 'bg-red-50 border-red-300'
                                                                        : 'bg-yellow-50 border-yellow-300'
                                                            : 'bg-gray-50 border-gray-200'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Step Number */}
                                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                            isCritical
                                                                ? evaluation === 'good'
                                                                    ? 'bg-green-600 text-white'
                                                                    : evaluation === 'skipped'
                                                                        ? 'bg-yellow-600 text-white'
                                                                        : evaluation === 'wrong'
                                                                            ? 'bg-red-600 text-white'
                                                                            : 'bg-yellow-600 text-white'
                                                                : evaluation === 'good'
                                                                    ? 'bg-green-600 text-white'
                                                                    : evaluation === 'skipped'
                                                                        ? 'bg-yellow-600 text-white'
                                                                        : evaluation === 'wrong'
                                                                            ? 'bg-red-600 text-white'
                                                                            : 'bg-gray-400 text-white'
                                                        }`}>
                                                            {stepIndex + 1}
                                                        </div>
                                                        
                                                        {/* Step Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm leading-relaxed ${
                                                                evaluation === 'good' ? 'text-green-800' :
                                                                evaluation === 'skipped' ? 'text-yellow-800' :
                                                                evaluation === 'wrong' ? 'text-red-800' :
                                                                'text-gray-700'
                                                            } ${isCritical ? 'font-bold' : ''}`}>
                                                                {step.description}
                                                                {isCritical && (
                                                                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                        Critical
                                                                    </span>
                                                                )}
                                                            </p>
                                                            
                                                            {/* Step Action Buttons */}
                                                            {handleStepEvaluation && (
                                                                <div className="flex gap-1 justify-center sm:justify-start sm:ml-2 flex-shrink-0">
                                                                    <button
                                                                        onClick={() => handleStepEvaluation(skill.id, step.id, 'good')}
                                                                        className={`p-2 sm:p-1 rounded transition-colors ${
                                                                            evaluation === 'good' ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'
                                                                        }`}
                                                                        title="Good"
                                                                    >
                                                                        <CheckIcon />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStepEvaluation(skill.id, step.id, 'skipped')}
                                                                        className={`p-2 sm:p-1 rounded transition-colors ${
                                                                            evaluation === 'skipped' ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-yellow-50 text-gray-400 hover:text-yellow-600'
                                                                        }`}
                                                                        title="Skipped"
                                                                    >
                                                                        <MinusIcon />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStepEvaluation(skill.id, step.id, 'wrong')}
                                                                        className={`p-2 sm:p-1 rounded transition-colors ${
                                                                            evaluation === 'wrong' ? 'bg-red-100 text-red-700' : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                                                                        }`}
                                                                        title="Wrong"
                                                                    >
                                                                        <XIcon />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Complete Skill Button */}
                                    {(() => {
                                        const allStepsEvaluated = skill.steps.every(step => 
                                            getStepEvaluation && getStepEvaluation(skill.id, step.id) !== null
                                        );
                                        return allStepsEvaluated && !isCompleted && completeSkill && (
                                            <div className="pt-2 border-t border-gray-200">
                                                <button
                                                    onClick={() => completeSkill(skill.id)}
                                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircleIcon />
                                                    Complete Skill
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Results Summary - when all skills completed */}
            {allSkillsCompleted && (
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 space-y-4">
                    <div className="text-center">
                        <div className="text-green-800 font-bold text-xl mb-2">Practice Session Complete!</div>
                        <p className="text-gray-700">Great job completing all the skills in your practice set.</p>
                    </div>
                    
                    {timeRemaining !== undefined && formatTime && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-700 mb-1">
                                    <ClockIcon />
                                    <span className="font-semibold">Total Time Used</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatTime(30 * 60 - timeRemaining)}
                                    <span className="text-sm text-gray-600 ml-2">/ 30:00</span>
                                </div>
                            </div>
                            
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-700 mb-1">
                                    <CheckCircleIcon />
                                    <span className="font-semibold">Skills Status</span>
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                    {currentSkills.length}/{currentSkills.length}
                                    <span className="text-sm text-gray-600 ml-2">completed</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">Individual Skill Times</h4>
                        <div className="space-y-2">
                            {currentSkills.map((skill) => {
                                const completionTime = skillCompletionTimes && skillCompletionTimes[skill.id];
                                return (
                                    <div key={skill.id} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700">
                                            {skill.number}. {skill.title}
                                        </span>
                                        <span className="font-medium text-blue-600">
                                            {completionTime && formatDuration ? formatDuration(completionTime) : '--'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                        {shareResults && (
                            <button
                                onClick={shareResults}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Share Results
                            </button>
                        )}
                        {handleNewSkillSet && (
                            <div>
                                <button
                                    onClick={handleNewSkillSet}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 text-center space-y-2">
                {handleNewSkillSet && (
                    <button
                        onClick={handleNewSkillSet}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                        <ShuffleIcon />
                        New Skill Set
                    </button>
                )}
                {resetTimer && (
                    <div>
                        <button
                            onClick={resetTimer}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
                        >
                            <RotateIcon />
                            Reset Timer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PracticeView;