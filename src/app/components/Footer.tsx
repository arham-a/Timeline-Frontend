import Link from 'next/link';
import { Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-purple-500/20 bg-black relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 p-0.5">
                <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <span className="font-black text-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                TIMELINE
              </span>
            </div>
            <p className="text-gray-400 mb-6 text-base leading-relaxed">
              Create, share, and explore legendary timelines. Your journey to greatness starts here.
            </p>
            <p className="text-sm text-gray-500 font-medium">© 2025 Timeline. All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg text-purple-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-purple-300 transition-colors text-sm font-medium">
                  Explore Timelines
                </Link>
              </li>
              <li>
                <Link href="/signin" className="text-gray-400 hover:text-purple-300 transition-colors text-sm font-medium">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/my-timelines" className="text-gray-400 hover:text-purple-300 transition-colors text-sm font-medium">
                  My Timelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg text-purple-400">Created By</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">AA</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">Arham Alvi</p>
                  <p className="text-xs text-gray-400">Full Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 p-0.5">
                  <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">SR</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">Shareeq Rashid</p>
                  <p className="text-xs text-gray-400">Full Stack Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 