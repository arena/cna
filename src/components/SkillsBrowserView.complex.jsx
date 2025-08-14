import React from 'react';
import ChevronDownIcon from '../data/icons/ChevronDownIcon.jsx';
import ChevronUpIcon from '../data/icons/ChevronUpIcon.jsx';
import ClockIcon from '../data/icons/ClockIcon.jsx';
import PlayIcon from '../data/icons/PlayIcon.jsx';
import CheckIcon from '../data/icons/CheckIcon.jsx';
import XIcon from '../data/icons/XIcon.jsx';
import MinusIcon from '../data/icons/MinusIcon.jsx';
import CheckCircleIcon from '../data/icons/CheckCircleIcon.jsx';

const SkillsBrowserView = ({
    // State variables
    skillsOrganization,
    setSkillsOrganization,
    expandedSkill,
    setExpandedSkill,
    practiceMode,
    practiceTime,
    practiceCompleted,
    practiceStepEvaluations,
    
    // Functions
    getSkillTypeIcon,
    getSkillTypeLabel,
    getSkillCategoryIcon,
    formatDuration,
    organizeSkillsByType,
    startPractice,
    resetPractice,
    stopPractice,
    completePractice,
    handlePracticeStepEvaluation,
    getPracticeStepEvaluation,
    getPracticeMissedSteps,
    hasPracticeCriticalFailures,
    
    // Data
    contentData,
    skillsData
}) => {
    return (
        <>
            {/* Organization Controls */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{contentData.browser.organize_by}:</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSkillsOrganization('number')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            skillsOrganization === 'number'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {contentData.browser.by_number}
                    </button>
                    <button
                        onClick={() => setSkillsOrganization('type')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            skillsOrganization === 'type'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {contentData.browser.by_type}
                    </button>
                </div>
            </div>

            {/* Skills Display */}
            {skillsOrganization === 'number' ? (
                <div className="space-y-3">
                    {skillsData.skills.map((skill) => (
                        <div key={skill.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Skill Header */}
                            <div
                                onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {/* Skill Number */}
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                                            {skill.number}
                                        </div>
                                        
                                        {/* Skill Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                                                {skill.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                                    {getSkillTypeIcon(skill)}
                                                    <span>{getSkillTypeLabel(skill)}</span>
                                                </div>
                                                <span className="text-gray-400 text-xs">•</span>
                                                <span className="text-xs text-gray-600">
                                                    {skill.steps.length} {contentData.browser.steps_text}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Expand/Collapse Icon */}
                                    <div className="ml-2 flex-shrink-0">
                                        {expandedSkill === skill.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Skill Content */}
                            {expandedSkill === skill.id && (
                                <div className="border-t border-gray-200">
                                    <div className="p-4 space-y-4">
                                        {/* Category Icon */}
                                        <div className="flex items-center justify-center p-4">
                                            <div className="text-blue-600" style={{transform: 'scale(3)'}}>
                                                {getSkillCategoryIcon(skill)}
                                            </div>
                                        </div>

                                        {/* Steps List */}
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-gray-800 mb-2">{contentData.browser.steps_heading}:</h4>
                                            {skill.steps.map((step, stepIndex) => {
                                                const evaluation = practiceMode === skill.id ? 
                                                    getPracticeStepEvaluation(skill.id, stepIndex) : 
                                                    null;
                                                
                                                return (
                                                    <div
                                                        key={step.id}
                                                        className={`p-3 rounded-lg border transition-colors ${
                                                            step.critical
                                                                ? evaluation === 'completed'
                                                                    ? 'bg-green-50 border-green-300'
                                                                    : evaluation === 'skipped'
                                                                        ? 'bg-yellow-50 border-yellow-300'
                                                                        : evaluation === 'missed'
                                                                            ? 'bg-red-50 border-red-300'
                                                                            : 'critical-step-default border-yellow-300'
                                                                : evaluation === 'completed'
                                                                    ? 'bg-green-50 border-green-300'
                                                                    : evaluation === 'skipped'
                                                                        ? 'bg-yellow-50 border-yellow-300'
                                                                        : evaluation === 'missed'
                                                                            ? 'bg-red-50 border-red-300'
                                                                            : 'bg-gray-50 border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {/* Step Number */}
                                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                                step.critical
                                                                    ? evaluation === 'completed'
                                                                        ? 'bg-green-600 text-white'
                                                                        : evaluation === 'skipped'
                                                                            ? 'bg-yellow-600 text-white'
                                                                            : evaluation === 'missed'
                                                                                ? 'bg-red-600 text-white'
                                                                                : 'critical-step-number-default text-yellow-800'
                                                                    : evaluation === 'completed'
                                                                        ? 'bg-green-600 text-white'
                                                                        : evaluation === 'skipped'
                                                                            ? 'bg-yellow-600 text-white'
                                                                            : evaluation === 'missed'
                                                                                ? 'bg-red-600 text-white'
                                                                                : 'bg-gray-400 text-white'
                                                            }`}>
                                                                {stepIndex + 1}
                                                            </div>
                                                            
                                                            {/* Step Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm leading-relaxed text-gray-700">
                                                                    {step.description}
                                                                    {step.critical && (
                                                                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            {contentData.browser.critical_text}
                                                                        </span>
                                                                    )}
                                                                </p>
                                                                
                                                                {/* Step Action Buttons - only show in practice mode */}
                                                                {practiceMode === skill.id && (
                                                                    <div className="flex gap-2 mt-2">
                                                                        <button
                                                                            onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'completed')}
                                                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                                evaluation === 'completed'
                                                                                    ? 'bg-green-600 text-white'
                                                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                            }`}
                                                                        >
                                                                            <CheckIcon />
                                                                            {contentData.browser.done_text}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'skipped')}
                                                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                                evaluation === 'skipped'
                                                                                    ? 'bg-yellow-600 text-white'
                                                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                            }`}
                                                                        >
                                                                            <MinusIcon />
                                                                            {contentData.browser.skip_text}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'missed')}
                                                                            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                                evaluation === 'missed'
                                                                                    ? 'bg-red-600 text-white'
                                                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                            }`}
                                                                        >
                                                                            <XIcon />
                                                                            {contentData.browser.miss_text}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Practice Controls */}
                                        <div className="pt-4 border-t border-gray-200">
                                            {practiceMode === skill.id ? (
                                                <div className="space-y-3">
                                                    {/* Practice Timer */}
                                                    <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-lg p-3">
                                                        <ClockIcon />
                                                        <span className="font-semibold text-blue-800">
                                                            {formatDuration(practiceTime)}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Practice Complete */}
                                                    {practiceCompleted && (
                                                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                            <div className="text-center">
                                                                <div className="text-green-800 font-bold mb-2">
                                                                    <CheckCircleIcon className="inline mr-2" />
                                                                    {contentData.browser.practice_complete}
                                                                </div>
                                                                <div className="text-sm text-green-700 mb-3">
                                                                    {contentData.browser.practice_complete_time}: {formatDuration(practiceTime)}
                                                                </div>
                                                                
                                                                {/* Show missed steps if any */}
                                                                {(() => {
                                                                    const missedSteps = getPracticeMissedSteps(skill);
                                                                    const hasCriticalFailures = hasPracticeCriticalFailures(skill);
                                                                    
                                                                    if (missedSteps.length > 0) {
                                                                        return (
                                                                            <div className={`text-sm p-2 rounded ${hasCriticalFailures ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                                <div className="font-semibold mb-1">
                                                                                    {hasCriticalFailures ? contentData.browser.critical_failures : contentData.browser.missed_steps}:
                                                                                </div>
                                                                                <ul className="list-disc list-inside text-xs space-y-1">
                                                                                    {missedSteps.map((step, index) => (
                                                                                        <li key={index}>{step}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Practice Action Buttons */}
                                                    <div className="flex gap-2">
                                                        {!practiceCompleted && (
                                                            <button
                                                                onClick={completePractice}
                                                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                                            >
                                                                {contentData.browser.finish_practice}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={stopPractice}
                                                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                                                        >
                                                            {practiceCompleted ? contentData.browser.close_practice : contentData.browser.stop_practice}
                                                        </button>
                                                        {practiceCompleted && (
                                                            <button
                                                                onClick={resetPractice}
                                                                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                                            >
                                                                {contentData.browser.try_again}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => startPractice(skill.id)}
                                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <PlayIcon />
                                                    {contentData.browser.practice_button}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {organizeSkillsByType(skillsData.skills).map((category) => (
                        <div key={category.type} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Category Header */}
                            <div className="bg-gray-50 p-4 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="text-blue-600" style={{transform: 'scale(1.5)'}}>
                                        {category.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {category.title}
                                    </h3>
                                    <span className="text-sm text-gray-600">
                                        ({category.title === contentData.categories.hand_hygiene.title ? contentData.categories.hand_hygiene.special_text : `${category.skills.length} ${category.skills.length === 1 ? 'skill' : contentData.browser.skills_count}`})
                                    </span>
                                </div>
                            </div>
                            
                            {/* Category Skills */}
                            <div className="p-4 space-y-3">
                                {category.skills.map((skill) => (
                                    <div key={skill.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Skill Header */}
                                        <div
                                            onClick={() => setExpandedSkill(expandedSkill === skill.id ? null : skill.id)}
                                            className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    {/* Skill Number */}
                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                                                        {skill.number}
                                                    </div>
                                                    
                                                    {/* Skill Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-800">
                                                            {skill.title}
                                                        </h4>
                                                        <span className="text-xs text-gray-600">
                                                            {skill.steps.length} {contentData.browser.steps_text}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {/* Expand/Collapse Icon */}
                                                <div className="ml-2 flex-shrink-0">
                                                    {expandedSkill === skill.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Skill Content (same as above) */}
                                        {expandedSkill === skill.id && (
                                            <div className="border-t border-gray-200">
                                                <div className="p-4 space-y-4">
                                                    {/* Steps List */}
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-gray-800 mb-2">{contentData.browser.steps_heading}:</h4>
                                                        {skill.steps.map((step, stepIndex) => {
                                                            const evaluation = practiceMode === skill.id ? 
                                                                getPracticeStepEvaluation(skill.id, stepIndex) : 
                                                                null;
                                                            
                                                            return (
                                                                <div
                                                                    key={step.id}
                                                                    className={`p-3 rounded-lg border transition-colors ${
                                                                        step.critical
                                                                            ? evaluation === 'completed'
                                                                                ? 'bg-green-50 border-green-300'
                                                                                : evaluation === 'skipped'
                                                                                    ? 'bg-yellow-50 border-yellow-300'
                                                                                    : evaluation === 'missed'
                                                                                        ? 'bg-red-50 border-red-300'
                                                                                        : 'critical-step-default border-yellow-300'
                                                                            : evaluation === 'completed'
                                                                                ? 'bg-green-50 border-green-300'
                                                                                : evaluation === 'skipped'
                                                                                    ? 'bg-yellow-50 border-yellow-300'
                                                                                    : evaluation === 'missed'
                                                                                        ? 'bg-red-50 border-red-300'
                                                                                        : 'bg-gray-50 border-gray-200'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        {/* Step Number */}
                                                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                                            step.critical
                                                                                ? evaluation === 'completed'
                                                                                    ? 'bg-green-600 text-white'
                                                                                    : evaluation === 'skipped'
                                                                                        ? 'bg-yellow-600 text-white'
                                                                                        : evaluation === 'missed'
                                                                                            ? 'bg-red-600 text-white'
                                                                                            : 'critical-step-number-default text-yellow-800'
                                                                                : evaluation === 'completed'
                                                                                    ? 'bg-green-600 text-white'
                                                                                    : evaluation === 'skipped'
                                                                                        ? 'bg-yellow-600 text-white'
                                                                                        : evaluation === 'missed'
                                                                                            ? 'bg-red-600 text-white'
                                                                                            : 'bg-gray-400 text-white'
                                                                        }`}>
                                                                            {stepIndex + 1}
                                                                        </div>
                                                                        
                                                                        {/* Step Content */}
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm leading-relaxed text-gray-700">
                                                                                {step.description}
                                                                                {step.critical && (
                                                                                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                                        {contentData.browser.critical_text}
                                                                                    </span>
                                                                                )}
                                                                            </p>
                                                                            
                                                                            {/* Step Action Buttons - only show in practice mode */}
                                                                            {practiceMode === skill.id && (
                                                                                <div className="flex gap-2 mt-2">
                                                                                    <button
                                                                                        onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'completed')}
                                                                                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                                            evaluation === 'completed'
                                                                                                ? 'bg-green-600 text-white'
                                                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                                        }`}
                                                                                    >
                                                                                        <CheckIcon />
                                                                                        {contentData.browser.done_text}
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'skipped')}
                                                                                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                                            evaluation === 'skipped'
                                                                                                ? 'bg-yellow-600 text-white'
                                                                                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                                                        }`}
                                                                                    >
                                                                                        <MinusIcon />
                                                                                        {contentData.browser.skip_text}
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handlePracticeStepEvaluation(skill.id, stepIndex, 'missed')}
                                                                                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                                                                            evaluation === 'missed'
                                                                                                ? 'bg-red-600 text-white'
                                                                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                                        }`}
                                                                                    >
                                                                                        <XIcon />
                                                                                        {contentData.browser.miss_text}
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Practice Controls */}
                                                    <div className="pt-4 border-t border-gray-200">
                                                        {practiceMode === skill.id ? (
                                                            <div className="space-y-3">
                                                                {/* Practice Timer */}
                                                                <div className="flex items-center justify-center gap-2 bg-blue-50 rounded-lg p-3">
                                                                    <ClockIcon />
                                                                    <span className="font-semibold text-blue-800">
                                                                        {formatDuration(practiceTime)}
                                                                    </span>
                                                                </div>
                                                                
                                                                {/* Practice Complete */}
                                                                {practiceCompleted && (
                                                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                                        <div className="text-center">
                                                                            <div className="text-green-800 font-bold mb-2">
                                                                                <CheckCircleIcon className="inline mr-2" />
                                                                                {contentData.browser.practice_complete}
                                                                            </div>
                                                                            <div className="text-sm text-green-700 mb-3">
                                                                                {contentData.browser.practice_complete_time}: {formatDuration(practiceTime)}
                                                                            </div>
                                                                            
                                                                            {/* Show missed steps if any */}
                                                                            {(() => {
                                                                                const missedSteps = getPracticeMissedSteps(skill);
                                                                                const hasCriticalFailures = hasPracticeCriticalFailures(skill);
                                                                                
                                                                                if (missedSteps.length > 0) {
                                                                                    return (
                                                                                        <div className={`text-sm p-2 rounded ${hasCriticalFailures ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                                            <div className="font-semibold mb-1">
                                                                                                {hasCriticalFailures ? contentData.browser.critical_failures : contentData.browser.missed_steps}:
                                                                                            </div>
                                                                                            <ul className="list-disc list-inside text-xs space-y-1">
                                                                                                {missedSteps.map((step, index) => (
                                                                                                    <li key={index}>{step}</li>
                                                                                                ))}
                                                                                            </ul>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return null;
                                                                            })()}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Practice Action Buttons */}
                                                                <div className="flex gap-2">
                                                                    {!practiceCompleted && (
                                                                        <button
                                                                            onClick={completePractice}
                                                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                                                        >
                                                                            {contentData.browser.finish_practice}
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={stopPractice}
                                                                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                                                                    >
                                                                        {practiceCompleted ? contentData.browser.close_practice : contentData.browser.stop_practice}
                                                                    </button>
                                                                    {practiceCompleted && (
                                                                        <button
                                                                            onClick={resetPractice}
                                                                            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                                                        >
                                                                            {contentData.browser.try_again}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => startPractice(skill.id)}
                                                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <PlayIcon />
                                                                {contentData.browser.practice_button}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default SkillsBrowserView;