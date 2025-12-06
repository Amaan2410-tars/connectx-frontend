import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPendingVerifications,
  approveVerification,
  rejectVerification,
  bypassVerification,
  getColleges,
  createCollege,
  updateCollege,
  deleteCollege,
  createCollegeAdmin,
  getAdminAnalytics,
  deleteUser,
  deletePost,
  getAllUsers as getAllUsersService,
} from "@/services/admin";
import { GlassCard } from "../ui/GlassCard";
import { NeonButton } from "../ui/NeonButton";
import { cn } from "@/lib/utils";
import {
  Shield,
  CheckCircle2,
  X,
  Zap,
  Loader2,
  User,
  Mail,
  Phone,
  Building2,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Users,
  FileText,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Tab = "dashboard" | "verifications" | "colleges" | "users";

export const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [createCollegeOpen, setCreateCollegeOpen] = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: analyticsData } = useQuery({
    queryKey: ["super-admin-analytics"],
    queryFn: getAdminAnalytics,
  });

  const { data: verificationsData, isLoading: verificationsLoading } = useQuery({
    queryKey: ["all-pending-verifications"],
    queryFn: getAllPendingVerifications,
    enabled: activeTab === "verifications",
    refetchInterval: 30000,
  });

  const { data: collegesData } = useQuery({
    queryKey: ["all-colleges"],
    queryFn: getColleges,
    enabled: activeTab === "colleges",
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: () => getAllUsersService(50),
    enabled: activeTab === "users",
  });

  const verifications = verificationsData?.data || [];
  const colleges = collegesData?.data || [];
  const users = usersData?.data?.users || [];
  const analytics = analyticsData?.data;

  const approveMutation = useMutation({
    mutationFn: approveVerification,
    onSuccess: () => {
      toast.success("Verification approved");
      queryClient.invalidateQueries({ queryKey: ["all-pending-verifications"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectVerification,
    onSuccess: () => {
      toast.success("Verification rejected");
      queryClient.invalidateQueries({ queryKey: ["all-pending-verifications"] });
    },
  });

  const bypassMutation = useMutation({
    mutationFn: bypassVerification,
    onSuccess: () => {
      toast.success("Verification bypassed");
      queryClient.invalidateQueries({ queryKey: ["all-pending-verifications"] });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });

  const createCollegeMutation = useMutation({
    mutationFn: createCollege,
    onSuccess: () => {
      toast.success("College created successfully");
      queryClient.invalidateQueries({ queryKey: ["all-colleges"] });
      setCreateCollegeOpen(false);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete user");
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: createCollegeAdmin,
    onSuccess: () => {
      toast.success("College admin created successfully");
      setCreateAdminOpen(false);
    },
  });

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    if (confirm("Reject this verification?")) {
      rejectMutation.mutate(id);
    }
  };

  const handleBypass = (userId: string) => {
    if (confirm("Bypass verification for this user?")) {
      bypassMutation.mutate(userId);
    }
  };

  return (
    <div className="px-4 lg:px-0 pt-4 lg:pt-6 pb-32 lg:pb-6 min-h-screen max-w-7xl lg:mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Super Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Full platform access and management</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <NeonButton
            variant={activeTab === "dashboard" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("dashboard")}
            className="whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </NeonButton>
          <NeonButton
            variant={activeTab === "verifications" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("verifications")}
            className="whitespace-nowrap"
          >
            <Shield className="w-4 h-4 mr-2" />
            Verifications ({verifications.length})
          </NeonButton>
          <NeonButton
            variant={activeTab === "colleges" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("colleges")}
            className="whitespace-nowrap"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Colleges ({colleges.length})
          </NeonButton>
          <NeonButton
            variant={activeTab === "users" ? "gradient" : "ghost"}
            onClick={() => setActiveTab("users")}
            className="whitespace-nowrap"
          >
            <Users className="w-4 h-4 mr-2" />
            Users ({users.length})
          </NeonButton>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Colleges</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.totals?.colleges || 0}</p>
                </div>
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.totals?.students || 0}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.totals?.posts || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">College Admins</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.totals?.collegeAdmins || 0}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
            </GlassCard>
          </div>

          {analytics.verificationStats && (
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Verification Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-neon-gold">{analytics.verificationStats.pending || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-primary">{analytics.verificationStats.approved || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-destructive">{analytics.verificationStats.rejected || 0}</p>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      )}

      {/* Verifications Tab */}
      {activeTab === "verifications" && (
        <div className="space-y-4">
          {verificationsLoading ? (
            <GlassCard className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading verifications...</p>
            </GlassCard>
          ) : verifications.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">No pending verifications</p>
            </GlassCard>
          ) : (
            verifications.map((verification: any) => (
              <GlassCard key={verification.id} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      {verification.user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{verification.user.email}</p>
                    <p className="text-sm text-muted-foreground">{verification.user.college?.name}</p>
                    {verification.matchScore !== undefined && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">Match Score</p>
                        <p className={cn(
                          "text-lg font-bold",
                          verification.matchScore >= 80 ? "text-primary" :
                          verification.matchScore >= 40 ? "text-neon-gold" : "text-destructive"
                        )}>
                          {verification.matchScore}%
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary">
                          <img src={verification.idCardImage} alt="ID" className="w-full h-full object-cover" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>ID Card</DialogTitle>
                        </DialogHeader>
                        <img src={verification.idCardImage} alt="ID" className="w-full rounded-lg" />
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary">
                          <img src={verification.faceImage} alt="Face" className="w-full h-full object-cover" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Selfie</DialogTitle>
                        </DialogHeader>
                        <img src={verification.faceImage} alt="Face" className="w-full rounded-lg" />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    <NeonButton
                      variant="gradient"
                      className="w-full"
                      onClick={() => handleApprove(verification.id)}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </NeonButton>
                    <NeonButton
                      variant="ghost"
                      className="w-full text-destructive"
                      onClick={() => handleReject(verification.id)}
                      disabled={rejectMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </NeonButton>
                    <NeonButton
                      variant="ghost"
                      className="w-full text-neon-gold"
                      onClick={() => handleBypass(verification.userId)}
                      disabled={bypassMutation.isPending}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Bypass
                    </NeonButton>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* Colleges Tab */}
      {activeTab === "colleges" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Colleges</h2>
            <Dialog open={createCollegeOpen} onOpenChange={setCreateCollegeOpen}>
              <DialogTrigger asChild>
                <NeonButton variant="gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create College
                </NeonButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New College</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createCollegeMutation.mutate({
                      name: formData.get("name") as string,
                      slug: formData.get("slug") as string,
                      city: formData.get("city") as string,
                      website: formData.get("website") as string,
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label>Name</Label>
                    <Input name="name" required />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input name="slug" required />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input name="city" />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input name="website" type="url" />
                  </div>
                  <NeonButton type="submit" variant="gradient" className="w-full" disabled={createCollegeMutation.isPending}>
                    {createCollegeMutation.isPending ? "Creating..." : "Create College"}
                  </NeonButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {colleges.map((college: any) => (
            <GlassCard key={college.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{college.name}</h3>
                  <p className="text-sm text-muted-foreground">{college.slug}</p>
                  {college._count && (
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>{college._count.users} students</span>
                      <span>{college._count.clubs} clubs</span>
                      <span>{college._count.events} events</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <NeonButton variant="ghost" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Admin
                      </NeonButton>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create College Admin</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          createAdminMutation.mutate({
                            name: formData.get("name") as string,
                            email: formData.get("email") as string,
                            password: formData.get("password") as string,
                            phone: formData.get("phone") as string,
                            collegeId: college.id,
                          });
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <Label>Name</Label>
                          <Input name="name" required />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input name="email" type="email" required />
                        </div>
                        <div>
                          <Label>Password</Label>
                          <Input name="password" type="password" required />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input name="phone" />
                        </div>
                        <NeonButton type="submit" variant="gradient" className="w-full" disabled={createAdminMutation.isPending}>
                          {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
                        </NeonButton>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {usersLoading ? (
            <GlassCard className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading users...</p>
            </GlassCard>
          ) : users.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">No users found</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {users.map((user: any) => (
                <GlassCard key={user.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            user.role === "super_admin" ? "bg-primary/20 text-primary" :
                            user.role === "college_admin" ? "bg-accent/20 text-accent" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.college?.name || "No college"}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{user._count?.posts || 0} posts</span>
                          <span>{user._count?.eventsRSVP || 0} events</span>
                          <span>{user._count?.clubs || 0} clubs</span>
                        </div>
                        {user.role === "student" && (
                          <div className="mt-2">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              user.bypassVerified ? "bg-neon-gold/20 text-neon-gold" :
                              user.verifiedStatus === "approved" ? "bg-primary/20 text-primary" :
                              user.verifiedStatus === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                              user.verifiedStatus === "rejected" ? "bg-destructive/20 text-destructive" :
                              "bg-muted text-muted-foreground"
                            )}>
                              {user.bypassVerified ? "Bypassed" :
                               user.verifiedStatus === "approved" ? "Verified" :
                               user.verifiedStatus === "pending" ? "Pending" :
                               user.verifiedStatus === "rejected" ? "Rejected" :
                               "Not Verified"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.role === "student" && !user.bypassVerified && (
                        <NeonButton
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Bypass verification for ${user.name}? This will allow them to access the platform without verification.`)) {
                              bypassMutation.mutate(user.id);
                            }
                          }}
                          disabled={bypassMutation.isPending}
                          className="text-neon-gold"
                          title="Bypass Verification"
                        >
                          <Zap className="w-4 h-4" />
                        </NeonButton>
                      )}
                      <NeonButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
                            deleteUserMutation.mutate(user.id);
                          }
                        }}
                        disabled={deleteUserMutation.isPending}
                        className="text-destructive"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </NeonButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

