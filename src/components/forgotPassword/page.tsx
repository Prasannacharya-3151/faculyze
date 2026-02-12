import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
// import { apiRequest } from "../../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Lorenta-1.png"

interface FormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      // Forgot password logic here
      toast.success("Password reset successful!");
      navigate("/login", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email && formData.newPassword && formData.confirmPassword;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm relative">
        {/* Back Button */}
       <button
  onClick={() => navigate(-1)}
  className="absolute -top-2 left-0 p-2 text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1"
>
  <ArrowLeft className="w-5 h-5" />
  <span className="text-xs">Back</span>
</button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="ml-4 rounded-full flex items-center justify-center lg:justify-start w-16 h-16">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Forgot Password</h1>
          <p className="text-muted-foreground text-xs">Reset your password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-foreground">
                Email *
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
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-full border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground bg-card"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="newPassword" className="block text-xs font-semibold text-foreground">
                New Password *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-full border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground bg-card"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary transition-colors duration-200"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-foreground">
                Confirm Password *
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-muted group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-full border border-muted outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-all duration-200 text-foreground placeholder:text-muted-foreground bg-card"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}