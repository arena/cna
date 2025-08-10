import React from 'react';

const PracticeView = ({ currentSkills, contentData }) => {
    console.log('PracticeView props:', { currentSkills, contentData });
    
    if (!currentSkills || currentSkills.length === 0) {
        return <div>No skills loaded for practice</div>;
    }

    return (
        <div>
            <h2>Practice Mode (Minimal Test)</h2>
            <p>Skills loaded: {currentSkills.length}</p>
            <div className="space-y-2">
                {currentSkills.map(skill => (
                    <div key={skill.id} className="p-3 border rounded">
                        <h3 className="font-bold">{skill.number}. {skill.title}</h3>
                        <p className="text-sm text-gray-600">{skill.steps.length} steps</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PracticeView;