import { useState, useEffect } from 'react';
import { generateSkillSet } from '../utils/skillUtils.js';

// Hook for managing skill sets, expansion, and completion state
export const useSkillManagement = (skillsData) => {
    const [currentSkills, setCurrentSkills] = useState([]);
    const [expandedSkill, setExpandedSkill] = useState(null);
    const [skillCompletionTimes, setSkillCompletionTimes] = useState({});
    const [skillStartTimes, setSkillStartTimes] = useState({});
    const [visitedSkills, setVisitedSkills] = useState(new Set());

    // Initialize with random skills on mount
    useEffect(() => {
        if (skillsData?.skills) {
            setCurrentSkills(generateSkillSet(skillsData.skills));
        }
    }, [skillsData]);

    // Check if all skills are completed
    const allSkillsCompleted = currentSkills.length > 0 && currentSkills.every(skill => skillCompletionTimes[skill.id] !== undefined);

    const handleNewSkillSet = () => {
        setCurrentSkills(generateSkillSet(skillsData.skills));
        setExpandedSkill(null);
        setSkillCompletionTimes({});
        setSkillStartTimes({});
        setVisitedSkills(new Set());
    };

    const setCustomSkillSet = (skills) => {
        setCurrentSkills(skills);
        setExpandedSkill(null);
        setSkillCompletionTimes({});
        setSkillStartTimes({});
        setVisitedSkills(new Set());
    };

    const toggleSkillExpansion = (skillId, timeRemaining) => {
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

    const completeSkill = (skillId, timeRemaining) => {
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

    const resetSkillsState = () => {
        setSkillCompletionTimes({});
        setSkillStartTimes({});
        setVisitedSkills(new Set());
        setExpandedSkill(null);
    };

    return {
        currentSkills,
        expandedSkill,
        skillCompletionTimes,
        skillStartTimes,
        visitedSkills,
        allSkillsCompleted,
        setCurrentSkills,
        setExpandedSkill,
        handleNewSkillSet,
        setCustomSkillSet,
        toggleSkillExpansion,
        completeSkill,
        resetSkillsState
    };
};