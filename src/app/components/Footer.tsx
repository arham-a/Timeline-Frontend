import Link from 'next/link';
import { Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-3 gap-20">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                      <Clock className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  <span className="font-black text-2xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    TIMELINE
                  </span>
                </div>
                <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                  Create, share, and explore legendary timelines. Your journey to greatness starts here.
                </p>
                <p className="text-sm text-gray-600 font-medium">© 2025 Timeline. All rights reserved.</p>
              </div>

              <div>
                <h4 className="font-black mb-6 text-xl text-cyan-400 tracking-wide">QUICK LINKS</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/explore" className="text-gray-400 hover:text-white transition-colors text-lg font-medium hover:translate-x-2 inline-block transition-transform">
                      Explore Timelines
                    </Link>
                  </li>
                  <li>
                    <Link href="/signin" className="text-gray-400 hover:text-white transition-colors text-lg font-medium hover:translate-x-2 inline-block transition-transform">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-timelines" className="text-gray-400 hover:text-white transition-colors text-lg font-medium hover:translate-x-2 inline-block transition-transform">
                      My Timelines
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-black mb-6 text-xl text-purple-400 tracking-wide">CREATED BY</h4>
                <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-0.5">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AA</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg text-white">Arham Alvi</p>
                  <p className="text-sm text-gray-400 font-medium">Full Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 p-0.5">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                    <span className="text-white font-bold text-lg">SR</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg text-white">Shareeq Rashid</p>
                  <p className="text-sm text-gray-400 font-medium">Full Stack Developer</p>
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