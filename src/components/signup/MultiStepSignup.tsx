import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Mail, Phone } from "lucide-react";
import { getCollegesForSignup } from "@/services/colleges";
import { useQuery } from "@tanstack/react-query";
import { sendEmailOtp, sendPhoneOtp, verifyEmailOtp, verifyPhoneOtp } from "@/services/otp";

// Generate batch years
const generateBatchOptions = () => {
  const currentYear = new Date().getFullYear();
  const batches = [];
  for (let i = -5; i <= 5; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 4;
    batches.push({
      value: `${startYear}-${endYear}`,
      label: `${startYear}-${endYear}`,
    });
  }
  return batches;
};

const BATCH_OPTIONS = generateBatchOptions();

type SignupStep = "form" | "email-otp" | "phone-otp" | "complete";

export const MultiStepSignup = () => {
  const [step, setStep] = useState<SignupStep>("form");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    batch: "",
    collegeId: "",
  });
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const { data: collegesData, isLoading: collegesLoading } = useQuery({
    queryKey: ["colleges-for-signup"],
    queryFn: getCollegesForSignup,
  });

  const colleges = collegesData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }

    setSendingOtp(true);
    try {
      await sendEmailOtp(formData.email);
      toast.success("OTP sent to your email");
      setStep("email-otp");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOtp(formData.email, emailOtp);
      toast.success("Email verified successfully!");
      setStep("phone-otp");
      setEmailOtp("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!formData.phone) {
      toast.error("Please enter your phone number first");
      return;
    }

    setSendingOtp(true);
    try {
      await sendPhoneOtp(formData.phone);
      toast.success("OTP sent to your phone");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyPhoneOtp(formData.phone, phoneOtp);
      toast.success("Phone verified successfully!");
      // Now create the account
      await handleCreateAccount();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await signup({
        ...formData,
        role: "student",
      });
      toast.success("Account created successfully!");
      setStep("complete");
      // Redirect to verification flow after 2 seconds
      setTimeout(() => {
        navigate("/verify");
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || "Signup failed");
      throw error;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.username || !formData.email || !formData.password || 
        !formData.phone || !formData.batch || !formData.collegeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Start with email OTP
    await handleSendEmailOtp();
  };

  // Render based on current step
  if (step === "email-otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Verify Email</h1>
            <p className="text-muted-foreground mt-2">
              We sent a 6-digit code to <strong>{formData.email}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOtp">Enter OTP</Label>
              <Input
                id="emailOtp"
                type="text"
                placeholder="000000"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <NeonButton
              onClick={handleVerifyEmailOtp}
              variant="gradient"
              className="w-full"
              disabled={loading || emailOtp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </NeonButton>

            <button
              onClick={handleSendEmailOtp}
              disabled={sendingOtp}
              className="text-sm text-primary hover:underline w-full"
            >
              {sendingOtp ? "Sending..." : "Resend OTP"}
            </button>

            <button
              onClick={() => setStep("form")}
              className="text-sm text-muted-foreground hover:text-foreground w-full"
            >
              ← Back to form
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (step === "phone-otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Verify Phone</h1>
            <p className="text-muted-foreground mt-2">
              We sent a 6-digit code to <strong>{formData.phone}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneOtp">Enter OTP</Label>
              <Input
                id="phoneOtp"
                type="text"
                placeholder="000000"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <NeonButton
              onClick={handleVerifyPhoneOtp}
              variant="gradient"
              className="w-full"
              disabled={loading || phoneOtp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying & Creating Account...
                </>
              ) : (
                "Verify Phone & Create Account"
              )}
            </NeonButton>

            <button
              onClick={handleSendPhoneOtp}
              disabled={sendingOtp}
              className="text-sm text-primary hover:underline w-full"
            >
              {sendingOtp ? "Sending..." : "Resend OTP"}
            </button>

            <button
              onClick={() => setStep("email-otp")}
              className="text-sm text-muted-foreground hover:text-foreground w-full"
            >
              ← Back
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md p-8 space-y-6 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Account Created!</h1>
          <p className="text-muted-foreground">Redirecting to verification...</p>
        </GlassCard>
      </div>
    );
  }

  // Form step
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Join ConnectX
          </h1>
          <p className="text-muted-foreground mt-2">Create your student account</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground">3-30 characters, unique</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
              required
              minLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collegeId">College *</Label>
            <Select
              value={formData.collegeId}
              onValueChange={(value) => handleSelectChange("collegeId", value)}
              required
              disabled={collegesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={collegesLoading ? "Loading colleges..." : "Select your college"} />
              </SelectTrigger>
              <SelectContent>
                {colleges.length === 0 ? (
                  <SelectItem value="no-colleges" disabled>
                    No colleges available
                  </SelectItem>
                ) : (
                  colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch">Batch *</Label>
            <Select
              value={formData.batch}
              onValueChange={(value) => handleSelectChange("batch", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your batch" />
              </SelectTrigger>
              <SelectContent>
                {BATCH_OPTIONS.map((batch) => (
                  <SelectItem key={batch.value} value={batch.value}>
                    {batch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <NeonButton
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={loading || collegesLoading || colleges.length === 0 || sendingOtp}
          >
            {sendingOtp ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Continue to Email Verification"
            )}
          </NeonButton>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

