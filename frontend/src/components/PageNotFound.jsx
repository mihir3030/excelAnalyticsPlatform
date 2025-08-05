import React from "react";
import { FileX2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Floating BG blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />

      <div className="z-10 max-w-xl">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-full text-sm font-medium text-red-600 mb-6 animate-bounce-gentle">
          <FileX2 className="w-5 h-5 mr-2 text-red-500" />
          Page Not Found
        </div>

        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
          404
        </h1>

        <p className="text-xl text-gray-700 mb-8 animate-fade-in-up animation-delay-200">
          Oops! The page you're looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up animation-delay-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
