import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../features/auth/authSlice";
import { axiosInstance } from '../utils/axiosUtil';
import { toast } from 'react-toastify';

import {
  Mail,
  Lock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";


import FooterComponent from "../components/FooterComponent";

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
      toast.error(errorMessage)
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
                    <FaGoogle className="mr-5" />
                    Continue with Google
                  </button>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Contact our support team if you're having trouble accessing your account.
                  </p>
                  <a
                    href="mailto:mihirpatel8798@gmail.com"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    mihirpatel8798@gmail.com
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
      <FooterComponent />
    </div>
  );
}

export default LoginPage;