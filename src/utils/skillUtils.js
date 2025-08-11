// Skill-related utility functions

export const generateSkillSet = (allSkills) => {
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

export const hasSkillCriticalFailures = (skill, getStepEvaluation) => {
    return skill.steps.some((step, stepIndex) => {
        if (!step.critical) return false;
        const evaluation = getStepEvaluation(skill.id, stepIndex);
        return evaluation === 'skipped' || evaluation === 'wrong';
    });
};

export const organizeSkillsByType = (skills) => {
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