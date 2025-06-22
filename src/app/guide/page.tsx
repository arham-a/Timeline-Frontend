'use client';

import { useState, ReactNode, MouseEvent } from "react";

// Aceternity UI inspired components
interface ChildrenProps {
  children: ReactNode;
  className?: string;
}

function BackgroundGradient({ children, className = "" }: ChildrenProps) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${className}`}>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function CardContainer({ children, className = "" }: ChildrenProps) {
  return (
    <div className={`group/card relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

function CardBody({ children, className = "" }: ChildrenProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface NavItem {
  name: string;
  link: string;
}

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
}

function FloatingNav({ navItems, className = "" }: FloatingNavProps) {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(targetId);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:block ${className}`}>
        <nav className="flex items-center space-x-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 shadow-2xl">
          {navItems.map((item: NavItem) => (
            <a
              key={item.name}
              href={item.link}
              onClick={(e) => handleScroll(e, item.link.substring(1))}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                activeSection === item.link.substring(1)
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"
        >
          <div className="w-5 h-5 flex flex-col justify-center items-center">
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
          </div>
        </button>

        {isMenuOpen && (
          <div className="absolute top-14 right-0 w-48 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 shadow-xl py-2">
            {navItems.map((item: NavItem) => (
              <a
                key={item.name}
                href={item.link}
                onClick={(e) => handleScroll(e, item.link.substring(1))}
                className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Spotlight({ children, className = "" }: ChildrenProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-px bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30" />
      <div className="relative">{children}</div>
    </div>
  );
}

function MovingBorder({ children, className = "" }: ChildrenProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-75"
        style={{
          background: 'linear-gradient(45deg, #9333ea, #ec4899, #9333ea)',
          backgroundSize: '200% 200%',
          animation: 'gradient 3s ease infinite'
        }} />
      <div className="relative m-[1px] bg-slate-900 rounded-lg">{children}</div>
    </div>
  );
}

interface TextGenerateEffectProps {
  words: string;
  className?: string;
}

function TextGenerateEffect({ words, className = "" }: TextGenerateEffectProps) {
  return (
    <h1 className={`bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent ${className}`}>
      {words}
    </h1>
  );
}

export default function GuidePage() {
  const navItems = [
    { name: 'Getting Started', link: '#getting-started' },
    { name: 'Timeline Types', link: '#timeline-types' },
    { name: 'Creating Timelines', link: '#creating-timelines' },
    { name: 'Segments', link: '#segments' },
    { name: 'Advanced Features', link: '#advanced-features' }
  ];

  const timelineTypes = [
    {
      type: "Chronicle",
      description: "Flexible timeline without time constraints",
      features: ["No scheduling", "Flexible structure", "Manual segments", "Perfect for creative projects"],
      color: "from-blue-600 to-cyan-600"
    },
    {
      type: "Roadmap", 
      description: "Structured timeline with time units and scheduling",
      features: ["Time-based structure", "Daily/Weekly/Monthly units", "Scheduling features", "Perfect for learning paths"],
      color: "from-purple-600 to-pink-600"
    }
  ];

  const creationSteps = [
    { step: 1, title: "Choose Timeline Type", description: "Select between Chronicle or Roadmap based on your needs" },
    { step: 2, title: "Set Basic Details", description: "Enter title, description, and visibility settings" },
    { step: 3, title: "Configure Time Settings", description: "For Roadmap: select time unit and duration" },
    { step: 4, title: "Create Segments", description: "Add segments manually or generate with AI" },
    { step: 5, title: "Publish & Share", description: "Make your timeline public or keep it private" }
  ];

  return (
    <div className="min-h-screen text-white">
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      
      <FloatingNav navItems={navItems} />

      {/* Hero Section */}
      <BackgroundGradient className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-8">
              📚 Complete Guide
            </span>
          </div>
          <TextGenerateEffect 
            words="Master Your Timeline Journey"
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          />
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Learn how to create stunning learning paths and roadmaps with our next-generation timeline platform. 
            From basic setup to advanced AI-powered features.
          </p>
          <div className="flex justify-center px-4">
            <MovingBorder className="inline-block w-full sm:w-auto">
              <a href="#getting-started" className="block px-8 py-4 text-white font-semibold text-center">
                Get Started →
              </a>
            </MovingBorder>
          </div>
        </div>
      </BackgroundGradient>

      <div className="bg-slate-950">
        {/* Getting Started Section */}
        <section id="getting-started" className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Getting Started</h2>
              <p className="text-gray-400 text-base sm:text-lg">Your journey begins here</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <CardContainer className="hover:scale-105 transition-transform duration-300">
                <CardBody>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                    <p className="text-gray-400">Create your account and join the community of learners</p>
                  </div>
                </CardBody>
              </CardContainer>

              <CardContainer className="hover:scale-105 transition-transform duration-300">
                <CardBody>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Explore</h3>
                    <p className="text-gray-400">Browse public timelines and discover learning paths</p>
                  </div>
                </CardBody>
              </CardContainer>

              <CardContainer className="hover:scale-105 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
                <CardBody>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Create</h3>
                    <p className="text-gray-400">Start building your first timeline</p>
                  </div>
                </CardBody>
              </CardContainer>
            </div>
          </div>
        </section>

        {/* Timeline Types Section */}
        <section id="timeline-types" className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Timeline Types</h2>
              <p className="text-gray-400 text-base sm:text-lg">Choose the perfect structure for your learning journey</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {timelineTypes.map((timeline, index) => (
                <Spotlight key={index}>
                  <CardContainer className="h-full">
                    <CardBody className="h-full flex flex-col">
                      <div className={`w-full h-2 bg-gradient-to-r ${timeline.color} rounded-full mb-6`} />
                      <h3 className="text-xl sm:text-2xl font-bold mb-4">{timeline.type} Timeline</h3>
                      <p className="text-gray-300 mb-6 flex-grow text-sm sm:text-base">{timeline.description}</p>
                      <ul className="space-y-2">
                        {timeline.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-gray-400 text-sm sm:text-base">
                            <span className="text-green-500 mr-2 mt-1 flex-shrink-0">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </CardContainer>
                </Spotlight>
              ))}
            </div>
          </div>
        </section>

        {/* Creating Timelines Section */}
        <section id="creating-timelines" className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Creating Your First Timeline</h2>
              <p className="text-gray-400 text-base sm:text-lg">Follow these simple steps to get started</p>
            </div>

            <div className="relative">
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 to-pink-600 hidden sm:block" />
              
              <div className="space-y-6 sm:space-y-8">
                {creationSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 sm:gap-6">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl z-10">
                      {step.step}
                    </div>
                    <CardContainer className="flex-1">
                      <CardBody className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-400 text-sm sm:text-base">{step.description}</p>
                      </CardBody>
                    </CardContainer>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Segments Section */}
        <section id="segments" className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Creating Segments</h2>
              <p className="text-gray-400 text-base sm:text-lg">Build your timeline content manually or with AI assistance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <CardContainer>
                <CardBody>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✏️</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">Manual Creation</h3>
                  </div>
                  <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                    <li>• Add title and description</li>
                    <li>• Set milestones and goals</li>
                    <li>• Include references and resources</li>
                    <li>• Full control over content structure</li>
                    <li>• Perfect for specific requirements</li>
                  </ul>
                </CardBody>
              </CardContainer>

              <CardContainer>
                <CardBody>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">AI Generation</h3>
                  </div>
                  <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                    <li>• Specify your learning goal</li>
                    <li>• Choose domain and skill level</li>
                    <li>• Define target audience</li>
                    <li>• AI creates structured segments</li>
                    <li>• Edit and customize as needed</li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">💳</span>
                      <h4 className="font-semibold text-yellow-400">Credit System</h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      <span className="font-semibold text-purple-400">6 credits</span> required for AI-generated segments
                    </p>
                    <p className="text-xs text-gray-400">
                      Credits refresh daily at <span className="font-mono bg-slate-800 px-1 rounded">12:00 +5 UTC</span>
                    </p>
                  </div>
                </CardBody>
              </CardContainer>
            </div>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section id="advanced-features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Advanced Features</h2>
              <p className="text-gray-400 text-lg">Unlock the full potential of your timelines</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <CardContainer className="text-center hover:scale-105 transition-transform duration-300">
                <CardBody>
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍴</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Fork Public Timelines</h3>
                  <p className="text-gray-400">Clone and customize existing public timelines for your own use</p>
                </CardBody>
              </CardContainer>

              <CardContainer className="text-center hover:scale-105 transition-transform duration-300">
                <CardBody>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
                  <p className="text-gray-400">Monitor your learning progress with detailed analytics</p>
                </CardBody>
              </CardContainer>

              <CardContainer className="text-center hover:scale-105 transition-transform duration-300">
                <CardBody>
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Share & Collaborate</h3>
                  <p className="text-gray-400">Share your timelines and collaborate with others</p>
                </CardBody>
              </CardContainer>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 text-center bg-gradient-to-b from-slate-950 to-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-gray-400 text-lg mb-8">
              Create your first timeline today and join thousands of learners worldwide
            </p>
            <MovingBorder className="inline-block">
              <a href="/signup" className="block px-8 py-4 text-white font-semibold text-lg">
                Get Started Free →
              </a>
            </MovingBorder>
          </div>
        </section>
      </div>
    </div>
  );
}