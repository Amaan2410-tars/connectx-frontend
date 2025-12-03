import { useState, useRef } from "react";
import { Upload, Camera, CheckCircle2, Shield, User, IdCard, ScanFace, Loader2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitVerification, getVerificationStatus } from "@/services/verification";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Upload ID", icon: IdCard },
  { id: 2, title: "Face Scan", icon: ScanFace },
  { id: 3, title: "Verify", icon: CheckCircle2 },
];

export const VerificationFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [faceImageFile, setFaceImageFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);
  const faceImageInputRef = useRef<HTMLInputElement>(null);

  const { data: statusData } = useQuery({
    queryKey: ["verification-status"],
    queryFn: getVerificationStatus,
  });

  const verificationMutation = useMutation({
    mutationFn: (data: { idCardImage: File; faceImage: File }) =>
      submitVerification(data),
    onSuccess: () => {
      toast.success("Verification submitted! Waiting for approval.");
      setCurrentStep(3);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to submit verification");
    },
  });

  const handleIdCardSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdCardFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setCurrentStep(2);
    }
  };

  const handleFaceImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaceImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (idCardFile && faceImageFile) {
      verificationMutation.mutate({
        idCardImage: idCardFile,
        faceImage: faceImageFile,
      });
    }
  };

  const verificationStatus = statusData?.data?.status;

  // If already verified or pending, show status
  if (verificationStatus === "approved") {
    return (
      <div className="px-4 pt-4 pb-32 min-h-screen flex flex-col items-center justify-center animate-fade-in">
        <div className="w-32 h-32 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow animate-float">
          <CheckCircle2 className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mt-6">You're Verified!</h2>
        <p className="text-muted-foreground mt-2">Your verification has been approved.</p>
      </div>
    );
  }

  if (verificationStatus === "pending") {
    return (
      <div className="px-4 pt-4 pb-32 min-h-screen flex flex-col items-center justify-center animate-fade-in">
        <div className="w-32 h-32 mx-auto rounded-full glass-card flex items-center justify-center animate-pulse">
          <Shield className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mt-6">Verification Pending</h2>
        <p className="text-muted-foreground mt-2">Your verification is under review.</p>
      </div>
    );
  }

  if (verificationStatus === "rejected") {
    return (
      <div className="px-4 pt-4 pb-32 min-h-screen flex flex-col items-center justify-center animate-fade-in">
        <div className="w-32 h-32 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
          <Shield className="w-16 h-16 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mt-6">Verification Rejected</h2>
        <p className="text-muted-foreground mt-2">Please try submitting again.</p>
        <NeonButton
          variant="gradient"
          className="mt-6"
          onClick={() => setCurrentStep(1)}
        >
          Try Again
        </NeonButton>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-32 min-h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Get Verified</h1>
        <p className="text-muted-foreground mt-2">Prove you're a real campus student</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className={cn("flex flex-col items-center")}>
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                    isCompleted && "gradient-primary shadow-glow",
                    isActive && "glass-card neon-border",
                    !isActive && !isCompleted && "bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Icon
                      className={cn(
                        "w-6 h-6",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-1 mx-2 rounded-full transition-all duration-500",
                    currentStep > step.id ? "gradient-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {currentStep === 1 && (
          <div className="w-full max-w-sm space-y-6 animate-scale-in">
            <input
              ref={idCardInputRef}
              type="file"
              accept="image/*"
              onChange={handleIdCardSelect}
              className="hidden"
            />
            <GlassCard
              className="flex flex-col items-center py-12 cursor-pointer hover:neon-glow transition-all"
              neonBorder
              onClick={() => idCardInputRef.current?.click()}
            >
              {idCardPreview ? (
                <>
                  <img
                    src={idCardPreview}
                    alt="ID Card"
                    className="w-48 h-32 object-cover rounded-lg mb-4"
                  />
                  <p className="text-lg font-semibold text-foreground">ID Card Uploaded!</p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-primary mb-4" />
                  <p className="text-lg font-semibold text-foreground">Upload Student ID</p>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Take a clear photo of your valid student ID card
                  </p>
                </>
              )}
            </GlassCard>

            <div className="flex gap-4">
              <NeonButton
                variant="ghost"
                className="flex-1 glass-card"
                onClick={() => idCardInputRef.current?.click()}
              >
                <Camera className="w-5 h-5 mr-2" />
                Camera
              </NeonButton>
              <NeonButton
                variant="ghost"
                className="flex-1 glass-card"
                onClick={() => idCardInputRef.current?.click()}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </NeonButton>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="w-full max-w-sm space-y-6 animate-scale-in">
            <input
              ref={faceImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleFaceImageSelect}
              className="hidden"
            />
            <div className="relative">
              <div
                className={cn(
                  "w-64 h-64 mx-auto rounded-full flex items-center justify-center",
                  "border-4 transition-all duration-500",
                  faceImagePreview
                    ? "border-mint-glow shadow-neon-mint"
                    : "border-primary shadow-neon animate-glow-pulse"
                )}
              >
                <div className="w-56 h-56 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden">
                  {faceImagePreview ? (
                    <img
                      src={faceImagePreview}
                      alt="Face"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-24 h-24 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {faceImagePreview ? "Face Image Captured!" : "Position your face in the circle"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {faceImagePreview
                  ? "Ready to submit"
                  : "Make sure you're in a well-lit area"}
              </p>
            </div>

            <div className="flex gap-4">
              <NeonButton
                variant="ghost"
                className="flex-1 glass-card"
                onClick={() => faceImageInputRef.current?.click()}
              >
                <Camera className="w-5 h-5 mr-2" />
                Camera
              </NeonButton>
              <NeonButton
                variant="ghost"
                className="flex-1 glass-card"
                onClick={() => faceImageInputRef.current?.click()}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </NeonButton>
            </div>

            {idCardFile && faceImageFile && (
              <NeonButton
                variant="gradient"
                className="w-full"
                onClick={handleSubmit}
                disabled={verificationMutation.isPending}
              >
                {verificationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Verification"
                )}
              </NeonButton>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="w-full max-w-sm space-y-6 animate-scale-in text-center">
            <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow animate-float">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-2 border-mint-glow/30 animate-ping" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">Verification Submitted!</h2>
              <p className="text-muted-foreground mt-2">
                Your verification is under review. You'll be notified once approved.
              </p>
            </div>

            <GlassCard className="text-left space-y-3" glow="mint">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-mint-glow/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-mint-glow" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Verification Pending</p>
                  <p className="text-xs text-muted-foreground">Waiting for admin approval</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
