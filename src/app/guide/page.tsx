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
        className="min-h-screen bg-[var(--color-bg-purple-50)] pt-24 pb-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
              Timeline Guide
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Learn how to create, manage, and share your timelines effectively
            </p>
          </motion.div>

          <motion.div variants={containerVariants} className="space-y-12">
            {/* Getting Started Section */}
            <motion.section variants={sectionVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
                Getting Started
              </h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <p>
                  Welcome to Timeline! This guide will help you understand how to use our platform effectively.
                  Whether you're creating a personal timeline or collaborating with others, we've got you covered.
                </p>
                <div className="bg-[var(--color-bg-purple-50)] p-4 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Quick Start Steps:</h3>
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
            <motion.section variants={sectionVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
                Timeline Types
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[var(--color-bg-purple-50)] p-6 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Roadmap</h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Perfect for planning future goals and milestones. Create step-by-step guides for projects,
                    career paths, or learning journeys.
                  </p>
                </div>
                <div className="bg-[var(--color-bg-purple-50)] p-6 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Chronicle</h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Ideal for documenting past events and experiences. Great for historical records,
                    personal journals, or project retrospectives.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Creating Timelines Section */}
            <motion.section variants={sectionVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
                Creating Your Timeline
              </h2>
              <div className="space-y-6">
                <div className="bg-[var(--color-bg-purple-50)] p-6 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Step 1: Choose Your Type</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Select between Roadmap or Chronicle based on your needs. Roadmaps are forward-looking,
                    while Chronicles document past events.
                  </p>
                </div>
                <div className="bg-[var(--color-bg-purple-50)] p-6 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Step 2: Add Segments</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Break down your timeline into meaningful segments. Each segment can include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)]">
                    <li>Title and description</li>
                    <li>Start and end dates</li>
                    <li>Progress tracking</li>
                    <li>Attachments and links</li>
                  </ul>
                </div>
                <div className="bg-[var(--color-bg-purple-50)] p-6 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Step 3: Customize</h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Make your timeline unique with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)]">
                    <li>Custom colors and themes</li>
                    <li>Icons and images</li>
                    <li>Tags and categories</li>
                    <li>Privacy settings</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Collaboration Section */}
            <motion.section variants={sectionVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
                Collaboration Features
              </h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <p>
                  Timeline supports various collaboration features to help you work with others:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[var(--color-bg-purple-50)] p-6 rounded-lg">
                    <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Sharing Options</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Public sharing</li>
                      <li>Private links</li>
                      <li>Team collaboration</li>
                    </ul>
                  </div>
                  <div className="bg-[var(--color-bg-purple-50)] p-6 rounded-lg">
                    <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Permissions</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>View-only access</li>
                      <li>Edit permissions</li>
                      <li>Admin controls</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Tips & Best Practices */}
            <motion.section variants={sectionVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
                Tips & Best Practices
              </h2>
              <div className="space-y-4 text-[var(--color-text-secondary)]">
                <div className="bg-[var(--color-bg-purple-50)] p-6 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text-primary)] mb-2">Creating Effective Timelines</h3>
                  <ul className="list-disc list-inside space-y-2">
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