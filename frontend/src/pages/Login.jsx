import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../features/auth/authSlice";
import { axiosInstance } from '../utils/axiosUtil';
import {
  Mail,
  Lock,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone
} from "lucide-react";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Redirect if already logged in
  if (user && user.token) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    
    try {
      const res = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });
      
      dispatch(loginSuccess(res.data));
      setIsSubmitted(true);
      
      // Redirect after showing success message
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login Failed";
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-50 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Login Hero Section - Matches Contact Page */}
      <section className="relative overflow-hidden py-2 lg:py-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-50 h-50 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        
        <div className="relative container mx-auto px-6 pt-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight mb-6">
              Login Here
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sign in to access your Excel analytics dashboard and continue transforming your data into actionable insights.
            </p>
          </div>
        </div>
      </section>

      {/* Login Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Login Form */}
            <div className="flex-1">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-8 lg:p-12 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Sign in to your account
                </h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Login Successful!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      You're being redirected to your dashboard...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-red-600">{error}</p>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className={`group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl w-full ${loading ? 'opacity-80' : ''}`}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {loading ? (
                          'Signing in...'
                        ) : (
                          <>
                            Sign In
                            <Lock className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    
                    <div className="mt-6 text-center">
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link
                          to="/signup"
                          className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                          Sign up here
                        </Link>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* Social Login & Info */}
            <div className="lg:w-1/3">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-3xl p-8 lg:p-10 shadow-lg h-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Quick Access
                </h2>
                
                <div className="space-y-6">
                  <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                    Continue with GitHub
                  </button>
                  
                  <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Continue with Twitter
                  </button>
                  
                  <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm6.25 10c0 3.452-2.798 6.25-6.25 6.25-3.452 0-6.25-2.798-6.25-6.25 0-3.452 2.798-6.25 6.25-6.25 3.452 0 6.25 2.798 6.25 6.25zm-6.25-3.125a3.125 3.125 0 100 6.25 3.125 3.125 0 000-6.25z" clipRule="evenodd" />
                    </svg>
                    Continue with Google
                  </button>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Contact our support team if you're having trouble accessing your account.
                  </p>
                  <a
                    href="mailto:support@excelanalytics.com"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    support@excelanalytics.com
                  </a>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                      <a
                        key={index}
                        href="#"
                        className="p-3 bg-gray-100 rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:text-white"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (matches contact page) */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Excel Analytics Platform
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Leading provider of data analytics and AI solutions for
                businesses. Transform your data into actionable insights with
                our cutting-edge platform.
              </p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                  <button
                    key={index}
                    className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  "Home",
                  "About Us",
                  "Services",
                  "Solutions",
                  "Pricing",
                  "Contact",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                  <span className="text-gray-400">
                    123 Business Ave, Tech City
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-blue-400" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-blue-400" />
                  <span className="text-gray-400">info@excelanalytics.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 Excel Analytics Platform. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;