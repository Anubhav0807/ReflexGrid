"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [userName,setUserName]=useState();
  const fetchSessions=async()=>{
    try{
     const res= await axios.get(`/api/web/user`);
     setUserName(res.data.data.name);
    }catch(error:any){
        console.log("Error"+error);
    }
}
useEffect(()=>{
    fetchSessions()
},[])
  return (
    <header className="sticky top-0 z-50  py-4 bg-gray-50 border-b border-gray-200 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
              boxShadow: "0 2px 10px rgba(79,70,229,0.35)",
            }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <div>
            <span className="text-gray-800 font-bold text-base tracking-tight">
              Reflex Grid
            </span>
            <span className="ml-2 text-xs font-mono text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5">
              Dashboard
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          <div className="w-px h-5 bg-gray-300 hidden sm:block"></div>

          <div className="flex items-center gap-2.5 bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5 cursor-pointer hover:border-blue-300 transition-colors">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              }}
            >
              {userName?userName[0]:"NA"}
            </div>

            <span className="text-sm text-gray-700 font-medium hidden sm:block">
              {userName}
            </span>

            {/* Status dot */}
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;