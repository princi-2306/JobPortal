import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import isLoggedIn from "../store/authStore"
import user from "../store/authStore"
import {
  BriefcaseIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: "Smart Job Search",
      description:
        "AI-powered job matching that finds the perfect opportunities based on your skills and preferences.",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: BuildingOfficeIcon,
      title: "Top Companies",
      description:
        "Connect with 10,000+ leading companies actively hiring talented professionals like you.",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: ChartBarIcon,
      title: "Salary Insights",
      description:
        "Get real-time salary data and market trends to negotiate better compensation packages.",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: UserGroupIcon,
      title: "Professional Network",
      description:
        "Build meaningful connections with industry experts and hiring managers.",
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: ShieldCheckIcon,
      title: "Verified Employers",
      description:
        "All job postings are verified to ensure a safe and trustworthy job search experience.",
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: RocketLaunchIcon,
      title: "Career Growth",
      description:
        "Access resources, courses, and tools to accelerate your career progression.",
      color: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  const stats = [
    { label: "Active Jobs", value: "50K+", icon: BriefcaseIcon },
    { label: "Companies", value: "10K+", icon: BuildingOfficeIcon },
    { label: "Job Seekers", value: "2M+", icon: UserGroupIcon },
    { label: "Placements", value: "500K+", icon: CheckBadgeIcon },
  ];

  // Social media icons in array
  const socialMedia = [
    {
      Icon: FaFacebook,
      href: "https://facebook.com",
      label: "Facebook",
      hoverColor: "hover:bg-blue-600",
    },
    {
      Icon: FaTwitter,
      href: "https://twitter.com",
      label: "Twitter",
      hoverColor: "hover:bg-blue-400",
    },
    {
      Icon: FaLinkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
      hoverColor: "hover:bg-blue-700",
    },
    {
      Icon: FaInstagram,
      href: "https://instagram.com",
      label: "Instagram",
      hoverColor: "hover:bg-pink-600",
    },
    {
      Icon: FaGithub,
      href: "https://github.com",
      label: "GitHub",
      hoverColor: "hover:bg-gray-700",
    },
    {
      Icon: FaYoutube,
      href: "https://youtube.com",
      label: "YouTube",
      hoverColor: "hover:bg-red-600",
    },
  ];

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Blog", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Salary Guide", href: "#" },
        { name: "Resume Tips", href: "#" },
        { name: "Interview Prep", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Accessibility", href: "#" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-6"
              >
                <span className="text-sm font-semibold">
                  ✨ Join 2M+ Job Seekers
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              >
                Find Your Dream Job
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Today!
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                Connect with thousands of employers, get personalized job
                recommendations, and take the next step in your career journey
                with JobPortal.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {/* Sign Up Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>{isLoggedIn() ? 
                    <><Link to={(user as any).role == "admin" ? "/admin/dashboard" : "/dashboard"}> Go to DashBoard</Link></> : <Link to="/signup">Sign up for Free</Link>}</span>
                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                {/* Learn More Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                  Learn More
                </motion.button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 flex items-center justify-center lg:justify-start space-x-4"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">10,000+</span> new
                  jobs added daily
                </p>
              </motion.div>
            </motion.div>

            {/* Right Content - Lottie Animation */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Lottie Animation */}
              <div className="relative z-10">
                <DotLottieReact
                  src="https://lottie.host/d739163e-3f78-4b03-8f0f-0d67b3b345c3/cHPL2rJR1A.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 p-8 bg-white rounded-2xl shadow-xl"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose JobPortal?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600">
              We provide the tools and resources you need to find the perfect
              job and advance your career.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>

                <motion.a
                  href="#"
                  className="inline-flex items-center space-x-2 text-blue-600 font-semibold mt-4 group-hover:space-x-3 transition-all"
                >
                  <span>Learn more</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </motion.a>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Ready to start your journey?
                </h3>
                <p className="text-blue-100 text-lg">
                  Join thousands of professionals who found their dream job
                  through UniZoy.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
              >
                {isLoggedIn() ? 
                    <><Link to={(user as any).role == "admin" ? "/admin/dashboard" : "/dashboard"}> Go to DashBoard</Link></> : <Link to="/signup">Get Started for Free</Link>}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <BriefcaseIcon className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">
                  Uni<span className="text-blue-400">Zoy</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Your trusted partner in finding the perfect job opportunity. We
                connect talented professionals with leading companies worldwide.
              </p>

              {/* Social Media Icons - Mapped from array */}
              <div className="flex space-x-3">
                {socialMedia.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center ${social.hoverColor} transition-colors group`}
                    aria-label={social.label}
                  >
                    <social.Icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Footer Links - Mapped from array */}
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="text-gray-400 hover:text-white transition-colors inline-block"
                      >
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">support@jobportal.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-5 w-5 text-blue-400" />
              <span className="text-gray-400">San Francisco, CA 94105</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
