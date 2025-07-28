import {
  Award,
  Brain,
  Briefcase,
  Calendar,
  Check, ChevronDown, ChevronUp, Copy,
  Edit3,
  FileText,
  History, Mail,
  Megaphone,
  MessageSquare,
  Newspaper,
  Package,
  PenTool,
  Send,
  Settings,
  Share2,
  Sparkles,
  ThumbsUp,
  Users,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import VoiceChat from './VoiceChat';

const App = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [activeCategory, setActiveCategory] = useState('communication');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [stats, setStats] = useState(null);

  // Form states for different content types
  const [emailForm, setEmailForm] = useState({
    purpose: '',
    details: '',
    tone: 'formal'
  });

  const [linkedinForm, setLinkedinForm] = useState({
    targetRole: '',
    intent: '',
    name: ''
  });

  const [coverLetterForm, setCoverLetterForm] = useState({
    jobTitle: '',
    companyName: '',
    skills: '',
    experience: '',
    requirements: ''
  });

  const [resumeSummaryForm, setResumeSummaryForm] = useState({
    profession: '',
    experience: '',
    skills: '',
    achievements: ''
  });

  const [interviewPrepForm, setInterviewPrepForm] = useState({
    jobTitle: '',
    companyName: '',
    interviewType: 'behavioral',
    experience: ''
  });

  const [thankYouForm, setThankYouForm] = useState({
    recipientName: '',
    occasion: '',
    personalDetails: '',
    tone: 'professional'
  });

  const [socialMediaForm, setSocialMediaForm] = useState({
    platform: 'LinkedIn',
    topic: '',
    tone: 'professional',
    hashtags: '',
    callToAction: ''
  });

  const [productDescForm, setProductDescForm] = useState({
    productName: '',
    features: '',
    benefits: '',
    targetAudience: '',
    tone: 'persuasive'
  });

  const [blogOutlineForm, setBlogOutlineForm] = useState({
    topic: '',
    targetAudience: '',
    keywords: '',
    postLength: '1500'
  });

  const [meetingAgendaForm, setMeetingAgendaForm] = useState({
    meetingTitle: '',
    attendees: '',
    duration: '',
    objectives: '',
    topics: ''
  });

  const [pressReleaseForm, setPressReleaseForm] = useState({
    headline: '',
    companyName: '',
    announcement: '',
    quote: '',
    contactInfo: ''
  });

  const [rewriteForm, setRewriteForm] = useState({
    originalText: '',
    style: 'improved',
    purpose: 'clarity',
    tone: 'professional'
  });

  const [generatedContent, setGeneratedContent] = useState('');

  const API_BASE = 'https://ai-agent-frontend-production.up.railway.app/api/ai';

  // Content categories and their items
  const contentCategories = {
    communication: {
      name: 'Communication',
      icon: Mail,
      items: [
        { id: 'email', name: 'Email Generator', icon: Mail },
        { id: 'linkedin', name: 'LinkedIn Message', icon: MessageSquare },
        { id: 'thank-you', name: 'Thank You Note', icon: ThumbsUp }
      ]
    },
    career: {
      name: 'Career & Professional',
      icon: Briefcase,
      items: [
        { id: 'cover-letter', name: 'Cover Letter', icon: FileText },
        { id: 'resume-summary', name: 'Resume Summary', icon: Award },
        { id: 'interview-prep', name: 'Interview Prep', icon: Users }
      ]
    },
    marketing: {
      name: 'Marketing & Content',
      icon: Megaphone,
      items: [
        { id: 'social-media', name: 'Social Media Post', icon: Share2 },
        { id: 'product-description', name: 'Product Description', icon: Package },
        { id: 'blog-outline', name: 'Blog Outline', icon: PenTool },
        { id: 'press-release', name: 'Press Release', icon: Newspaper }
      ]
    },
    business: {
      name: 'Business Tools',
      icon: Calendar,
      items: [
        { id: 'meeting-agenda', name: 'Meeting Agenda', icon: Calendar }
      ]
    },
    utilities: {
      name: 'Text Utilities',
      icon: Settings,
      items: [
        { id: 'rewrite-text', name: 'Text Rewriter', icon: Edit3 }
      ]
    }
  };

  // Fetch message history and stats
  const fetchHistory = async () => {
    try {
      const [historyResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE}/history`),
        fetch(`${API_BASE}/stats`)
      ]);

      const historyData = await historyResponse.json();
      const statsData = await statsResponse.json();

      setMessages(historyData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Generic API call function
  const makeAPICall = async (endpoint, formData) => {
    setLoading(true);
    setGeneratedContent('');

    try {
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedContent(data.output);
      fetchHistory(); // Refresh history
    } catch (error) {
      console.error(`${endpoint} generation failed:`, error);
      alert(`Failed to generate content. Please try again.`);
    }

    setLoading(false);
  };

  // Individual generation functions
  const generateEmail = () => {
    if (!emailForm.purpose || !emailForm.details) {
      alert('Please fill in purpose and details');
      return;
    }
    makeAPICall('generate-email', emailForm);
  };

  const generateLinkedIn = () => {
    if (!linkedinForm.targetRole || !linkedinForm.intent) {
      alert('Please fill in target role and intent');
      return;
    }
    makeAPICall('generate-linkedin', linkedinForm);
  };

  const generateCoverLetter = () => {
    if (!coverLetterForm.jobTitle || !coverLetterForm.companyName) {
      alert('Please fill in job title and company name');
      return;
    }
    makeAPICall('generate-cover-letter', coverLetterForm);
  };

  const generateResumeSummary = () => {
    if (!resumeSummaryForm.profession || !resumeSummaryForm.experience) {
      alert('Please fill in profession and experience');
      return;
    }
    makeAPICall('generate-resume-summary', resumeSummaryForm);
  };

  const generateInterviewPrep = () => {
    if (!interviewPrepForm.jobTitle || !interviewPrepForm.companyName) {
      alert('Please fill in job title and company name');
      return;
    }
    makeAPICall('generate-interview-prep', interviewPrepForm);
  };

  const generateThankYou = () => {
    if (!thankYouForm.recipientName || !thankYouForm.occasion) {
      alert('Please fill in recipient name and occasion');
      return;
    }
    makeAPICall('generate-thank-you', thankYouForm);
  };

  const generateSocialMedia = () => {
    if (!socialMediaForm.platform || !socialMediaForm.topic) {
      alert('Please fill in platform and topic');
      return;
    }
    makeAPICall('generate-social-post', socialMediaForm);
  };

  const generateProductDescription = () => {
    if (!productDescForm.productName || !productDescForm.features) {
      alert('Please fill in product name and features');
      return;
    }
    makeAPICall('generate-product-description', productDescForm);
  };

  const generateBlogOutline = () => {
    if (!blogOutlineForm.topic || !blogOutlineForm.targetAudience) {
      alert('Please fill in topic and target audience');
      return;
    }
    makeAPICall('generate-blog-outline', blogOutlineForm);
  };

  const generateMeetingAgenda = () => {
    if (!meetingAgendaForm.meetingTitle || !meetingAgendaForm.objectives) {
      alert('Please fill in meeting title and objectives');
      return;
    }
    makeAPICall('generate-meeting-agenda', meetingAgendaForm);
  };

  const generatePressRelease = () => {
    if (!pressReleaseForm.headline || !pressReleaseForm.companyName) {
      alert('Please fill in headline and company name');
      return;
    }
    makeAPICall('generate-press-release', pressReleaseForm);
  };

  const generateRewriteText = () => {
    if (!rewriteForm.originalText) {
      alert('Please provide text to rewrite');
      return;
    }
    makeAPICall('rewrite-text', rewriteForm);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveTab(contentCategories[category].items[0].id);
    setGeneratedContent('');
    setSelectedHistoryItem(null);
  };

  // Handle tab change within category
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setGeneratedContent('');
    setSelectedHistoryItem(null);
  };

  // Handle history item click
  const handleHistoryItemClick = (message) => {
    setSelectedHistoryItem(message);
    setGeneratedContent(message.output);
  };

  // Get messages to display based on showAllHistory state
  const displayedMessages = showAllHistory ? messages : messages.slice(0, 5);

  // Render form based on active tab
  const renderForm = () => {
    switch (activeTab) {
      case 'email':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Email Purpose *
                </label>
                <input
                  type="text"
                  value={emailForm.purpose}
                  onChange={(e) => setEmailForm({...emailForm, purpose: e.target.value})}
                  placeholder="e.g., Job application, Meeting request, Follow-up"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Tone
                </label>
                <select
                  value={emailForm.tone}
                  onChange={(e) => setEmailForm({...emailForm, tone: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Details *
              </label>
              <textarea
                value={emailForm.details}
                onChange={(e) => setEmailForm({...emailForm, details: e.target.value})}
                placeholder="Provide specific details about what you want to communicate..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <button
              onClick={generateEmail}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Email</span>
                </>
              )}
            </button>
          </div>
        );

      case 'linkedin':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Target Role *
                </label>
                <input
                  type="text"
                  value={linkedinForm.targetRole}
                  onChange={(e) => setLinkedinForm({...linkedinForm, targetRole: e.target.value})}
                  placeholder="e.g., Software Engineer, Product Manager, CEO"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={linkedinForm.name}
                  onChange={(e) => setLinkedinForm({...linkedinForm, name: e.target.value})}
                  placeholder="Recipient's name"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Intent *
              </label>
              <textarea
                value={linkedinForm.intent}
                onChange={(e) => setLinkedinForm({...linkedinForm, intent: e.target.value})}
                placeholder="What do you want to achieve? e.g., Networking, Job inquiry, Collaboration"
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <button
              onClick={generateLinkedIn}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Message</span>
                </>
              )}
            </button>
          </div>
        );

      case 'cover-letter':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={coverLetterForm.jobTitle}
                  onChange={(e) => setCoverLetterForm({...coverLetterForm, jobTitle: e.target.value})}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={coverLetterForm.companyName}
                  onChange={(e) => setCoverLetterForm({...coverLetterForm, companyName: e.target.value})}
                  placeholder="e.g., Microsoft"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Key Skills
              </label>
              <input
                type="text"
                value={coverLetterForm.skills}
                onChange={(e) => setCoverLetterForm({...coverLetterForm, skills: e.target.value})}
                placeholder="e.g., React, Node.js, Python, Team Leadership"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Experience
              </label>
              <textarea
                value={coverLetterForm.experience}
                onChange={(e) => setCoverLetterForm({...coverLetterForm, experience: e.target.value})}
                placeholder="Describe your relevant work experience and achievements..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Job Requirements
              </label>
              <textarea
                value={coverLetterForm.requirements}
                onChange={(e) => setCoverLetterForm({...coverLetterForm, requirements: e.target.value})}
                placeholder="Key requirements from the job posting..."
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <button
              onClick={generateCoverLetter}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Cover Letter</span>
                </>
              )}
            </button>
          </div>
        );

      case 'resume-summary':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Profession *
                </label>
                <input
                  type="text"
                  value={resumeSummaryForm.profession}
                  onChange={(e) => setResumeSummaryForm({...resumeSummaryForm, profession: e.target.value})}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Years of Experience *
                </label>
                <input
                  type="text"
                  value={resumeSummaryForm.experience}
                  onChange={(e) => setResumeSummaryForm({...resumeSummaryForm, experience: e.target.value})}
                  placeholder="e.g., 5 years"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Key Skills
              </label>
              <input
                type="text"
                value={resumeSummaryForm.skills}
                onChange={(e) => setResumeSummaryForm({...resumeSummaryForm, skills: e.target.value})}
                placeholder="e.g., JavaScript, Project Management, Data Analysis"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Notable Achievements
              </label>
              <textarea
                value={resumeSummaryForm.achievements}
                onChange={(e) => setResumeSummaryForm({...resumeSummaryForm, achievements: e.target.value})}
                placeholder="Highlight your key accomplishments and results..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <button
              onClick={generateResumeSummary}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Summary</span>
                </>
              )}
            </button>
          </div>
        );

      case 'interview-prep':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={interviewPrepForm.jobTitle}
                  onChange={(e) => setInterviewPrepForm({...interviewPrepForm, jobTitle: e.target.value})}
                  placeholder="e.g., Product Manager"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={interviewPrepForm.companyName}
                  onChange={(e) => setInterviewPrepForm({...interviewPrepForm, companyName: e.target.value})}
                  placeholder="e.g., Google"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Interview Type
                </label>
                <select
                  value={interviewPrepForm.interviewType}
                  onChange={(e) => setInterviewPrepForm({...interviewPrepForm, interviewType: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical</option>
                  <option value="case-study">Case Study</option>
                  <option value="panel">Panel Interview</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Experience Level
                </label>
                <input
                  type="text"
                  value={interviewPrepForm.experience}
                  onChange={(e) => setInterviewPrepForm({...interviewPrepForm, experience: e.target.value})}
                  placeholder="e.g., 3 years in product management"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <button
              onClick={generateInterviewPrep}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Interview Prep</span>
                </>
              )}
            </button>
          </div>
        );

      case 'thank-you':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={thankYouForm.recipientName}
                  onChange={(e) => setThankYouForm({...thankYouForm, recipientName: e.target.value})}
                  placeholder="e.g., Sarah Johnson"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Tone
                </label>
                <select
                  value={thankYouForm.tone}
                  onChange={(e) => setThankYouForm({...thankYouForm, tone: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="professional">Professional</option>
                  <option value="warm">Warm</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Occasion *
              </label>
              <input
                type="text"
                value={thankYouForm.occasion}
                onChange={(e) => setThankYouForm({...thankYouForm, occasion: e.target.value})}
                placeholder="e.g., Interview, Business meeting, Referral"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Personal Details
              </label>
              <textarea
                value={thankYouForm.personalDetails}
                onChange={(e) => setThankYouForm({...thankYouForm, personalDetails: e.target.value})}
                placeholder="Add specific details about what you're thanking them for..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <button
              onClick={generateThankYou}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Thank You Note</span>
                </>
              )}
            </button>
          </div>
        );

      case 'social-media':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Platform *
                </label>
                <select
                  value={socialMediaForm.platform}
                  onChange={(e) => setSocialMediaForm({...socialMediaForm, platform: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Tone
                </label>
                <select
                  value={socialMediaForm.tone}
                  onChange={(e) => setSocialMediaForm({...socialMediaForm, tone: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="engaging">Engaging</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Topic *
              </label>
              <input
                type="text"
                value={socialMediaForm.topic}
                onChange={(e) => setSocialMediaForm({...socialMediaForm, topic: e.target.value})}
                placeholder="e.g., New product launch, Industry insights, Career tips"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={socialMediaForm.hashtags}
                  onChange={(e) => setSocialMediaForm({...socialMediaForm, hashtags: e.target.value})}
                  placeholder="e.g., #technology #innovation #startup"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Call to Action
                </label>
                <input
                  type="text"
                  value={socialMediaForm.callToAction}
                  onChange={(e) => setSocialMediaForm({...socialMediaForm, callToAction: e.target.value})}
                  placeholder="e.g., Share your thoughts, Visit our website"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <button
              onClick={generateSocialMedia}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Social Post</span>
                </>
              )}
            </button>
          </div>
        );

      case 'product-description':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productDescForm.productName}
                  onChange={(e) => setProductDescForm({...productDescForm, productName: e.target.value})}
                  placeholder="e.g., Smart Fitness Tracker"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Tone
                </label>
                <select
                  value={productDescForm.tone}
                  onChange={(e) => setProductDescForm({...productDescForm, tone: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="persuasive">Persuasive</option>
                  <option value="informative">Informative</option>
                  <option value="exciting">Exciting</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Key Features *
              </label>
              <textarea
                value={productDescForm.features}
                onChange={(e) => setProductDescForm({...productDescForm, features: e.target.value})}
                placeholder="List the main features of your product..."
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Benefits
              </label>
              <textarea
                value={productDescForm.benefits}
                onChange={(e) => setProductDescForm({...productDescForm, benefits: e.target.value})}
                placeholder="How does this product help customers?"
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Target Audience
              </label>
              <input
                type="text"
                value={productDescForm.targetAudience}
                onChange={(e) => setProductDescForm({...productDescForm, targetAudience: e.target.value})}
                placeholder="e.g., Fitness enthusiasts, Tech-savvy professionals"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
              />
            </div>
            <button
              onClick={generateProductDescription}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Description</span>
                </>
              )}
            </button>
          </div>
        );

      case 'blog-outline':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Blog Topic *
                </label>
                <input
                  type="text"
                  value={blogOutlineForm.topic}
                  onChange={(e) => setBlogOutlineForm({...blogOutlineForm, topic: e.target.value})}
                  placeholder="e.g., How to Build a Successful Startup"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Target Audience *
                </label>
                <input
                  type="text"
                  value={blogOutlineForm.targetAudience}
                  onChange={(e) => setBlogOutlineForm({...blogOutlineForm, targetAudience: e.target.value})}
                  placeholder="e.g., Aspiring entrepreneurs"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={blogOutlineForm.keywords}
                  onChange={(e) => setBlogOutlineForm({...blogOutlineForm, keywords: e.target.value})}
                  placeholder="e.g., startup, entrepreneurship, business"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Post Length
                </label>
                <select
                  value={blogOutlineForm.postLength}
                  onChange={(e) => setBlogOutlineForm({...blogOutlineForm, postLength: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="800">800 words</option>
                  <option value="1500">1500 words</option>
                  <option value="2500">2500 words</option>
                  <option value="4000">4000+ words</option>
                </select>
              </div>
            </div>
            <button
              onClick={generateBlogOutline}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Blog Outline</span>
                </>
              )}
            </button>
          </div>
        );

      case 'meeting-agenda':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={meetingAgendaForm.meetingTitle}
                  onChange={(e) => setMeetingAgendaForm({...meetingAgendaForm, meetingTitle: e.target.value})}
                  placeholder="e.g., Q4 Planning Meeting"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Duration
                </label>
                <input
                  type="text"
                  value={meetingAgendaForm.duration}
                  onChange={(e) => setMeetingAgendaForm({...meetingAgendaForm, duration: e.target.value})}
                  placeholder="e.g., 60 minutes"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Attendees
              </label>
              <input
                type="text"
                value={meetingAgendaForm.attendees}
                onChange={(e) => setMeetingAgendaForm({...meetingAgendaForm, attendees: e.target.value})}
                placeholder="e.g., Product Team, Marketing Team, CEO"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Objectives *
              </label>
              <textarea
                value={meetingAgendaForm.objectives}
                onChange={(e) => setMeetingAgendaForm({...meetingAgendaForm, objectives: e.target.value})}
                placeholder="What are the main goals of this meeting?"
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Topics to Cover
              </label>
              <textarea
                value={meetingAgendaForm.topics}
                onChange={(e) => setMeetingAgendaForm({...meetingAgendaForm, topics: e.target.value})}
                placeholder="List the key topics to discuss..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <button
              onClick={generateMeetingAgenda}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Agenda</span>
                </>
              )}
            </button>
          </div>
        );

      case 'press-release':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Headline *
                </label>
                <input
                  type="text"
                  value={pressReleaseForm.headline}
                  onChange={(e) => setPressReleaseForm({...pressReleaseForm, headline: e.target.value})}
                  placeholder="e.g., TechCorp Launches Revolutionary New Product"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={pressReleaseForm.companyName}
                  onChange={(e) => setPressReleaseForm({...pressReleaseForm, companyName: e.target.value})}
                  placeholder="e.g., TechCorp Inc."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Announcement Details
              </label>
              <textarea
                value={pressReleaseForm.announcement}
                onChange={(e) => setPressReleaseForm({...pressReleaseForm, announcement: e.target.value})}
                placeholder="Describe what you're announcing..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Key Quote
              </label>
              <textarea
                value={pressReleaseForm.quote}
                onChange={(e) => setPressReleaseForm({...pressReleaseForm, quote: e.target.value})}
                placeholder="A key quote from leadership..."
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Contact Information
              </label>
              <input
                type="text"
                value={pressReleaseForm.contactInfo}
                onChange={(e) => setPressReleaseForm({...pressReleaseForm, contactInfo: e.target.value})}
                placeholder="e.g., Jane Smith, PR Manager, jane@techcorp.com"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
              />
            </div>
            <button
              onClick={generatePressRelease}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Press Release</span>
                </>
              )}
            </button>
          </div>
        );

      case 'rewrite-text':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Original Text *
              </label>
              <textarea
                value={rewriteForm.originalText}
                onChange={(e) => setRewriteForm({...rewriteForm, originalText: e.target.value})}
                placeholder="Paste the text you want to rewrite..."
                rows={6}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 resize-none text-sm sm:text-base"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Style
                </label>
                <select
                  value={rewriteForm.style}
                  onChange={(e) => setRewriteForm({...rewriteForm, style: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="improved">Improved</option>
                  <option value="simplified">Simplified</option>
                  <option value="academic">Academic</option>
                  <option value="conversational">Conversational</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Purpose
                </label>
                <select
                  value={rewriteForm.purpose}
                  onChange={(e) => setRewriteForm({...rewriteForm, purpose: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="clarity">Clarity</option>
                  <option value="persuasion">Persuasion</option>
                  <option value="engagement">Engagement</option>
                  <option value="brevity">Brevity</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Tone
                </label>
                <select
                  value={rewriteForm.tone}
                  onChange={(e) => setRewriteForm({...rewriteForm, tone: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 text-sm sm:text-base"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
            </div>
            <button
              onClick={generateRewriteText}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                  <span>Rewriting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Rewrite Text</span>
                </>
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-800" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Content Suite
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium">Comprehensive Content Generation Platform</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-4 py-2 rounded-full border border-blue-100">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">

          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Category Navigation */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-6 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {Object.entries(contentCategories).map(([categoryId, category]) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={categoryId}
                        onClick={() => handleCategoryChange(categoryId)}
                        className={`flex items-center space-x-2 px-3 sm:px-4 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 text-sm ${
                          activeCategory === categoryId
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">{category.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content Type Tabs */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-6 sm:mb-8 overflow-hidden">
              <div className="flex flex-wrap border-b border-gray-100">
                {contentCategories[activeCategory].items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-all duration-300 text-sm sm:text-base ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden xs:inline">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {renderForm()}
              </div>
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 sm:px-8 py-3 sm:py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="bg-green-500 rounded-full p-1.5 sm:p-2">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        Generated Content
                      </h3>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base ${
                        copied
                          ? 'bg-green-100 text-green-700 border-2 border-green-200'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 sm:p-6 border-2 border-gray-100">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-sm sm:text-base">
                      {generatedContent}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - History & Stats */}
          <div className="xl:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 xl:sticky xl:top-24 mb-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="bg-purple-500 rounded-full p-1.5 sm:p-2">
                    <History className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Recent History</h3>
                </div>
              </div>
              <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="bg-gray-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4">
                      <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No content generated yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Your history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {displayedMessages.map((message, index) => (
                      <div
                        key={index}
                        onClick={() => handleHistoryItemClick(message)}
                        className="group border-2 border-gray-100 rounded-xl p-3 sm:p-4 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100">
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900 capitalize">
                            {message.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                          {message.output.substring(0, 120)}...
                        </p>
                        <div className="flex items-center justify-between mt-2 sm:mt-3">
                          <p className="text-xs text-gray-400 font-medium">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-xs text-blue-600 font-medium">View →</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* View More/Less Button */}
                    {messages.length > 5 && (
                      <button
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-gray-200 hover:border-blue-300 rounded-xl font-semibold text-gray-700 hover:text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                      >
                        {showAllHistory ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>View Less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>View More ({messages.length - 5})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats Panel */}
            {stats && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="bg-indigo-500 rounded-full p-1.5 sm:p-2">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Usage Stats</h3>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{stats.totalMessages}</div>
                    <div className="text-sm text-gray-600">Total Generated</div>
                  </div>
                  <div className="space-y-2">
                    {stats.messagesByType.slice(0, 3).map((type, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 capitalize">{type._id.replace('_', ' ')}</span>
                        <span className="font-semibold text-gray-900">{type.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <VoiceChat/>
    </div>
  );
};

export default App;
