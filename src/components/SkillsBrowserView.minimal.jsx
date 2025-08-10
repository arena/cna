import React from 'react';

const SkillsBrowserView = ({ contentData, skillsData }) => {
    return (
        <div>
            <h2>Skills Browser (Minimal Test Version)</h2>
            <p>Content data exists: {contentData ? 'Yes' : 'No'}</p>
            <p>Skills data exists: {skillsData ? 'Yes' : 'No'}</p>
            <p>Number of skills: {skillsData?.skills?.length || 0}</p>
        </div>
    );
};

export default SkillsBrowserView;