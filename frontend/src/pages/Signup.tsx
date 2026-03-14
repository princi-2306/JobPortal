// pages/Signup.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import useAuthStore, {
  type UserSignupData,
  type AdminSignupData,
} from "../store/authStore";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin"; // Add this back
  agreeToTerms: boolean;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Add this back with default value
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    setPasswordStrength(strength);
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "name":
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 50) return "Name cannot exceed 50 characters";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[a-z]/.test(value))
          return "Include at least one lowercase letter";
        if (!/[A-Z]/.test(value))
          return "Include at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Include at least one number";
        return "";

      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => new Set(prev).add(name));

    const error = validateField(name, formData[name as keyof FormData]);
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === "password") {
      checkPasswordStrength(value);
    }

    if (touchedFields.has(name)) {
      const error = validateField(name, newValue);
      setValidationErrors((prev) => ({ ...prev, [name]: error }));
    }

    if (name === "password" || name === "confirmPassword") {
      if (touchedFields.has("confirmPassword")) {
        const confirmError = validateField(
          "confirmPassword",
          name === "confirmPassword" ? newValue : formData.confirmPassword,
        );
        setValidationErrors((prev) => ({
          ...prev,
          confirmPassword: confirmError,
        }));
      }
    }

    // Clear API error when user makes changes
    if (error) clearError();
  };

  const handleRoleChange = (role: "user" | "admin") => {
    setFormData((prev) => ({
      ...prev,
      role,
      // Reset form fields when switching roles? Optional - you can keep or remove this
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    }));
    setValidationErrors({});
    setTouchedFields(new Set());
    setPasswordStrength(0);

    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    // Validate all fields
    const errors: ValidationErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword,
      ),
    };

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms";
    }

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => v && v !== ""),
    );

    if (Object.keys(filteredErrors).length > 0) {
      setValidationErrors(filteredErrors);
      // Mark all fields as touched to show errors
      setTouchedFields(
        new Set([
          "name",
          "email",
          "password",
          "confirmPassword",
          "agreeToTerms",
        ]),
      );
      return;
    }

    // Prepare signup data based on role
    let signupData: UserSignupData | AdminSignupData;

    if (formData.role === "admin") {
      signupData = {
        adminName: formData.name,
        email: formData.email,
        password: formData.password,
        role: "admin", // Add role property
      };
    } else {
      signupData = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user", // Add role property
        // avatar: undefined, // Avatar can be added later
      };
    }

    const result = await signup(signupData);

    if (result.success) {
      // Navigate based on role
      if (formData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
    // If error, it will be displayed from the store's error state
  };

  const getPasswordStrengthText = () => {
    if (!formData.password) return "";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const isFieldValid = (name: string) => {
  return Boolean(
    touchedFields.has(name) &&
    !validationErrors[name as keyof ValidationErrors] &&
    formData[name as keyof FormData],
  );
};

  const isFieldInvalid = (name: string) => {
  return touchedFields.has(name) && validationErrors[name as keyof ValidationErrors];
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <DotLottieReact
              src="https://lottie.host/77c2f39a-b040-45fa-8d5b-ae7a62113d16/0rbzMj5w9d.lottie"
              loop
              autoplay
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="text-center mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join JobPortal Today!
            </h2>
            <p className="text-lg text-gray-600">
              Create your account and start your journey towards your dream
              career.
            </p>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Role Selection */}
          <div className="flex space-x-4 mb-8">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleChange("user")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                formData.role === "user"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <BriefcaseIcon className="h-5 w-5 inline-block mr-2" />
              Job Seeker
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleChange("admin")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                formData.role === "admin"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <BuildingOfficeIcon className="h-5 w-5 inline-block mr-2" />
              Employer/Admin
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.role === "admin" ? "Admin Name" : "Username"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    isFieldInvalid("name")
                      ? "border-red-500"
                      : isFieldValid("name")
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder={
                    formData.role === "admin" ? "John Doe (Admin)" : "john_doe"
                  }
                />
                {isFieldValid("name") && (
                  <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    isFieldInvalid("email")
                      ? "border-red-500"
                      : isFieldValid("email")
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                />
                {isFieldValid("email") && (
                  <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    isFieldInvalid("password")
                      ? "border-red-500"
                      : isFieldValid("password")
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex space-x-1 flex-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= passwordStrength
                              ? getPasswordStrengthColor()
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-600">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1 mt-2">
                    <li
                      className={`flex items-center ${
                        formData.password.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> At least 8
                      characters
                    </li>
                    <li
                      className={`flex items-center ${
                        /[a-z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> One lowercase
                      letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /[A-Z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> One uppercase
                      letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /[0-9]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <CheckCircleIcon className="h-3 w-3 mr-1" /> One number
                    </li>
                  </ul>
                </div>
              )}
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                    isFieldInvalid("confirmPassword")
                      ? "border-red-500"
                      : isFieldValid("confirmPassword")
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 text-sm text-gray-600"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Privacy Policy
                </Link>{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>
            {validationErrors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.agreeToTerms}
              </p>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>
                    Create{" "}
                    {formData.role === "admin" ? "Employer" : "Job Seeker"}{" "}
                    Account
                  </span>
                  <ArrowRightIcon className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <CheckBadgeIcon className="h-5 w-5 text-green-500" />
            <span>Your information is secure and encrypted</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
