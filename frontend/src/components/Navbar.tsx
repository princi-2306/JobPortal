// components/Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BriefcaseIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../store/authStore";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Get user display name based on role
  const getUserDisplayName = () => {
    if (!user) return "";
    if (isAdmin()) {
      return (user as any).adminName || "Admin";
    }
    return user.name || (user as any).username || "User";
  };

  const getUserInitial = () => {
    const name = getUserDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg py-2"
            : "bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-800">
                  Uni<span className="text-blue-600">Zoy</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation - Changes based on auth and role */}
            <div className="hidden lg:flex items-center space-x-8">
              {!isAuthenticated ? (
                /* Public Navigation - Not Logged In */
                <>
                  <Link
                    to="/jobs"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    About Us
                  </Link>
                </>
              ) : isAdmin() ? (
                /* Admin Navigation */
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  >
                    <ChartBarIcon className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </>
              ) : (
                /* User Navigation */
                <>
                  <Link
                    to="/jobs"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Find Jobs
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>

          
            <div className="hidden lg:flex items-center space-x-4">
              {!isAuthenticated ? (
               
                <>
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 px-5 py-2.5 text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Log In</span>
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                    >
                      <UserPlusIcon className="h-5 w-5" />
                      <span>Sign Up</span>
                    </motion.button>
                  </Link>
                </>
              ) : (
             
                <>

                  {/* Admin Badge - Only for admin */}
                  {isAdmin() && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span className="text-xs font-semibold">Admin</span>
                    </div>
                  )}

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={getUserDisplayName()}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {getUserInitial()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700 hidden xl:block">
                        {getUserDisplayName()}
                      </span>
                      <ChevronDownIcon
                        className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 border border-gray-100"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">
                              {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email}
                            </p>
                            <p className="text-xs text-purple-600 mt-1 capitalize">
                              {isAdmin() ? "Administrator" : "Job Seeker"}
                            </p>
                          </div>

                          {/* Dynamic menu based on role */}
                          {isAdmin() ? (
                            /* Admin Menu */
                            <>

                              <Link to="/admin/dashboard">
                                <motion.div
                                  whileHover={{ x: 5 }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    setIsProfileDropdownOpen(false)
                                  }
                                >
                                  View Applications
                                </motion.div>
                              </Link>
                            </>
                          ) : (
                            /* User Menu */
                            <>
                              <Link to="/dashboard">
                                <motion.div
                                  whileHover={{ x: 5 }}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                  onClick={() =>
                                    setIsProfileDropdownOpen(false)
                                  }
                                >
                                  My Applications
                                </motion.div>
                              </Link>
                            </>
                          )}

                          <div className="border-t border-gray-100 my-1"></div>

                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            Logout
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-white shadow-xl z-40 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="p-4 space-y-3">
              {/* Mobile User Info when logged in */}
              {isAuthenticated && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-3">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={getUserDisplayName()}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {getUserInitial()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  {isAdmin() && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              )}

              {/* Mobile Navigation based on auth status */}
              {!isAuthenticated ? (
                /* Public Mobile Menu */
                <>
                  <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-medium">
                      Browse Jobs
                    </div>
                  </Link>
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-medium">
                      About Us
                    </div>
                  </Link>

                  {/* Auth Buttons */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                      >
                        Log In
                      </motion.button>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                      >
                        Sign Up
                      </motion.button>
                    </Link>
                  </div>
                </>
              ) : isAdmin() ? (
                /* Admin Mobile Menu */
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg font-medium">
                      Dashboard
                    </div>
                  </Link>

                  {/* Profile Section */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                /* User Mobile Menu */
                <>
                  {/* Profile Section */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <Link
                      to="/applications"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg">
                        My Applications
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
