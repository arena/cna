// Icon utility functions
import React from 'react';
import DropletsIcon from '../data/icons/DropletsIcon.jsx';
import AwardIcon from '../data/icons/AwardIcon.jsx';
import GlovesIcon from '../data/icons/GlovesIcon.jsx';
import StockingsIcon from '../data/icons/StockingsIcon.jsx';
import MobilityIcon from '../data/icons/MobilityIcon.jsx';
import CareIcon from '../data/icons/CareIcon.jsx';
import WaterIcon from '../data/icons/WaterIcon.jsx';

export const getSkillTypeIcon = (skill) => {
    if (skill.isWaterSkill) return <DropletsIcon />;
    if (skill.isMeasurementSkill) return <AwardIcon />;
    return null;
};

export const getSkillCategoryIcon = (skill) => {
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

export const getSkillTypeLabel = (skill) => {
    const types = [];
    if (skill.isWaterSkill) types.push("Water");
    if (skill.isMeasurementSkill) types.push("Measurement");
    return types.join(" • ");
};