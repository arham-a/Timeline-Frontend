"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--color-bg-purple-50)] pt-16 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg-purple-50)]">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-6xl">
                Your Journey, Your Timeline
              </h1>
              <p className="mt-6 text-lg leading-8 text-[var(--color-text-secondary)]">
                Create, manage, and share your personal and professional timelines. 
                Track your progress, set milestones, and collaborate with others.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {!user ? (
                  <>
                    <Link
                      href="/auth"
                      className="rounded-md bg-[var(--color-primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get started
                    </Link>
                    <Link
                      href="/timelines/explore"
                      className="text-sm font-semibold leading-6 text-[var(--color-text-primary)]"
                    >
                      Explore timelines <span aria-hidden="true">→</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/user"
                    className="rounded-md bg-[var(--color-primary)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    My Timelines
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
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
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="relative flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                  <div className="absolute -top-4 left-6">
                    <div className="rounded-full bg-[var(--color-primary)] p-3 shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-[var(--color-text-primary)] mt-4">
                    Create & Customize
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[var(--color-text-secondary)]">
                    <p className="flex-auto">
                      Build beautiful, interactive timelines with custom segments, milestones, and goals.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[var(--color-primary)]">
                      <span className="text-sm font-medium">Learn more</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </dd>
                </div>
                <div className="relative flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                  <div className="absolute -top-4 left-6">
                    <div className="rounded-full bg-[var(--color-primary)] p-3 shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-[var(--color-text-primary)] mt-4">
                    Collaborate & Share
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[var(--color-text-secondary)]">
                    <p className="flex-auto">
                      Share your timelines with others and collaborate on shared projects.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[var(--color-primary)]">
                      <span className="text-sm font-medium">Learn more</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </dd>
                </div>
                <div className="relative flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                  <div className="absolute -top-4 left-6">
                    <div className="rounded-full bg-[var(--color-primary)] p-3 shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-[var(--color-text-primary)] mt-4">
                    Track & Progress
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-[var(--color-text-secondary)]">
                    <p className="flex-auto">
                      Monitor your progress, update segments, and achieve your goals.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[var(--color-primary)]">
                      <span className="text-sm font-medium">Learn more</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
