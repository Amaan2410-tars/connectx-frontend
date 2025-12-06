import { useState, useRef, useEffect } from "react";
import { Upload, Camera, CheckCircle2, Shield, User, IdCard, ScanFace, Loader2, X } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadIdCard, uploadFaceImage, getVerificationStatus } from "@/services/verification";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
  const [idCardUploaded, setIdCardUploaded] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraType, setCameraType] = useState<"idCard" | "face" | null>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);
  const faceImageInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: statusData, refetch } = useQuery({
    queryKey: ["verification-status"],
    queryFn: getVerificationStatus,
  });

  const verification = statusData?.data?.verification;
  const userStatus = statusData?.data?.user;
  const canRetry = statusData?.data?.canRetry ?? true;
  const retryAfter = statusData?.data?.retryAfter ? new Date(statusData.data.retryAfter) : null;

  // Redirect if fully verified
  useEffect(() => {
    if (userStatus?.verifiedStatus === "approved" || userStatus?.bypassVerified) {
      navigate("/", { replace: true });
    }
  }, [userStatus, navigate]);

  const idCardMutation = useMutation({
    mutationFn: (file: File) => uploadIdCard(file),
    onSuccess: () => {
      toast.success("ID card uploaded successfully!");
      setIdCardUploaded(true);
      setCurrentStep(2);
      queryClient.invalidateQueries({ queryKey: ["verification-status"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to upload ID card");
    },
  });

  const faceImageMutation = useMutation({
    mutationFn: (file: File) => uploadFaceImage(file),
    onSuccess: (data) => {
      const status = data.data?.status || data.status;
      
      if (status === "approved") {
        toast.success("Verification approved! You can now access the app.");
        queryClient.invalidateQueries({ queryKey: ["verification-status"] });
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } else if (status === "rejected") {
        toast.error("Verification rejected. Please check the requirements and try again after 3 hours.");
        queryClient.invalidateQueries({ queryKey: ["verification-status"] });
        setCurrentStep(3);
      } else {
        toast.success("Face image uploaded and analyzed! Waiting for admin review.");
        queryClient.invalidateQueries({ queryKey: ["verification-status"] });
        setCurrentStep(3);
      }
      
      // Refetch status to get analysis results
      setTimeout(() => {
        refetch();
      }, 1000);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || error.message || "Failed to upload face image");
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
    }
  };

  const handleIdCardUpload = () => {
    if (idCardFile) {
      idCardMutation.mutate(idCardFile);
    } else if (idCardPreview) {
      // If we have a preview but no file (from camera), convert canvas to file
      toast.error("Please select an image file");
    }
  };

  // Camera functionality
  const startCamera = async (type: "idCard" | "face") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: type === "face" ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setCameraStream(stream);
      setCameraType(type);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check permissions or use file upload instead.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCameraType(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
            if (cameraType === "idCard") {
              setIdCardFile(file);
              setIdCardPreview(canvas.toDataURL("image/jpeg"));
            } else {
              setFaceImageFile(file);
              setFaceImagePreview(canvas.toDataURL("image/jpeg"));
            }
            stopCamera();
          }
        }, "image/jpeg", 0.9);
      }
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

  const handleFaceImageUpload = () => {
    if (faceImageFile) {
      faceImageMutation.mutate(faceImageFile);
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Check if user has already uploaded images
  useEffect(() => {
    if (verification?.idCardImage && !idCardPreview) {
      setIdCardPreview(verification.idCardImage);
      setIdCardUploaded(true);
      setCurrentStep(2);
    }
    if (verification?.faceImage && !faceImagePreview) {
      setFaceImagePreview(verification.faceImage);
      setCurrentStep(3);
    }
  }, [verification]);

  const verificationStatus = verification?.status || userStatus?.verifiedStatus;

  // If already verified or pending, show status
  if (verificationStatus === "approved") {
    const isAutoApproved = verification?.reviewedBy === "system";
    
    return (
      <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 min-h-screen flex flex-col items-center justify-center animate-fade-in max-w-4xl lg:mx-auto">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow animate-float">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mt-6">You're Verified!</h2>
            <p className="text-muted-foreground mt-2">
              {isAutoApproved 
                ? "Your verification was automatically approved based on high match scores." 
                : "Your verification has been approved by admin."}
            </p>
          </div>

          {verification && (
            <GlassCard className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Verification Details</h3>
              
              <div className="space-y-3">
                {verification.faceMatchScore !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Face Match Score</span>
                    <span className="font-semibold text-foreground">{verification.faceMatchScore}%</span>
                  </div>
                )}

                {verification.collegeMatch !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">College Match</span>
                    <span className={cn(
                      "font-semibold",
                      verification.collegeMatch ? "text-primary" : "text-destructive"
                    )}>
                      {verification.collegeMatch ? "Yes" : "No"}
                    </span>
                  </div>
                )}

                {verification.matchScore !== undefined && (
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-muted-foreground">Overall Match Score</span>
                    <span className="font-semibold text-primary">{verification.matchScore}%</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-primary">Approved</span>
                </div>
              </div>
            </GlassCard>
          )}

          <NeonButton
            variant="gradient"
            className="w-full"
            onClick={() => navigate("/", { replace: true })}
          >
            Go to App
          </NeonButton>
        </div>
      </div>
    );
  }

  if (verificationStatus === "pending") {
    return (
      <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 min-h-screen flex flex-col items-center justify-center animate-fade-in max-w-4xl lg:mx-auto">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full glass-card flex items-center justify-center animate-pulse">
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mt-6">Verification Pending</h2>
            <p className="text-muted-foreground mt-2">Your verification is under review by admin.</p>
          </div>

          <GlassCard className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Verification Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ID Card Uploaded</span>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Selfie Uploaded</span>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>

              {verification?.faceMatchScore !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Face Match Score</span>
                  <span className="font-semibold text-foreground">{verification.faceMatchScore}%</span>
                </div>
              )}

              {verification?.collegeMatch !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">College Match</span>
                  <span className={cn(
                    "font-semibold",
                    verification.collegeMatch ? "text-primary" : "text-destructive"
                  )}>
                    {verification.collegeMatch ? "Yes" : "No"}
                  </span>
                </div>
              )}

              {verification?.matchScore !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Overall Match Score</span>
                  <span className="font-semibold text-foreground">{verification.matchScore}%</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-muted-foreground">Admin Decision</span>
                <span className="font-semibold text-primary">Pending</span>
              </div>
            </div>
          </GlassCard>

          {verification?.idCardImage && (
            <GlassCard>
              <h3 className="text-lg font-semibold text-foreground mb-4">Uploaded ID Card</h3>
              <img
                src={verification.idCardImage}
                alt="ID Card"
                className="w-full rounded-lg"
              />
            </GlassCard>
          )}

          {verification?.faceImage && (
            <GlassCard>
              <h3 className="text-lg font-semibold text-foreground mb-4">Uploaded Selfie</h3>
              <img
                src={verification.faceImage}
                alt="Selfie"
                className="w-full rounded-lg"
              />
            </GlassCard>
          )}
        </div>
      </div>
    );
  }

  if (verificationStatus === "rejected") {
    const getTimeRemaining = () => {
      if (!retryAfter) return null;
      const now = new Date();
      const diff = retryAfter.getTime() - now.getTime();
      if (diff <= 0) return null;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    };

    const timeRemaining = getTimeRemaining();
    const canRetryNow = canRetry && !timeRemaining;

    return (
      <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 min-h-screen flex flex-col items-center justify-center animate-fade-in max-w-4xl lg:mx-auto">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full bg-destructive/20 flex items-center justify-center">
              <Shield className="w-16 h-16 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mt-6">Verification Rejected</h2>
            <p className="text-muted-foreground mt-2">
              {verification?.analysisRemarks || "Your verification did not meet the requirements."}
            </p>
          </div>

          {verification && (
            <GlassCard className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
              
              <div className="space-y-3">
                {verification.faceMatchScore !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Face Match Score</span>
                    <span className="font-semibold text-foreground">{verification.faceMatchScore}%</span>
                  </div>
                )}

                {verification.collegeMatch !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">College Match</span>
                    <span className={cn(
                      "font-semibold",
                      verification.collegeMatch ? "text-primary" : "text-destructive"
                    )}>
                      {verification.collegeMatch ? "Yes" : "No"}
                    </span>
                  </div>
                )}

                {verification.matchScore !== undefined && (
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-muted-foreground">Overall Match Score</span>
                    <span className="font-semibold text-destructive">{verification.matchScore}%</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-destructive">Rejected</span>
                </div>
              </div>
            </GlassCard>
          )}

          {!canRetryNow && timeRemaining && (
            <GlassCard className="text-center space-y-4" glow="destructive">
              <div>
                <p className="text-lg font-semibold text-foreground">Please wait before retrying</p>
                <p className="text-muted-foreground mt-2">
                  You can submit a new verification after the cooldown period.
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {timeRemaining.hours > 0 && `${timeRemaining.hours}h `}
                {timeRemaining.minutes}m remaining
              </div>
            </GlassCard>
          )}

          {canRetryNow && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You can now submit a new verification. Please ensure your ID card and selfie are clear and match.
              </p>
              <NeonButton
                variant="gradient"
                className="w-full"
                onClick={() => {
                  setCurrentStep(1);
                  setIdCardFile(null);
                  setFaceImageFile(null);
                  setIdCardPreview(null);
                  setFaceImagePreview(null);
                  setIdCardUploaded(false);
                  queryClient.invalidateQueries({ queryKey: ["verification-status"] });
                }}
              >
                Try Again
              </NeonButton>
            </div>
          )}
        </div>
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
            <GlassCard className="flex flex-col items-center py-12" neonBorder>
              {idCardPreview ? (
                <>
                  <div className="relative mb-4">
                    <img
                      src={idCardPreview}
                      alt="ID Card"
                      className="w-64 h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setIdCardPreview(null);
                        setIdCardFile(null);
                        if (idCardInputRef.current) {
                          idCardInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <NeonButton
                    variant="gradient"
                    className="w-full"
                    onClick={handleIdCardUpload}
                    disabled={idCardMutation.isPending}
                  >
                    {idCardMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload ID Card"
                    )}
                  </NeonButton>
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

            {!idCardPreview && (
              <div className="flex gap-4">
                <NeonButton
                  variant="ghost"
                  className="flex-1 glass-card"
                  onClick={() => startCamera("idCard")}
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
            )}
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
              {faceImagePreview && (
                <button
                  onClick={() => {
                    setFaceImagePreview(null);
                    setFaceImageFile(null);
                    if (faceImageInputRef.current) {
                      faceImageInputRef.current.value = "";
                    }
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {faceImagePreview ? "Face Image Captured!" : "Position your face in the circle"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {faceImagePreview
                  ? "Ready to upload and analyze"
                  : "Make sure you're in a well-lit area"}
              </p>
            </div>

            {!faceImagePreview && (
              <div className="flex gap-4">
                <NeonButton
                  variant="ghost"
                  className="flex-1 glass-card"
                  onClick={() => startCamera("face")}
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
            )}

            {faceImagePreview && (
              <NeonButton
                variant="gradient"
                className="w-full"
                onClick={handleFaceImageUpload}
                disabled={faceImageMutation.isPending}
              >
                {faceImageMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading & Analyzing...
                  </>
                ) : (
                  "Upload & Analyze"
                )}
              </NeonButton>
            )}
          </div>
        )}

        {/* Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <GlassCard className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {cameraType === "idCard" ? "Capture ID Card" : "Capture Face"}
                </h3>
                <button
                  onClick={stopCamera}
                  className="p-2 rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                  style={{ transform: cameraType === "face" ? "scaleX(-1)" : "none" }}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-4">
                <NeonButton
                  variant="ghost"
                  className="flex-1"
                  onClick={stopCamera}
                >
                  Cancel
                </NeonButton>
                <NeonButton
                  variant="gradient"
                  className="flex-1"
                  onClick={capturePhoto}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture
                </NeonButton>
              </div>
            </GlassCard>
          </div>
        )}

        {currentStep === 3 && verification && verification.status === "pending" && (
          <div className="w-full max-w-2xl space-y-6 animate-scale-in">
            <div className="text-center">
              <div className="relative">
                <div className="w-32 h-32 mx-auto rounded-full glass-card flex items-center justify-center animate-pulse">
                  <Shield className="w-16 h-16 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-6">Verification Under Review</h2>
              <p className="text-muted-foreground mt-2">
                Your verification is being reviewed by admin. You'll be notified once a decision is made.
              </p>
            </div>

            <GlassCard className="space-y-4" glow="mint">
              <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ID Card Uploaded</span>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Selfie Uploaded</span>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>

                {verification.faceMatchScore !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Face Match Score</span>
                    <span className="font-semibold text-foreground">{verification.faceMatchScore}%</span>
                  </div>
                )}

                {verification.collegeMatch !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">College Match</span>
                    <span className={cn(
                      "font-semibold",
                      verification.collegeMatch ? "text-primary" : "text-destructive"
                    )}>
                      {verification.collegeMatch ? "Yes" : "No"}
                    </span>
                  </div>
                )}

                {verification.matchScore !== undefined && (
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-muted-foreground">Overall Match Score</span>
                    <span className="font-semibold text-foreground">{verification.matchScore}%</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">Admin Decision</span>
                  <span className="font-semibold text-primary">Pending</span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};
