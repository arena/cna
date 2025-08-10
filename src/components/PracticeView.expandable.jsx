import React from 'react';
import ChevronDownIcon from '../data/icons/ChevronDownIcon.jsx';
import ChevronUpIcon from '../data/icons/ChevronUpIcon.jsx';

const PracticeView = ({ 
    currentSkills, 
    expandedSkill,
    toggleSkillExpansion,
    getSkillTypeIcon,
    getSkillTypeLabel
}) => {
    if (!currentSkills || currentSkills.length === 0) {
        return <div>No skills loaded for practice</div>;
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {currentSkills.map((skill) => {
                const isExpanded = expandedSkill === skill.id;

                return (
                    <div key={skill.id} className="bg-white rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
                        {/* Skill Header */}
                        <div
                            onClick={() => toggleSkillExpansion(skill.id)}
                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    {/* Skill Number */}
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 text-white text-sm font-bold">
                                        {skill.number}
                                    </div>
                                    
                                    {/* Skill Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-base sm:text-lg leading-tight text-gray-800">
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
                            <div className="border-t-2 border-gray-200">
                                <div className="p-4 space-y-4">
                                    {/* Steps List */}
                                    <div className="space-y-2">
                                        {skill.steps.map((step, stepIndex) => (
                                            <div
                                                key={step.id}
                                                className="p-3 rounded-lg border bg-gray-50 border-gray-200"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Step Number */}
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-gray-400 text-white">
                                                        {stepIndex + 1}
                                                    </div>
                                                    
                                                    {/* Step Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm leading-relaxed text-gray-700">
                                                            {step.description}
                                                            {step.critical && (
                                                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                    Critical
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PracticeView;