import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  bypassVerification,
  type PendingVerification,
} from "@/services/collegeAdmin";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { cn } from "@/lib/utils";
import { Shield, CheckCircle2, X, Zap, Loader2, User, Mail, Phone, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

export const AdminVerificationPanel = () => {
  const queryClient = useQueryClient();
  const [selectedVerification, setSelectedVerification] = useState<PendingVerification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bypassUserId, setBypassUserId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pending-verifications"],
    queryFn: getPendingVerifications,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const verifications = data?.data || [];

  const approveMutation = useMutation({
    mutationFn: approveVerification,
    onSuccess: () => {
      toast.success("Verification approved successfully");
      queryClient.invalidateQueries({ queryKey: ["pending-verifications"] });
      setDialogOpen(false);
      setSelectedVerification(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to approve verification");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectVerification,
    onSuccess: () => {
      toast.success("Verification rejected");
      queryClient.invalidateQueries({ queryKey: ["pending-verifications"] });
      setDialogOpen(false);
      setSelectedVerification(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to reject verification");
    },
  });

  const bypassMutation = useMutation({
    mutationFn: bypassVerification,
    onSuccess: () => {
      toast.success("Verification bypassed successfully");
      queryClient.invalidateQueries({ queryKey: ["pending-verifications"] });
      setBypassUserId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to bypass verification");
    },
  });

  const handleApprove = (verificationId: string) => {
    approveMutation.mutate(verificationId);
  };

  const handleReject = (verificationId: string) => {
    if (confirm("Are you sure you want to reject this verification?")) {
      rejectMutation.mutate(verificationId);
    }
  };

  const handleBypass = (userId: string) => {
    if (confirm("Are you sure you want to bypass verification for this user? They will be immediately verified.")) {
      bypassMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading verifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 min-h-screen flex items-center justify-center">
        <GlassCard className="text-center p-8">
          <p className="text-destructive mb-4">Failed to load verifications</p>
          <NeonButton onClick={() => queryClient.invalidateQueries({ queryKey: ["pending-verifications"] })}>
            Retry
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 min-h-screen max-w-7xl lg:mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Verification Management
            </h1>
            <p className="text-muted-foreground">Review and manage student verifications</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <GlassCard className="px-4 py-2">
            <span className="text-sm text-muted-foreground">Pending: </span>
            <span className="text-lg font-bold text-primary">{verifications.length}</span>
          </GlassCard>
        </div>
      </div>

      {/* Verifications List */}
      {verifications.length === 0 ? (
        <GlassCard className="text-center py-12">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">No pending verifications</p>
          <p className="text-muted-foreground mt-2">All verifications have been processed</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {verifications.map((verification) => (
            <GlassCard key={verification.id} className="p-6 hover:neon-glow transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Student Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">Name:</span>
                        <span className="text-muted-foreground">{verification.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{verification.user.email}</span>
                      </div>
                      {verification.user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{verification.user.phone}</span>
                        </div>
                      )}
                      {verification.user.batch && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">Batch:</span>
                          <span className="text-muted-foreground">{verification.user.batch}</span>
                        </div>
                      )}
                      {verification.user.college && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{verification.user.college.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                        <span className="font-medium text-foreground">Email Verified:</span>
                        <span className={cn(
                          verification.user.emailVerified ? "text-primary" : "text-destructive"
                        )}>
                          {verification.user.emailVerified ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">Phone Verified:</span>
                        <span className={cn(
                          verification.user.phoneVerified ? "text-primary" : "text-destructive"
                        )}>
                          {verification.user.phoneVerified ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Analysis */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Analysis Results
                    </h3>
                    <div className="space-y-2 text-sm">
                      {verification.faceMatchScore !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Face Match Score:</span>
                          <span className="font-semibold text-foreground">{verification.faceMatchScore}%</span>
                        </div>
                      )}
                      {verification.collegeMatch !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">College Match:</span>
                          <span className={cn(
                            "font-semibold",
                            verification.collegeMatch ? "text-primary" : "text-destructive"
                          )}>
                            {verification.collegeMatch ? "Yes" : "No"}
                          </span>
                        </div>
                      )}
                      {verification.matchScore !== undefined && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <span className="font-medium text-foreground">Overall Match Score:</span>
                          <span className={cn(
                            "font-bold text-lg",
                            verification.matchScore >= 80 ? "text-primary" :
                            verification.matchScore >= 40 ? "text-neon-gold" : "text-destructive"
                          )}>
                            {verification.matchScore}%
                          </span>
                        </div>
                      )}
                      {verification.analysisRemarks && (
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground">{verification.analysisRemarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Images and Actions */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Uploaded Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">ID Card</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="w-full aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                              <img
                                src={verification.idCardImage}
                                alt="ID Card"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>ID Card Image</DialogTitle>
                            </DialogHeader>
                            <img
                              src={verification.idCardImage}
                              alt="ID Card"
                              className="w-full rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Selfie</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="w-full aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                              <img
                                src={verification.faceImage}
                                alt="Selfie"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Selfie Image</DialogTitle>
                            </DialogHeader>
                            <img
                              src={verification.faceImage}
                              alt="Selfie"
                              className="w-full rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <NeonButton
                      variant="gradient"
                      className="w-full"
                      onClick={() => handleApprove(verification.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      {approveMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </>
                      )}
                    </NeonButton>
                    <NeonButton
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => handleReject(verification.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      {rejectMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </>
                      )}
                    </NeonButton>
                    <NeonButton
                      variant="ghost"
                      className="w-full text-neon-gold hover:text-neon-gold"
                      onClick={() => handleBypass(verification.userId)}
                      disabled={bypassMutation.isPending}
                    >
                      {bypassMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Bypassing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Bypass Verification
                        </>
                      )}
                    </NeonButton>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};


