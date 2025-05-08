"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './components/LoadingSpinner';

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
    <>
      <Navbar />
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="min-h-screen bg-[var(--color-bg-purple-50)]"
        >
          {/* Hero Section */}
          <div className="relative isolate px-6 pt-14 lg:px-8 bg-[linear-gradient(to_bottom_right,white,var(--color-bg-purple-100))]">
            <motion.div
              className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 "
              variants={fadeInUp}
            >
              <div className="text-center">
                <motion.h1
                  className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-6xl"
                  variants={fadeInUp}
                >
                  Your Journey, Your Timeline
                </motion.h1>
                <motion.p
                  className="mt-6 text-lg leading-8 text-[var(--color-text-secondary)]"
                  variants={fadeInUp}
                >
                  Create, manage, and share your personal and professional timelines. 
                  Track your progress, set milestones, and collaborate with others.
                </motion.p>
                <motion.div
                  className="mt-10 flex items-center justify-center gap-x-6"
                  variants={fadeInUp}
                >
                  {!user ? (
                    <>
                      <Link
                        href="/auth"
                        className="rounded-md bg-[var(--color-primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:scale-105 hover:bg-[var(--color-primary-dark)] transition-transform"
                      >
                        Get started
                      </Link>
                      <Link
                        href="/explore"
                        className="group relative inline-flex items-center gap-1 text-sm font-semibold leading-6 text-[var(--color-text-primary)] cursor-pointer"
                      >
                        <span className="relative group-hover:font-bold after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[var(--color-text-primary)] after:transition-all after:duration-300 group-hover:after:w-full">
                            Explore timelines
                        </span>
                        <span
                           aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                           →
                       </span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/user"
                      className="rounded-md bg-[var(--color-primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:scale-105 hover:bg-[var(--color-primary-dark)] transition-transform"
                    >
                      My Timelines
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <div className="bg-[var(--color-bg-purple-50)] py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div
                className="mx-auto max-w-2xl lg:text-center"
                variants={fadeInUp}
              >
                <h2 className="text-base font-semibold leading-7 text-[var(--color-primary)] flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Timeline Management
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                  Everything you need to manage your timelines
                </p>
                <p className="mt-6 text-lg leading-8 text-[var(--color-text-secondary)]">
                  Whether you're planning your career, tracking a project, or documenting history,
                  our platform provides all the tools you need.
                </p>
              </motion.div>

              <motion.dl
                className="mx-auto mt-16 max-w-2xl grid gap-x-8 gap-y-16 lg:grid-cols-3 sm:mt-20 lg:mt-24 lg:max-w-none"
                variants={containerVariants}
              >
                {[
                  {
                    title: "Create & Customize",
                    desc: "Build beautiful, interactive timelines with custom segments, milestones, and goals.",
                    iconPath: "M12 6v6m0 0v6m0-6h6m-6 0H6"
                  },
                  {
                    title: "Collaborate & Share",
                    desc: "Share your timelines with others and collaborate on shared projects.",
                    iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  },
                  {
                    title: "Track & Progress",
                    desc: "Monitor your progress, update segments, and achieve your goals.",
                    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative flex flex-col bg-[linear-gradient(to_bottom_right,white,var(--color-bg-purple-light))] hover:bg-[linear-gradient(to_top_left,white,var(--color-bg-purple-light))] p-6 rounded-2xl shadow-sm border border-[var(--color-border)] transition-all duration-300"


                    variants={cardVariants}
                  >
                    <div className="absolute -top-4 left-6">
                      <div className="rounded-full bg-[var(--color-primary)] p-3 shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                        </svg>
                      </div>
                    </div>
                    <dt className="mt-4 text-base font-semibold leading-7 text-[var(--color-text-primary)]">
                      {item.title}
                    </dt>
                    <dd className="mt-4 flex flex-col text-base leading-7 text-[var(--color-text-secondary)]">
                      <p className="flex-auto">{item.desc}</p>
                      <div className="group mt-4 flex items-center gap-2 text-[var(--color-primary)] cursor-pointer">
                        <span className="relative text-sm font-medium group-hover:font-semibold after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[var(--color-primary)] after:transition-all after:duration-300 group-hover:after:w-full">
                           Learn more
                        </span>
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
