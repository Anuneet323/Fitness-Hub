import { Dumbbell, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) => value.length >= 8;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);
    setApiError("");

    try {
      const data = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // user + token are already stored in localStorage by authService
      const user = data.user || authService.getCurrentUser();
      const role = user?.role || "user";

      if (role === "trainer") {
        navigate("/trainer-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden p-4">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl">
        {/* Decorative Background Elements */}
        <div className="w-full h-full z-[2] absolute bg-gradient-to-t from-transparent to-black/20 pointer-events-none"></div>

        <div className="flex absolute z-[2] overflow-hidden backdrop-blur-2xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[40rem] z-[2] w-16 bg-gradient-to-b from-transparent via-black/50 via-[69%] to-white/20 opacity-30"
            />
          ))}
        </div>

        <div className="w-60 h-60 bg-orange-500 absolute z-[1] rounded-full -bottom-20 -left-20 blur-3xl"></div>
        <div className="w-32 h-20 bg-white absolute z-[1] rounded-full bottom-10 left-40 blur-2xl"></div>

        {/* Left Side - Branding */}
        <div className="bg-black text-white p-8 md:p-12 md:w-1/2 relative rounded-bl-3xl overflow-hidden flex items-center justify-center">
          <div className="z-10 relative">
            <div className="flex items-center gap-3 mb-6">
              <Dumbbell className="h-12 w-12 text-orange-500" />
              <h1 className="text-4xl font-bold text-orange-500">FitPlanHub</h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium leading-tight tracking-tight">
              Welcome back to your fitness journey.
            </h2>
            <p className="mt-4 text-gray-400">
              Log in to access your personalized workout plans.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-white z-[99]">
          <div className="flex flex-col items-left mb-8">
            <div className="text-orange-500 mb-4">
              <Dumbbell className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight text-gray-900">
              Login
            </h2>
            <p className="text-left text-gray-600">
              Enter your credentials to continue
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2 text-gray-700"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                className={`text-sm w-full py-2 px-3 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-orange-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                disabled={loading}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-2 text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className={`text-sm w-full py-2 px-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 bg-white text-black focus:ring-orange-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-gray-900 font-medium underline hover:text-orange-500 transition-colors"
              >
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
