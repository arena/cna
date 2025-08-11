import React from 'react';
import ShareIcon from '../data/icons/ShareIcon.jsx';

const AboutView = ({ contentData }) => {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{contentData.about.title}</h2>
                
                <div className="space-y-4 text-gray-700">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.who.title}</h3>
                        <p className="text-sm leading-relaxed mb-3">
                            {contentData.about.sections.who.text}
                        </p>
                        <p className="text-sm text-gray-700 mb-3">
                            {contentData.about.sections.who.share_prompt}
                        </p>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: contentData.share.app.title,
                                        text: contentData.share.app.description,
                                        url: window.location.href
                                    });
                                } else {
                                    navigator.clipboard.writeText(window.location.href).then(() => {
                                        alert('Link copied to clipboard!');
                                    }).catch(() => {
                                        prompt('Copy this link to share:', window.location.href);
                                    });
                                }
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <ShareIcon />
                            Share App
                        </button>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.why.title}</h3>
                        <p className="text-sm leading-relaxed">
                            {contentData.about.sections.why.text}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.usage.title}</h3>
                        <ul className="text-sm space-y-1 ml-4">
                            {contentData.about.sections.usage.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span><strong>{item.title}:</strong> {item.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.reference.title}</h3>
                        <p className="text-sm leading-relaxed mb-3">
                            {contentData.about.sections.reference.text}
                        </p>
                        <div className="space-y-1">
                            {contentData.about.sections.reference.links.map((link, index) => (
                                <div key={index}>
                                    <a 
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                                    >
                                        {link.text}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.pricing.title}</h3>
                        <p className="text-sm leading-relaxed">
                            {contentData.about.sections.pricing.text}
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{contentData.about.sections.feedback.title}</h3>
                        <p className="text-sm leading-relaxed mb-3">
                            {contentData.about.sections.feedback.text}
                        </p>
                        <a
                            href={contentData.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            📝 GitHub Repo
                        </a>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">{contentData.about.sections.disclaimer.title}</h3>
                        <p className="text-sm leading-relaxed text-yellow-800">
                            {contentData.about.sections.disclaimer.text}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            <span className="italic">{contentData.about.sections.footer.text}</span> 💙
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutView;