import React from 'react';
import XIcon from '../data/icons/XIcon.jsx';

const CustomSkillModal = ({ isOpen, onClose, skillsData, onStartPractice }) => {
    const [selectedMeasurement, setSelectedMeasurement] = React.useState('');
    const [selectedAdditional, setSelectedAdditional] = React.useState([]);

    // Clear selections and scroll to top when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setSelectedMeasurement('');
            setSelectedAdditional([]);
            // Scroll to top of modal content
            setTimeout(() => {
                const modalContent = document.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.scrollTop = 0;
                }
            }, 0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Get measurement skills (Vital Signs category) in specific order
    const measurementOrder = ['counts_radial_pulse', 'counts_respirations', 'measures_blood_pressure', 'measures_weight', 'measures_urinary_output'];
    const measurementSkills = skillsData.skills
        .filter(skill => skill.category === 'Vital Signs')
        .sort((a, b) => {
            const indexA = measurementOrder.indexOf(a.id);
            const indexB = measurementOrder.indexOf(b.id);
            return indexA - indexB;
        });

    // Get non-measurement, non-handwashing skills
    const additionalSkills = skillsData.skills.filter(skill => 
        skill.category !== 'Vital Signs' && skill.id !== 'hand_hygiene' && !skill.title.toLowerCase().includes('hand hygiene')
    ).sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);

    // Get hand washing skill
    const handWashing = skillsData.skills.find(skill => skill.id === 'hand_hygiene');

    const handleAdditionalToggle = (skillId) => {
        setSelectedAdditional(prev => {
            if (prev.includes(skillId)) {
                return prev.filter(id => id !== skillId);
            } else if (prev.length < 3) {
                return [...prev, skillId];
            }
            return prev;
        });
    };

    const handleStartPractice = () => {
        const selectedSkills = [
            handWashing,
            measurementSkills.find(skill => skill.id === selectedMeasurement),
            ...additionalSkills.filter(skill => selectedAdditional.includes(skill.id))
        ].filter(Boolean);

        console.log('Selected skills:', selectedSkills);
        console.log('Valid?', selectedSkills.length === 5);
        
        if (selectedSkills.length === 5) {
            onStartPractice(selectedSkills);
            onClose();
        } else {
            console.log('Not enough skills selected');
        }
    };

    const isValid = selectedMeasurement && selectedAdditional.length === 3;
    const totalSelected = 1 + (selectedMeasurement ? 1 : 0) + selectedAdditional.length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Custom Practice Set</h2>
                    <button onClick={onClose} className="timer-button">
                        <XIcon />
                    </button>
                </div>

                {/* Content */}
                <div className="modal-content p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Hand Washing */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">First Skill</h3>
                        <div className="p-3 bg-gray-50 rounded border">
                            <label className="flex-center gap-3 cursor-default">
                                <input
                                    type="checkbox"
                                    checked={true}
                                    disabled={true}
                                    className="text-blue-600"
                                />
                                <span className="flex-1">Hand Washing (required)</span>
                                {/* Time estimate removed but sorting maintained */}
                            </label>
                        </div>
                    </div>

                    {/* Measurement Skills */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Measurement Skills (select 1)</h3>
                        <div className="space-y-2">
                            {measurementSkills.map(skill => (
                                <label key={skill.id} className="flex-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="measurement"
                                        value={skill.id}
                                        checked={selectedMeasurement === skill.id}
                                        onChange={(e) => setSelectedMeasurement(e.target.value)}
                                        className="text-blue-600"
                                    />
                                    <span className="flex-1">{skill.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Additional Skills */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Additional Skills (select 3)</h3>
                        <div className="space-y-2">
                            {additionalSkills.map(skill => {
                                const isSelected = selectedAdditional.includes(skill.id);
                                const isDisabled = !isSelected && selectedAdditional.length >= 3;
                                
                                return (
                                    <label key={skill.id} className={`flex-center gap-3 p-3 border rounded cursor-pointer ${
                                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                    }`}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            disabled={isDisabled}
                                            onChange={() => handleAdditionalToggle(skill.id)}
                                            className="text-blue-600"
                                        />
                                        <span className="flex-1">{skill.title}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex-between mb-3">
                        <span className="text-sm text-gray-600">Selected {totalSelected} of 5 skills</span>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button 
                            onClick={handleStartPractice}
                            disabled={!isValid}
                            className={`btn-primary ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Use This Set
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomSkillModal;