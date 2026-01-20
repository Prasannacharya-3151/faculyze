import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { toast } from "react-toastify";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";


interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function RegisterFormDemo() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate terms agreement
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Sending registration data:", formData);
      
      const res = await apiRequest(
        "/faculty/signup",
        "POST",
        formData as any
      );

      console.log("Registration response:", res);

      // Handle different response structures
      if (res.success) {
        // If backend just returns { success: true }
        toast.success("Account created successfully! Please login.");
        navigate("/login");
      } else if (res.user && res.token) {
        // If backend returns user and token (auto-login)
        login(res.user, res.token);
        toast.success("Account created! Redirecting...");
        if (res.user.profileSetupCompleted) {
          navigate("/");
        } else {
          navigate("/profile-setup");
        }
      } else if (res.message) {
        toast.success(res.message);
        setTimeout(()=>{
          navigate("/login");
        },800)
        
      } else {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }

    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = {
    minLength: formData.password.length >= 8,
    mixedCase: /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[^A-Za-z0-9]/.test(formData.password)
  };

  const isFormValid = formData.username &&  formData.email && formData.password && agreedToTerms;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm">
      
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Create Account
          </h1>
          <p className="text-muted-foreground text-xs">
            Join our community in less than a minute
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-xs font-semibold text-foreground">
                Username *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-full border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground bg-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-foreground">
                Email Address *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-full border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground bg-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold text-foreground">
                Password *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-full border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground bg-transparent"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
          
              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.minLength ? 'bg-accent' : 'bg-muted/60'}`}></div>
                  <span className="text-xs text-muted-foreground">8+ chars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.mixedCase ? 'bg-accent' : 'bg-muted/60'}`}></div>
                  <span className="text-xs text-muted-foreground">Mixed case</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasNumber ? 'bg-accent' : 'bg-muted/60'}`}></div>
                  <span className="text-xs text-muted-foreground">Numbers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasSpecial ? 'bg-accent' : 'bg-muted/60'}`}></div>
                  <span className="text-xs text-muted-foreground">Special</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-full border border-muted text-primary focus:ring-ring cursor-pointer flex-shrink-0"
                required
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-secondary font-semibold">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:text-secondary font-semibold">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-primary text-primary-foreground font-bold py-2.5 px-6 text-sm rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

         
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-muted rounded-full hover:bg-muted/10 transition-colors duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-xs font-semibold text-foreground">Google</span>
              </button>
             
            </div>

        
            <div className="text-center pt-1">
              <p className="text-muted-foreground text-xs">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-primary hover:text-secondary transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}