import { useState } from "react";
import { toast } from "sonner";
import { 
  User, Mail, Lock, KeyRound, Loader2, CheckCircle
} from "lucide-react";

export default function Profile() {
  // ========== Mock User Data ==========
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@lorenta.tech",
    role: "Administrator"
  });

  // ========== Form States ==========
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // ========== UI States ==========
  const [isLoading, setIsLoading] = useState(false);

  /* ================= Password Update ================= */
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
      setIsLoading(false);
    }, 700);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-body">
          Manage your account and security settings
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* ========== PROFILE CARD ========== */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-5">
              {/* Avatar with initials */}
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <span className="text-xl font-heading font-bold text-primary">
                  {getInitials(user.name)}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-heading font-bold">
                    {user.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="font-body">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="font-body">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== CHANGE PASSWORD CARD ========== */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-heading font-semibold">
              Change Password
            </h2>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Update your login credentials
            </p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
            <InputField
              id="current-password"
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              disabled={isLoading}
            />

            <InputField
              id="new-password"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<KeyRound className="w-4 h-4" />}
              disabled={isLoading}
            />

            <InputField
              id="confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<KeyRound className="w-4 h-4" />}
              disabled={isLoading}
            />

            <div className="mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground font-heading font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= Simple Input Field ================= */
interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  type?: string;
  disabled?: boolean;
}

function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon,
  type = "text",
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs font-heading font-semibold text-foreground">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-muted-foreground/60">
              {icon}
            </span>
          </div>
        )}
        
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full 
            ${icon ? 'pl-10' : 'pl-4'} 
            pr-4 py-2.5 
            text-sm font-body
            rounded-full 
            bg-transparent 
            border border-border 
            outline-none 
            focus:border-primary focus:ring-1 focus:ring-ring
            placeholder:text-muted-foreground/50
            disabled:opacity-50
          `}
        />
      </div>
    </div>
  );
}