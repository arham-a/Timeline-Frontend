"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import { FeatureCard } from './components/ui/FeatureCard';
import { Clock, Code, Compass, Plus, Users, TrendingUp, ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { Boxes } from './components/ui/background-boxes';

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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-16 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <Boxes />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/5 to-transparent rounded-full"></div>
      </div>
     

      <div className="relative z-10">
        {/* Header */}
       <Navbar />

        {/* Hero Section */}
        <motion.section 
          className="pt-24 pb-20 md:pt-32 md:pb-32 px-3 sm:px-6 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          
          <div className="container mx-auto text-center max-w-2xl sm:max-w-4xl md:max-w-6xl mt-12">
            
            <motion.div className="space-y-6 sm:space-y-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
              <motion.div 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm text-xs sm:text-base"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse" />
                <span className="text-purple-300 font-semibold tracking-wide">NEXT-GEN TIMELINE PLATFORM</span>
              </motion.div>

              <motion.h1 
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight md:leading-none tracking-tight"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <span className="block">YOUR JOURNEY,</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-purple-400  to-yellow-400 bg-clip-text text-transparent animate-pulse">
                  YOUR TIMELINE
                </span>
              </motion.h1>

              <motion.p 
                className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-300 max-w-xs xs:max-w-md sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed font-light"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                Create <span className="text-cyan-400 font-semibold">stunning</span>, manage{" "}
                <span className="text-purple-400 font-semibold">effortlessly</span>, and share{" "}
                <span className="text-pink-400 font-semibold">instantly</span>. The future of timeline creation is here.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-8 sm:pt-12 items-center"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link href="/auth">
                  <button
                    className="w-full max-w-xs sm:w-auto bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white border-0 px-6 xs:px-8 sm:px-12 py-3 xs:py-4 text-base xs:text-lg sm:text-xl font-bold rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-500 hover:scale-105 sm:hover:scale-110 mx-auto"
                  >
                    <span className="flex items-center justify-center">
                      GET STARTED
                      <ArrowRight className="w-5 h-5 xs:w-6 xs:h-6 ml-2 xs:ml-3 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </button>
                </Link>

                <Link href="/explore">
                  <button
                    className="w-full max-w-xs sm:w-auto border-2 border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-white bg-black/50 hover:bg-cyan-400/10 px-6 xs:px-8 sm:px-12 py-3 xs:py-4 text-base xs:text-lg sm:text-xl font-bold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 mx-auto"
                  >
                    <span className="flex items-center justify-center">
                      EXPLORE NOW
                      <Zap className="w-5 h-5 xs:w-6 xs:h-6 ml-2 xs:ml-3 group-hover:text-cyan-400 transition-colors" />
                    </span>
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-16 xs:py-20 md:py-32 px-3 sm:px-6 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="container mx-auto max-w-2xl sm:max-w-4xl md:max-w-7xl">
            <motion.div className="text-center mb-12 sm:mb-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
              <motion.div 
                className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-full px-4 sm:px-8 py-2 sm:py-4 mb-4 sm:mb-8 backdrop-blur-sm text-xs sm:text-base"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                <span className="text-cyan-300 font-bold text-xs sm:text-lg tracking-wide">POWERFUL FEATURES</span>
              </motion.div>

              <motion.h2 
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 sm:mb-8 leading-tight"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                EVERYTHING YOU NEED TO{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DOMINATE
                </span>
              </motion.h2>

              <motion.p 
                className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-400 max-w-xs xs:max-w-md sm:max-w-2xl md:max-w-4xl mx-auto font-light"
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              >
                Whether you're building your empire, tracking massive projects, or documenting legendary journeys -
                we've got the arsenal you need.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
                <FeatureCard
                  title="CREATE & CUSTOMIZE"
                  description="Build mind-blowing, interactive timelines with custom segments, epic milestones, and crushing goals."
                  icon={<Plus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
                  spotlightColor="rgba(37,99,235,0.35)"
                  textColor="text-blue-600"
                  iconBgColor="bg-blue-600"
                  borderColor='border-blue-600'
                  points={[
                    { color: "bg-cyan-400", text: "Custom templates" },
                    { color: "bg-blue-500", text: "Interactive elements" },
                    { color: "bg-purple-400", text: "Rich media support" },
                    { color: "bg-pink-400", text: "Goal tracking" },
                  ]}
                />
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
                <FeatureCard
                  title="COLLABORATE & SHARE"
                  description="Share your masterpieces with the world and collaborate with your team in real-time like never before."
                  icon={<Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
                  spotlightColor="rgba(168,85,247,0.35)"
                  textColor="text-purple-600"
                  iconBgColor="bg-purple-600"
                  borderColor='border-purple-600'
                  points={[
                    { color: "bg-cyan-400", text: "Team collaboration" },
                    { color: "bg-blue-500", text: "Public sharing" },
                    { color: "bg-purple-400", text: "Real-time updates" },
                    { color: "bg-pink-400", text: "Comment system" },
                  ]}
                />
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}>
                <FeatureCard
                  title="TRACK & PROGRESS"
                  description="Monitor your empire's growth, smash through milestones, and achieve legendary status with precision tracking."
                  icon={<TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
                  spotlightColor="rgba(34,197,94,0.35)"
                  textColor="text-green-600"
                  iconBgColor="bg-green-600"
                  borderColor='border-green-600'
                  points={[
                    { color: "bg-green-400", text: "Progress tracking" },
                    { color: "bg-emerald-400", text: "Milestone alerts" },
                    { color: "bg-teal-400", text: "Analytics dashboard" },
                    { color: "bg-cyan-400", text: "Goal completion" },
                  ]}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}
