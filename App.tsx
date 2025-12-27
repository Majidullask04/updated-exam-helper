import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Zap,
  Target,
  Clock,
  Users,
  Menu,
  X,
} from 'lucide-react';

interface NavCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  href?: string;
}

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationCards: NavCard[] = [
    {
      id: 'flashcards',
      title: 'Flashcards',
      description: 'Master concepts with interactive flashcards',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      gradient: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      id: 'quiz',
      title: 'Quiz Mode',
      description: 'Test your knowledge with timed quizzes',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      gradient: 'hover:from-purple-600 hover:to-purple-700',
    },
    {
      id: 'notes',
      title: 'Notes',
      description: 'Create and organize study notes',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      gradient: 'hover:from-green-600 hover:to-green-700',
    },
    {
      id: 'analytics',
      title: 'Progress Analytics',
      description: 'Track your learning journey',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-orange-500 to-orange-600',
      gradient: 'hover:from-orange-600 hover:to-orange-700',
    },
    {
      id: 'goals',
      title: 'Study Goals',
      description: 'Set and achieve your targets',
      icon: <Target className="w-8 h-8" />,
      color: 'from-red-500 to-red-600',
      gradient: 'hover:from-red-600 hover:to-red-700',
    },
    {
      id: 'schedule',
      title: 'Schedule',
      description: 'Plan your study sessions',
      icon: <Clock className="w-8 h-8" />,
      color: 'from-indigo-500 to-indigo-600',
      gradient: 'hover:from-indigo-600 hover:to-indigo-700',
    },
    {
      id: 'collaborate',
      title: 'Collaborate',
      description: 'Study with friends and peers',
      icon: <Users className="w-8 h-8" />,
      color: 'from-cyan-500 to-cyan-600',
      gradient: 'hover:from-cyan-600 hover:to-cyan-700',
    },
    {
      id: 'ai-tutor',
      title: 'AI Tutor',
      description: 'Get personalized help instantly',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-yellow-500 to-yellow-600',
      gradient: 'hover:from-yellow-600 hover:to-yellow-700',
    },
  ];

  const handleCardClick = (cardId: string) => {
    console.log(`Navigating to: ${cardId}`);
    // Route to respective feature page
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ExamHelper
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              About
            </a>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-700 hover:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 p-4 space-y-3">
            <a
              href="#features"
              className="block text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#about"
              className="block text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              About
            </a>
            <button className="w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium">
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
              Your Personal Study Companion
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Master any subject with intelligent flashcards, adaptive quizzes, and personalized analytics.
              Study smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-semibold">
                Start Learning Now
              </button>
              <button className="px-8 py-3 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
        </div>
      </section>

      {/* Card Navigation Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Powerful Features at Your Fingertips
          </h3>
          <p className="text-slate-600 text-lg">
            Everything you need to excel in your exams
          </p>
        </div>

        {/* Grid Layout - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {navigationCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.color} ${card.gradient} transition-all duration-300`}
              ></div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 text-white z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-xl sm:text-2xl font-bold mb-2 text-left">
                      {card.title}
                    </h4>
                    <p className="text-sm sm:text-base text-white/90 text-left line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-white/80 group-hover:text-white transition-colors">
                    {card.icon}
                  </div>
                  <div className="text-white/60 group-hover:text-white transition-colors">
                    <svg
                      className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Overlay Effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {[
              { label: 'Students', value: '10K+' },
              { label: 'Study Sets', value: '50K+' },
              { label: 'Questions', value: '500K+' },
              { label: 'Success Rate', value: '95%' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-slate-600 text-sm sm:text-base mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              &copy; 2025 ExamHelper. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.593 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.184.092-.923.35-1.544.636-1.9-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.273.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.195 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
