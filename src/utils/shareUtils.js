// Sharing utility functions

export const shareResults = async (currentSkills, skillCompletionTimes, timeRemaining, formatTime, formatDuration, hasSkillCriticalFailures, contentData) => {
    const totalTime = formatDuration(30 * 60 - timeRemaining);
    const passedCount = currentSkills.filter(skill => !hasSkillCriticalFailures(skill)).length;
    const failedCount = currentSkills.filter(skill => hasSkillCriticalFailures(skill)).length;
    const overallStatus = failedCount > 0 ? 'PRACTICE TEST NOT PASSED - Review Critical Steps' : 'PRACTICE TEST PASSED - Great Job!';
    
    const skillDetails = currentSkills.map((skill, index) => {
        const completionTime = skillCompletionTimes[skill.id];
        const hasFailed = hasSkillCriticalFailures(skill);
        return `${index + 1}. ${skill.title}: ${formatDuration(completionTime)} ${hasFailed ? '(NEEDS REVIEW)' : '(PASSED)'}`;
    }).join('\n');

    const shareText = `${contentData.share.results.header}

📊 Overall: ${overallStatus}
⏱️ Total Time: ${totalTime} / 30:00
✅ Skills Passed: ${passedCount}
📝 Skills to Review: ${failedCount}

📋 Individual Results:
${skillDetails}

Practice at: ${window.location.href}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: contentData.share.results.title,
                text: shareText
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                fallbackShare(shareText);
            }
        }
    } else {
        fallbackShare(shareText);
    }
};

export const fallbackShare = (text) => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        }).catch(() => {
            promptShare(text);
        });
    } else {
        promptShare(text);
    }
};

export const promptShare = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('Results copied to clipboard!');
    } catch (err) {
        prompt('Copy your results:', text);
    } finally {
        document.body.removeChild(textarea);
    }
};