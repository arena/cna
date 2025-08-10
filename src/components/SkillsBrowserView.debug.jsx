import React from 'react';

const SkillsBrowserView = ({
    skillsOrganization,
    setSkillsOrganization,
    getSkillTypeIcon,
    getSkillTypeLabel,
    getSkillCategoryIcon,
    organizeSkillsByType,
    contentData,
    skillsData
}) => {
    console.log('SkillsBrowserView props:', {
        skillsOrganization,
        hasSetSkillsOrganization: !!setSkillsOrganization,
        hasGetSkillTypeIcon: !!getSkillTypeIcon,
        hasGetSkillTypeLabel: !!getSkillTypeLabel,
        hasGetSkillCategoryIcon: !!getSkillCategoryIcon,
        hasOrganizeSkillsByType: !!organizeSkillsByType,
        hasContentData: !!contentData,
        hasSkillsData: !!skillsData,
        skillsCount: skillsData?.skills?.length
    });

    if (!contentData || !skillsData || !getSkillTypeIcon) {
        return <div>Missing required props for SkillsBrowserView</div>;
    }

    return (
        <div>
            <h2>Skills Browser Debug</h2>
            <p>Organization: {skillsOrganization}</p>
            <p>Skills: {skillsData.skills.length}</p>
            <button onClick={() => setSkillsOrganization('number')}>By Number</button>
            <button onClick={() => setSkillsOrganization('type')}>By Type</button>
            
            <div>
                <h3>First skill test:</h3>
                {skillsData.skills[0] && (
                    <div>
                        <p>Title: {skillsData.skills[0].title}</p>
                        <p>Number: {skillsData.skills[0].number}</p>
                        <p>Steps: {skillsData.skills[0].steps.length}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsBrowserView;