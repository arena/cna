import React from 'react';
import ChevronDownIcon from '../data/icons/ChevronDownIcon.jsx';
import ChevronUpIcon from '../data/icons/ChevronUpIcon.jsx';

const SkillsBrowserView = ({
    skillsOrganization,
    setSkillsOrganization,
    expandedSkill,
    setExpandedSkill,
    getSkillTypeIcon,
    getSkillTypeLabel,
    getSkillCategoryIcon,
    organizeSkillsByType,
    contentData,
    skillsData
}) => {
    return (
        <>
            {/* Organization Controls */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Organize by:</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSkillsOrganization('number')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            skillsOrganization === 'number'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Number
                    </button>
                    <button
                        onClick={() => setSkillsOrganization('type')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            skillsOrganization === 'type'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Type
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
                                                    {skill.steps.length} steps
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

                            {/* Expanded Skill Content - Simplified */}
                            {expandedSkill === skill.id && (
                                <div className="border-t border-gray-200">
                                    <div className="p-4 space-y-4">
                                        {/* Category Icon */}
                                        <div className="flex items-center justify-center p-4">
                                            <div className="text-blue-600" style={{transform: 'scale(3)'}}>
                                                {getSkillCategoryIcon(skill)}
                                            </div>
                                        </div>

                                        {/* Steps List - Simplified */}
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-gray-800 mb-2">Steps:</h4>
                                            {skill.steps.map((step, stepIndex) => (
                                                <div key={step.id} className="p-3 rounded-lg border bg-gray-50 border-gray-200">
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
                    ))}
                </div>
            ) : (
                /* Organize by Type - Simplified */
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
                                        ({category.title === contentData.categories.hand_hygiene.title ? contentData.categories.hand_hygiene.special_text : `${category.skills.length} ${category.skills.length === 1 ? 'skill' : 'skills'}`})
                                    </span>
                                </div>
                            </div>
                            
                            {/* Category Skills */}
                            <div className="p-4 space-y-3">
                                {category.skills.map((skill) => (
                                    <div key={skill.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="p-3 bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                                                    {skill.number}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800">{skill.title}</h4>
                                                    <span className="text-xs text-gray-600">
                                                        {skill.steps.length} steps
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
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