"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 pt-4 pb-3 h-36 flex items-center justify-evenly">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
            }}
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            Smart Reflex Training System
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          <span>v2.4.1</span>

          <span className="w-px h-3 bg-gray-300"></span>

          <span>© 2026 Reflex Grid</span>

          <span className="w-px h-3 bg-gray-300"></span>

          <span className="text-blue-500 font-medium">
            All systems operational
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;