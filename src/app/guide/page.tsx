"use client";

import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function GuidePage() {
  return (
    <>
      <Navbar />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen relative pt-24 pb-16 overflow-x-hidden"
      >
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-purple-950"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-900/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-900/40 to-transparent rounded-full"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              TIMELINE GUIDE
            </h1>
            <p className="text-lg text-gray-200">
              Learn how to create, manage, and share your timelines effectively
            </p>
          </motion.div>

          <motion.div variants={containerVariants} className="space-y-12">
            {/* Getting Started Section */}
            <motion.section variants={sectionVariants} className="bg-black/40 rounded-2xl p-8 shadow-xl border border-cyan-900/40 backdrop-blur-lg text-white">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                Getting Started
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Welcome to Timeline! This guide will help you understand how to use our platform effectively.
                  Whether you're creating a personal timeline or collaborating with others, we've got you covered.
                </p>
                <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-4">
                  <h3 className="font-semibold text-cyan-300 mb-2">Quick Start Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Create an account or sign in</li>
                    <li>Choose your timeline type</li>
                    <li>Add your first segment</li>
                    <li>Customize and share</li>
                  </ol>
                </div>
              </div>
            </motion.section>

            {/* Timeline Types Section */}
            <motion.section variants={sectionVariants} className="bg-black/40 rounded-2xl p-8 shadow-xl border border-cyan-900/40 backdrop-blur-lg text-white">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                Timeline Types
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/30 border border-cyan-900/30 p-6 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Roadmap</h3>
                  <p className="text-gray-300">
                    Perfect for planning future goals and milestones. Create step-by-step guides for projects,
                    career paths, or learning journeys.
                  </p>
                </div>
                <div className="bg-black/30 border border-cyan-900/30 p-6 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Chronicle</h3>
                  <p className="text-gray-300">
                    Ideal for documenting past events and experiences. Great for historical records,
                    personal journals, or project retrospectives.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Creating Timelines Section */}
            <motion.section variants={sectionVariants} className="bg-black/40 rounded-2xl p-8 shadow-xl border border-cyan-900/40 backdrop-blur-lg text-white">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                Creating Your Timeline
              </h2>
              <div className="space-y-6">
                <div className="bg-black/30 border border-cyan-900/30 p-6 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Step 1: Choose Your Type</h3>
                  <p className="text-gray-300 mb-4">
                    Select between Roadmap or Chronicle based on your needs. Roadmaps are forward-looking,
                    while Chronicles document past events.
                  </p>
                </div>
                <div className="bg-black/30 border border-cyan-900/30 p-6 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Step 2: Add Segments</h3>
                  <p className="text-gray-300 mb-4">
                    Break down your timeline into meaningful segments. Each segment can include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Title and description</li>
                    <li>Start and end dates</li>
                    <li>Progress tracking</li>
                    <li>Attachments and links</li>
                  </ul>
                </div>
                <div className="bg-black/30 border border-cyan-900/30 p-6 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Step 3: Customize</h3>
                  <p className="text-gray-300 mb-4">
                    Make your timeline unique with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Custom colors and themes</li>
                    <li>Icons and images</li>
                    <li>Tags and categories</li>
                    <li>Privacy settings</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Collaboration Section */}
            <motion.section variants={sectionVariants} className="bg-black/40 rounded-2xl p-8 shadow-xl border border-cyan-900/40 backdrop-blur-lg text-white">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                Collaboration Features
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Timeline supports various collaboration features to help you work with others:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/30 border border-cyan-900/30 p-6 rounded-lg">
                    <h3 className="font-semibold text-cyan-300 mb-2">Sharing Options</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      <li>Public sharing</li>
                      <li>Private links</li>
                      <li>Team collaboration</li>
                    </ul>
                  </div>
                  <div className="bg-black/30 border border-cyan-900/30 p-6 rounded-lg">
                    <h3 className="font-semibold text-cyan-300 mb-2">Permissions</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      <li>View-only access</li>
                      <li>Edit permissions</li>
                      <li>Admin controls</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Tips & Best Practices */}
            <motion.section variants={sectionVariants} className="bg-black/40 rounded-2xl p-8 shadow-xl border border-cyan-900/40 backdrop-blur-lg text-white">
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-4">
                Tips & Best Practices
              </h2>
              <div className="space-y-4 text-gray-300">
                <div className="bg-black/30 border border-cyan-900/30 p-6 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Creating Effective Timelines</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li>Keep segments concise and clear</li>
                    <li>Use consistent formatting</li>
                    <li>Add relevant details and context</li>
                    <li>Regularly update progress</li>
                    <li>Use tags for better organization</li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
} 