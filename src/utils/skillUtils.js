// Skill-related utility functions
import contentData from '../content.yml';

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
            category: contentData.categories.hand_hygiene.title,
            description: contentData.categories.hand_hygiene.description,
            skills: handHygiene
        });
    }
    
    // 2. Measurement Skills (second skill in tests)
    const measurementSkills = skills.filter(skill => skill.isMeasurementSkill && !skill.isAlwaysFirst);
    if (measurementSkills.length > 0) {
        organized.push({
            category: contentData.categories.measurement_skills.title,
            description: contentData.categories.measurement_skills.description,
            skills: measurementSkills
        });
    }
    
    // 3. Water Skills (excluding measurement skills)
    const waterSkills = skills.filter(skill => skill.isWaterSkill && !skill.isMeasurementSkill && !skill.isAlwaysFirst);
    if (waterSkills.length > 0) {
        organized.push({
            category: contentData.categories.water_skills.title,
            description: contentData.categories.water_skills.description,
            skills: waterSkills
        });
    }
    
    // 4. Other Personal Care (non-water)
    const otherPersonalCare = skills.filter(skill => 
        skill.category === "Personal Care" && 
        !skill.isWaterSkill && 
        !skill.isMeasurementSkill &&
        !skill.isAlwaysFirst
    );
    if (otherPersonalCare.length > 0) {
        organized.push({
            category: contentData.categories.personal_care.title,
            description: contentData.categories.personal_care.description,
            skills: otherPersonalCare
        });
    }
    
    // 5. Mobility Skills
    const mobilitySkills = skills.filter(skill => skill.category === "Mobility");
    if (mobilitySkills.length > 0) {
        organized.push({
            category: contentData.categories.mobility_skills.title,
            description: contentData.categories.mobility_skills.description,
            skills: mobilitySkills
        });
    }
    
    // 6. Infection Control
    const infectionControlSkills = skills.filter(skill => skill.category === "Infection Control");
    if (infectionControlSkills.length > 0) {
        organized.push({
            category: contentData.categories.infection_control.title,
            description: contentData.categories.infection_control.description,
            skills: infectionControlSkills
        });
    }
    
    return organized;
};