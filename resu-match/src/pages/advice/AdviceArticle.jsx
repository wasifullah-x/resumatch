import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser, FiCalendar, FiShare2, FiBookmark, FiArrowRight } from 'react-icons/fi';

const AdviceArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock article data (in production, fetch from API)
    const article = {
        id: parseInt(id),
        title: '10 Tips to Write a Winning Resume in 2024',
        category: 'Resume & CV',
        author: 'Sarah Johnson',
        date: '2024-01-15',
        readTime: '8 min read',
        image: '📄',
        content: `
            <h2>Introduction</h2>
            <p>In today's competitive job market, your resume is your first opportunity to make a lasting impression. With recruiters spending an average of 6-7 seconds reviewing each resume, it's crucial to make every word count. This comprehensive guide will walk you through 10 proven strategies to create a resume that not only passes Applicant Tracking Systems (ATS) but also captures the attention of hiring managers.</p>

            <h2>1. Start with a Strong Professional Summary</h2>
            <p>Your professional summary is prime real estate at the top of your resume. This 2-3 sentence paragraph should encapsulate your professional identity, key achievements, and what you bring to the table.</p>
            <p><strong>Example:</strong> "Results-driven Software Engineer with 5+ years of experience in full-stack development. Led team of 8 developers to deliver enterprise solutions that increased operational efficiency by 40%. Expertise in React, Node.js, and cloud architecture."</p>

            <h2>2. Use Action Verbs and Quantify Achievements</h2>
            <p>Replace passive descriptions with powerful action verbs. Instead of "Responsible for managing team," write "Led cross-functional team of 12 members to deliver $2M project ahead of schedule."</p>
            <ul>
                <li>Achieved - Increased sales by 35% within 6 months</li>
                <li>Streamlined - Reduced processing time by 50% through automation</li>
                <li>Spearheaded - Launched new product line generating $500K revenue</li>
                <li>Optimized - Improved website performance by 40%</li>
            </ul>

            <h2>3. Tailor Your Resume for Each Application</h2>
            <p>Generic resumes rarely make it past ATS systems. Carefully read the job description and mirror the language used. If they're looking for "project management," use that exact phrase rather than "project coordination."</p>

            <h2>4. Optimize for Applicant Tracking Systems (ATS)</h2>
            <p>Many companies use ATS to filter resumes before they reach human eyes. Follow these guidelines:</p>
            <ul>
                <li>Use standard section headings (Experience, Education, Skills)</li>
                <li>Avoid tables, graphics, and complex formatting</li>
                <li>Use standard fonts (Arial, Calibri, Times New Roman)</li>
                <li>Save as .docx or PDF (check job posting preference)</li>
                <li>Include relevant keywords from the job description</li>
            </ul>

            <h2>5. Highlight Relevant Skills</h2>
            <p>Create a dedicated skills section that includes both hard and soft skills. Organize them by category:</p>
            <ul>
                <li><strong>Technical:</strong> Python, React, AWS, Docker, SQL</li>
                <li><strong>Management:</strong> Agile, Scrum, Team Leadership, Budgeting</li>
                <li><strong>Communication:</strong> Public Speaking, Technical Writing, Stakeholder Management</li>
            </ul>

            <h2>6. Keep It Concise and Relevant</h2>
            <p>For professionals with less than 10 years of experience, stick to one page. Beyond that, two pages are acceptable. Focus on the last 10-15 years of your career and ensure every line adds value.</p>

            <h2>7. Include Education and Certifications</h2>
            <p>List your educational background with degree, institution, and graduation year. Include relevant certifications, especially those mentioned in the job description. For example: AWS Certified Solutions Architect, PMP, CPA, etc.</p>

            <h2>8. Add a Professional Projects Section</h2>
            <p>If you're a developer, designer, or in a creative field, include a section showcasing your best projects with links to live demos or GitHub repositories. Briefly describe the technology stack and your role.</p>

            <h2>9. Proofread, Then Proofread Again</h2>
            <p>Typos and grammatical errors can instantly disqualify your application. Use tools like Grammarly, have a friend review it, and read it aloud to catch mistakes.</p>

            <h2>10. Design Matters (But Keep It Professional)</h2>
            <p>A clean, well-organized layout with consistent formatting shows attention to detail. Use:</p>
            <ul>
                <li>Consistent font sizes and styles</li>
                <li>Adequate white space for readability</li>
                <li>Bold or italic text to highlight key information</li>
                <li>Bullet points for easy scanning</li>
            </ul>

            <h2>Conclusion</h2>
            <p>Crafting a winning resume takes time and iteration. Use these 10 tips as your framework, but remember to let your unique experiences and personality shine through. Your resume is a living document—update it regularly as you gain new skills and achievements. With a polished, targeted resume, you'll be well on your way to landing your dream job in 2024.</p>

            <p><strong>Next Steps:</strong> Ready to put your resume to work? Browse thousands of job opportunities on ResuMatch and start applying today!</p>
        `
    };

    const relatedArticles = [
        { id: 2, title: 'How to Answer "Tell Me About Yourself"', category: 'Interview Tips' },
        { id: 7, title: 'Building a Strong LinkedIn Profile', category: 'Resume & CV' },
        { id: 11, title: 'Resume Keywords That Get You Hired', category: 'Resume & CV' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/advice')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
                >
                    <FiArrowLeft size={20} />
                    Back to Career Advice
                </button>

                {/* Article Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                    <div className="mb-6">
                        <span className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
                            {article.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {article.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <FiUser size={16} />
                            <span className="font-medium">{article.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiCalendar size={16} />
                            <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiClock size={16} />
                            <span>{article.readTime}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            <FiBookmark size={18} />
                            Save Article
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <FiShare2 size={18} />
                            Share
                        </button>
                    </div>
                </div>

                {/* Article Content */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
                    <div 
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                        style={{
                            lineHeight: '1.8',
                            color: '#374151'
                        }}
                    />
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white mb-8">
                    <h3 className="text-2xl font-bold mb-3">Ready to put your resume to work?</h3>
                    <p className="text-blue-100 mb-6">Browse thousands of job opportunities and start applying today</p>
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                    >
                        Browse Jobs
                        <FiArrowRight />
                    </Link>
                </div>

                {/* Related Articles */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                    <div className="space-y-4">
                        {relatedArticles.map(related => (
                            <Link
                                key={related.id}
                                to={`/advice/${related.id}`}
                                className="block p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium mb-1">{related.category}</p>
                                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {related.title}
                                        </h4>
                                    </div>
                                    <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Inline Styles for Article Content */}
            <style>{`
                .prose h2 {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: #111827;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .prose p {
                    margin-bottom: 1rem;
                }
                .prose ul {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                    list-style-type: disc;
                }
                .prose li {
                    margin-bottom: 0.5rem;
                }
                .prose strong {
                    font-weight: 600;
                    color: #111827;
                }
            `}</style>
        </div>
    );
};

export default AdviceArticle;
