
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(
      result.user.role === "admin" ? "/admin" : "/student"
    );
  };

  const fillDemo = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7 sm:p-9">

        <div className="flex justify-center mb-5">
          <div className="bg-blue-600 text-white p-4 rounded-2xl">
            <GraduationCap size={34} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Assignment Portal
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Sign in to manage and track assignments
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Email Address
            </label>

            <div className="flex items-center border border-slate-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Mail size={18} className="text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Password
            </label>

            <div className="flex items-center border border-slate-300 rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock size={18} className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 outline-none text-sm"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-7 border-t pt-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Quick Demo Login
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillDemo("rahul@demo.com", "admin123")}
              className="border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 p-3 rounded-lg text-sm font-medium"
            >
              Admin Login
            </button>

            <button
              type="button"
              onClick={() => fillDemo("amit@demo.com", "student123")}
              className="border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 p-3 rounded-lg text-sm font-medium"
            >
              Student Login
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-7">
          Assignment & Review Dashboard
        </p>

      </div>
    </div>
  );
}

export default Login;
