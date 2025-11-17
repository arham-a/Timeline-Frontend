"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { CardSpotlight } from "@/app/components/ui/card-spotlight";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <CardSpotlight 
      className={cn(
        "relative h-full w-full p-6 sm:p-8 lg:p-10 bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:border-purple-500/40",
        className
      )} 
      spotlightColor="rgba(168,85,247,0.15)"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/5 to-transparent pointer-events-none opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full items-center text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(168,85,247,0.7)]">
            {icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent uppercase tracking-tight leading-tight">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed flex-grow">
          {description}
        </p>
      </div>
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 opacity-50" />
    </CardSpotlight>
  );
} 