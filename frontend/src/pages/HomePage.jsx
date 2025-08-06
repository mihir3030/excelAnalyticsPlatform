import React, { useState, useEffect } from "react";
import './HomePage.css'
import {
  ChevronRight,
  TrendingUp,
  BarChart3,
  PieChart,
  FileSpreadsheet,
} from "lucide-react";
import FooterComponent from "../components/FooterComponent";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id^="animate-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-700 mb-6 animate-bounce-gentle">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" />
                Excel Analytics Platform
              </div>

              <h1 className="text-2xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight mb-6">
                Upload Excel Files
                <span className="block">& Visualize Data</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Transform your Excel data into beautiful, interactive charts and
                visualizations. Upload your files and discover insights with our
                powerful analytics platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 
                hover:shadow-2xl"
                onClick={() => navigate("/dashboard")}>
                  <span className="relative z-10 flex items-center">
                    Go to Dashboard
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-center">
                <div className="animate-counter">
                  <div className="text-3xl font-bold text-blue-600">10+</div>
                  <div className="text-sm text-gray-600">Files Processed</div>
                </div>
                <div className="animate-counter animation-delay-500">
                  <div className="text-3xl font-bold text-purple-600">5+</div>
                  <div className="text-sm text-gray-600">Chart Types</div>
                </div>
                <div className="animate-counter animation-delay-1000">
                  <div className="text-3xl font-bold text-pink-600">24/7</div>
                  <div className="text-sm text-gray-600">Access</div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 relative">
              <div className="relative w-full max-w-lg mx-auto">
                <img
                  src="https://datrics.themetags.com/img/hero-single-img-1.svg"
                  alt="Hero"
                  className="w-full animate-float relative z-20"
                />
                <img
                  src="https://datrics.themetags.com/img/hero-animation-01.svg"
                  alt="Animation"
                  className="absolute top-0 left-16 w-full animate-float-delayed z-10"
                />

                {/* Floating Cards */}
                <div className="absolute -top-8 -left-8 bg-white rounded-2xl shadow-xl p-4 animate-float-up-down">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Excel Upload</span>
                  </div>
                </div>

                <div className="absolute z-10 -bottom-8 -right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl p-4 animate-float-up-down animation-delay-1000">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-sm font-medium">Charts Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="animate-features"
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible["animate-features"]
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Excel Analytics
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your Excel files into stunning visualizations with our
              comprehensive suite of analytics tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileSpreadsheet className="w-8 h-8" />,
                title: "Easy File Upload",
                description:
                  "Simply drag and drop your Excel files or browse to upload. Support for .xlsx, .xls formats.",
                color: "from-green-400 to-blue-500",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Multiple Chart Types",
                description:
                  "Create bar charts, line graphs, pie charts, scatter plots and more from your data.",
                color: "from-blue-400 to-purple-500",
              },
              {
                icon: <PieChart className="w-8 h-8" />,
                title: "Interactive Visualizations",
                description:
                  "Hover, zoom, filter and interact with your charts for deeper data exploration.",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Real-time Analysis",
                description:
                  "Get instant insights as you upload your data with automatic chart generation.",
                color: "from-orange-400 to-red-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterComponent />
    </div>
  );
}

export default HomePage;
